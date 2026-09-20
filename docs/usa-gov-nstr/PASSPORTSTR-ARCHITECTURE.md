# Passportstr Architecture

## Status

Passportstr is the first experimental service branch under `usa.gov.Nstr`.
It explores how a single public service can use Nostr-compatible signatures,
recoverable Cinderella signing, private workflow events, and government-held
records without treating a Nostr public key as proof of citizenship.

This is an experimental architecture. It is not a production passport system,
does not issue a legal passport, and must use synthetic people and documents
until independent security, privacy, legal, accessibility, and operational
reviews are complete.

## Service Scope

The first experiment supports one service only:

```text
USA.gov.Nstr
  -> Passportstr
    -> New Passport
      -> First-time adult U.S. passport book application
```

Included:

- First-time adult applicant in the United States
- Routine passport-book application
- Application preparation and signed submission intent
- In-person acceptance checkpoint
- Evidence receipt and administrative status tracking
- Additional-information requests and response receipts
- Approval, production, mailing, and case closure status
- Citizen signing continuity after loss of one Cinderella share

Excluded from the first experiment:

- Passport renewal
- Applications for minors
- Passport cards
- Lost, stolen, damaged, or corrected passports
- Urgent or emergency travel
- Applications outside the United States
- Diplomatic, official, or special-issuance passports
- Real citizen records, real passport numbers, and production issuance

## Passport Services Map

Passportstr is the parent service identity for a larger family of citizen
workflows. The landing-page service map groups the Department of State's public
passport services into four branches:

1. **Apply:** first-time adult, child under 16, and applicant age 16-17.
2. **Renew or replace:** eligible online renewal, mail renewal, lost or stolen
   passport reporting, and name or data correction.
3. **Timing and access:** routine or expedited service, urgent travel, where to
   apply, and fee options.
4. **Case support:** application status, forms, and official contact channels.

These graph nodes are a navigation and architecture map, not one combined
workflow. Each future node requires its own evidence rules, signer roles,
authorization states, privacy review, event contract, recovery policy, and
non-digital alternative before it can become an experimental Passportstr
workflow. Only the first-time adult passport-book node is modeled in v1.

## Foundational Claims

### A Public Key Is Not Citizenship

A citizen's Nostr public key proves control of cryptographic signing authority.
It does not prove the person's name, citizenship, age, address, eligibility, or
legal identity.

Citizenship evidence remains subject to the authorized government process. Once
the evidence is examined, an authorized agency may sign a private attestation
that a specific Passportstr case passed that checkpoint. The attestation must
not reproduce the evidence or expose personal data.

### Nostr Is the Coordination Layer

Passportstr uses Nostr events for:

- Signed requests and receipts
- Agency and facility authentication
- Workflow status transitions
- Tamper-evident event relationships
- Key rotation and revocation notices
- Citizen-visible audit history

Nostr is not the passport database, document vault, citizenship registry, or
legal issuing authority.

### Sensitive Records Stay Off Relays

No name, birth date, Social Security number, address, photograph, document
image, application locator number, or passport number is placed on a public
relay.

For the experiment, those fields are also excluded from the private relay. The
private relay carries only minimal workflow events, opaque references, status
codes, signatures, and timestamps.

## Four-Layer Identification

Passportstr does not accept one key or one database match as sufficient proof.
Every sensitive action passes four distinct layers:

1. **Government authority:** the `usa.gov.Nstr` registry verifies the
   Department of State, Passportstr service, acceptance-facility, and delegated
   operational keys.
2. **Cryptographic control:** Cinderella proves that the configured threshold
   approved the exact event using the citizen's service-scoped or case key.
3. **Authoritative proofing:** authorized government personnel and systems
   examine the applicant and required evidence under the existing passport
   process. A Nostr key is not evidence of citizenship.
4. **Case authorization:** the gateway binds the signer, role, opaque case,
   workflow state, request ID, policy version, challenge, purpose, and expiry
   before allowing a transition.

The layers produce different evidence and must remain separate. A valid
Cinderella signature cannot replace government proofing, and a successful
government database match cannot silently authorize a new signed action.

## System Architecture

```text
Citizen workstation
  |
  | approve and sign
  v
Cinderella signer provider
  |
  | signed Nostr event or signed HTTP authorization
  v
Passportstr government gateway
  |                  |                    |
  | workflow events  | case state         | encrypted objects
  v                  v                    v
Private Nostr relay  Case database        Document vault
  |                  |                    |
  +------------------+--------------------+
                     |
                     v
             Audit and monitoring
```

### Citizen Workstation

The workstation:

- Shows the exact action before approval
- Builds canonical event templates
- Requests signatures from Cinderella
- Verifies returned event IDs and signatures
- Authenticates to government HTTP endpoints
- Displays agency-signed receipts and case status
- Never stores an unprotected permanent private key

