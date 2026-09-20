# Educationstr Architecture

## Selected Service

Educationstr initially supports one Department of Education service: private
status and next-action tracking for an already-submitted Free Application for
Federal Student Aid (FAFSA). It does not submit or correct a FAFSA, calculate
eligibility, make an aid award, disburse funds, or expose education or financial
records on Nostr.

## Four Identification Layers

1. **Government authority:** the registry verifies Department of Education,
   Federal Student Aid, and Educationstr operational keys.
2. **Cryptographic control:** Cinderella controls a service-scoped case key for
   the student.
3. **Authoritative proofing:** Federal Student Aid verifies the student's
   identity and access to the submitted FAFSA record. A Nostr key is not proof
   of identity, enrollment, aid eligibility, or account ownership.
4. **Case authorization:** every status subscription is bound to one FAFSA
   submission, award year, student role, event scope, and expiration.

## Workflow

1. The student verifies the Educationstr service key against the official
   registry.
2. The workstation creates a new case key and signs
   `link-fafsa-status-intent` through Cinderella `2-of-3` approval.
3. The Federal Student Aid gateway collects account and submission identifiers
   through a protected HTTPS flow, never through a relay event.
4. Federal Student Aid authenticates the student and verifies access to the
   submitted FAFSA.
5. The gateway creates an opaque case alias and signs `application-linked` or
   `manual-review-required`.
6. Authorized systems publish minimal signed transitions such as `in-review`,
   `action-required`, `processed`, or `closed`.
7. When available, the FAFSA Submission Summary and detailed next actions
   remain in the protected government system; the relay carries only
   `protected-summary-ready` or `protected-action-ready`.
8. The student signs a fresh, provider-aware NIP-98 request to retrieve each
   protected item from the authorized gateway.
9. Corrections, verification documents, contributor actions, school changes,
   and financial-aid acceptance remain outside v1. Educationstr may point the
   student to the official workflow but cannot execute it.
10. The student may unlink the notification channel without changing the FAFSA
    or the Federal Student Aid account.

## Event Contract

- `link-fafsa-status-intent`
- `application-linked`
- `manual-review-required`
- `application-status`
- `protected-summary-ready`
- `protected-action-ready`
- `protected-item-retrieved`
- `subscription-unlinked`
- `application-closed`

No name, date of birth, Social Security number, address, contributor identity,
income or tax data, Student Aid Index, school list, aid estimate, verification
detail, FAFSA answer, document, account identifier, or submission identifier is
placed on a relay.

## Cinderella Policy

- Link or unlink application status: student `2-of-3`
- Retrieve protected summary or next action: fresh challenge, provider-aware
  NIP-98 authorization, and active case authorization
- Publish status: registered Federal Student Aid role quorum
- Change FAFSA data or submit documents: excluded from v1
- Recovery: Cinderella continuity plus separate Federal Student Aid account and
  case proofing

## Policy Boundaries

- Relay status is informational; the official Federal Student Aid record and
  school-issued financial-aid offer control.
- Educationstr must not infer or announce eligibility, award amount, enrollment,
  verification reason, or adverse outcome from a generic status.
- Contributors cannot use the student's Educationstr authorization to access
  the FAFSA Submission Summary.
- A recovered or replacement Nostr key does not regain FAFSA access until
  Federal Student Aid reauthorizes the case binding.
- Existing StudentAid.gov, telephone, accessibility, and paper-assisted channels
  remain available.

## Success Criteria

A synthetic student privately links one fake submitted FAFSA, receives ordered
signed status updates, retrieves a protected fake summary notice with a fresh
provider-aware NIP-98 request, and unlinks notifications without exposing
student, contributor, school, tax, eligibility, or application data on a relay.

## Official References

- Federal Student Aid, "FAFSA Submission Summary: What You Need To Know":
  https://studentaid.gov/articles/fafsa-submission-summary/
- Federal Student Aid, "What Happens After You Submit the FAFSA Form?":
  https://studentaid.gov/articles/things-after-fafsa/
- Federal Student Aid, "7 Key Facts About Your StudentAid.gov Account":
  https://studentaid.gov/articles/key-facts-accounts/
