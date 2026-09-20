# usa.gov.Nstr

## Concept

`usa.gov.Nstr` is a proposed digital government office for transforming conventional public services into Nostr-based public-service infrastructure. The core idea is that every government agency, department, public office, and verified service endpoint is bound to a cryptographic public key, so citizens and agencies can verify identity, publish signed records, exchange permissioned messages, and audit public-service actions without relying only on centralized web portals.

The office name uses `Nstr` to signal a public-service layer built on Nostr protocols while remaining visibly connected to `usa.gov`.

## Mission

Modernize basic public services by replacing portal-only, email-heavy, paper-heavy, and account-password workflows with signed, interoperable, event-based public-service channels.

The mission has five parts:

1. Give every public agency a verified Nostr public key.
2. Give every public service a signed event stream and service identity.
3. Let citizens verify that a message, form, notice, permit, appointment, or receipt came from the real agency.
4. Let agencies exchange signed service events across federal, state, local, and tribal systems.
5. Preserve privacy by separating public records, private citizen messages, and sensitive case data.

## Naming Standard

All modernized services should use `str` as the service suffix. The suffix means "signed trusted relay" or "sovereign trusted record," depending on the service context.

Examples:

| Conventional service | Nstr service name | Purpose |
| --- | --- | --- |
| Passport service | Passportstr | Passport applications, renewal notices, appointment confirmations |
| Tax service | Taxstr | Tax notices, payment receipts, filing confirmations |
| Social Security service | Socialstr | Benefit status, official notices, identity-bound updates |
| Federal student aid service | Educationstr | Submitted FAFSA status and protected next-action notices |
| DMV service | DMVstr | License renewal, vehicle registration, appointment events |
| Immigration service | Immigrationstr | Case receipts, biometric appointments, status notices |
| Public health service | Healthstr | Vaccine records, clinic appointments, emergency notices |
| Emergency alert service | Alertstr | Signed emergency warnings and local response updates |
| Voting information service | Votestr | Registration status, polling-place notices, election office keys |
| Court notice service | Courtstr | Summons, hearing notices, case status events |
| Benefits service | Benefitstr | Food, housing, unemployment, and family-support applications |
| Business license service | Licensestr | Business permits, renewals, compliance reminders |
| FOIA service | FOIAstr | Public-record requests and agency response receipts |

Naming rule:

```text
{Public Service Root Name} + str
```

The office should maintain an official `Service Name Registry` so agencies do not invent conflicting names.

## First Service Branch

The first experimental service branch is documented in
[`PASSPORTSTR-ARCHITECTURE.md`](./PASSPORTSTR-ARCHITECTURE.md):

```text
USA.gov.Nstr
  -> Passportstr
    -> New Passport
      -> First-time adult U.S. passport book application
```

The initial scope excludes renewals, minors, urgent travel, passport cards,
overseas applications, and real citizen data.

All service branches follow the shared four-layer identity and signing rules in
[`USA-GOV-NSTR-SERVICE-STANDARD.md`](./USA-GOV-NSTR-SERVICE-STANDARD.md). The
complete initial portfolio is indexed in
[`USA-GOV-NSTR-SERVICE-CATALOG.md`](./USA-GOV-NSTR-SERVICE-CATALOG.md).

## Core Architecture

### 1. National Public Key Registry

`usa.gov.Nstr` operates a signed public-key registry for public institutions.

Each agency entry includes:

- Agency legal name
- Jurisdiction
- Service authority
- Official domain
- Nostr public key
- Key creation date
- Key rotation policy
- Delegated service keys
- Revoked keys
- Human-readable service names
- Machine-readable service metadata

The registry itself must be signed by a root `usa.gov.Nstr` public key and mirrored across public relays, government relays, and downloadable transparency logs.

### 2. Agency Identity Model

Each agency receives:

- One master agency public key
- One or more service public keys
- Optional local-office public keys
- Emergency broadcast keys
- Revocation keys stored offline

