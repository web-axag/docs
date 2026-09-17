---
id: annotating-tables
title: Annotating Tables and Bulk Actions
sidebar_label: Tables & Bulk Actions
slug: /authoring-guide/annotating-tables
---
# Annotating Tables and Bulk Actions

Tables with row-level and bulk actions require annotations on action controls within table contexts.

## Row Action
```html title="Row-level actions — view & cancel" showLineNumbers
<table axag-scope="user">
  <tr>
    <td>Order #1234</td>
    <td>
      <button axag-intent="order.view" axag-entity="order" axag-action-type="navigate"
        axag-required-parameters='["order_id"]' axag-risk-level="none">View</button>
      <button axag-intent="order.cancel" axag-entity="order" axag-action-type="write"
        axag-risk-level="high" axag-confirmation-required="true" axag-idempotent="true"
        axag-preconditions='["order is not shipped"]'
        axag-required-parameters='["order_id"]'>Cancel</button>
    </td>
  </tr>
</table>
```

Each row control is its own action and needs its own intent, entity and action type. Only `axag-scope`, `axag-tenant-boundary` and `axag-required-roles` are [inherited](/docs/specification/context-inheritance) from the table — the entity is not.

One row's annotation describes the operation for every row: the `order_id` parameter is what tells an agent which row it is acting on.

## Bulk Action
```html title="Bulk action — export selected"
<button
  axag-intent="order.bulk_export"
  axag-entity="order"
  axag-action-type="read"
  axag-required-parameters='["order_ids"]'
  axag-scope="user"
  axag-risk-level="none"
  axag-description="Export selected orders as CSV"
>Export Selected</button>
```
