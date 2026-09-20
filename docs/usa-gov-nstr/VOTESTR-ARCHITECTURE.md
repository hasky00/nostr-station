# Votestr Architecture

## Selected Service

Votestr initially supports one state and local election service: a citizen
checks voter-registration status and receives verified polling-place and voting
information from the responsible election office.

Votestr never registers a vote, records a ballot choice, transports a ballot,
or produces evidence of how a person voted.

## Four Identification Layers

1. **Government authority:** the registry verifies the state and local election
   office keys and their geographic jurisdiction.
2. **Cryptographic control:** Cinderella controls a voter-information case key.
3. **Authoritative proofing:** the election system performs the jurisdiction's
   required voter-record lookup and identity matching.
4. **Case authorization:** the response is bound to one lookup, election,
   jurisdiction, information snapshot, and expiration.

## Workflow

1. The citizen selects a state and local jurisdiction and verifies Votestr keys.
2. The workstation creates a fresh lookup key.
3. Cinderella signs `registration-status-request`.
4. Personal lookup fields go directly to the election-office gateway.
5. The authoritative voter-registration system performs the match.
6. Votestr returns an encrypted private result and signs `status-ready`.
7. The citizen retrieves status, polling location, hours, and official local
   instructions through the protected gateway.
8. Election offices sign public updates when locations or hours change.
9. The citizen may subscribe with a one-election notification key.
10. The key expires automatically after the election and audit period.

## Event Contract

- `registration-status-request`
- `status-ready`
- `manual-review-required`
- `polling-information-published`
- `polling-information-updated`
- `election-notice`
- `subscription-expired`

No name, address, birth date, party affiliation, voter identifier, registration
status, ballot request, ballot choice, or voting history appears publicly. A
private relay event also must not reveal whether a person is registered.

## Cinderella Policy

- Private lookup: citizen `2-of-3`
- Public polling information: registered election-office service quorum
- Location change near an election: stronger quorum and visible correction
- Registration update: excluded from v1 and requires a separate workflow
- Ballot or vote event: permanently denied by this architecture

## Policy Boundaries

- State and local election rules control; EAC information is a directory and
  guidance layer, not the local voter record.
- Votestr must never create a public list of voter queries.
- A signed status response is time-bound information, not a ballot credential.
- Existing official lookup, telephone, mail, and in-person channels remain.

## Success Criteria

A synthetic voter privately retrieves a fake registration status and verified
polling information, receives a signed location correction, and leaves no
public evidence of registration, party, attendance, or ballot choice.

## Official Reference

- U.S. Election Assistance Commission, Register and Vote in Your State:
  https://www.eac.gov/voters/register-and-vote-in-your-state
