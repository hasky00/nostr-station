# Benefitstr Architecture

## Selected Service

Benefitstr initially supports one state-administered public benefit workflow:
SNAP recertification for an existing synthetic household. It does not determine
eligibility, calculate a benefit amount, issue an EBT credential, or replace
the state's required interview and verification process.

## Four Identification Layers

1. **Government authority:** the registry verifies USDA program metadata and
   the responsible state or local SNAP agency keys.
2. **Cryptographic control:** Cinderella controls a household-case signing key.
3. **Authoritative proofing:** the state agency verifies household identity,
   composition, eligibility facts, interviews, and evidence.
4. **Case authorization:** the recertification is bound to one existing case,
   certification period, household role, deadline, and policy version.

## Workflow

1. The household verifies the state Benefitstr service key.
2. Benefitstr sends a minimal private `recertification-window-open` notice.
3. An authorized household member signs `recertification-started`.
4. Household, income, expense, and eligibility information goes directly to the
   protected state case system and vault.
5. Cinderella signs `recertification-submitted` with a commitment to the
   encrypted submission.
6. The state signs `submission-received` and schedules any required interview.
7. Evidence requests and responses use protected vault delivery.
8. An authorized eligibility worker records the official determination.
9. Benefitstr publishes `decision-ready`; the detailed notice is retrieved from
   the vault.
10. Appeal rights and deadlines remain visible in the official notice, and the
    case closes only after delivery acknowledgement or required retention.

## Event Contract

- `recertification-window-open`
- `recertification-started`
- `recertification-submitted`
- `submission-received`
- `interview-required`
- `information-request`
- `citizen-response-receipt`
- `decision-ready`
- `notice-delivered`
- `case-closed`

No name, address, household member, income, expense, disability, immigration
information, benefit amount, EBT data, eligibility reason, or decision content
appears on the relay.

## Cinderella Policy

- Household submission: authorized citizen `2-of-3`
- Add or replace household representative: stronger proofing and agency review
- Eligibility determination: authorized worker plus agency service quorum
- Adverse action: explicit human authorization and due-process notice
- Recovery: Cinderella continuity plus state case identity proofing

## Policy Boundaries

- Benefitstr cannot automate away interviews, verification, notices, or appeal.
- Relay failure cannot terminate benefits or count as missed cooperation.
- The official state case record controls eligibility and amount.
- Non-digital and accessible channels remain available without penalty.

## Success Criteria

A synthetic household receives a recertification notice, submits fake evidence,
completes a simulated interview, receives a protected decision notice, and
recovers one lost share without exposing benefit data or weakening appeal rights.

## Official Reference

- USDA Food and Nutrition Service, SNAP:
  https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program
