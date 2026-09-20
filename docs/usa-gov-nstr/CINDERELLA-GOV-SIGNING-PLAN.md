# Cinderella Government Signing Plan

## Purpose

This plan adapts the experimental `hasky00/cinderella` policy-aware FROSTR signer into the signing and recovery layer for the `usa.gov.Nstr` workstation.

The objective is to remove the single-device failure mode of ordinary mobile signing while preserving Nostr-compatible Schnorr signatures, protecting sensitive government actions with independent policy enforcement, and providing a governed recovery path when a device or share is lost.

This is an experimental security architecture. It must not be used for real government identities, citizen records, benefits, taxes, elections, emergency alerts, or legal notices until the cryptography, implementation, operations, and recovery ceremonies have completed independent review.

## Security Position

Cinderella improves on a single signer in three ways:

1. A signing key is divided into a `k-of-n` FROSTR keyset.
2. No individual share can produce a valid signature.
3. Every participating Cinderella node independently inspects the complete Nostr event and enforces policy before producing a partial signature.

It does not solve every recovery problem by itself.

- If fewer than `k` valid shares remain, the same private key cannot be recovered unless another authorized recovery mechanism holds sufficient material.
- Reissuing shares for the same secret does not cryptographically revoke old shares. An old quorum can still sign if enough old shares were retained or compromised.
- A normal Nostr verifier sees the final signature and public key, not which share set or policy approved it.
- Government identity continuity must therefore combine threshold cryptography with a signed registry, keyset epochs, auditable ceremonies, and legal authority.

## Design Principles

- No permanent `nsec` on a workstation, phone, or application server.
- No single person, device, office, vendor, or cloud account can control an agency identity.
- Signers receive the complete canonical event and never sign a blind hash.
- The public key registry separates legal identity from the current operational signing key.
- Daily actions remain usable; identity-changing and destructive actions require stronger quorum and delay.
- Recovery is easier than permanent identity loss, but harder than ordinary signing.
- Old shares are treated as hazardous until there is evidence of destruction or the public key is retired.
- Citizen privacy is not weakened to make recovery convenient.
- All policy decisions are deterministic, versioned, signed, and auditable.

## Identity Model

### Legal Identity Versus Operational Key

Each agency receives a stable registry identifier that is not itself a Nostr public key.

```text
agency_id: us-gov-state-passport
legal_name: U.S. Department of State - Passport Services
active_npub: npub1...
keyset_epoch: 7
policy_hash: sha256:...
status: active
previous_npubs: [...]
```

The registry entry is signed by the `usa.gov.Nstr` registry authority and mirrored to transparency relays.

This gives two continuity modes:

- Share recovery: preserve the same `npub` when a valid threshold remains.
- Identity migration: preserve the same legal agency identity while replacing the `npub` when the old key is unrecoverable or suspected to have a compromised quorum.

Clients must verify both the Nostr signature and the current registry entry. A valid signature from a retired key is historical evidence, not current authority.

### Keyset Epochs

Every operational event includes:

```text
["agency", "us-gov-state-passport"]
["keyset_epoch", "7"]
["policy", "sha256:<policy-hash>"]
["request_id", "<unique-id>"]
```

Cinderella nodes refuse events with the wrong agency, stale epoch, unknown policy hash, duplicate request ID, excessive clock skew, or expired authorization.

The registry records the accepted epoch. Government services reject stale epochs even when the underlying Schnorr signature is valid.

Epochs reduce accidental reuse and make stale activity visible, but they cannot stop an old quorum from creating signatures that legacy Nostr clients may accept. A suspected old-quorum compromise therefore requires migration to a new `npub`.

## Recommended Quorums

### Citizen Pilot

Use `2-of-3` only for a non-production pilot:

| Share | Location | Normal state |
| --- | --- | --- |
| C1 | Citizen phone signer | Online when used |
| C2 | Citizen workstation or hardware token | Available |
| C3 | Encrypted offline recovery device | Offline |

