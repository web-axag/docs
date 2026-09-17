---
id: visibility-vs-operability
title: "Core Concept: Visibility vs Operability"
sidebar_label: Visibility vs Operability
slug: /concepts/visibility-vs-operability
---

# Visibility vs Operability

**Visibility** means an agent can discover an operation exists. **Operability** means an agent can invoke it.

An operation can be:
- Visible and operable — Discoverable and executable
- Visible but not operable — Discoverable but gated (e.g., requires approval)
- Not visible — Hidden from the agent entirely

This distinction prevents agents from assuming that discovery implies permission.

## Declaring Operability

```html
<button
  axag-intent="user.delete"
  axag-entity="user"
  axag-action-type="delete"
  axag-visible="true"
  axag-operable="false"
  axag-operability-reason="Requires admin approval"
  axag-approval-required="true"
  axag-approval-roles='["admin"]'
>
  Delete User
</button>
```

This tells the agent: you can see this operation exists, but you cannot execute it without admin approval.

## How the Runtime Decides

[`@web-axag/webmcp`](/docs/frameworks/runtime) computes operability from the page rather than from the attributes: an action whose element is disabled, hidden, `inert`, `aria-disabled` or detached is withdrawn from the agent's tool list, and offered again when the element comes back. So a button your UI disables is already not operable, without annotating it.

The visibility attributes are declarations for readers and for your own code; the 1.1 manifest doesn't carry them. To keep an action off an agent's list deliberately, use the binding's `enabled` option in [React](/docs/frameworks/react), [Vue](/docs/frameworks/vue) or [Angular](/docs/frameworks/angular), and let the server refuse it too.

## Next Steps

- [Determinism and Trust](/docs/concepts/determinism-and-trust)
- [Safety Boundaries](/docs/concepts/safety-boundaries)
