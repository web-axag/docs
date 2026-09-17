---
id: risk-level-validation
title: Risk-Level Validation
sidebar_label: Risk-Level Validation
slug: /validation/risk-level-validation
---

# Risk-Level Validation

Risk-level validation ensures that the `axag-risk-level` attribute accurately reflects the operation's actual danger and that corresponding safety metadata is proportional.

## Why It Matters

Incorrect risk levels undermine the entire safety model:

- **Under-classified risk** — Dangerous operations executed without safeguards
- **Over-classified risk** — Benign operations blocked by unnecessary friction
- **Missing risk metadata** — Agents cannot make informed execution decisions

## Risk-Level Definitions

| Level | Operations | Expected Safeguards |
|-------|-----------|-------------------|
| `none` | Read-only queries, searches, listings | None required |
| `low` | Creating non-critical records, bookmarks | Logging |
| `medium` | Updating records, status changes | Confirmation |
| `high` | Financial transactions, bulk operations, deletions | Confirmation + preconditions |
| `critical` | Permanent deletions, admin operations, compliance actions | Confirmation + approval + preconditions |

## Validation Rules

### AXAG-LINT-023: Missing Risk Level on Mutations

```
Rule: AXAG-LINT-023
Severity: Error
Message: axag-action-type="write" must declare axag-risk-level
Fix: Add axag-risk-level appropriate to the operation's impact
```

```html title="❌ Missing risk level → ✅ Fix"
<!-- ❌ Missing risk level -->
<button
  axag-intent="invoice.void"
  axag-entity="invoice"
  axag-action-type="write"
>Void Invoice</button>

<!-- ✅ Risk level declared -->
<button
  axag-intent="invoice.void"
  axag-entity="invoice"
  axag-action-type="write"
  axag-risk-level="high"
  axag-confirmation-required="true"
>Void Invoice</button>
```

### AXAG-LINT-024: Risk Level Too Low for Action Type

```
Rule: AXAG-LINT-024
Severity: Warning
Message: Delete action has axag-risk-level="low" — delete actions should typically be "high" or "critical"
Fix: Verify risk level — most deletions should be "high" or "critical"
```

### AXAG-LINT-025: Risk Level Too High for Action Type

```
Rule: AXAG-LINT-025
Severity: Info
Message: Read action has axag-risk-level="high" — read actions are typically "none" or "low"
Fix: Verify — reads are normally "none" unless exposing sensitive data
```

### AXAG-LINT-013: Critical Read

```
Rule: AXAG-LINT-013
Default severity: error
Message: axag-action-type="read" contradicts axag-risk-level="critical" — read operations should not be critical risk
Fix: Reads don't destroy anything — use "medium" or "high" for sensitive reads
```

**Combinations to check:**

| Action Type | Questionable Risk Level | Rule |
|------------|------------------------|------|
| `read` | `critical` | AXAG-LINT-013 (error) |
| `read` | above `low` | AXAG-LINT-025 (info) |
| `delete` | below `high` | AXAG-LINT-024 (warning) |
| `navigate` | any, when side effects are declared | AXAG-LINT-015 (warning) |

### AXAG-LINT-026: Safety Metadata Mismatch

The required safety metadata must be proportional to the risk level:

| Risk Level | Metadata AXAG-LINT-026 expects |
|-----------|--------------------------------|
| `none` | None |
| `low` | `idempotent` recommended |
| `medium` | `confirmation-required`, `idempotent` |
| `high` | `confirmation-required`, `idempotent`, `preconditions` |
| `critical` | All of `high`, plus `approval-required` and `approval-roles` |

`side-effects` is asked for separately, by AXAG-LINT-017, whenever a mutation isn't idempotent.

```html
<!-- ❌ High risk without required safety metadata -->
<button
  axag-intent="payment.refund"
  axag-entity="payment"
  axag-action-type="write"
  axag-risk-level="high"
>Refund</button>

<!-- ✅ High risk with proportional safety metadata -->
<button
  axag-intent="payment.refund"
  axag-entity="payment"
  axag-action-type="write"
  axag-risk-level="high"
  axag-required-parameters='["payment_id","amount"]'
  axag-preconditions='["payment exists","amount within refund limit"]'
  axag-postconditions='["refund initiated","customer notified"]'
  axag-confirmation-required="true"
  axag-idempotent="true"
  axag-side-effects='["payment_reversal","accounting_entry"]'
  axag-scope="tenant"
>Refund</button>
```

## Risk Assessment Checklist

When assigning a risk level, consider:

- [ ] Does this operation modify persistent state?
- [ ] Is the operation reversible?
- [ ] Does it affect financial records or payments?
- [ ] Could it affect other users or tenants?
- [ ] Does it trigger external side effects (emails, webhooks)?
- [ ] Does it require regulatory compliance?
- [ ] Could repeated execution cause harm?

## CI Integration

```yaml
- name: Validate risk levels
  run: npx axag-lint src --format github
```

## Next Steps

- [Contradictory Annotation Detection](/docs/validation/contradictory-annotation-detection)
- [Common Validation Failures](/docs/validation/common-failures)
- [Remediation Guidance](/docs/validation/remediation-guidance)
