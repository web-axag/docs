---
id: error-codes
title: Error Codes Reference
sidebar_label: Error Codes
slug: /reference/error-codes
---

# Error Codes Reference

Complete reference of all AXAG error codes used in validation, runtime enforcement, and agent communication.

## Validation Error Codes

These are emitted by [`axag-lint`](/docs/validation/ci-linting) and by `axag validate`. Severities are the defaults; a project can change any of them in `.axaglintrc.json`.

| Code | Default severity | Description |
|------|------------------|-------------|
| `AXAG-LINT-001` | Error | Interactive element missing axag-intent attribute |
| `AXAG-LINT-002` | Error | Element has axag-intent but missing axag-entity |
| `AXAG-LINT-003` | Error | Element has axag-intent but missing axag-action-type |
| `AXAG-LINT-004` | Error | Invalid axag-action-type value |
| `AXAG-LINT-005` | Error | Invalid axag-risk-level value |
| `AXAG-LINT-006` | Warning | High/critical risk without confirmation-required |
| `AXAG-LINT-007` | Warning | Write/delete action without idempotent declaration |
| `AXAG-LINT-008` | Error | Parameter name appears in both required and optional parameters |
| `AXAG-LINT-009` | Error | Invalid JSON in parameter attributes |
| `AXAG-LINT-010` | Warning | Intent not found in manifest |
| `AXAG-LINT-011` | Warning | Role-based attributes without scope declaration |
| `AXAG-LINT-012` | Error | Approval required without approval roles |
| `AXAG-LINT-013` | Error | Read action with critical risk level |
| `AXAG-LINT-014` | Warning | Write action with contradictory precondition |
| `AXAG-LINT-015` | Warning | Navigate action with side effects |
| `AXAG-LINT-016` | Warning | Tenant-specific role name with non-tenant scope |
| `AXAG-LINT-017` | Warning | Non-idempotent mutation without side effects declaration |
| `AXAG-LINT-018` | Warning | Global scope with personal entity |
| `AXAG-LINT-019` | Warning | Superadmin role with tenant scope |
| `AXAG-LINT-020` | Warning | Same entity with different scopes in the same file |
| `AXAG-LINT-021` | Warning | Delete action without scope declaration |
| `AXAG-LINT-022` | Warning | Write action with user scope but tenant-level entity |
| `AXAG-LINT-023` | Error | Write/delete action without risk-level |
| `AXAG-LINT-024` | Warning | Delete action with risk-level below high |
| `AXAG-LINT-025` | Info | Read action with risk-level above low |
| `AXAG-LINT-026` | Warning | Safety metadata mismatch for declared risk level |
| `AXAG-LINT-027` | Error | Invalid axag macro syntax |
| `AXAG-LINT-028` | Error | axag macro conflicts with a longhand attribute |
| `AXAG-LINT-029` | Warning | Form control has no name and cannot become a parameter |
| `AXAG-LINT-030` | Warning | Form constraint disagrees with the linked schema |
| `AXAG-LINT-031` | Error | Annotated element has no accessible name |
| `AXAG-LINT-032` | Warning | Harvested parameter has no label or description |
| `AXAG-LINT-033` | Info | Dynamic axag value is registered at runtime only |
| `AXAG-LINT-034` | Error | axag-intent does not match entity.verb |
| `AXAG-LINT-035` | Error | axag-entity is not a lowercase name |
| `AXAG-LINT-036` | Error | Tenant-scoped action exposes a tenant identifier as a parameter |
| `AXAG-LINT-037` | Warning | High-risk action has no server-side enforcement |

## Runtime Error Codes

These are returned when a call breaks the contract. The codes are exported from `@web-axag/core` as `AXAG_ERRORS`, with `AxagError` and `refusal()` to raise them, so a refusal means the same thing wherever it comes from.

**Raised by** says which part of the SDK produces a code today: *server* is the [`@web-axag/server`](/docs/frameworks/safety) enforcer, *runtime* is the in-page enforcers in `@web-axag/webmcp`. Parameter checks against `inputSchema` are normally done by the agent host before a tool is called; a handler or API that validates again — as it should — reports failures with the codes marked *your code*.

