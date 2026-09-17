---
id: annotating-embedded-widgets
title: Annotating Embedded Widgets
sidebar_label: Embedded Widgets
slug: /authoring-guide/annotating-embedded-widgets
---
# Annotating Embedded Widgets

Third-party widgets (payment forms, maps, calendars) embedded in your application should be annotated at the container level.

```html title="Third-party widget — Stripe payment" showLineNumbers
<div
  role="group"
  aria-label="Payment details"
  axag-intent="payment.collect"
  axag-entity="payment"
  axag-action-type="write"
  axag-required-parameters='["amount","currency","payment_method"]'
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-scope="user"
  axag-x-acme-widget-provider="stripe"
>
  <!-- Stripe Elements iframe renders here -->
</div>
```

The container annotation describes the semantic operation even though the internal widget implementation is opaque. Give the container an accessible name, as with any annotated element — `axag-lint` reports one without it (AXAG-LINT-031).

AXAG has no attribute for the widget's vendor. If your team wants to record it, use a [namespaced extension](/docs/specification/namespacing) such as `axag-x-acme-widget-provider`; agents and tooling ignore extensions they don't recognise.

## Parameters Inside an Iframe

Fields inside a cross-origin iframe can't be harvested — the page can't read them. Declare every parameter on the container, as above, and let the widget's own API do the work when the action runs.