Example:

```text
usa.gov.Nstr root key
  -> Department of State agency key
    -> Passportstr service key
    -> Travelstr advisory key
  -> IRS agency key
    -> Taxstr notice key
    -> Taxstr receipt key
```

The public should never need to guess whether a Nostr account belongs to an agency. The key must resolve from the official registry and be independently verifiable.

### 3. Relay Network

The system uses multiple relay tiers:

| Relay tier | Access | Purpose |
| --- | --- | --- |
| Public transparency relays | Read-heavy public access | Public notices, agency keys, revocations, service metadata |
| Government service relays | Agency and approved partner access | Inter-agency messages, service events, workflow coordination |
| Citizen private relays | Citizen-controlled or delegated | Personal messages, receipts, case updates |
| Emergency relays | Highly available public broadcast | Alerts, disaster notices, urgent public instructions |
| Archive relays | Long-term record preservation | Signed historical records and audit trails |

Docker or containerization may help standardize deployment, but privacy comes from key policy, relay authorization, encryption, and access control, not from containers alone.

### 4. Event Types

`usa.gov.Nstr` should define public-service event kinds. These can begin as experimental custom event kinds before being standardized.

Important event categories:

- Agency identity event
- Service metadata event
- Public notice event
- Citizen request receipt
- Appointment confirmation
- Payment receipt
- Case status update
- Document request
- Document delivery notice
- Emergency alert
- Key rotation notice
- Key revocation notice
- Audit checkpoint

Every event must include:

- Signing public key
- Timestamp
- Service name
- Jurisdiction
- Event type
- Hash of any attached document
- Privacy classification
- Expiration or retention policy

### 5. Citizen Identity

Citizens may use one or more Nostr public keys, but the government should not force a single permanent public identity for every life activity.

Recommended model:

- Citizen-controlled keys for ordinary service communication
- Service-specific delegated keys for sensitive use cases
- Optional hardware-backed keys for high-security actions
- Recovery through existing identity-proofing systems
- Pairwise identifiers so different agencies cannot unnecessarily correlate citizen activity

Citizen privacy principle:

Public agency identity should be public. Citizen identity should be minimally disclosed, consent-based, and service-scoped.

## Service Flow

### Example: Passportstr New Passport Application

1. Citizen opens Passportstr through an official client or website.
2. Client verifies the Passportstr public key against the `usa.gov.Nstr` registry.
3. Citizen creates a case-specific key and signs an application intent.
4. Sensitive application data goes directly to a government-controlled vault.
5. An authorized facility completes the required in-person acceptance process.
6. Passportstr returns signed receipts and minimal case-status events.
7. Citizen can prove that every notice came from an authorized agency key.

### Example: Alertstr Emergency Warning

1. Local emergency office signs an alert with its emergency key.
2. Alertstr publishes the event to emergency and public relays.
3. Apps, radios, websites, and local systems verify the key.
4. Citizens receive the alert without depending on screenshots, forwarded messages, or unverified social posts.

### Example: Taxstr Payment Receipt

1. Citizen submits payment through an approved payment channel.
2. Taxstr publishes a private encrypted receipt event.
3. The receipt contains no public tax data.
4. The citizen stores a signed proof of payment.
5. The agency can later verify the receipt without relying on email headers or portal screenshots.

## Office Structure

`usa.gov.Nstr` should include the following divisions:

| Division | Responsibility |
| --- | --- |
| Key Authority Division | Agency key issuance, rotation, revocation, transparency logs |
| Relay Infrastructure Division | Government relay network, uptime, disaster recovery |
| Service Transformation Division | Converts conventional services into `str` services |
| Privacy and Civil Rights Division | Minimization, consent, anti-surveillance controls |
| Standards and Interoperability Division | Event schemas, naming registry, API rules |
| Security Operations Division | Threat monitoring, incident response, compromised-key handling |
| Public Client Division | Reference apps, SDKs, accessibility, multilingual UX |
| Audit and Accountability Division | Public logs, compliance reports, third-party verification |

