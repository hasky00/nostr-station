# Courtstr Architecture

## Selected Service

Courtstr initially supports one federal court service: verifying and responding
to a federal jury summons through a participating district court. District
procedures vary, so each deployment uses a court-specific policy bundle.

Courtstr does not decide qualification, excuse a juror, change a reporting
date, issue a warrant, or publish juror information.

## Four Identification Layers

1. **Government authority:** the registry verifies the federal district court
   and jury-office keys.
2. **Cryptographic control:** Cinderella controls a summons-specific response
   key.
3. **Authoritative proofing:** the court binds the person to its summons and
   participant record using its required process.
4. **Case authorization:** each action is limited to one summons, response type,
   court, deadline, and current workflow state.

## Workflow

1. The prospective juror verifies the court and Courtstr keys.
2. The summons identifier is submitted directly to the court gateway.
3. The court issues a one-time challenge bound to the summons.
4. Cinderella signs `summons-link-intent` using a fresh case key.
5. The court signs `summons-verified` after authoritative matching.
6. The juror completes the qualification response in the protected portal.
7. Cinderella signs `questionnaire-submitted` with a digest of the encrypted
   submission.
8. The court signs `response-received` and later publishes private reporting,
   deferral, excuse, or review status.
9. Detailed reasons and questionnaire answers stay in the court vault.
10. Courtstr closes the notification case when service ends.

## Event Contract

- `summons-link-intent`
- `summons-verified`
- `questionnaire-submitted`
- `response-received`
- `manual-review-required`
- `reporting-instruction-ready`
- `deferral-decision-ready`
- `service-completed`
- `case-closed`

No name, address, participant number, questionnaire answer, employer, medical
information, hardship reason, reporting location, or service history appears
on a relay.

## Cinderella Policy

- Link summons and submit questionnaire: citizen `2-of-3`
- Change material answers: fresh challenge and explicit superseding event
- Court receipt and decision: registered jury-office quorum
- Excuse or deferral decision: authorized human role; no automatic approval
- Recovery: threshold continuity plus court-controlled summons proofing

## Policy Boundaries

- The court's official summons and instructions control.
- Courtstr never asks for payment; payment requests trigger a fraud warning.
- Failure of the experimental channel cannot silently count as non-response.
- Mail, telephone, accessible, and official eJuror paths remain available.

## Success Criteria

A synthetic juror verifies a fake summons, submits an encrypted questionnaire,
receives a signed court receipt and reporting update, and recovers a lost share
without exposing juror information.

## Official Reference

- U.S. Courts, Summoned for Federal Jury Service:
  https://www.uscourts.gov/court-programs/jury-service/summoned-federal-jury-service
