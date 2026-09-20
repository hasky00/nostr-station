import { getEventHash, verifyEvent } from 'nostr-tools/pure';
import { signEventWithSavedBunker, type SignWithBunkerResult } from './auth-bunker.js';
import { getKeychain } from './keychain.js';
import { hexToNpub, npubToHex, readIdentity, writeIdentity } from './identity.js';

export interface EventTemplate {
  kind: number;
  created_at: number;
  tags: string[][];
  content: string;
}

export interface CinderellaHealth {
  ok: boolean;
  ready: boolean;
  pubkey: string;
  threshold: number;
}

async function readGatewayToken(): Promise<string | null> {
  return process.env.CINDERELLA_GATEWAY_TOKEN
    || await getKeychain().retrieve('cinderella-gateway-token');
}

function normalizeLoopbackUrl(raw: string): string {
  let url: URL;
  try { url = new URL(raw); }
  catch { throw new Error('Cinderella gateway URL is invalid'); }
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '::1'].includes(host)) {
    throw new Error('Cinderella gateway must use HTTP on a loopback address');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('Cinderella gateway URL must not contain credentials, query, or fragment');
  }
  return url.origin;
}

async function gatewayRequest(
  gatewayUrl: string,
  token: string,
  path: '/health' | '/sign',
  init: RequestInit = {},
  timeoutMs = 30_000,
): Promise<any> {
  const response = await fetch(`${normalizeLoopbackUrl(gatewayUrl)}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  let body: any = null;
  try { body = await response.json(); } catch {}
  if (!response.ok || body?.ok !== true) {
    throw new Error(body?.error || `Cinderella gateway returned HTTP ${response.status}`);
  }
  return body;
}

export async function probeCinderella(
  gatewayUrl: string,
  token: string,
  timeoutMs = 5_000,
): Promise<CinderellaHealth> {
  const body = await gatewayRequest(gatewayUrl, token, '/health', {}, timeoutMs);
  if (!/^[0-9a-f]{64}$/i.test(body.pubkey || '')) throw new Error('Cinderella returned an invalid public key');
  if (!Number.isSafeInteger(body.threshold) || body.threshold < 1) throw new Error('Cinderella returned an invalid threshold');
  return {
    ok: true,
    ready: body.ready === true,
    pubkey: body.pubkey.toLowerCase(),
    threshold: body.threshold,
  };
}

export async function configureCinderella(gatewayUrl: string, token: string): Promise<CinderellaHealth> {
  if (typeof token !== 'string' || token.length < 32) throw new Error('Cinderella token must be at least 32 characters');
  const normalizedUrl = normalizeLoopbackUrl(gatewayUrl);
  const health = await probeCinderella(normalizedUrl, token);
  if (!health.ready) throw new Error('Cinderella signer network is not ready');
  await getKeychain().store('cinderella-gateway-token', token);
  const ident = readIdentity();
  writeIdentity({
    ...ident,
    npub: hexToNpub(health.pubkey),
    signerMode: 'cinderella',
    cinderellaGatewayUrl: normalizedUrl,
    // Cinderella event signing is real, but dashboard NIP-98 login still
    // needs its own provider-aware flow before remote auth can be enabled.
    requireAuth: false,
  });
  return health;
}

export async function signEventWithConfiguredProvider(
  template: EventTemplate,
  timeoutMs = 30_000,
): Promise<SignWithBunkerResult> {
  const ident = readIdentity();
  if (ident.signerMode !== 'cinderella') return signEventWithSavedBunker(template, timeoutMs);
  if (!ident.npub || !ident.cinderellaGatewayUrl) {
    return { ok: false, tried: false, error: 'Cinderella is not configured' };
  }
  const token = await readGatewayToken();
  if (!token) return { ok: false, tried: false, error: 'Cinderella gateway token is missing' };
  try {
    const body = await gatewayRequest(
      ident.cinderellaGatewayUrl,
      token,
      '/sign',
      { method: 'POST', body: JSON.stringify({ event: template }) },
      timeoutMs,
    );
    const event = body.event;
    if (!event || event.kind !== template.kind || event.created_at !== template.created_at ||
        event.content !== template.content || JSON.stringify(event.tags) !== JSON.stringify(template.tags)) {
      throw new Error('Cinderella returned a different event');
    }
    if (event.pubkey !== npubToHex(ident.npub)) throw new Error('Cinderella returned the wrong public key');
    if (event.id !== getEventHash(event)) throw new Error('Cinderella returned the wrong event id');
    if (!verifyEvent(event)) throw new Error('Cinderella returned an invalid signature');
    return { ok: true, tried: true, signedEvent: event };
  } catch (error: any) {
    return { ok: false, tried: true, error: error?.message || 'Cinderella signing failed' };
  }
}
