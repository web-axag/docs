---
id: proposed-vs-normative
title: Proposed Patterns vs Normative Rules
sidebar_label: Proposed vs Normative
slug: /examples/proposed-vs-normative
---

# Proposed Patterns vs Normative Rules

AXAG documentation distinguishes between **normative rules** (binding requirements) and **proposed patterns** (recommended approaches that are not yet part of the formal specification). This page clarifies the distinction with concrete examples.

## Content Classification

| Classification | Meaning | Language | Binding? |
|---------------|---------|----------|----------|
| **Normative** | Binding requirement. Implementations MUST comply. | MUST, MUST NOT, SHALL | Yes |
| **Recommended** | Best practice. Implementations SHOULD follow. | SHOULD, SHOULD NOT | Strongly advised |
| **Informative** | Explanatory context. Not binding. | — | No |
| **Example** | Illustrative code. Not binding. | — | No |
| **Proposed Pattern** | Inferred implementation approach. Not yet canonical. | — | No |

---

## Normative Rules

These are part of the AXAG specification and MUST be followed for conformance.

### Rule: Required Attributes (Normative)

> Every annotated element **MUST** include `axag-intent`, `axag-entity`, and `axag-action-type`.

```html
<!-- ✅ Conformant: all three required attributes present -->
<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
>Search</button>
```

```html
<!-- ❌ Non-conformant: missing axag-entity and axag-action-type -->
<button axag-intent="product.search">Search</button>
```

### Rule: Risk Level Values (Normative)

> The `axag-risk-level` attribute **MUST** be one of: `none`, `low`, `medium`, `high`, `critical`.

```html
<!-- ✅ Valid risk level -->
<button
  axag-intent="order.cancel"
  axag-entity="order"
  axag-action-type="write"
  axag-risk-level="high"
>Cancel Order</button>
```

```html
<!-- ❌ Invalid risk level value -->
<button
  axag-intent="order.cancel"
  axag-entity="order"
  axag-action-type="write"
  axag-risk-level="dangerous"
>Cancel Order</button>
```

### Rule: Attribute Prefix (Normative)

> All AXAG annotation attributes **MUST** use the `axag-` prefix. This prefix is reserved and **MUST NOT** be used for non-AXAG purposes.

---

## Proposed Implementation Patterns

These patterns are **not part of the formal specification** but represent recommended approaches inferred from the AXAG conceptual model. They are labeled clearly to avoid confusion with normative content.

### Pattern: Async Operation Polling (Proposed)

:::info Proposed Implementation Pattern
This pattern is not part of the normative specification. It represents an inferred best practice.
:::

For async operations, the proposed pattern is to declare the async nature and let the agent framework handle polling:

```html
<button
  axag-intent="report.generate"
  axag-entity="report"
  axag-action-type="read"
  axag-async="true"
  axag-description="Generate analytics report (async, may take 30-60 seconds)"
>Generate Report</button>
```

The corresponding manifest would include:

```json
{
  "intent": "report.generate",
  "entity": "report",
  "async": true,
  "estimated_duration": "30-60s",
  "polling_endpoint": "/api/reports/{job_id}/status"
}
```

**Why this is "proposed":** The specification defines `axag-async` as an optional attribute, but the manifest fields `estimated_duration` and `polling_endpoint` are not part of the normative manifest schema. They are useful extensions that implementations may adopt.

### Pattern: Composite Flow Sequencing (Proposed)

:::info Proposed Implementation Pattern
This pattern shows one approach to declaring multi-step workflows. The specification does not mandate a specific sequencing syntax.
:::

```html
<!-- Step 1 -->
<button
  axag-intent="checkout.validate_cart"
  axag-entity="cart"
  axag-action-type="read"
  axag-postconditions='["cart_valid"]'
  data-axag-flow="checkout"
  data-axag-step="1"
>Validate Cart</button>

<!-- Step 2 -->
<button
  axag-intent="checkout.select_shipping"
  axag-entity="order"
  axag-action-type="write"
  axag-preconditions='["cart_valid"]'
  axag-postconditions='["shipping_selected"]'
  data-axag-flow="checkout"
  data-axag-step="2"
>Select Shipping</button>

<!-- Step 3 -->
<button
  axag-intent="checkout.confirm_payment"
  axag-entity="order"
  axag-action-type="write"
  axag-preconditions='["shipping_selected"]'
  axag-risk-level="high"
  axag-confirmation-required="true"
  data-axag-flow="checkout"
  data-axag-step="3"
>Confirm Payment</button>
```

