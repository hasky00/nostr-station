# Taxstr Architecture

## Selected Service

Taxstr initially supports one federal service: an individual requests and
receives an IRS tax transcript. It does not file a tax return, make a payment,
calculate tax, or share a transcript with a third party.

Tax transcripts contain highly sensitive tax and financial information. The
transcript stays in the encrypted IRS-controlled vault and is never placed on a
Nostr relay, even in encrypted form.

## Four Identification Layers

1. **Government authority:** the registry verifies the IRS and Taxstr keys.
2. **Cryptographic control:** the taxpayer approves with a `2-of-3` Cinderella
   identity and a transcript-request case key.
3. **Authoritative proofing:** IRS identity systems bind the requester to the
   taxpayer account. The Nostr key is not a taxpayer identification number.
4. **Case authorization:** the request is bound to transcript type, tax year,
   delivery channel, expiry, and opaque case alias.

## Workflow

1. The workstation verifies the active Taxstr registry entry.
2. The taxpayer selects an available transcript type and tax year.
3. Cinderella signs `transcript-request-intent` after showing the exact scope.
4. The IRS gateway performs authoritative account and identity checks.
5. Taxstr creates an opaque case and signs `request-accepted` or a minimal
   `request-needs-review` receipt.
6. The IRS generates the transcript inside its existing system.
7. The transcript is envelope-encrypted and stored in the government vault.
8. Taxstr publishes `transcript-ready` with an opaque vault reference and short
   retrieval window.
9. The taxpayer signs a fresh NIP-98-style retrieval authorization.
10. The gateway streams the transcript over TLS after authorization.
11. Taxstr signs `transcript-delivered`; the citizen may close the case.

## Event Contract

- `transcript-request-intent`
- `request-accepted`
- `request-needs-review`
- `transcript-processing`
- `transcript-ready`
- `transcript-delivered`
- `case-key-rotation`
- `case-closed`

Relay events contain no SSN, name, address, income, tax year, transcript type,
account data, or transcript content. Tax year and transcript type remain inside
the encrypted case record because they can reveal personal circumstances.

## Cinderella Policy

- Citizen request and retrieval: `2-of-3` citizen threshold
- IRS generation receipt: registered Taxstr service quorum
- Disclosure to another party: excluded from v1 and denied by default
- Citizen key recovery: surviving threshold plus separate IRS proofing
- IRS key rotation: institutional quorum and registry epoch update

## Policy Boundaries

- Taxstr proves request and delivery history, not correctness of tax records.
- A transcript is released only to the verified taxpayer in v1.
- No financial data enters event tags, URLs, telemetry, or error messages.
- Existing IRS online and mail alternatives remain authoritative fallbacks.

## Success Criteria

A synthetic taxpayer can request one fake transcript, receive signed status,
retrieve the encrypted artifact once, recover after one lost share, and export
a verifiable receipt history without exposing tax data to the relay.

## Official Reference

- IRS, Get your tax records and transcripts:
  https://www.irs.gov/individuals/get-transcript
