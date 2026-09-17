---
id: scope-mismatch-detection
title: Scope Mismatch Detection
sidebar_label: Scope Mismatch Detection
slug: /validation/scope-mismatch-detection
---

# Scope Mismatch Detection

Scope mismatch detection identifies annotations where the declared `axag-scope` is inconsistent with the operation's actual access pattern, tenant model, or role requirements.

## Why It Matters

Scope mismatches can cause:

- **Cross-tenant data leakage** — An operation scoped to `global` that should be scoped to `tenant`
- **Privilege escalation** — An operation scoped to `user` that actually modifies tenant-wide settings
- **Broken authorization** — Roles defined for one scope applied in another
- **Agent over-reach** — An agent invoking operations beyond its authorized boundary

## Common Scope Mismatches

### 1. Missing Scope on Tenant-Sensitive Operations

```html title="❌ No scope — agent can't determine tenant boundary"
<!-- ❌ No scope declared — agent doesn't know tenant boundary -->
<button
  axag-intent="user.list"
  axag-entity="user"
  axag-action-type="read"
  axag-required-roles='["admin"]'
>List All Users</button>
```

**Rule:** `AXAG-LINT-011` (warning) — an operation that names roles, approval roles or a tenant boundary **SHOULD** declare the scope those roles apply within.

**Fix:**
```html title="✅ Fix — add tenant scope"
<button
  axag-intent="user.list"
  axag-entity="user"
  axag-action-type="read"
  axag-required-roles='["admin"]'
  axag-scope="tenant"
>List All Users</button>
```

### 2. Global Scope on User-Specific Operations

```html title="❌ Global scope on personal action"
<!-- ❌ Global scope on a personal action -->
<button
  axag-intent="profile.update"
  axag-entity="profile"
  axag-action-type="write"
  axag-scope="global"
  axag-required-parameters='["user_id","display_name"]'
>Update Profile</button>
```

**Rule:** `AXAG-LINT-018` (warning) — operations on personal entities **SHOULD** use `user` scope, not `global`.

**Fix:**
```html title="✅ Fix — use user scope"
<button
  axag-intent="profile.update"
  axag-entity="profile"
  axag-action-type="write"
  axag-scope="user"
  axag-required-parameters='["display_name"]'
>Update Profile</button>
```

### 3. Tenant Scope Without Tenant-Aware Roles

```html
<!-- ❌ Tenant scope but roles don't include tenant context -->
<button
  axag-intent="settings.update"
  axag-entity="settings"
  axag-action-type="write"
  axag-scope="tenant"
  axag-required-roles='["superadmin"]'
>Update Settings</button>
```

**Rule:** `AXAG-LINT-019` (warning) — `superadmin` roles typically imply `global` scope. Verify that `tenant` is correct.

### 4. Cross-Entity Scope Inconsistency

When two operations on the same page operate on the same entity but declare different scopes:

```html
<!-- Operation 1: tenant scope -->
<button axag-intent="report.generate" axag-entity="report"
  axag-action-type="read" axag-scope="tenant">Generate</button>

<!-- Operation 2: global scope (on same entity) -->
<button axag-intent="report.delete" axag-entity="report"
  axag-action-type="delete" axag-scope="global">Delete</button>
```

**Rule:** `AXAG-LINT-020` (warning) — operations on the same entity within one file **SHOULD** use a consistent scope unless the difference is deliberate.

## Scope Hierarchy

```
global
  └── tenant
       └── user
            └── public
```

| Scope | Meaning | Typical Operations |
|-------|---------|-------------------|
| `global` | Platform-wide, all tenants | System settings, platform analytics |
| `tenant` | Within a single tenant/organization | Team management, tenant config, business data |
| `user` | Personal to the signed-in user | Profile, preferences, cart, personal data |
| `public` | No authentication needed | Catalogue browsing, help pages |

These four are the only values the manifest schema accepts. A narrower boundary — a team, a department — is `tenant` plus `axag-required-roles`.

## Detection Rules Summary

| Rule | Mismatch | Severity |
|------|----------|----------|
| `AXAG-LINT-011` | Role or tenancy attributes without a scope | Warning |
| `AXAG-LINT-018` | Global scope on personal operations | Warning |
| `AXAG-LINT-019` | Scope/role hierarchy mismatch | Warning |
| `AXAG-LINT-020` | Inconsistent scope on the same entity | Warning |
| `AXAG-LINT-021` | Delete operation without scope | Warning |
| `AXAG-LINT-022` | Tenant-level entity written with user scope | Warning |
| `AXAG-LINT-036` | Tenant-scoped action that takes the tenant as a parameter | Error |

Scope rules are warnings because only your domain knows the right boundary. AXAG-LINT-036 is an error: a tenant-scoped action that accepts the tenant as a parameter lets an agent name someone else's tenant, which [`@web-axag/server`](/docs/frameworks/safety) then has to refuse.

## CI Integration

```yaml
- name: Check for scope mismatches
  run: npx axag-lint src --format github
```

## Next Steps

- [Risk-Level Validation](/docs/validation/risk-level-validation)
- [Common Validation Failures](/docs/validation/common-failures)
- [Remediation Guidance](/docs/validation/remediation-guidance)
