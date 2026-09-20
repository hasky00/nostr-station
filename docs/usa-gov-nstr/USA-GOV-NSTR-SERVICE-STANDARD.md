# USA.gov.Nstr Service Standard

## Purpose

This document defines the common architecture for every experimental service
branch under `usa.gov.Nstr`. Each service has its own architecture file and one
narrow workflow, but all services use the same identity, signing, privacy, and
authorization model.

This standard is experimental. It does not replace governing law, agency
authority, required physical procedures, accessibility obligations, due
process, or existing official records.

## Four-Layer Identification

No single identifier is sufficient for a government action.

### Layer 1: Government Authority

The `usa.gov.Nstr` registry binds a stable government organization and service
role to its active Nostr keys. Clients verify registry authority, jurisdiction,
key purpose, policy epoch, expiration, rotation, and revocation.

### Layer 2: Cryptographic Control

Cinderella proves that the required signing threshold approved the exact
canonical event. It provides recoverable control of a key, not legal identity,
citizenship, eligibility, professional authority, or truth of the signed data.

Citizen experiments use `2-of-3`. Government service keys use `3-of-5` or a
stronger role-composed threshold. High-impact actions require independent
approvers and cannot be authorized by one workstation or operator.

### Layer 3: Authoritative Proofing

The responsible agency applies its existing identity, residency, eligibility,
ownership, professional, case, or evidence checks. Results come from an
authoritative government system or authorized human decision, not from the
citizen's Nostr key.

The service records a minimal signed result such as `identity-verified`,
`eligibility-confirmed`, or `authority-confirmed`; it does not place the source
evidence on a relay.

### Layer 4: Case and Action Authorization

Every action is bound to a service, jurisdiction, opaque case, signer role,
workflow state, request ID, challenge, policy version, purpose, and expiry. A
valid signature is rejected when the signer lacks authority for that exact
case or transition.

## Shared Components

```text
Citizen or government workstation
  -> Cinderella signer provider
  -> Service gateway
       -> Private government relay: minimal signed workflow events
       -> Case database: authoritative state and access mappings
       -> Encrypted vault: forms, evidence, records, and deliverables
       -> KMS/HSM: encryption and institutional signing protection
       -> Audit service: policy decisions, alerts, and checkpoints
```

The relay is never the primary database or bulk document store.

## Data Boundary

Private relays may store:

- Opaque case aliases
- Event and status names
- Case-scoped and registered agency keys
- Previous event IDs
- Request IDs, timestamps, and expirations
- Policy versions
- Opaque vault references
- Digests of randomized encrypted objects

Private relays must not store:

- Names, birth dates, SSNs, addresses, or telephone numbers
- Medical, tax, immigration, benefit, license, or court records
- Document images, photographs, account numbers, or credential numbers
- Human-readable denial reasons
- Reusable download URLs
- Hashes of predictable personal data

The government gateway resolves opaque references only after authenticating
the caller and authorizing the exact case operation.

## Shared Signing Policy

| Action tier | Example | Minimum experimental policy |
| --- | --- | --- |
| Public | Publish service metadata | Registered agency service quorum |
| Routine | Create request or receipt | Authorized case key and replay checks |
| Sensitive | View or update protected case | Fresh challenge and stronger approval |
| Determinative | Approve, deny, suspend, revoke | Role-composed agency quorum |
| Identity | Rotate key or change delegation | Delay, independent approval, new epoch |
| Destructive | Delete, withdraw, permanently close | Strong quorum, reason, review window |
| Emergency | Issue urgent public instruction | Dedicated schema and emergency quorum |

Cinderella signers receive the complete event and independently verify its
schema, service, jurisdiction, role, case, policy epoch, request ID, timestamp,
expiry, and content commitment. Blind hash signing is prohibited.

## Shared Event Envelope

Every service event includes:

```text
schema_version
service_id
jurisdiction_id
event_type
opaque_case_alias
request_id
previous_event_id
signer_role
created_at
expires_at
privacy_class
policy_hash
```

Services define event names first. They do not claim standardized Nostr kind
numbers until interoperability and privacy review are complete.

## Transport and Encryption

- NIP-42 authenticates relay connections; application policy authorizes cases.
- NIP-98 may authorize HTTP requests when combined with a one-time challenge,
  exact URL and method validation, payload digest, short expiry, and consumed
  nonce storage.
- NIP-44 may protect limited messages but is not sufficient for long-lived,
  high-risk government records because it lacks forward secrecy and
  post-compromise security.
- NIP-59 may reduce message metadata exposure but does not eliminate timing,
  traffic, endpoint, or relay-operator visibility.
- Sensitive documents use reviewed envelope encryption in the government
  vault, with independent per-object data keys protected by a KMS or HSM.

## Shared Recovery Rules

Lost share:

1. Mark the share suspect and restrict sensitive actions.
2. Demonstrate the surviving Cinderella threshold.
3. Perform separate identity or authority proofing.
4. Issue fresh shares and advance the policy epoch.
5. Sign a redacted recovery receipt.

Lost case key:

1. Recover through Cinderella when possible.
2. Otherwise, perform agency-approved proofing.
3. Bind a new case key to the internal case.
4. Revoke the old key for future actions.
5. Preserve old signatures as historical evidence.

Suspected threshold compromise:

1. Freeze high-impact actions.
2. Create a completely new key and keyset.
3. Publish a registry-backed revocation and continuity statement.
4. Reject new events from the retired key after the effective time.
5. Investigate all events from the affected period.

## Experimental Rules

- Synthetic identities and records only
- No public relay federation for private services
- No legal, financial, medical, immigration, voting, licensing, or benefit
  decision made by the experiment
- Existing non-digital and accessibility channels remain available
- Explicit human review and appeal paths for consequential decisions
- Redacted structured logging
- Data retention and deletion defined per service
- Threat modeling and independent review before any real-data pilot
- Cryptographic success never described as legal or factual correctness

## Required Tests for Every Service

1. Correct threshold signs the intended event.
2. One unavailable citizen share does not stop routine signing.
3. One signer cannot authorize an institutional action.
4. Mutated, replayed, expired, wrong-service, and wrong-case events fail.
5. Revoked and stale-epoch keys fail.
6. Unauthorized roles cannot advance workflow state.
7. Relay inspection reveals no protected record content.
8. Vault references cannot be resolved without case authorization.
9. Recovery preserves history without granting silent takeover.
10. Audit export detects missing, duplicated, and reordered events.

## Protocol References

- NIP-01: https://github.com/nostr-protocol/nips/blob/master/01.md
- NIP-42: https://github.com/nostr-protocol/nips/blob/master/42.md
- NIP-44: https://github.com/nostr-protocol/nips/blob/master/44.md
- NIP-59: https://github.com/nostr-protocol/nips/blob/master/59.md
- NIP-98: https://github.com/nostr-protocol/nips/blob/master/98.md
