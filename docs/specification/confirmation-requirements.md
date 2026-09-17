---
id: confirmation-requirements
title: Confirmation Requirements
sidebar_label: Confirmation Requirements
slug: /specification/confirmation-requirements
---
# Confirmation Requirements

Confirmation requirements gate operation execution behind explicit acknowledgment by the person the agent acts for.

## When Confirmation Is Required
- `risk_level` is `high` or `critical`
- The operation produces irreversible side effects
- Financial transactions exceed defined thresholds

## Declaration
```html
<button
  axag-intent="order.cancel"
  axag-entity="order"
  axag-action-type="write"
  axag-risk-level="high"
  axag-idempotent="true"
  axag-confirmation-required="true"
  axag-confirmation-message="This will cancel the order and initiate a refund. This cannot be undone."
>Cancel Order</button>
```

## Agent Runtime Behavior
When `axag-confirmation-required="true"`, agent runtimes MUST:
1. Present the confirmation message to the user
2. Wait for explicit confirmation
3. Only proceed upon affirmative response
4. Log the confirmation event

## Server Enforcement

Confirmation that only happens in the agent can be skipped, so the server MUST be able to tell that a person confirmed *this* call. In the SDK:

- The page's [safety enforcers](/docs/frameworks/safety) show a confirmation dialog the agent can't dismiss, and exchange the person's answer for a single-use token bound to the intent, the parameters and the actor.
- `@web-axag/server` refuses a call without a valid token with `AXAG_CONFIRMATION_MISSING`. A token can't be reused, or replayed with different parameters.

The dialog shows the action's description, its risk level and the parameters the agent supplied. `axag-confirmation-message` isn't carried into the manifest in 1.1, so write the consequence into `axag-description` as well.
