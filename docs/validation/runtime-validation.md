---
id: runtime-validation
title: Runtime Validation
sidebar_label: Runtime Validation
slug: /validation/runtime-validation
---

# Runtime Validation

Runtime validation ensures AXAG contracts are honored during agent execution. While static validation catches structural errors, runtime validation catches behavioral violations — an agent attempting an action without meeting preconditions, exceeding parameter constraints, or violating safety boundaries.

## Runtime Validation Points

### Pre-Execution Validation
Before executing a tool call, the runtime validates:
- **Required parameters**: All required parameters are present and non-null
- **Type constraints**: Parameter values match declared types
- **Range constraints**: Numeric values are within `minimum`/`maximum` bounds
- **Enum constraints**: String values are from declared enum sets
- **Format constraints**: Values match declared formats (email, date, URI)
- **Preconditions**: Declared preconditions are checked (where machine-checkable)

### Execution-Time Validation
During execution, the runtime enforces:
- **Confirmation gate**: If `confirmation_required=true`, ensure user confirmation was obtained
- **Approval gate**: If `approval_required=true`, verify approval token from authorized role
- **Scope boundary**: Ensure the operation stays within declared scope (tenant, user, etc.)
- **Idempotency check**: For non-idempotent operations, warn if duplicate detected

### Post-Execution Validation
After execution, the runtime verifies:
- **Postconditions**: Declared postconditions are met (where verifiable)
- **Side-effects**: Declared side-effects occurred as expected
- **Error semantics**: Error responses follow the declared error schema

## Implementation

[`@web-axag/server`](/docs/frameworks/safety) enforces the safety half of these checks against the generated manifest:

```typescript title="Server-side enforcement" showLineNumbers
import { createEnforcer, AxagError } from '@web-axag/server';

const enforcer = createEnforcer({
  manifest,
  approvals: ({ action, actor }) => approvals.exists(action.intent, actor.id),
  csrfOf: request => request.session?.csrfToken,
  audit: record => log.info(record),
});

try {
  await enforcer.check({
    intent: 'cart.begin_checkout',
    parameters: request.body,
    headers: request.headers,
    actor: { id: session.userId, tenant: session.tenant, roles: session.roles },
  });
} catch (error) {
  if (error instanceof AxagError) return response.status(error.status).json(error.toRefusal());
  throw error;
}
```

What each layer checks today:

| Check | Where |
|-------|-------|
| Confirmation (single-use token bound to intent, parameters and actor) | `@web-axag/server`; the page asks the person first |
| Approval and `approval_roles` | `@web-axag/server`, through your `approvals` hook |
| `required_roles` | `@web-axag/server` |
| Tenant scope and `tenant_boundary` | `@web-axag/server`; the page removes tenant parameters from the agent's schema |
| CSRF | `@web-axag/server`; the page attaches the token |
| Parameter types, enums and ranges | The input schema the agent sees, and your API's own validation |
| Preconditions and postconditions | Your application — they are written for people and agents to reason about, not for a machine to evaluate |

## Error Response Format

A refused call answers with the error code as `error`, the HTTP status it carries, and a message a person can act on:

```json title="Refusal"
{
  "error": "AXAG_CONFIRMATION_MISSING",
  "status": 428,
  "message": "\"cart.begin_checkout\" needs a confirmation token",
  "intent": "cart.begin_checkout"
}
```

`details` is added where there is more to say — the roles that may approve, or the parameter that pointed at another tenant:

```json title="Refusal with details"
{
  "error": "AXAG_ROLE_INSUFFICIENT",
  "status": 403,
  "message": "\"audit_log.purge\" requires one of: auditor",
  "intent": "audit_log.purge",
  "details": { "required_roles": ["auditor"] }
}
```

The same shape comes back from the page's enforcers when a person declines, so an agent handles a refusal the same way wherever it happened.

## Error Codes

Every code, its HTTP status and which layer raises it is listed in the [Error Codes Reference](/docs/reference/error-codes). Codes are exported from `@web-axag/core` as `AXAG_ERRORS`, so your own validation can refuse in the same shape:

```typescript
import { AxagError } from '@web-axag/core';

if (!body.cart_id) {
  throw new AxagError('AXAG_MISSING_PARAM', 'cart_id is required', { intent: 'cart.begin_checkout' });
}
```

