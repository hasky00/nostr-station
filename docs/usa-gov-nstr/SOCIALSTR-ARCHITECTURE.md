# Socialstr Architecture

## Selected Service

Socialstr initially supports one Social Security Administration service:
requesting a replacement Social Security card. It does not create an SSN,
change a person's legal identity, determine benefit eligibility, or place an
SSN or card image on Nostr.

## Four Identification Layers

1. **Government authority:** the registry verifies SSA and Socialstr keys.
2. **Cryptographic control:** Cinderella approves the request using a
   service-scoped citizen key.
3. **Authoritative proofing:** SSA determines whether online replacement is
   available and verifies identity and current records.
4. **Case authorization:** the action is limited to one replacement-card case,
   verified delivery destination, policy epoch, and expiry.

## Workflow

1. The citizen verifies the Socialstr service key.
2. The workstation creates a replacement-card case key.
3. Cinderella signs `replacement-request-intent`.
4. The SSA gateway performs authoritative identity and eligibility checks.
5. If an office visit is required, Socialstr signs `in-person-action-required`
   without exposing the reason on the relay.
6. If accepted, SSA signs `request-accepted` and starts production.
7. Socialstr publishes minimal `card-produced` and `card-mailed` events.
8. Delivery details remain in the SSA vault and are retrieved only through a
   freshly authorized session.
9. The citizen signs `delivery-acknowledged` or opens a non-delivery case.
10. SSA signs `case-closed` after completion or authorized cancellation.

## Event Contract

- `replacement-request-intent`
- `identity-review-required`
- `in-person-action-required`
- `request-accepted`
- `card-produced`
- `card-mailed`
- `delivery-acknowledged`
- `non-delivery-reported`
- `case-closed`

No SSN, name, birth date, address, identification image, account identifier,
card image, or tracking number appears on the relay.

## Cinderella Policy

- Start request and acknowledge delivery: citizen `2-of-3`
- Change delivery address: stronger fresh challenge plus SSA proofing
- Approve production: registered SSA service quorum
- Cancel or rebind case: independent review and delayed high-risk approval
- Recovery: Cinderella continuity plus separate SSA identity proofing

## Policy Boundaries

- The citizen key is never presented as an SSN.
- A replacement-card event is not evidence of citizenship or benefit status.
- The system must warn against unsolicited messages and verify all SSA keys
  through the official registry.
- Existing office, telephone, and mail channels remain available.

## Success Criteria

A synthetic citizen completes a replacement-card simulation, including an
in-person-required branch and lost-share recovery, with no SSN or address
visible in relay events or logs.

## Official Reference

- SSA, Replace Social Security card:
  https://www.ssa.gov/number-card/replace-card