### Cinderella Signer Provider

The citizen pilot uses a recoverable `2-of-3` threshold policy:

| Share | Suggested custody | Normal state |
| --- | --- | --- |
| C1 | Citizen workstation or hardware token | Available |
| C2 | Independent trusted device | Available when needed |
| C3 | Encrypted offline recovery medium | Offline |

Cinderella signs citizen actions after each participating share evaluates the
complete action. It protects signing authority; it does not determine
citizenship or make an application legally valid by itself.

### Passportstr Government Gateway

The gateway is the only component allowed to resolve an opaque relay reference
to an internal case or vault object. It:

- Verifies citizen and agency signatures
- Enforces freshness, nonce, replay, role, and case authorization rules
- Maps case-scoped public keys to internal records
- Issues short-lived upload and download capabilities
- Writes authoritative state changes to the case database
- Publishes minimal signed workflow receipts
- Redacts personal data from logs and errors

### Private Nostr Relay

The relay stores a compact signed workflow history. It requires TLS, NIP-42
authentication, an explicit key allowlist, recipient-level read policy, rate
limits, storage quotas, expiration policy, and disabled public federation.

NIP-42 authenticates the relay connection. Passportstr authorization still
decides which authenticated key may read or write each case.

The relay must never:

- Mirror events to a public relay
- Accept anonymous reads or writes
- Store document files or raw application forms
- Expose reusable vault URLs
- Treat possession of a Nostr key as government identity proof

### Case Database

The case database stores authoritative workflow state and internal mappings:

- Random internal case identifier
- Current case state
- Case-scoped citizen key
- Authorized agency and facility roles
- Vault object identifiers
- Evidence-check results
- Key rotations and revocations
- Retention and deletion schedule

It does not use relay history as its only source of operational truth.

### Encrypted Document Vault

The vault stores forms, photographs, and supporting evidence outside Nostr.
Each object is encrypted with a unique random data-encryption key. A government
KMS or HSM wraps those keys for authorized services and supports rotation,
revocation, backup, and recovery.

Cinderella signing keys must not be reused as document-encryption keys. This
keeps signer recovery separate from record encryption and retention.

### Agency Key Registry

The `usa.gov.Nstr` registry binds legal authority to agency keys. Passportstr
uses separate registered keys for:

- Department of State service authority
- Passportstr operational signing
- Acceptance facilities
- Adjudication services
- Key revocation and continuity statements

Clients verify both the event signature and the registry status of the signer.
A cryptographically valid signature from a retired agency key is historical
evidence, not current authority.

## Identifier Model

Passportstr uses three different identifiers so one identifier does not become
a universal tracking key:

| Identifier | Purpose | Exposure |
| --- | --- | --- |
| Cinderella root identity | Recoverable signing continuity | Citizen-controlled |
| Case public key | One passport application | Private relay and gateway |
| Internal case ID | Government record correlation | Government systems only |

The gateway binds the case public key to the internal case only after the
required identity and evidence checks. Public events never contain the mapping.

## Data Classification

### Relay-Safe Data

- Random opaque case alias
- Workflow event type
- Previous event ID
- Agency or case-scoped public key
- Timestamp and expiration
- Privacy classification
- Opaque vault reference
- Digest of encrypted content

### Vault-Only Data

- Legal name
- Date and place of birth
- Social Security number
- Home and mailing addresses
- Photograph
- Citizenship evidence
- Identity-document images and numbers
- Application locator number
- Passport number
- Payment and delivery details

A digest of predictable personal data must not be placed on a relay. Names,
dates, SSNs, and document numbers can be guessed and compared against an
unkeyed hash. When integrity evidence is needed, Passportstr records a digest
of randomized encrypted content or uses a keyed commitment held by the
government.

## New Passport Process

### 1. Verify the Service

1. The workstation retrieves the `usa.gov.Nstr` registry entry.
2. It verifies the active Passportstr service key and registry signature.
3. It refuses retired, revoked, unregistered, or mismatched service keys.

### 2. Create a Case

1. The workstation creates a fresh case key and random local correlation ID.
2. The citizen reviews and Cinderella-signs an `application-intent`.
3. The gateway verifies the signature, request freshness, and one-time nonce.
4. The gateway creates an internal case ID and returns a signed receipt.
5. The private relay receives only the case-scoped event and opaque case alias.

Creating a case proves that the signer requested the workflow. It does not yet
prove legal identity, citizenship, or eligibility.

### 3. Prepare the Application

1. The citizen completes application data through the government gateway.
2. Sensitive fields are transmitted over TLS directly to government systems.
3. Supporting files upload directly to the encrypted vault using a single-use,
   short-lived capability.
