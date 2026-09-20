# FOIAstr Architecture

## Selected Service

FOIAstr initially supports one federal service: submitting and tracking a
Freedom of Information Act request to one participating federal agency. A
request must reasonably describe existing agency records; FOIA does not require
an agency to create records, conduct research, or answer general questions.

## Four Identification Layers

1. **Government authority:** the registry verifies the federal agency component
   and its FOIA office key.
2. **Cryptographic control:** Cinderella controls a requester-specific case key.
   A requester may use a pseudonymous key when law and agency procedure permit.
3. **Authoritative proofing:** identity is required only when necessary, such as
   requests for protected records about the requester or another person.
4. **Case authorization:** each action is bound to one request, agency
   component, fee position, delivery choice, and appeal timeline.

## Workflow

1. The requester searches already-public records and selects the responsible
   agency component.
2. The workstation verifies the component's FOIAstr key.
3. The requester drafts a description, preferred format, and optional fee limit.
4. Sensitive request text goes directly to the agency gateway and vault.
5. Cinderella signs `foia-request-submitted` using a fresh case key.
6. The agency signs `request-acknowledged` and stores its tracking number only
   in the protected case record.
7. Clarification, fee estimate, narrowing, and identity-proof requests use
   protected messages and signed receipts.
8. The agency records search and review progress with minimal status events.
9. Releasable records and the determination letter are delivered from the vault.
10. FOIAstr records delivery and any appeal intent without exposing requested
    subject matter publicly.

## Event Contract

- `foia-request-submitted`
- `request-acknowledged`
- `clarification-requested`
- `scope-updated`
- `fee-estimate-ready`
- `identity-proof-required`
- `processing-status`
- `determination-ready`
- `records-delivered`
- `appeal-intent`
- `case-closed`

No requester identity, tracking number, request text, named person, fee details,
search terms, exemption analysis, responsive record, or determination content
appears on a public relay. Private events use an opaque case alias.

## Cinderella Policy

- Submit, clarify, narrow, and appeal: requester `2-of-3`
- Accept a fee estimate: fresh challenge with exact maximum amount
- Agency acknowledgement and status: registered FOIA office quorum
- Determination and release: authorized FOIA role and agency policy
- Requester recovery: threshold continuity; identity proofing only when required

## Policy Boundaries

- FOIAstr does not centralize authority that legally belongs to each agency.
- A pseudonymous request remains possible where the process allows it.
- Agency records and exemptions control; Nostr does not decide disclosure.
- Existing web, email, fax, and written request channels remain available.

## Success Criteria

A synthetic requester submits a fake records request, narrows it, accepts a fake
fee estimate, receives a redacted test release, and files an appeal intent while
the relay reveals neither identity nor subject matter.

## Official Reference

- FOIA.gov, How to Make a FOIA Request:
  https://www.foia.gov/how-to.html
