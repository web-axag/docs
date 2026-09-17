---
id: vocabulary
title: Canonical Vocabulary
sidebar_label: Vocabulary
slug: /specification/vocabulary
---

# Canonical Vocabulary

The AXAG canonical vocabulary defines all reserved attribute names, their types, allowed values, and semantic meaning.

## Reserved Attribute Prefix

The prefix `axag-` is reserved for AXAG annotations. Implementations MUST NOT use this prefix for non-AXAG purposes.

:::note Which attributes reach the manifest
Most attributes become a field of the manifest action and of the generated tool. These do not, in 1.1: `axag-confirmation-message`, `axag-approval-count`, `axag-rate-limit`, `axag-cooldown`, `axag-role-escalation`, the visibility attributes, the workflow attributes and the versioning attributes. They are valid in markup and describe intent to a reader, but AXAG tooling doesn't carry or enforce them yet — enforce the behaviour they describe in your own code. The [manifest field reference](/docs/reference/manifest-fields) lists what is carried.
:::

## Identity Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-intent` | `string` | Semantic intent in `entity.verb` format |
| `axag-entity` | `string` | Domain entity being operated on |
| `axag-action-type` | `enum` | Operation classification |
| `axag-description` | `string` | Human-readable description |
| `axag-operation-id` | `string` | Unique operation identifier |

## Parameter Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-required-parameters` | `array` | JSON array of parameter names, or parameter objects (`{"name":"query","type":"string","maxLength":200}`) |
| `axag-optional-parameters` | `array` | Same form, for optional parameters |
| `axag-params-from` | `string` | `#id` of the form whose controls supply parameters |
| `axag-schema` | `string` | Schema binding: `zod:<file>#<export>` or `openapi:[<file>#]<operationId>` |
| `axag-parameter` | `string` | Parameter name (on input elements) |
| `axag-parameter-type` | `enum` | `string`, `number`, `integer`, `boolean`, `array`, `object` |
| `axag-parameter-required` | `boolean` | Whether the parameter is required |
| `axag-parameter-description` | `string` | Parameter description |
| `axag-parameter-format` | `enum` | `email`, `url`, `date`, `datetime`, `uuid` |
| `axag-parameter-enum` | `string[]` | Allowed values for enum parameters |
| `axag-parameter-min` | `number` | Minimum value |
| `axag-parameter-max` | `number` | Maximum value |
| `axag-parameter-pattern` | `string` | Regex pattern for validation |
| `axag-parameter-min-length` | `number` | Minimum string length |
| `axag-parameter-max-length` | `number` | Maximum string length |

## State Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-preconditions` | `string[]` | Required state before execution |
| `axag-postconditions` | `string[]` | Guaranteed state after execution |
| `axag-side-effects` | `string[]` | Observable changes beyond primary result |

## Safety Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-risk-level` | `enum` | `none`, `low`, `medium`, `high`, `critical` |
| `axag-confirmation-required` | `boolean` | Whether explicit confirmation is needed |
| `axag-confirmation-message` | `string` | Message to display for confirmation |
| `axag-approval-required` | `boolean` | Whether multi-party approval is needed |
| `axag-approval-roles` | `string[]` | Roles that can approve |
| `axag-approval-count` | `number` | Number of approvals required |
| `axag-idempotent` | `boolean` | Whether safe to repeat |
| `axag-rate-limit` | `string` | Maximum invocation frequency |
| `axag-cooldown` | `string` | Minimum time between invocations |

## Scope Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-scope` | `enum` | `public`, `user`, `tenant`, `global` |
| `axag-tenant-boundary` | `enum` | `strict` (never crosses tenants) or `relaxed` (cross-tenant access where authorized) |
| `axag-required-roles` | `string[]` | Roles permitted to invoke |
| `axag-role-escalation` | `boolean` | Whether role escalation is permitted |

## Visibility Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-visible` | `boolean` | Whether discoverable by agents |
| `axag-operable` | `boolean` | Whether invocable by agents |
| `axag-operability-reason` | `string` | Why the operation is not operable |

## Workflow Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-workflow-id` | `string` | Workflow identifier |
| `axag-workflow-step` | `number` | Step position in workflow |
| `axag-workflow-total-steps` | `number` | Total steps in workflow |
| `axag-workflow-next` | `string` | Intent of next step |
| `axag-workflow-previous` | `string` | Intent of previous step |

## Versioning Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `axag-version` | `string` | AXAG specification version |
| `axag-deprecated` | `boolean` | Whether this annotation is deprecated |
| `axag-deprecated-replacement` | `string` | Replacement intent for deprecated operations |
| `axag-since` | `string` | Version when this annotation was introduced |

## Action Type Values

| Value | Description |
|-------|-------------|
| `read` | Non-mutating data retrieval |
| `write` | Creates or modifies an entity |
| `delete` | Removes, cancels, or deactivates an entity |
| `navigate` | Changes the view or context without data mutation |

:::note Changed in 1.1
Earlier drafts of this page listed `create` and `mutate`. The manifest schema and all AXAG tooling only ever accepted `write`; use `write` for both.
:::

## Scope Values

| Value | Description |
|-------|-------------|
| `public` | Available without authentication (catalog browsing, help pages) |
| `user` | Affects only the signed-in user's own data |
| `tenant` | Affects data shared across the user's organization |
| `global` | Affects every tenant or the whole platform |

## Risk Level Values

| Value | Description | Typical Actions |
|-------|-------------|-----------------|
| `none` | No risk | Search, browse, read |
| `low` | Easily reversible | Add to cart, bookmark |
| `medium` | Requires attention | Update profile, change settings |
| `high` | Financial or data impact | Process payment, submit application |
| `critical` | Irreversible, high impact | Delete account, purge data |

## Next Steps

- [Annotation Primitives](/docs/specification/annotation-primitives)
- [Required Fields](/docs/specification/required-fields)
