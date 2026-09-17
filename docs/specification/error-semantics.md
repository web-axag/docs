---
id: error-semantics
title: Error Semantics
sidebar_label: Error Semantics
slug: /specification/error-semantics
---
# Error Semantics

AXAG defines two families of error codes: validation codes for annotations that break the specification, and runtime codes for calls that break the contract an annotation declares.

## Validation Error Codes

Validation codes have the form `AXAG-LINT-NNN` and are reported by `axag-lint` and `axag validate`, with a file, line and column. Each rule has a default severity — `error`, `warning` or `info` — that a project may change, and a conformance level it belongs to.

| Codes | What they cover |
|-------|-----------------|
| `AXAG-LINT-001`–`003` | Missing intent, entity or action type |
| `AXAG-LINT-004`–`005` | Values outside the vocabulary |
| `AXAG-LINT-006`–`007`, `023`–`026` | Safety metadata that doesn't match the risk level |
| `AXAG-LINT-010` | An intent missing from the manifest |
| `AXAG-LINT-011`, `018`–`022` | Scope and tenancy |
| `AXAG-LINT-036`–`037` | Server enforcement |

The [Error Codes Reference](/docs/reference/error-codes#validation-error-codes) lists all 37.

## Runtime Error Codes

Runtime codes have the form `AXAG_NAME`. A refused call returns one in a flat object alongside its HTTP status:

```json
{
  "error": "AXAG_ROLE_INSUFFICIENT",
  "status": 403,
  "message": "\"audit_log.purge\" requires one of: auditor",
  "intent": "audit_log.purge",
  "details": { "required_roles": ["auditor"] }
}
```

Implementations that refuse a call MUST use this shape and the code that matches the reason:

| Reason | Code | Status |
|--------|------|--------|
| A required parameter is missing, or a value breaks its type or constraints | `AXAG_MISSING_PARAM`, `AXAG_INVALID_TYPE`, `AXAG_OUT_OF_RANGE`, `AXAG_INVALID_ENUM`, `AXAG_INVALID_FORMAT` | 400 |
| A precondition is false | `AXAG_PRECONDITION_FAILED` | 412 |
| Confirmation is required and absent, declined or invalid | `AXAG_CONFIRMATION_MISSING` | 428 |
| Approval is required and not granted | `AXAG_APPROVAL_MISSING` | 428 |
| Approval came from a role that may not approve | `AXAG_APPROVAL_INVALID` | 403 |
| The caller lacks a required role | `AXAG_ROLE_INSUFFICIENT` | 403 |
| The call reaches outside its scope or tenant | `AXAG_SCOPE_VIOLATION`, `AXAG_TENANT_BOUNDARY` | 403 |
| The intent doesn't exist | `AXAG_INTENT_NOT_FOUND` | 404 |

A refusal MUST NOT perform any part of the operation. See the [Error Codes Reference](/docs/reference/error-codes#runtime-error-codes) for which codes AXAG tooling raises today.

:::note Changed in 1.1
Earlier drafts of this page used `AXAG-001` and `AXAG-R001` style codes. No tooling ever emitted them; they are replaced by the `AXAG-LINT-NNN` and `AXAG_NAME` codes above.
:::
