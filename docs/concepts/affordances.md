---
id: affordances
title: "Core Concept: Affordances"
sidebar_label: Affordances
slug: /concepts/affordances
---

# Affordances

In UX, an affordance is a property of an object that indicates how it can be used — a button affords clicking, a slider affords dragging.

In AX, affordances are **declared capabilities**. An AXAG-annotated element declares what operations it affords to agents through its `axag-intent` and `axag-action-type` attributes.

## Visual vs Semantic Affordances

| Visual Affordance | Semantic Affordance |
|------------------|---------------------|
| A button shape suggests "clickable" | `axag-action-type="write"` declares "invocable operation" |
| A text field suggests "typeable" | `axag-parameter-type="string"` declares "accepts text input" |
| A dropdown suggests "selectable" | `axag-parameter-enum='["draft","published"]'` declares "accepts one of these values" |

## Agent-Facing Affordances

For agents, affordances MUST be:
- **Explicit** — Declared through annotations, not inferred from appearance
- **Typed** — Carrying parameter type information
- **Scoped** — Bounded by declared context
- **Constrained** — Governed by declared validation rules

## Next Steps

- [Constraints](/docs/concepts/constraints)
- [Preconditions and Postconditions](/docs/concepts/preconditions-postconditions)
