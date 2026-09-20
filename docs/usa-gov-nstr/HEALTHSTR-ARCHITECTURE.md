# Healthstr Architecture

## Selected Service

Healthstr initially supports one state or local public-health service: a person
requests an official copy of their immunization record from the jurisdiction's
Immunization Information System (IIS).

There is no single national vaccination-record database. Each deployment is
bound to the relevant state, territory, or participating local jurisdiction.

## Four Identification Layers

1. **Government authority:** the registry verifies the jurisdiction's health
   department and IIS service keys.
2. **Cryptographic control:** Cinderella controls a jurisdiction-specific
   record-request key.
3. **Authoritative proofing:** the IIS verifies the person, guardian, or other
   legally authorized requester and locates the record.
4. **Case authorization:** access is limited to one request, one subject, one
   permitted record format, and a short retrieval period.

## Workflow

1. The citizen chooses the correct jurisdiction and verifies its Healthstr key.
2. Cinderella signs `immunization-record-request-intent`.
3. Identity, guardianship, and record-matching data go directly to the IIS
   gateway and protected case database.
4. The IIS signs `request-accepted`, `record-not-found`, or
   `manual-review-required` using non-revealing status codes.
5. Authorized IIS staff resolve incomplete or duplicate matches.
6. The official record is generated and envelope-encrypted in the vault.
7. Healthstr publishes `record-ready` with a short-lived opaque reference.
8. The requester signs a fresh retrieval authorization.
9. The gateway streams the record over TLS and signs `record-delivered`.
10. The case closes according to jurisdiction retention rules.

## Event Contract

- `immunization-record-request-intent`
- `request-accepted`
- `manual-review-required`
- `record-not-found`
- `record-ready`
- `record-delivered`
- `case-key-rotation`
- `case-closed`

No name, birth date, address, guardian relationship, vaccine, dose, date,
provider, lot number, medical-record number, or record image appears on the
relay.

## Cinderella Policy

- Adult self-request: citizen `2-of-3`
- Guardian request: separate proofing and scoped delegated authorization
- Generate official record: registered IIS service quorum
- Correct a record: excluded from v1 and requires a distinct reviewed workflow
- Recovery: threshold continuity plus renewed IIS identity proofing

## Policy Boundaries

- Healthstr does not create, alter, or interpret immunization records.
- `record-ready` does not disclose whether any vaccination exists.
- No employer, school, or third party receives a record in v1.
- Jurisdiction law, consent, retention, and access rules remain controlling.

## Success Criteria

A synthetic adult obtains a fake official record from a mock jurisdiction IIS,
while a wrong-subject, wrong-jurisdiction, replayed, or expired retrieval fails
and no health information reaches the relay.

## Official Reference

- CDC, Contacts for IIS Immunization Records:
  https://www.cdc.gov/iis/contacts-locate-records/index.html
