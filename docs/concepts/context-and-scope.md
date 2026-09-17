---
id: context-and-scope
title: "Core Concept: Context and Scope"
sidebar_label: Context and Scope
slug: /concepts/context-and-scope
---

# Context and Scope

**Scope** defines the boundary within which an operation executes. **Context** provides the environmental information needed for execution.

## Scope Levels

| Scope | Description | Example |
|-------|-------------|---------|
| `public` | Available without authentication | Product search, help pages |
| `user` | Affects only the signed-in user's own data | Profile updates, cart operations, order history |
| `tenant` | Affects data shared across the user's organization | Multi-tenant SaaS operations, team settings |
| `global` | Affects every tenant or the whole platform | Platform-wide configuration (rare, admin-only) |

These four are the whole set. Narrower boundaries — a catalog, a session, a customer account — are expressed with `tenant` or `user` plus `axag-required-roles` and preconditions, not new scope values.

:::note Changed in 1.1
Earlier drafts of this page listed `catalog`, `organization`, `session` and `customer`. They were never accepted by the manifest schema or tooling.
:::

## Why Scope Matters

An agent operating within a multi-tenant SaaS product must know that `tenant` scope means operations are isolated to the current tenant. Without this declaration, an agent might attempt cross-tenant operations that should be forbidden.

## Context Inheritance

A container can declare scope, tenant boundary and roles once for every annotation inside it:

```html
<div axag-scope="tenant" axag-tenant-boundary="strict">
  <button axag-intent="user.create" axag-entity="user" axag-action-type="write">
    Add User
  </button>
  <!-- This button inherits scope="tenant" and tenant-boundary="strict" -->
</div>
```

Generators copy the inherited values into each action, so the manifest — and `@web-axag/server`, which enforces from it — sees `scope: "tenant"` on the button. See [Context Inheritance](/docs/specification/context-inheritance).

## Next Steps

- [Visibility vs Operability](/docs/concepts/visibility-vs-operability)
- [Role Awareness and Tenant Boundaries](/docs/concepts/role-awareness-tenant-boundaries)
