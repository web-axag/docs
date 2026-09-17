---
id: annotating-destructive-actions
title: Annotating Destructive Actions
sidebar_label: Destructive Actions
slug: /authoring-guide/annotating-destructive-actions
---
# Annotating Destructive Actions

Destructive actions (delete, purge, revoke) require explicit safety annotations.

```html title="🔴 Critical destructive action — account deletion" showLineNumbers
<button
  axag-intent="account.delete"
  axag-entity="account"
  axag-action-type="delete"
  axag-required-parameters='["account_id","confirmation_code"]'
  axag-risk-level="critical"
  axag-confirmation-required="true"
  axag-confirmation-message="This will permanently delete the account and all data. This cannot be undone."
  axag-idempotent="false"
  axag-side-effects='["data_purged","subscriptions_cancelled","api_keys_revoked"]'
  axag-scope="user"
>Delete Account</button>
```

Rules:
- `delete` actions MUST declare a risk level, and MUST NOT be `none` unless trivially reversible. `axag-lint` flags any below `high` for review (AXAG-LINT-024)
- `high` and `critical` actions MUST have `axag-confirmation-required="true"`; `critical` actions also need approval (AXAG-LINT-026)
- Declare idempotency honestly: deleting an already-deleted record is often idempotent, but an action that also cancels subscriptions or sends email usually isn't
- All side effects MUST be declared
- `high` and `critical` actions MUST be [enforced on the server](/docs/frameworks/safety)

The example above is `critical` without approval, so `axag-lint` warns about it. For self-service account deletion that is a reasonable choice — no one else should approve deleting your own account — and the warning can be turned off for that file. For an admin deleting someone else's account, add `axag-approval-required` and `axag-approval-roles`.