**Why this is "proposed":** The `data-axag-flow` and `data-axag-step` attributes are extensions. The specification does not define flow-level sequencing — it focuses on individual element annotations. Step ordering is inferred through preconditions and postconditions (which ARE normative).

### Pattern: JSON-LD Inline Annotation (Proposed)

:::info Proposed Implementation Pattern
JSON-LD is an alternative annotation format being evaluated for future specification versions.
:::

```html
<script type="application/ld+json">
{
  "@context": "https://axag.org/schema/v1",
  "@type": "AXAGAnnotation",
  "intent": "product.search",
  "entity": "product",
  "actionType": "read",
  "parameters": {
    "required": ["query"],
    "optional": ["category", "price_min", "price_max"]
  },
  "riskLevel": "none",
  "targetSelector": "#search-button"
}
</script>
```

**Why this is "proposed":** The normative annotation format is HTML data attributes (`axag-*`). JSON-LD is being explored as a complementary format for machine-readable page-level declarations.

### Pattern: The `axag` Macro (Proposed)

:::info Proposed Implementation Pattern
The macro is a proposed pattern in AXAG 1.1, and becomes normative once the 1.1 review period closes. All AXAG tooling already supports it.
:::

```html
<button axag="write:user.deactivate!critical?approval&roles=security_admin">Deactivate</button>
```

It expands to exactly the longhand attributes an author could have written, so a manifest built from either form is identical. See [Macro Syntax](/docs/specification/macro-syntax).

**Why this is "proposed":** the normative annotation format is the longhand `axag-*` attributes. The macro is shorthand over them, under review for 1.2.

### Pattern: TypeScript Wrapper Component (Proposed)

:::info Proposed Implementation Pattern
Framework-specific helpers are not part of the specification but are recommended for developer experience.
:::

The SDK now ships bindings for [React](/docs/frameworks/react), [Vue](/docs/frameworks/vue) and [Angular](/docs/frameworks/angular) that do this and register the action with the agent runtime while the component is mounted. A hand-rolled wrapper like the one below is still fine for a project that only wants the attributes in the DOM.

```typescript
import React from 'react';

interface AXAGButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent: string;
  entity: string;
  actionType: 'read' | 'write' | 'delete' | 'navigate';
  requiredParameters?: string[];
  riskLevel?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  confirmationRequired?: boolean;
  description?: string;
}

export const AXAGButton: React.FC<AXAGButtonProps> = ({
  intent, entity, actionType, requiredParameters,
  riskLevel, confirmationRequired, description,
  children, ...rest
}) => (
  <button
    axag-intent={intent}
    axag-entity={entity}
    axag-action-type={actionType}
    axag-required-parameters={requiredParameters ? JSON.stringify(requiredParameters) : undefined}
    axag-risk-level={riskLevel}
    axag-confirmation-required={confirmationRequired?.toString()}
    axag-description={description}
    {...rest}
  >
    {children}
  </button>
);
```

**Why this is "proposed":** The specification is framework-agnostic. React/TypeScript wrappers are implementation helpers, not part of the normative standard.

---

## How to Identify Content Classification

When reading AXAG documentation:

1. **Look for RFC keywords** — `MUST`, `SHOULD`, `MAY` indicate normative content
2. **Check callout boxes** — "Proposed Implementation Pattern" callouts indicate non-normative content
3. **Check page metadata** — Each page declares its classification in the frontmatter or header
4. **Look for the badge** — Normative pages display a classification badge

## Why This Matters

Mixing normative rules with proposed patterns causes:

- **False compliance** — Teams implement proposed patterns thinking they're required
- **Tooling confusion** — Linters enforce proposed patterns as errors
- **Spec drift** — Proposed patterns become de facto standards without review
- **Adoption friction** — Teams unsure what's mandatory vs optional

AXAG maintainers and contributors **MUST** clearly label all content to prevent these issues.

## Next Steps

- [Specification Overview](/docs/specification/overview)
- [Conformance Levels](/docs/specification/conformance-levels)
- [Anti-Patterns](/docs/examples/anti-patterns)
