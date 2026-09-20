# Cinderella signer experiment

## Conclusion

Cinderella is feasible as a real Nostr event-signing provider for
nostr-station. The current integration is experimental: it proves the local
provider contract and event-integrity checks, but it is not yet evidence of a
production-ready recovery system or a completed multi-device threshold
deployment.

## Implemented

- `signerMode: "cinderella"` identity selection with Amber fallback.
- A loopback-only, bearer-authenticated Cinderella gateway client.
- Gateway credentials stored in the platform keychain, not `identity.json`.
- Verification of the returned event template, author pubkey, event ID, and
  Schnorr signature before a signed event is accepted.
- Provider-aware signing across the station's standard event publication
  paths.
- Setup and Config UI for connecting the Cinderella gateway.
- An explicit non-signing setup mode for workstation evaluation before shares
  are connected.

## Evidence

- Cinderella gateway build and contract tests pass.
- The gateway refuses unauthenticated requests and arbitrary blind hashes.
- The station accepts a correctly signed event and rejects a gateway response
  that changes the requested event.
- nostr-station build and typecheck pass.
- The full nostr-station suite passes except for the existing watchdog tests
  that require macOS Keychain authorization in the test environment.

These tests establish integration feasibility. A real k-of-n ceremony across
independent devices is still required before making a threshold-security
claim.

## Threshold ECDH gate

Bifrost exposes threshold ECDH and an `ecdh` middleware hook. Cinderella must
add policy-aware NIP-44 operations without exposing the derived shared secret:

1. Add authenticated gateway operations for NIP-44 encrypt and decrypt.
2. Bind every ECDH request to an operation, requesting application,
   counterparty pubkey, request ID, expiry, and content hash.
3. Make every participating share evaluate that context before contributing.
4. Perform NIP-44 inside the gateway and return only ciphertext or plaintext.
5. Add provider capabilities for public-key lookup, NIP-44 encrypt/decrypt,
   and event signing, then migrate the mail pipeline to that interface.

## Provider-aware NIP-98 gate

NIP-98 uses ordinary event signing, so no new threshold primitive is needed.
The authentication flow must:

1. Issue a single-use challenge.
2. Build kind 27235 with the exact URL, method, timestamp, challenge, and
   payload hash when applicable.
3. Sign through the selected provider.
4. Verify the owner pubkey, signature, URL, method, freshness, and challenge.
5. Consume the challenge and record the provider in the issued session.

An unauthenticated remote endpoint must never automatically sign its own login
challenge. Remote Cinderella login therefore requires a NIP-46 transport or an
equivalent explicit approval path at the shares.

## Required validation

- Real 2-of-3 signing with shares on independent devices.
- Successful signing with one share offline.
- Policy rejection by a share prevents threshold completion.
- Threshold NIP-44 round trips without raw-secret leakage.
- NIP-98 replay, wrong-URL, wrong-method, and expired-challenge rejection.
- Lost-share replacement and recovery rehearsal.
- Review of logs, files, and API responses for key or shared-secret leakage.
