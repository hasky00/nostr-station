# Alertstr Architecture

## Selected Service

Alertstr initially supports one public service: publishing a verified local
emergency alert derived from an authorized Common Alerting Protocol (CAP)
message. It supplements existing emergency channels and never replaces IPAWS,
Wireless Emergency Alerts, radio, television, sirens, or local instructions.

Public alert receipt is anonymous. Citizens do not need an account or
Cinderella key to read a public safety warning.

## Four Identification Layers

For Alertstr, the four layers identify the issuing authority rather than the
recipient:

1. **Government authority:** the registry verifies the alerting authority,
   jurisdiction, permitted hazard classes, and emergency key.
2. **Cryptographic control:** Cinderella requires a role-composed emergency
   signing threshold.
3. **Authoritative proofing:** the alerting authority confirms the incident,
   originator role, geographic scope, and legal authority to warn.
4. **Action authorization:** the event is bound to one incident, CAP message,
   geography, severity, effective period, update chain, and cancellation rule.

## Workflow

1. An authorized originator creates or receives an approved CAP alert.
2. Alertstr validates required fields, geography, instructions, language,
   effective time, and expiration.
3. Independent Cinderella shares display the complete human-readable warning
   and CAP digest before approval.
4. The threshold signs `public-alert-issued` using the dedicated emergency key.
5. Alertstr publishes to redundant public, government, and archive relays.
6. Clients verify the registry, signature, scope, freshness, and event chain.
7. Corrections reference the previous alert; they never silently overwrite it.
8. The authority signs `public-alert-updated`, `all-clear-issued`, or
   `public-alert-cancelled`.
9. An automatic post-incident checkpoint records approvals and delivery health.

## Event Contract

- `public-alert-issued`
- `public-alert-updated`
- `all-clear-issued`
- `public-alert-cancelled`
- `delivery-health-checkpoint`
- `post-incident-review`

Public alert events may contain the warning, affected geographic area, hazard,
instructions, accessibility content, translations, start time, and expiration.
They must not contain victim identities, caller data, responder private
locations, or unpublished operational details.

## Cinderella Policy

- Draft or test alert: training key that cannot publish to production relays
- Live local alert: dedicated emergency quorum with required operator roles
- National alert: separate federal authority and stronger quorum
- Update or cancellation: same or stronger authority with event-chain binding
- Key recovery: offline ceremony; no routine workstation recovery

## Policy Boundaries

- Alertstr is a redistribution and verification channel, not the source of
  incident truth.
- Clients must prioritize active official instructions and show expiration.
- Test alerts are visibly and cryptographically separated from live alerts.
- Emergency operation includes an audited path for urgent issuance without
  eliminating multi-party control.

## Success Criteria

A synthetic authority issues, updates, and cancels a geographically scoped test
alert across redundant relays; clients reject stale, unsigned, wrong-scope, and
training-key events while anonymous public reading remains available.

## Official Reference

- FEMA, IPAWS technology vendors and distribution:
  https://www.fema.gov/emergency-managers/practitioners/integrated-public-alert-warning-system/technology-developers
