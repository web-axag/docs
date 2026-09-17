---
id: unsafe-mutation-detection
title: Unsafe Mutation Exposure Detection
sidebar_label: Unsafe Mutation Detection
slug: /validation/unsafe-mutation-detection
---

# Unsafe Mutation Exposure Detection

Unsafe mutation exposure occurs when a write, delete, or mutate operation is annotated without adequate safety metadata — exposing the operation to unchecked agent execution.

## Why It Matters

When an agent discovers a mutation operation without safety constraints, it may:

- Execute destructive actions without confirmation
- Trigger financial transactions without approval
- Modify shared state without tenant boundaries
- Invoke non-idempotent operations multiple times

These scenarios represent **real production risk**.

## What Constitutes "Unsafe Exposure"

A mutation is considered unsafely exposed when any of these conditions are true:

| Condition | Risk |
|-----------|------|
| `action-type` is `write` or `delete` but no `risk-level` | Agent cannot assess risk |
| `risk-level` is `high` or `critical` but `confirmation-required` is `false` or missing | Dangerous action without human check |
| `action-type` is `delete` but no `preconditions` | No guard against invalid deletion |
| `action-type` is `write` with financial side effects but no `approval-required` | Financial risk without governance |
| `idempotent` is `false` or missing with no `side-effects` declaration | Agent cannot predict consequences |
| `scope` is missing on tenant-sensitive mutations | Cross-tenant data corruption risk |

## Detection Rules

### AXAG-LINT-023: Mutation Without a Risk Level

```
Rule: AXAG-LINT-023
Default severity: error
Message: axag-action-type="write" must declare axag-risk-level
Fix: Add axag-risk-level appropriate to the operation's impact
```

**Failing example:**
```html title="❌ Unsafe — no risk level on a delete"
<button
  axag-intent="account.delete"
  axag-entity="account"
  axag-action-type="delete"
>Delete Account</button>
```

### AXAG-LINT-006: High Risk Without Confirmation

```
Rule: AXAG-LINT-006
Default severity: warning
Message: axag-risk-level="critical" should have axag-confirmation-required="true"
Fix: Add axag-confirmation-required="true"
```

**Passing example:**
```html title="✅ Safe — full safety metadata" showLineNumbers
<button
  axag-intent="account.delete"
  axag-entity="account"
  axag-action-type="delete"
  axag-risk-level="critical"
  axag-confirmation-required="true"
  axag-approval-required="true"
  axag-approval-roles='["super_admin"]'
  axag-preconditions='["no active subscriptions"]'
  axag-postconditions='["account deactivated","data retention started"]'
  axag-idempotent="true"
  axag-scope="tenant"
>Delete Account</button>
```

### AXAG-LINT-017: Missing Side Effects Declaration

```
Rule: AXAG-LINT-017
Default severity: warning
Message: Non-idempotent write action should declare axag-side-effects
Fix: Add axag-side-effects listing observable state changes
```

A mutation that isn't idempotent, or doesn't say, must at least tell an agent what repeating it would do.

### AXAG-LINT-021: Delete Without a Scope

```
Rule: AXAG-LINT-021
Default severity: warning
Message: Delete action should declare axag-scope to indicate blast radius
Fix: Add axag-scope — how far does this deletion reach?
```

### AXAG-LINT-026: Safety Metadata Below the Declared Risk

Each risk level asks for the metadata that makes it actionable — `critical` adds approval and approval roles. See [Risk-Level Validation](/docs/validation/risk-level-validation).

### AXAG-LINT-037: No Server Enforcement

```
Rule: AXAG-LINT-037
Default severity: warning
Message: High-risk action has no server-side enforcement
Fix: Enforce the intent with @web-axag/server, and point the linter at the list it produces
```

This is the rule that closes the gap the others can't: confirmation and tenant checks in the page only guide a cooperative agent. It reports nothing until `enforcedIntentsPath` in `.axaglintrc.json` points at the intents your server enforces. See [Safety Enforcers](/docs/frameworks/safety).

## Safety Metadata by Action Type

| Action Type | Metadata the linter expects |
|------------|------------------------------|
| `read` | Nothing; `critical` risk is an error (AXAG-LINT-013) |
| `write` | `risk-level`, `idempotent`, plus `side-effects` when not idempotent |
| `write` (medium) | + `confirmation-required` |
| `write` (high) | + `preconditions`, and server enforcement |
| `delete` | `risk-level` (normally `high` or above), `scope` |
| `critical` (any) | + `approval-required`, `approval-roles` |

## CI Integration

```yaml
- name: Check for unsafe mutations
  run: npx axag-lint src --format github
```

## Next Steps

- [Scope Mismatch Detection](/docs/validation/scope-mismatch-detection)
- [Risk-Level Validation](/docs/validation/risk-level-validation)
- [Remediation Guidance](/docs/validation/remediation-guidance)
