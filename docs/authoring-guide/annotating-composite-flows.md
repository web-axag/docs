---
id: annotating-composite-flows
title: Annotating Composite Flows
sidebar_label: Composite Flows
slug: /authoring-guide/annotating-composite-flows
---
# Annotating Composite Flows

Composite flows combine multiple operations into a logical workflow — validate a cart, choose shipping, pay. Annotate each step as its own action, and link them through state:

```html
<button axag="read:cart.validate!none" axag-postconditions='["cart_valid"]'>Validate Cart</button>

<button axag="write:order.select_shipping!low?idempotent"
  axag-preconditions='["cart_valid"]'
  axag-postconditions='["shipping_selected"]'>Select Shipping</button>

<button axag="write:payment.confirm!high?confirm&idempotent=false"
  axag-preconditions='["shipping_selected"]'>Confirm Payment</button>
```

A postcondition of one step that matches a precondition of the next tells an agent the order to call them in. Nothing enforces that order for you: each step's handler or API must still refuse a call whose precondition is false, with `AXAG_PRECONDITION_FAILED`.

`axag-workflow-id` and `axag-workflow-step` may also be used to group and number the steps for human readers, but they aren't carried into the manifest in 1.1. See [Multi-Step Workflows](/docs/authoring-guide/annotating-multi-step-workflows).