This survives one lost device. Recovery requires two valid shares and fresh identity proofing before a replacement share is issued.

The government must not silently hold a citizen share in the same system that consumes the identity. An optional assisted-recovery share requires explicit consent, separation of duties, published terms, and a design that cannot track routine citizen signing.

### Agency Service Key

Use `3-of-5`:

| Share | Custodian |
| --- | --- |
| A1 | Service operations HSM |
| A2 | Agency security HSM |
| A3 | Independent regional office HSM |
| A4 | Offline disaster-recovery device |
| A5 | Inspector or independent continuity authority |

Routine service events may use A1+A2+A3. Recovery and policy changes must include at least one offline or independent custodian.

### Agency Master and Emergency Keys

Use `4-of-7` or stronger, with organizational and geographic separation. The threshold must include mandatory role classes, not merely any four devices.

Example required composition:

- At least one agency security custodian
- At least one independent oversight custodian
- At least one offline recovery custodian
- At least one executive or legally delegated approver

Plain FROSTR `4-of-7` does not enforce role composition. Cinderella must add role-aware policy before this is relied upon.

## Signing Tiers

The current Cinderella `daily`, `identity`, and `destructive` model should become a versioned government policy matrix.

| Tier | Examples | Minimum controls |
| --- | --- | --- |
| Informational | Public office hours, non-binding updates | Standard service quorum, rate limit |
| Transactional | Receipts, appointments, case acknowledgements | Service quorum, request correlation, replay protection |
| Sensitive | Benefits decision, tax notice, license status | Strong quorum, case authorization, encrypted delivery |
| Identity | Kind 0, relay list, delegated key, policy or epoch update | Strong quorum, 24-hour delay, independent approval |
| Destructive | Deletion, revocation, permanent closure | Strong quorum, 48-hour delay, named approvers, veto window |
| Emergency | Time-critical public warning | Dedicated emergency quorum, strict schema, immediate post-event review |

Unknown kinds remain denied by default.

Emergency signing must not simply bypass policy. It needs a dedicated key, narrow event schema, geographic scope, short expiration, high-visibility audit event, and mandatory retrospective review.

## Workstation Architecture

```text
Government service UI
        |
        v
NIP-46 Cinderella Gateway
  - authenticates workstation and operator
  - constructs canonical event
  - attaches full event JSON
  - adds agency, epoch, policy and request tags
        |
        v
Authorization Service
  - verifies operator role and case authority
  - issues short-lived signed authorization
        |
        v
FROSTR coordination relays
  - encrypted transport only
  - no custody or policy authority
        |
        v
Cinderella share nodes
  - independently verify event hash
  - verify schema, epoch and authorization
  - enforce tier, delay, rate and replay policy
  - produce partial signature only after approval
        |
        v
Standard Nostr signature
        |
        +--> Government service relay
        +--> Transparency log checkpoint
        +--> Audit and monitoring pipeline
```

The workstation never handles raw shares. It communicates with the gateway using NIP-46 or a narrowly scoped equivalent. Shares remain in dedicated signers or HSM-backed signer services.

## Recovery Workflows

### Lost Citizen Phone, Threshold Still Available

1. Citizen reports the device lost and the phone share is marked suspect.
2. Routine signing is temporarily restricted.
3. Citizen proves control of the workstation share and offline recovery share.
4. Identity proofing confirms the recovery request through a separate channel.
5. The surviving threshold reconstructs or rotates the keyset in an isolated recovery environment.
6. Fresh shares are distributed to new devices.
7. A new keyset epoch is registered and old share identifiers are denied by Cinderella policy.
8. The recovery produces a signed receipt and public transparency checkpoint without exposing citizen personal data.

### One Agency Share Lost

1. Security Operations opens an incident with a unique recovery ID.
2. Remaining custodians freeze identity and destructive tiers.
3. A recovery quorum meets in a recorded ceremony.
4. The same key is split into a fresh share set only inside an isolated environment.
5. New shares are delivered through separate authenticated channels.
6. The registry advances the keyset epoch and publishes the policy hash.
7. All reachable old shares are destroyed and destruction attestations are logged.
8. Monitoring treats any event claiming the old epoch as a critical incident.

