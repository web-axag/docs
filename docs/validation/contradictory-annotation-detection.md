---
id: contradictory-annotation-detection
title: Contradictory Annotation Detection
sidebar_label: Contradictory Annotation Detection
slug: /validation/contradictory-annotation-detection
---

# Contradictory Annotation Detection

Contradictory annotations occur when two or more AXAG attributes on the same element express incompatible semantics. These contradictions create ambiguity for agents, which cannot determine the correct interpretation.

## Why It Matters

When an agent encounters contradictory annotations, it must either:
- Guess which attribute to trust (dangerous)
- Reject the operation entirely (safe but limits functionality)
- Ask for human clarification (possible but defeats automation)

None of these outcomes are acceptable in production. **Contradictions MUST be detected and resolved before deployment.**

## Common Contradictions

### 1. Risk Level vs Action Type

A `read` operation annotated with `critical` risk:

```html title="❌ Contradictory — read with critical risk"
<!-- ❌ Contradictory: reads don't destroy anything -->
<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-risk-level="critical"
>Search</button>
```

**Rule:** `AXAG-LINT-013` (error) — a `read` operation **MUST NOT** be `critical`. `AXAG-LINT-025` (info) also notes a read above `low`, which is sometimes right for a sensitive export.

**Fix:**
```html title="✅ Fix — risk level matches action type"
<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-risk-level="none"
>Search</button>
```

### 2. Approval Without Roles

```html
<!-- ❌ Contradictory: approval required but nobody can give it -->
<button
  axag-intent="expense.approve"
  axag-entity="expense"
  axag-action-type="write"
  axag-approval-required="true"
  axag-risk-level="high"
>Approve</button>
```

**Rule:** `AXAG-LINT-012` (error) — when `axag-approval-required="true"`, `axag-approval-roles` **MUST** be specified.

### 3. Preconditions Contradicting Action Type

```html
<!-- ❌ Contradictory: create with "must exist" precondition -->
<button
  axag-intent="product.create"
  axag-entity="product"
  axag-action-type="write"
  axag-risk-level="low"
  axag-idempotent="false"
  axag-preconditions='["product must exist"]'
>Create Product</button>
```

**Rule:** `AXAG-LINT-014` (warning) — a `write` whose preconditions say the entity "must exist" or "already exists" is either an update, or the precondition is wrong.

### 4. Navigation With Side Effects

```html
<!-- ❌ Contradictory: navigation that changes state -->
<a
  href="/logout"
  axag-intent="session.end"
  axag-entity="session"
  axag-action-type="navigate"
  axag-side-effects='["session_destroyed"]'
>Log out</a>
```

**Rule:** `AXAG-LINT-015` (warning) — `navigate` means changing the view. An action with side effects is a `write` or a `delete`.

### 5. Tenant Roles Outside Tenant Scope

```html
<!-- ❌ Contradictory: a tenant_ role approving a global action -->
<button
  axag-intent="billing.adjust"
  axag-entity="billing"
  axag-action-type="write"
  axag-risk-level="high"
  axag-idempotent="false"
  axag-confirmation-required="true"
  axag-scope="global"
  axag-approval-required="true"
  axag-approval-roles='["tenant_admin"]'
>Adjust Billing</button>
```

**Rule:** `AXAG-LINT-016` (warning) — a `tenant_`-prefixed approval role with a non-tenant scope means one of the two is wrong.

### Also Worth Checking by Hand

Some contradictions no rule can see. An operation declared `axag-idempotent="true"` whose side effects include `email_sent` is one: repeating it sends another email, so either the declaration or the side effect is wrong. `AXAG-LINT-017` only catches the opposite case — a non-idempotent mutation that declares no side effects at all.

## Detection Rules Summary

| Rule | Contradiction | Default severity |
|------|--------------|------------------|
| `AXAG-LINT-012` | Approval required + no approval roles | Error |
| `AXAG-LINT-013` | Read + critical risk | Error |
| `AXAG-LINT-014` | Write + "must exist" precondition | Warning |
| `AXAG-LINT-015` | Navigate + side effects declared | Warning |
| `AXAG-LINT-016` | Tenant-only approval roles + non-tenant scope | Warning |
| `AXAG-LINT-025` | Read + risk above `low` | Info |

## CI Integration

```yaml
# In your CI pipeline
- name: Check for contradictory annotations
  run: npx axag-lint src --format github
```

## Next Steps

- [Missing Intent Detection](/docs/validation/missing-intent-detection)
- [Unsafe Mutation Exposure Detection](/docs/validation/unsafe-mutation-detection)
- [Common Validation Failures](/docs/validation/common-failures)
