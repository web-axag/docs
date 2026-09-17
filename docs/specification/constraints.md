---
id: constraints
title: Constraints
sidebar_label: Constraints
slug: /specification/constraints
---
# Constraints

Constraints govern valid inputs and execution conditions. They MUST be declared in annotations, not hidden in client-side validation logic.

## Value Constraints
Applied to individual parameters: type, format, range, pattern, enum, length. Declare them on the parameter itself, in the object form of `axag-required-parameters` / `axag-optional-parameters`, or with the `axag-parameter-*` attributes on a form control. They become JSON Schema keywords (`enum`, `minimum`, `maxLength`, …) in the generated tool, so an agent host can check them before a call is made.

## Relational Constraints
Relationships between parameters: mutual exclusion, conditional requirements, dependencies. AXAG 1.1 has no machine-readable form for these. State them as preconditions, and in the description, so an agent can reason about them — and check them in the handler or API, which must reject a call that breaks them.

## Execution Constraints
State requirements: preconditions, rate limits, cooldown periods, temporal windows. Use `axag-preconditions` for state, and `axag-rate-limit` / `axag-cooldown` for frequency.

## Declaration Example
```html
<button
  axag-intent="booking.create"
  axag-entity="reservation"
  axag-action-type="write"
  axag-required-parameters='[
    {"name":"check_in","type":"string","format":"date"},
    {"name":"check_out","type":"string","format":"date"},
    {"name":"guests","type":"integer","min":1,"max":10}
  ]'
  axag-preconditions='["room_available","check_out is after check_in"]'
  axag-risk-level="medium"
  axag-idempotent="false"
  axag-description="Book a room. check_out must be after check_in."
>
  Book Room
</button>
```

The range on `guests` is a value constraint and reaches the tool's input schema. The ordering of the two dates is relational, so it is written as a precondition and enforced by the booking API.

:::note Changed in 1.1
Earlier drafts showed an `axag-constraints` attribute holding expressions such as `"check_out > check_in"`. It was never part of the vocabulary and no tooling read it; declare value constraints on parameters instead.
:::