| Code | Category | HTTP Status | Description | Raised by |
|------|----------|-------------|-------------|-----------|
| `AXAG_MISSING_PARAM` | Parameter | 400 | Required parameter not provided | your code |
| `AXAG_INVALID_TYPE` | Parameter | 400 | Parameter value has wrong type | your code |
| `AXAG_OUT_OF_RANGE` | Constraint | 400 | Numeric value or string length outside min/max bounds | your code |
| `AXAG_INVALID_ENUM` | Constraint | 400 | Value not in allowed enum set | your code |
| `AXAG_INVALID_FORMAT` | Constraint | 400 | Value doesn't match declared format or pattern | your code |
| `AXAG_PRECONDITION_FAILED` | Precondition | 412 | Precondition check failed | your code |
| `AXAG_CONFIRMATION_MISSING` | Safety | 428 | Confirmation required but no valid token provided | server, runtime |
| `AXAG_APPROVAL_MISSING` | Safety | 428 | Approval required but not provided | server |
| `AXAG_APPROVAL_INVALID` | Safety | 403 | Approval from unauthorized role | your code |
| `AXAG_SCOPE_VIOLATION` | Security | 403 | Operation outside declared scope | server (CSRF) |
| `AXAG_TENANT_BOUNDARY` | Security | 403 | Cross-tenant access attempt | server, runtime |
| `AXAG_ROLE_INSUFFICIENT` | Authorization | 403 | Caller lacks required role | server |
| `AXAG_INTENT_NOT_FOUND` | Routing | 404 | Requested intent not in manifest | server |

### Reserved for Future Use

These codes are reserved so implementations don't invent conflicting names, but no AXAG tooling raises them yet. A server that needs them today should return them in the same shape.

| Code | Category | HTTP Status | Description |
|------|----------|-------------|-------------|
| `AXAG_VERSION_MISMATCH` | Compatibility | 409 | Consumer/manifest version incompatible |
| `AXAG_RATE_LIMITED` | Throttling | 429 | Too many requests for this intent |

## Error Response Format

A refusal is a flat object. `error` is the code and `status` its HTTP status, so a server can answer with it directly; `intent` and `details` are present when there is something to say.

```json
{
  "error": "AXAG_PRECONDITION_FAILED",
  "status": 412,
  "message": "Precondition not met: cart must have at least one item",
  "intent": "cart.begin_checkout",
  "details": {
    "failed_precondition": "cart must have at least one item"
  }
}
```

```json
{
  "error": "AXAG_APPROVAL_MISSING",
  "status": 428,
  "message": "\"user.deactivate\" has no approval yet",
  "intent": "user.deactivate",
  "details": { "approval_roles": ["security_admin"] }
}
```

In code, `AxagError` carries the same fields and `toRefusal()` produces this object. See [Runtime Validation](/docs/validation/runtime-validation).

## Agent Handling Guide

| Error Code | Agent Action |
|-----------|-------------|
| `AXAG_MISSING_PARAM` | Add the missing parameter and retry |
| `AXAG_INVALID_TYPE` | Fix the parameter type and retry |
| `AXAG_OUT_OF_RANGE` | Adjust value to within bounds and retry |
| `AXAG_INVALID_ENUM` | Choose a value from the tool's `enum` and retry |
| `AXAG_INVALID_FORMAT` | Reformat the value and retry |
| `AXAG_PRECONDITION_FAILED` | Execute prerequisite action, then retry |
| `AXAG_CONFIRMATION_MISSING` | Ask the person to confirm, then retry with the confirmation token |
| `AXAG_APPROVAL_MISSING` | Request approval from an authorized role, then retry |
| `AXAG_APPROVAL_INVALID` | Do not retry with the same approver |
| `AXAG_ROLE_INSUFFICIENT` | Do not retry — escalate to a person with the role |
| `AXAG_SCOPE_VIOLATION` | Do not retry — operation is out of scope |
| `AXAG_TENANT_BOUNDARY` | Do not retry — security violation |
| `AXAG_INTENT_NOT_FOUND` | Refresh the tool list; the action may no longer be on the page |
