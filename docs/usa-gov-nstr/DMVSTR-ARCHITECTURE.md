# DMVstr Architecture

## Selected Service

DMVstr initially supports one state service: renewal of a non-commercial adult
driver's license when the issuing jurisdiction permits renewal through its
normal remote process. State and territorial rules vary, so each deployment
must publish a jurisdiction-specific policy bundle.

DMVstr does not issue a first license, determine driving privilege, perform a
vision test, or override an in-person requirement.

## Four Identification Layers

1. **Government authority:** the registry verifies the state DMV and renewal
   service keys for the correct jurisdiction.
2. **Cryptographic control:** Cinderella approves through a state-specific,
   service-scoped citizen key.
3. **Authoritative proofing:** the DMV verifies the license record, eligibility,
   identity, residency, and any required checks.
4. **Case authorization:** the request is bound to one license record, renewal
   term, permitted options, fee quote, and expiration.

## Workflow

1. The citizen selects a jurisdiction and verifies its DMVstr registry entry.
2. The gateway checks whether remote renewal is available for the record.
3. The citizen reviews the exact renewal term, declarations, and fee quote.
4. Cinderella signs `renewal-intent`.
5. Sensitive declarations and evidence go directly to the DMV vault.
6. Payment occurs through the jurisdiction's approved payment processor; the
   relay receives only a random payment-receipt reference.
7. The DMV performs authoritative eligibility checks.
8. DMVstr signs `renewal-approved`, `in-person-action-required`, or
   `renewal-not-approved` with detailed reasons kept off-relay.
9. Production and mailing systems issue minimal signed receipts.
10. The citizen acknowledges delivery and the case closes.

## Event Contract

- `renewal-eligibility-checked`
- `renewal-intent`
- `evidence-received`
- `payment-receipt`
- `in-person-action-required`
- `renewal-approved`
- `renewal-not-approved`
- `credential-produced`
- `credential-mailed`
- `case-closed`

No license number, name, address, birth date, photograph, driving record,
medical declaration, payment data, or machine-readable credential is placed on
the relay.

## Cinderella Policy

- Renewal intent: citizen `2-of-3`
- Address change or identity-field change: stronger proofing and separate event
- DMV approval: institutional service quorum
- License suspension or revocation: excluded from v1 and denied by this service
- Recovery: threshold recovery plus jurisdiction identity proofing

## Policy Boundaries

- DMVstr cannot normalize different state laws into one national rule.
- Registry metadata identifies the controlling jurisdiction and policy version.
- A signed renewal receipt is not itself a driver's license.
- In-person and accessibility channels remain available.

## Success Criteria

A synthetic state can run an eligible renewal and an in-person-required branch,
verify fees and signatures, rotate a case key, and keep all license data outside
the relay.

## Official Reference

- USAGov, State motor vehicle services:
  https://www.usa.gov/state-motor-vehicle-services