## Security Requirements

Minimum requirements:

- Hardware security modules for root and agency master keys
- Offline root-key ceremonies
- Mandatory key rotation schedules
- Public revocation list
- Signed agency metadata
- Encrypted citizen messages
- Strict separation between public notices and private case data
- Multi-signature approval for emergency broadcasts
- Independent audit logs
- Open-source reference clients
- Bug bounty and disclosure program

Critical warning:

Nostr signatures prove who signed an event. They do not automatically prove that the signer had legal authority, that the data is correct, or that the workflow is privacy-safe. `usa.gov.Nstr` must combine cryptographic signatures with governance, audits, and legal controls.

## Privacy Rules

The architecture should follow these rules:

1. Public agency keys are public.
2. Citizen service activity is private by default.
3. Sensitive documents are not published directly to public relays.
4. Public events may contain hashes, receipts, and status markers, but not unnecessary personal data.
5. Citizens can rotate keys and recover access.
6. Agencies cannot use the system as a universal citizen-tracking layer.
7. All inter-agency data sharing requires a signed purpose and legal basis.

## Technical Components

Reference components:

- `nstr-registry`: official public-key and service registry
- `nstr-relay-gov`: government-authorized relay
- `nstr-relay-public`: transparency and public notice relay
- `nstr-client-citizen`: citizen wallet/client for public services
- `nstr-client-agency`: agency caseworker and service console
- `nstr-sdk`: developer toolkit for agencies
- `nstr-audit-log`: append-only transparency and revocation log
- `nstr-bridge`: adapter for legacy systems
- `nstr-identity-gateway`: optional identity-proofing and recovery layer

## Legacy System Bridge

Most agencies cannot replace old systems immediately. The first phase should use adapters.

Legacy portal action:

```text
User submits form in existing system
  -> agency backend validates request
  -> nstr-bridge creates signed Nostr receipt
  -> citizen receives signed proof
  -> audit log stores event hash
```

This lets agencies keep existing databases while adding verifiable public-service messaging.

## Rollout Plan

### Phase 1: Foundation

- Establish `usa.gov.Nstr` office
- Create root key ceremony
- Publish agency-key registry prototype
- Define service naming rules
- Launch test relays
- Select 3 pilot services

Recommended pilot services:

- Alertstr
- FOIAstr
- Passportstr appointment receipts

### Phase 2: Pilot Services

- Issue agency and service keys
- Build reference citizen client
- Build agency console
- Integrate with existing portals
- Publish signed notices and receipts
- Run security and privacy audits

### Phase 3: Public Expansion

- Add state and local agencies
- Add DMVstr, Taxstr, Healthstr, Benefitstr
- Release SDKs and compliance templates
- Create public service directory
- Add multilingual accessibility support

### Phase 4: National Interoperability

- Standardize event schemas
- Support cross-agency workflows
- Add independent relay operators
- Establish permanent audit board
- Support disaster-mode operations

## Governance Model

`usa.gov.Nstr` should be governed as public infrastructure, not as a vendor platform.

Rules:

- Root keys are public-interest infrastructure.
- Reference code should be open source.
- Citizens must be able to verify agency identity without using one required private app.
- Agencies may use approved vendors, but vendors must not control the public-key registry.
- Public-service events should be portable across clients and relays.
- Sensitive data must remain protected by existing privacy, records, and civil-rights law.

## Success Metrics

Measure:

- Reduction in fake agency messages
- Faster receipt confirmation for public-service requests
- Number of verified agency keys
- Number of signed public notices
- Citizen ability to verify official messages
- Relay uptime
- Key rotation compliance
- Privacy audit results
- Accessibility compliance
- Reduction in paper or email-only workflows

## One-Line Vision

`usa.gov.Nstr` turns public services from isolated portals and unverifiable messages into signed, interoperable, citizen-verifiable government infrastructure.
