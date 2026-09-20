import test from 'node:test';
import assert from 'node:assert/strict';
import http, { type Server } from 'node:http';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { useTempHome, resetTempHome } from './_home.js';

const HOME = useTempHome();
const token = 'station-test-token-with-at-least-thirty-two-characters';
process.env.CINDERELLA_GATEWAY_TOKEN = token;

const { hexToNpub, writeIdentity } = await import('../src/lib/identity.js');
const { signEventWithConfiguredProvider } = await import('../src/lib/signer-provider.js');

async function fakeGateway(
  sign: (template: any) => any,
): Promise<{ server: Server; url: string }> {
  const server = http.createServer((req, res) => {
    if (req.headers.authorization !== `Bearer ${token}`) {
      res.writeHead(401, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: 'unauthorized' }));
      return;
    }
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, event: sign(body.event) }));
    });
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  return { server, url: `http://127.0.0.1:${address.port}` };
}

test('configured Cinderella provider returns a verified signed event', async (t) => {
  resetTempHome(HOME);
  const secret = generateSecretKey();
  const pubkey = getPublicKey(secret);
  const gateway = await fakeGateway(template => finalizeEvent(template, secret));
  t.after(() => new Promise<void>(resolve => gateway.server.close(() => resolve())));
  writeIdentity({
    npub: hexToNpub(pubkey),
    readRelays: [],
    signerMode: 'cinderella',
    cinderellaGatewayUrl: gateway.url,
  });

  const result = await signEventWithConfiguredProvider({
    kind: 1,
    created_at: 123,
    tags: [['t', 'government-service']],
    content: 'approved',
  });
  assert.equal(result.ok, true);
  assert.equal(result.tried, true);
  assert.equal(result.signedEvent?.pubkey, pubkey);
});

test('configured Cinderella provider rejects a gateway that changes the event', async (t) => {
  resetTempHome(HOME);
  const secret = generateSecretKey();
  const pubkey = getPublicKey(secret);
  const gateway = await fakeGateway(template => finalizeEvent({ ...template, content: 'changed' }, secret));
  t.after(() => new Promise<void>(resolve => gateway.server.close(() => resolve())));
  writeIdentity({
    npub: hexToNpub(pubkey),
    readRelays: [],
    signerMode: 'cinderella',
    cinderellaGatewayUrl: gateway.url,
  });

  const result = await signEventWithConfiguredProvider({
    kind: 1,
    created_at: 123,
    tags: [],
    content: 'original',
  });
  assert.equal(result.ok, false);
  assert.match(result.error || '', /different event/i);
});
