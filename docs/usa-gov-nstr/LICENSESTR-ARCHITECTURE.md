# Licensestr Architecture

## Selected Service

Licensestr initially supports one local government service: renewal of an
existing low-risk general business license. Requirements vary by location and
business activity, so each city or county publishes its own policy bundle.

The experiment excludes professional licenses, alcohol, firearms, healthcare,
childcare, transportation, hazardous materials, and other regulated activities
that require specialized review.

## Four Identification Layers

1. **Government authority:** the registry verifies the city or county licensing
   office and the exact license category it administers.
2. **Cryptographic control:** Cinderella controls a business-specific renewal
   key with authorized representatives.
3. **Authoritative proofing:** the licensing office verifies the business,
   representative authority, standing, address, and required declarations.
4. **Case authorization:** renewal is bound to one existing license, term,
   jurisdiction, fee quote, representative role, and policy version.

## Workflow

1. The representative verifies the local Licensestr registry entry.
2. The license identifier is supplied directly to the government gateway.
3. The gateway verifies representative authority and creates an opaque case.
4. Cinderella signs `renewal-intent` after displaying declarations and scope.
5. Supporting records upload directly to the encrypted municipal vault.
6. The payment processor returns an opaque receipt to the case system.
7. Licensing staff complete required compliance review.
8. Licensestr signs `renewal-approved`, `correction-required`, or
   `decision-ready`; detailed reasons remain protected.
9. The renewed credential is delivered through the official channel.
10. Public license status, when legally public, is published from a separate
    public-record key without linking private workflow events.

## Event Contract

- `representative-linked`
- `renewal-intent`
- `application-received`
- `payment-receipt`
- `correction-required`
- `decision-ready`
- `renewal-approved`
- `credential-delivered`
- `case-closed`

Private events contain no owner name, home address, tax identifier, financial
record, payment data, employee data, compliance evidence, or credential number.

## Cinderella Policy

- Sole proprietor pilot: citizen `2-of-3`
- Organization pilot: organization threshold with named representative roles
- Add or remove representative: delayed identity-tier approval
- Government approval: licensing worker plus institutional service quorum
- Revocation or enforcement: excluded from v1 and handled separately

## Policy Boundaries

- Jurisdiction and license category are explicit and machine-verifiable.
- A receipt does not authorize operation; only the official license does.
- Public-record disclosure is separated from private application processing.
- Existing payment, in-person, mail, and appeal channels remain.

## Success Criteria

A synthetic business renews one fake low-risk license, changes no identity
fields, receives signed payment and approval receipts, and exposes no private
business record through the relay.

## Official Reference

- U.S. Small Business Administration, Apply for licenses and permits:
  https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits
