---
id: safety-boundaries
title: "Core Concept: Safety Boundaries"
sidebar_label: Safety Boundaries
slug: /concepts/safety-boundaries
---

# Safety Boundaries

Safety boundaries are explicit declarations that control how and when operations can be executed. They prevent agents from performing dangerous actions without appropriate safeguards.

## Safety Dimensions

### Risk Classification

| Level | Description | Example |
|-------|-------------|---------|
| `none` | No risk — read-only, no side effects | Product search |
| `low` | Minor risk — easily reversible | Adding item to cart |
| `medium` | Moderate risk — state changes that require attention | Updating user profile |
| `high` | Significant risk — financial or data impact | Processing payment |
| `critical` | Maximum risk — irreversible, high-impact | Deleting an account |

### Confirmation Requirements

Operations classified as `high` or `critical` risk SHOULD require explicit confirmation before execution.

```html
<button
  axag-intent="account.delete"
  axag-entity="account"
  axag-action-type="delete"
  axag-risk-level="critical"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-confirmation-message="This will permanently delete the account and all associated data."
>
  Delete Account
</button>
```

### Approval Requirements

Some operations require multi-party approval before execution:

```html
<button
  axag-intent="payment.refund"
  axag-entity="payment"
  axag-action-type="write"
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-approval-required="true"
  axag-approval-roles='["finance_manager"]'
  axag-approval-count="1"
>
  Issue Refund
</button>
```

### Rate Limits and Cooldowns

```html
<button
  axag-intent="email.send_bulk"
  axag-entity="email"
  axag-action-type="write"
  axag-risk-level="medium"
  axag-confirmation-required="true"
  axag-idempotent="false"
  axag-rate-limit="100/hour"
  axag-cooldown="60s"
>
  Send Campaign
</button>
```

`axag-rate-limit`, `axag-cooldown` and `axag-approval-count` are not carried into the 1.1 manifest, so no AXAG tool enforces them — they tell a reader what your API already enforces.

## Where Boundaries Are Enforced

A declaration is not a control. An agent running in the page holds the session's credentials and can call your API directly, so risk, confirmation and approval must be enforced where the operation actually happens:

| Layer | Enforces |
|-------|----------|
| The annotation | Nothing — it declares what the rules are |
| The page ([`@web-axag/webmcp`](/docs/frameworks/safety)) | Asks the person to confirm, keeps tenant identifiers out of the agent's reach, audits calls |
| Your server ([`@web-axag/server`](/docs/frameworks/safety)) | Confirmation tokens, approvals, roles, tenant boundaries — the checks that count |

Actions at `high` risk and above MUST be enforced on the server; `axag-lint` flags those that aren't (AXAG-LINT-037).

## Why Safety Boundaries Are Non-Negotiable

An agent without safety boundaries is equivalent to giving every user root access. Without explicit risk declarations, agents cannot distinguish between browsing products and deleting accounts.

## Next Steps

- [Idempotency and Side Effects](/docs/concepts/idempotency-side-effects)
- [Role Awareness and Tenant Boundaries](/docs/concepts/role-awareness-tenant-boundaries)
