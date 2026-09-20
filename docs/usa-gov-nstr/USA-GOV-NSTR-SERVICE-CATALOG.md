# USA.gov.Nstr Service Architecture Catalog

## Purpose

This catalog defines the first complete experimental service portfolio under
`usa.gov.Nstr`. Each branch selects one narrow public workflow and applies the
same four-layer identification, Cinderella signing, private-relay, protected
vault, authorization, and recovery rules.

The shared policy is defined in
[`USA-GOV-NSTR-SERVICE-STANDARD.md`](./USA-GOV-NSTR-SERVICE-STANDARD.md).

## Service Portfolio

| Service branch | Jurisdiction | Initial workflow | Architecture |
| --- | --- | --- | --- |
| Passportstr | Federal | First-time adult passport book | [Passportstr](./PASSPORTSTR-ARCHITECTURE.md) |
| Taxstr | Federal | Request an individual tax transcript | [Taxstr](./TAXSTR-ARCHITECTURE.md) |
| Socialstr | Federal | Request a replacement Social Security card | [Socialstr](./SOCIALSTR-ARCHITECTURE.md) |
| Educationstr | Federal | Track a submitted FAFSA and required next actions | [Educationstr](./EDUCATIONSTR-ARCHITECTURE.md) |
| DMVstr | State or territory | Renew an eligible adult driver's license | [DMVstr](./DMVSTR-ARCHITECTURE.md) |
| Immigrationstr | Federal | Privately track an existing USCIS case | [Immigrationstr](./IMMIGRATIONSTR-ARCHITECTURE.md) |
| Healthstr | State or local | Request an official immunization record | [Healthstr](./HEALTHSTR-ARCHITECTURE.md) |
| Alertstr | Federal, state, tribal, territorial, or local | Publish a verified emergency alert | [Alertstr](./ALERTSTR-ARCHITECTURE.md) |
| Votestr | State or local | Check registration and polling information | [Votestr](./VOTESTR-ARCHITECTURE.md) |
| Courtstr | Federal district court | Verify and respond to a jury summons | [Courtstr](./COURTSTR-ARCHITECTURE.md) |
| Benefitstr | State or local | Complete SNAP recertification | [Benefitstr](./BENEFITSTR-ARCHITECTURE.md) |
| Licensestr | City or county | Renew a low-risk general business license | [Licensestr](./LICENSESTR-ARCHITECTURE.md) |
| FOIAstr | Federal agency component | Submit and track a FOIA request | [FOIAstr](./FOIASTR-ARCHITECTURE.md) |

## Government Coverage

The initial portfolio deliberately covers different government structures:

- Federal identity and document services
- Federal tax administration
- Federal student-aid application communication
- Federal immigration case communication
- Federal court administration
- Federal records access
- State and territorial motor vehicle agencies
- State and local public-health registries
- State-administered federal benefit programs
- State and local election administration
- Local business licensing
- Multi-level emergency alerting authorities

It is a representative first catalog, not a claim to include every government
service in the United States. New branches must select one narrow workflow,
identify the legally responsible authority, and pass the service standard
before being added.

## Four-Layer Rule

Every service uses all four layers:

1. Verify the government authority and service key.
2. Verify recoverable cryptographic control through Cinderella.
3. Complete the service's authoritative real-world proofing.
4. Authorize the exact case action in the correct workflow state.

No service may collapse these into a claim that a Nostr key alone proves a
person's legal identity, citizenship, eligibility, status, or authority.

## Shared Execution Pattern

```text
discover official service
  -> verify registry and jurisdiction
  -> create service-scoped case key
  -> build exact action
  -> approve with Cinderella threshold
  -> verify at government gateway
  -> perform authoritative agency checks
  -> store sensitive records in encrypted vault
  -> publish minimal signed receipt to appropriate relay
  -> authorize next state transition
  -> deliver protected result
  -> close, retain, or revoke under service policy
```

## Expansion Gate

A proposed service branch is not accepted into the catalog until it defines:

- One narrow initial workflow
- Responsible jurisdiction and legal authority
- Four-layer identification mapping
- Citizen and agency Cinderella thresholds
- Authoritative data source
- Relay-safe and vault-only fields
- Explicit workflow states and signer roles
- Recovery, revocation, appeal, and non-digital alternatives
- Threat model and synthetic-data tests
- Official government source describing the current service

## Portfolio Safety Boundaries

- No real personal data in the experimental portfolio
- No public relay for citizen case activity
- No universal citizen key shared across services
- No automated adverse government decision
- No ballot, vote choice, SSN, passport number, tax record, student-aid record,
  health record, immigration record, benefit record, court response, or license
  evidence on a Nostr relay
- No claim that cryptographic validity equals legal validity
- No removal of existing accessibility, mail, telephone, or in-person channels
