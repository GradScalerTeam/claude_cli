# API Review Checklist

Use this checklist to keep API reviews consistent.

## Validation

- Are required fields validated at the boundary?
- Are type and format constraints enforced?
- Are unexpected fields rejected or ignored deliberately?

## Auth

- Is authentication required where expected?
- Is authorization checked separately from authentication?
- Are role or ownership checks explicit?

## Errors

- Are user-facing errors clear and non-leaky?
- Are status codes consistent with the API contract?
- Are unexpected failures handled without exposing internals?

## Tests

- Are happy-path tests present?
- Are auth failure and validation failure tests present?
- Are edge cases or regression-prone paths covered?