4. The case database records the authoritative application state.
5. Passportstr publishes an `application-prepared` receipt without personal
   data.

NIP-98 may be used for signed HTTP authorization. Passportstr adds a server
challenge, exact URL and method checks, body digest, short expiry, and
single-use replay protection.

### 4. Complete In-Person Acceptance

1. The citizen appears at an authorized acceptance facility.
2. The facility workstation presents a fresh challenge for the case.
3. The citizen approves the challenge through Cinderella.
4. An authorized employee follows the existing government procedure to inspect
   the person and required evidence.
5. The facility signs an `acceptance-receipt` describing only which checkpoints
   were completed.
6. Passportstr verifies the facility key and countersigns agency intake.

The administrative finding comes from the authorized examination. The citizen
signature prevents substitution and records consent; it does not replace that
examination.

### 5. Transfer and Intake

1. The facility creates a signed dispatch receipt.
2. Passport Services creates a signed intake receipt.
3. A randomized encrypted manifest is stored in the vault.
4. The relay links the dispatch and intake events through event IDs and an
   encrypted-manifest digest.
5. Missing or duplicated transfers generate an audit alert.

### 6. Adjudicate the Case

Passportstr publishes minimal agency-signed transitions:

```text
application-received
evidence-verified
adjudication-started
additional-information-required
approved
not-approved
document-produced
mailed
case-closed
```

The case database holds detailed reasons and personal records. The relay event
contains only the status appropriate for the citizen and authorized staff.

### 7. Request Additional Information

1. The agency creates an encrypted information request for the case key.
2. The workstation authenticates and retrieves the request.
3. The citizen uploads any response directly to the vault.
4. Cinderella signs a response receipt bound to the encrypted upload digest.
5. The agency signs an acknowledgement after successful intake.

NIP-59 gift wrapping may reduce exposed sender and message metadata. It does
not remove all traffic, timing, size, endpoint, or relay-operator visibility.

### 8. Produce, Mail, and Close

1. The authoritative government system records the adjudication result.
2. Passportstr signs the approved or not-approved status.
3. Production and mailing systems sign their own minimal receipts.
4. The citizen acknowledges receipt when appropriate.
5. Passportstr publishes `case-closed` and applies the retention schedule.

The passport number, address, tracking details, and physical document data stay
outside the relay.

## Experimental Event Contract

The first implementation uses application-defined names rather than claiming
standard Nostr kind numbers:

| Event name | Signer | Purpose |
| --- | --- | --- |
| `application-intent` | Citizen case key | Start a new application |
| `application-prepared` | Passportstr | Confirm preparation checkpoint |
| `appointment-challenge` | Acceptance facility | Bind an in-person session |
| `acceptance-receipt` | Facility and Passportstr | Record completed acceptance |
| `agency-receipt` | Passportstr | Confirm government intake |
| `case-status` | Authorized agency role | Publish a status transition |
| `information-request` | Authorized agency role | Request additional evidence |
| `citizen-response-receipt` | Citizen case key | Acknowledge a response upload |
| `case-key-rotation` | Citizen and/or recovery authority | Replace a case key |
| `case-closed` | Passportstr | End active processing |

Every event must include:

- Schema version
- Service identifier: `passportstr`
- Opaque case alias
- Unique request ID
- Previous event ID when applicable
- Event type and status code
- Signer role
- Creation and expiration times
- Privacy classification
- Policy version or policy digest

The event must not include a human-readable citizen identifier.

## State and Authorization Rules

The gateway enforces an explicit state machine. Examples:

- Only a citizen case key can create its `application-intent`.
- Only a registered facility key can create an `acceptance-receipt`.
- Only an authorized adjudication role can publish an adjudication status.
- `approved` cannot precede required acceptance and intake events.
- `document-produced` cannot precede `approved`.
- Closed cases reject ordinary updates.
- Duplicate request IDs and stale challenges are rejected.
- Every status change records its authorized predecessor.

A valid signature is necessary but not sufficient. The signer must also have
the correct role, case authority, policy version, and workflow position.

## Recovery and Key Rotation

### Lost Citizen Share

1. The citizen reports the share as lost or suspect.
2. Passportstr temporarily restricts sensitive case actions.
3. The citizen demonstrates the remaining Cinderella threshold.
4. Separate identity proofing authorizes replacement.
5. Fresh shares are issued and the signer policy epoch advances.
6. Passportstr signs a recovery receipt without disclosing identity data.

### Lost Case Key

1. The citizen completes Cinderella recovery where possible.
2. If the original case key can authorize rotation, it signs the replacement.
3. If it cannot, an authorized recovery officer performs identity proofing.
4. Passportstr signs a `case-key-rotation` binding the new case key to the
   internal case.
5. The old key remains usable only to verify historical events.

### Compromised Key or Threshold

A suspected compromised threshold triggers revocation, not silent recovery.
Passportstr freezes sensitive actions, creates a new key, records a new policy
epoch, publishes a registry-backed continuity statement, and preserves old
events as historical evidence.

## Privacy and Security Controls

- Synthetic data only during the experiment
- Private, non-federated relay with authenticated reads and writes
- Case-specific citizen keys and pairwise identifiers
- TLS for every connection
- Short-lived, audience-bound authorization
- Nonces and consumed-request storage for replay prevention
- Unique encryption key for every vault object
- KMS or HSM protection for government encryption and signing keys
- Independent agency signing roles and separation of duties
- Structured logs with automatic personal-data redaction
- No personal data in URLs, event tags, metrics, or error messages
- Encrypted backups with tested restoration and deletion procedures
- Documented retention limits for relay events, cases, and vault objects
- Security monitoring for unusual reads, exports, rotations, and status changes
- No bridge from the experimental relay to public Nostr infrastructure

NIP-44 encryption alone is not sufficient for passport information. It lacks
forward secrecy and post-compromise security and exposes some metadata. The
experiment may use it for tightly scoped messages, but document protection
belongs in the government vault using a reviewed record-encryption design.

## Threats the Experiment Must Test

- Stolen citizen device or signing share
- Malicious or compromised relay operator
- Replayed signed HTTP request
- Unauthorized facility or agency key
- Correlation of one citizen across cases
- Guessing personal data from hashes
- Substitution of an uploaded document
- Reordering or skipping workflow events
- Compromised old key after rotation
- Insider access to the document vault
- Sensitive data leaking through logs or backups
- One unavailable Cinderella share
- Recovery used to take over a legitimate case

## Experimental Delivery Stages

### Stage 1: Synthetic Workflow

- One fake citizen and one fake acceptance facility
- Local private relay
- Mock case database and encrypted object store
- Signed application intent, acceptance receipt, and status events

### Stage 2: Cinderella Signing

- Real experimental `2-of-3` signing across independent devices
- Successful signing with one share unavailable
- Full-event policy inspection by every participating signer
- Replay, mutation, and wrong-provider rejection tests

### Stage 3: Private Data Boundary

- Direct encrypted uploads to the vault
- Opaque relay references
- NIP-42 relay authentication
- Provider-aware NIP-98 gateway authentication
- Authorization and redaction tests

### Stage 4: Recovery Drill

- Lost-share rehearsal
- Case-key rotation
- Compromised-key freeze and revocation
- Audit reconstruction before and after recovery

### Stage 5: Administrative Simulation

- Multiple facility and agency roles
- Additional-information workflow
- Approval, production, mailing, and closure simulation
- Independent privacy and threat-model review

No stage authorizes real passport processing.

## Success Criteria

The Passportstr experiment succeeds when a synthetic citizen can:

1. Verify the official Passportstr service key.
2. Create a new-passport case with a unique case identity.
3. Upload fake evidence without putting sensitive content on a relay.
4. Complete a simulated in-person acceptance event.
5. Receive and verify every signed administrative status.
6. Respond to an additional-information request.
7. Lose one Cinderella share and retain authorized signing capability.
8. Rotate a case key without losing the verifiable history.
9. Export an audit trail that detects missing, duplicated, or reordered events.
10. Demonstrate that public and private relay inspection reveals no passport
    personal data.

## Future Direction

A future government deployment may use large regional databases and encrypted
object-storage systems behind the Passportstr gateway. The relay should remain
a minimal coordination and receipt layer rather than becoming the large record
store itself.

Possible future work includes:

- Federated government vault regions
- Hardware-backed citizen signing
- Privacy-preserving government credentials
- Selective disclosure of verified attributes
- Multi-agency authorization without universal citizen identifiers
- Public transparency checkpoints that reveal no case activity
- Standardized public-service Nostr event schemas

These capabilities require separate review and are not assumptions of the
initial experiment.

## Protocol References

- NIP-01, Basic protocol flow description:
  https://github.com/nostr-protocol/nips/blob/master/01.md
- NIP-42, Authentication of clients to relays:
  https://github.com/nostr-protocol/nips/blob/master/42.md
- NIP-44, Versioned encrypted payloads and limitations:
  https://github.com/nostr-protocol/nips/blob/master/44.md
- NIP-59, Gift Wrap:
  https://github.com/nostr-protocol/nips/blob/master/59.md
- NIP-98, HTTP authentication:
  https://github.com/nostr-protocol/nips/blob/master/98.md
- U.S. Department of State, applying for an adult passport:
  https://travel.state.gov/en/passports/apply/adults.html
- Shared USA.gov.Nstr service standard:
  ./USA-GOV-NSTR-SERVICE-STANDARD.md
