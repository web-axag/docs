---
id: authorization-identity
title: Authorization and Identity
sidebar_label: Authorization & Identity
slug: /tool-generation/authorization-identity
---
# Authorization and Identity

Tool definitions carry role and tenant context from AXAG annotations, enabling agent runtimes to enforce access control.

## Role-Based Access
`axag-required-roles` becomes `metadata.required_roles`:
```json title="Role-based access control — tool metadata excerpt"
{
  "name": "user_delete",
  "metadata": {
    "action_type": "delete",
    "risk_level": "high",
    "required_roles": ["admin", "super_admin"],
    "source_intent": "user.delete",
    "source_entity": "user"
  }
}
```

## Tenant Isolation
`axag-scope` and `axag-tenant-boundary` become `metadata.scope` and `metadata.tenant_boundary`:
```json title="Tenant isolation — tool metadata excerpt"
{
  "name": "settings_update",
  "metadata": {
    "action_type": "write",
    "risk_level": "medium",
    "scope": "tenant",
    "tenant_boundary": "strict",
    "source_intent": "settings.update",
    "source_entity": "settings"
  }
}
```

Agent runtimes SHOULD check this metadata before invoking a tool, so an agent doesn't attempt a call it can't make. That check is a courtesy, not a control: the metadata travels with the tool, and an agent that ignores it still reaches your API with the page's session.

The enforcement that counts happens on your server, against the manifest rather than anything the caller sent — [`@web-axag/server`](/docs/frameworks/safety) checks `required_roles`, `scope` and `tenant_boundary` on every call and refuses with `AXAG_ROLE_INSUFFICIENT` or `AXAG_TENANT_BOUNDARY`. A tenant-scoped tool should also not accept the tenant as a parameter; `axag-lint` reports that as AXAG-LINT-036.