### Suspected Old-Quorum Compromise

Do not preserve the same `npub`.

1. Freeze the affected service.
2. Generate a completely new key and keyset.
3. Use the agency master and registry authority to publish an emergency revocation and continuity statement.
4. Update the registry to the new operational `npub`.
5. Require clients to reject new events from the retired key after the effective time.
6. Preserve old signed records as historical evidence.

### Threshold Permanently Lost

The same `npub` cannot be recovered. A new keyset is created after legal identity proofing, multi-party approval, and public registry migration. The stable agency ID preserves institutional continuity.

For citizens, the service must support account and case continuity through privacy-preserving identity proofing and pairwise identifiers. It must not claim that a new Nostr key is cryptographically the same identity.

## Required Cinderella Changes

### P0: Make the Prototype Durable

- Persist rate-limit history, pending delays, vetoes, used request IDs, and policy version across restart.
- Use an authenticated database with atomic writes and rollback protection.
- Validate the complete Nostr event schema, canonical serialization, field sizes, tag counts, timestamps, and public key.
- Require the event public key to equal the configured FROSTR group public key.
- Replace free-form log strings with structured, redacted audit events.
- Add deterministic configuration validation and signed policy bundles.
- Add tests for malformed events, restart behavior, replay, time skew, concurrency, and partial failures.

### P1: Build the Workstation Gateway

- Implement a NIP-46 gateway that always attaches full event JSON.
- Authenticate each workstation, operator, agency, and service.
- Add short-lived authorization tokens bound to event ID, kind, service, operator, case, expiry, and request ID.
- Reject arbitrary hash signing and unsupported batch signing.
- Provide dry-run policy evaluation before asking custodians to approve.
- Return a human-readable approval summary to each signer.

### P2: Recovery and Rotation

- Integrate audited FROSTR keyset recovery and rotation utilities.
- Support new member enrollment, lost member removal, threshold changes, and fresh share distribution.
- Add keyset epoch management and a registry update transaction.
- Require recovery ceremonies to use an offline or isolated coordinator.
- Produce signed recovery manifests and destruction attestations.
- Never place reconstructed `nsec` material in logs, shell history, environment variables, or ordinary files.

### P3: Role-Aware Policy

- Assign every signer a verified role and organization.
- Define required role composition per tier.
- Require named approval for identity and destructive events.
- Add dual control for policy changes.
- Add a duress process that freezes signing and alerts oversight; it must not secretly create misleading government events.

### P4: Registry and Transparency

- Build the national agency registry described in `USA-GOV-NSTR-ARCHITECTURE.md`.
- Publish active key, retired keys, keyset epoch, policy hash, effective time, and recovery status.
- Use append-only transparency checkpoints and independent mirrors.
- Provide client libraries that fail closed when registry status is unknown for high-risk actions.

## Policy Engine Corrections

The current implementation is a good proof of concept but has known limitations that must be addressed:

- Delay queues and rate-limit counters are in memory and disappear on restart.
- `veto_all()` is local and unauthenticated; the README roadmap describes a listener that is not implemented.
- The policy checks event kind but not agency, service, operator, authorization, keyset epoch, or event expiry.
- The request only checks that the event ID appears in a one-item hash list; stronger typed validation is needed.
- The policy does not verify that the event public key matches the configured group public key.
- The configuration is read from a local unsigned JSON file.
- There is no durable anti-replay store or cross-node consensus on pending state.
- Tests are script-style smoke tests rather than a comprehensive adversarial suite.

These are prototype gaps, not reasons to abandon the concept. They define the first engineering milestone.

## Pilot Sequence

### Phase 0: Threat Model and Specification

- Define citizen, operator, insider, relay, workstation, signer, and supply-chain attackers.
- Specify signing tiers, role composition, recovery ceremonies, privacy boundaries, and failure behavior.
- Decide which Nostr event kinds and tags are experimental.
- Obtain cryptographic and public-sector identity review before production code claims.

