# Immigrationstr Architecture

## Selected Service

Immigrationstr initially supports one USCIS service: private case-status
tracking for an already-filed application or petition. It does not file an
immigration form, make an eligibility decision, provide legal advice, or expose
a receipt number on Nostr.

## Four Identification Layers

1. **Government authority:** the registry verifies USCIS and Immigrationstr
   operational keys.
2. **Cryptographic control:** Cinderella controls a case-specific notification
   key.
3. **Authoritative proofing:** USCIS verifies that the person or authorized
   representative may access the existing case.
4. **Case authorization:** every status subscription is bound to one internal
   case, role, notification scope, and expiration.

## Workflow

1. The user verifies the Immigrationstr service key.
2. The workstation creates a new case key and signs `link-case-intent`.
3. The USCIS gateway collects the receipt number through the protected HTTPS
   flow, never through a relay event.
4. USCIS verifies case-access authority and creates an opaque case alias.
5. Immigrationstr signs `case-linked` or `manual-review-required`.
6. Authorized USCIS systems publish minimal signed status transitions.
7. Detailed notices are stored in the encrypted vault.
8. The user signs a fresh retrieval request for each protected notice.
9. Address changes, evidence responses, and filings remain outside v1.
10. The user may unlink notifications without altering the USCIS case.

## Event Contract

- `link-case-intent`
- `case-linked`
- `manual-review-required`
- `case-status`
- `protected-notice-ready`
- `notice-retrieved`
- `subscription-unlinked`
- `case-closed`

No receipt number, A-number, name, address, country of origin, immigration
category, form type, decision reason, notice content, or representative data is
placed on the relay.

## Cinderella Policy

- Link or unlink case: citizen `2-of-3`
- Read protected notice: fresh challenge and case authorization
- Publish status: registered USCIS role quorum
- Representative access: excluded until delegated-authority design is reviewed
- Recovery: Cinderella continuity plus separate USCIS case proofing

## Policy Boundaries

- Relay status is informational; the USCIS record and official notice control.
- Generic status must not reveal immigration category or outcome to observers.
- A new public key is not proof of continuity without USCIS authorization.
- Existing case inquiry and accessible service channels remain available.

## Success Criteria

A synthetic applicant privately links one fake case, receives ordered signed
updates, retrieves a protected fake notice, and unlinks the subscription without
exposing a USCIS receipt number or case category.

## Official Reference

- USCIS, Case Status Online:
  https://egov.uscis.gov/
