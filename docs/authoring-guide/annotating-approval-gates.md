---
id: annotating-approval-gates
title: Annotating Approval Gates
sidebar_label: Approval Gates
slug: /authoring-guide/annotating-approval-gates
---
# Annotating Approval Gates

Operations requiring multi-party approval need explicit approval annotations.

```html title="Approval gate — refund processing" showLineNumbers
<button
  axag-intent="refund.process"
  axag-entity="refund"
  axag-action-type="write"
  axag-required-parameters='["order_id","amount","reason"]'
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-preconditions='["order is settled","refund amount within limit"]'
  axag-approval-required="true"
  axag-approval-roles='["finance_manager"]'
  axag-approval-count="1"
  axag-scope="tenant"
>Process Refund</button>
```

The agent runtime should submit an approval request rather than executing directly, then wait for approval from an authorized role.

Because an agent can skip that, the gate has to exist on the server too: [`@web-axag/server`](/docs/frameworks/safety) asks your `approvals` hook on every call and refuses with `AXAG_APPROVAL_MISSING` when approval hasn't been granted. `axag-approval-count` isn't carried into the manifest, so a rule like "two approvers" lives in that hook. See [Approval Requirements](/docs/specification/approval-requirements).