Exit condition: reviewed protocol and testable security requirements.

### Phase 1: Local Three-Node Lab

- Run three Cinderella nodes with synthetic shares and isolated local relays.
- Connect a development build of the Nostr workstation through the gateway.
- Demonstrate ordinary signing, signer refusal, device loss, restart, veto, delay, replay rejection, and share replacement.
- Use only generated test identities and synthetic records.

Exit condition: repeatable automated integration tests with no manual secret copying.

### Phase 2: Agency Simulation

- Run a `3-of-5` Passportstr simulation across separate machines and networks.
- Add role-aware authorization, durable policy state, registry epochs, and audit checkpoints.
- Conduct lost-share, malicious-signer, stale-epoch, relay-outage, clock-skew, and workstation-compromise exercises.

Exit condition: documented recovery time, no single-person control, and independent red-team findings resolved.

### Phase 3: Citizen Recovery Sandbox

- Test `2-of-3` recovery with volunteer test identities only.
- Compare self-recovery, trusted-person recovery, and institution-assisted recovery.
- Measure accessibility, coercion risk, privacy leakage, and support burden.
- Give users clear proof of which entities hold shares and what they can do.

Exit condition: recovery works without creating a hidden government master key.

### Phase 4: Independent Review

- Commission cryptographic, application-security, operational-security, privacy, accessibility, and civil-rights assessments.
- Publish the protocol, code, threat model, test vectors, limitations, and audit findings.
- Run a public bug bounty against the sandbox.

Exit condition: explicit authorization for a narrowly scoped, non-critical pilot.

## Test Requirements

- One share cannot sign.
- `k` authorized shares can sign a permitted event.
- `k` shares cannot sign an event denied by policy when every node enforces the same policy.
- Blind hashes, altered content, mismatched public keys, stale epochs, expired authorizations, duplicated request IDs, and unknown kinds are rejected.
- Restarting every node does not erase delays, vetoes, replay state, or rate limits.
- A lost share can be replaced while quorum remains.
- An old share alone cannot join the new active set.
- Retired epochs are rejected by government clients and services.
- A compromised old quorum triggers public-key migration, not false recovery.
- Relay failure, partition, malicious relay replay, clock skew, and concurrent signing cannot bypass policy.
- Audit logs contain enough evidence for investigation but no shares, secrets, citizen documents, or unnecessary personal data.

## Initial Deliverables

1. `cinderella-threat-model.md`
2. Versioned `cinderella-policy.schema.json`
3. Durable policy-state module with migration support
4. NIP-46 Cinderella gateway prototype
5. Agency registry and keyset-epoch schema
6. Three-node local integration environment
7. Recovery ceremony CLI using test keys only
8. Adversarial test suite and published test vectors
9. Workstation signing-status and recovery UI
10. Independent review package

## First Build Milestone

The first milestone should not be a government deployment. It should be a local demonstrator that proves this complete path:

```text
Create synthetic 2-of-3 keyset
  -> register group npub and epoch 1
  -> request a signed Passportstr test receipt
  -> obtain two policy-approved partial signatures
  -> publish and verify the standard Nostr event
  -> simulate loss of one share
  -> recover into a fresh share set
  -> advance registry to epoch 2
  -> reject an epoch-1 request
  -> verify that the public npub remained unchanged
```

After that works reliably, repeat the exercise with a suspected old-quorum compromise and prove migration to a new `npub` through the registry.

## Decision

Cinderella is a stronger experimental foundation than single-device Amber signing for this workstation because it removes the phone as the sole custody and availability point and adds policy at every signing share. The secure government model is not merely `Amber replaced by FROSTR`. It is:

```text
Cinderella threshold signing
+ role-aware authorization
+ durable policy state
+ governed recovery ceremonies
+ registry-enforced key epochs
+ public-key migration for true compromise
+ independent audit
```

That complete system can improve resilience without claiming that threshold cryptography alone solves institutional identity.
