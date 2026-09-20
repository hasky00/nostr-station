import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { Server } from 'node:http';

import { useTempHome } from './_home.js';
useTempHome();
process.env.STATION_INPROC_RELAY = '0';
process.env.STATION_DISABLE_NVPN_TAIL = '1';
process.env.NOSTR_STATION_EXPERIMENTAL_SIGNER_BYPASS = '1';

const { startWebServer } = await import('../src/lib/web-server.js');
const { readIdentity } = await import('../src/lib/identity.js');

async function boot(): Promise<{ server: Server; port: number }> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const port = 30000 + Math.floor(Math.random() * 20000);
    try {
      return { server: await startWebServer(port), port };
    } catch (error: any) {
      if (!/EADDRINUSE/.test(error?.message ?? '')) throw error;
    }
  }
  throw new Error('could not find a free port');
}

function request(port: number, path: string, method = 'GET'): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        host: `127.0.0.1:${port}`,
        origin: `http://127.0.0.1:${port}`,
      },
    }, res => {
      const chunks: Buffer[] = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode ?? 0,
        body: JSON.parse(Buffer.concat(chunks).toString('utf8')),
      }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('experimental signer bypass creates a non-signing local identity', async (t) => {
  const { server, port } = await boot();
  t.after(() => new Promise<void>(resolve => server.close(() => resolve())));

  const options = await request(port, '/api/setup/options');
  assert.equal(options.status, 200);
  assert.equal(options.body.experimentalSignerBypass, true);

  const bypass = await request(port, '/api/setup/experimental-bypass', 'POST');
  assert.equal(bypass.status, 200);
  assert.equal(bypass.body.ok, true);
  assert.equal(bypass.body.signerMode, 'experimental-none');
  assert.match(bypass.body.npub, /^npub1/);

  const identity = readIdentity();
  assert.equal(identity.signerMode, 'experimental-none');
  assert.equal(identity.requireAuth, false);
  assert.equal(identity.setupComplete, false);

  const verify = await request(port, '/api/setup/verify', 'POST');
  assert.equal(verify.status, 200);
  assert.equal(verify.body.ok, true);
  assert.equal(verify.body.bypassed, true);
});
