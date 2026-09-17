---
id: missing-intent-detection
title: Missing Intent Detection
sidebar_label: Missing Intent Detection
slug: /validation/missing-intent-detection
---

# Missing Intent Detection

Missing intent detection identifies interactive UI elements that lack AXAG annotations — elements an agent cannot interpret semantically.

## Why It Matters

Every unannotated interactive element is a gap in the semantic contract. When an agent encounters a button, link, or form without `axag-intent`, it must fall back to:

- DOM scraping (brittle)
- Label inference (ambiguous)
- Visual layout parsing (fragile)

These are exactly the failure modes AXAG is designed to eliminate.

## What Counts as "Missing Intent"

`axag-lint` treats an element as interactive if it is:

- a `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>` or `<form>`
- any element with an `onclick` handler, `role="button"` or `type="submit"`

An interactive element without `axag-intent` is reported by **AXAG-LINT-001**, with three exceptions where the element is already covered:

| Not reported | Why |
|--------------|-----|
| The submit button of an annotated `<form>` | The form's annotation describes the action |
| A form that feeds an annotated button | The button's annotation describes the action, and the form's controls become its parameters |
| An element with a bound spec (`axag={spec}`, `:axag`, `v-axag`, `[axag]`) | It is annotated at runtime; AXAG-LINT-033 reports that instead |

Plain navigation links are interactive too. Annotate the ones an agent should be able to follow (`axag="navigate:..."`), and turn AXAG-LINT-001 down for a project where most links aren't actions — see [Opting Out](#opting-out).

## Detection Rules

### AXAG-LINT-001: Missing Intent

```
Rule: AXAG-LINT-001
Default severity: error
Message: Interactive <button> element is missing axag-intent attribute
Fix: Add axag-intent, or an axag macro, with the semantic operation identifier
```

**Failing example:**
```html title="❌ No intent declared"
<!-- ❌ No intent declared -->
<button onclick="submitOrder()">Place Order</button>
```

**Passing example:**
```html title="✅ Intent declared"
<!-- ✅ Intent declared -->
<button
  onclick="submitOrder()"
  axag-intent="order.place"
  axag-entity="order"
  axag-action-type="write"
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="false"
>Place Order</button>
```

### AXAG-LINT-002: Missing Entity

```
Rule: AXAG-LINT-002
Default severity: error
Message: Element has axag-intent but missing axag-entity
Fix: Add axag-entity with the domain object name, or use the macro, which implies it from the intent
```

### AXAG-LINT-003: Missing Action Type

```
Rule: AXAG-LINT-003
Default severity: error
Message: Element has axag-intent but missing axag-action-type
Fix: Add axag-action-type with read, write, delete, or navigate
```

## Coverage Metrics

Track annotation coverage as a quality metric:

```
Annotation Coverage = (annotated interactive elements / total interactive elements) × 100
```

| Coverage Level | Percentage | Assessment |
|---------------|-----------|------------|
| None | 0% | No semantic contract |
| Minimal | 1–25% | Early adoption |
| Partial | 26–50% | In progress |
| Substantial | 51–75% | Good coverage |
| Comprehensive | 76–99% | Production-ready |
| Complete | 100% | Full semantic contract |

`axag-lint` doesn't report a coverage percentage. The count of AXAG-LINT-001 findings in its JSON output (`--format json`) is the number of uncovered elements, which is the figure to drive down.

## Opting Out

There is no per-element opt-out attribute. Where a whole category of element shouldn't be annotated, change the rule's severity or exclude the files:

```json title=".axaglintrc.json"
{
  "exclude": ["node_modules/**", "dist/**", "src/marketing/**"],
  "rules": {
    "AXAG-LINT-001": "warning"
  }
}
```

For an existing codebase, a [baseline](/docs/validation/ci-linting) is usually better than lowering severity: current findings are recorded and ignored, and only new unannotated elements fail the build.

## CI Integration

```yaml
- name: Check for missing intents
  run: npx axag-lint src --format github --baseline
```

## Next Steps

- [Unsafe Mutation Exposure Detection](/docs/validation/unsafe-mutation-detection)
- [Scope Mismatch Detection](/docs/validation/scope-mismatch-detection)
- [Remediation Guidance](/docs/validation/remediation-guidance)
