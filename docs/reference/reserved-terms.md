---
id: reserved-terms
title: Reserved Terms
sidebar_label: Reserved Terms
slug: /reference/reserved-terms
---

# Reserved Terms

The following terms are reserved in the AXAG specification. Custom annotations MUST NOT use these names for different purposes.

## Reserved Attribute Prefixes

All attributes starting with `axag-` are reserved by the AXAG specification:

- `axag-intent`
- `axag-entity`
- `axag-action-type`
- `axag-description`
- `axag-risk-level`
- `axag-idempotent`
- `axag-required-parameters`
- `axag-optional-parameters`
- `axag-preconditions`
- `axag-postconditions`
- `axag-side-effects`
- `axag-confirmation-required`
- `axag-approval-required`
- `axag-approval-roles`
- `axag-scope`
- `axag-tenant-boundary`
- `axag-async`

Custom extensions MUST use the `axag-x-` prefix:

```html
axag-x-my-custom-attribute="value"
```

## Reserved Action Types

| Value | Meaning |
|-------|---------|
| `read` | Query, search, list, get, view — no state change |
| `write` | Create, update, submit, schedule — state change |
| `delete` | Remove, cancel, deactivate — destructive state change |

## Reserved Risk Levels

| Value | Meaning |
|-------|---------|
| `none` | No risk — read-only operations |
| `low` | Minimal risk — easily reversible |
| `medium` | Moderate risk — may require confirmation |
| `high` | Significant risk — MUST require confirmation |
| `critical` | Maximum risk — MUST require confirmation AND approval |

## Reserved Scope Values

| Value | Meaning |
|-------|---------|
| `public` | No authentication required |
| `user` | Scoped to the authenticated user |
| `tenant` | Scoped to the user's organization |
| `global` | Cross-tenant, typically admin-only |

## Reserved Manifest Fields

These field names are reserved in the Semantic Manifest JSON:

- `version`, `generated_at`, `source`, `conformance`, `actions`
- `intent`, `entity`, `operation_id`, `action_type`, `description`
- `required_parameters`, `optional_parameters`, and parameter fields `name`, `type`, `enum`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `format`, `default`, `items`, `properties`
- `preconditions`, `postconditions`, `side_effects`
- `risk_level`, `idempotent`, `confirmation_required`, `approval_required`, `approval_roles`
- `scope`, `tenant_boundary`, `required_roles`, `async`
- `element_selector`, `source_file`, `source_line`

## Reserved Error Codes

All error codes starting with `AXAG_` are reserved:

- `AXAG_MISSING_PARAM`
- `AXAG_INVALID_TYPE`
- `AXAG_OUT_OF_RANGE`
- `AXAG_INVALID_ENUM`
- `AXAG_INVALID_FORMAT`
- `AXAG_PRECONDITION_FAILED`
- `AXAG_CONFIRMATION_MISSING`
- `AXAG_APPROVAL_MISSING`
- `AXAG_APPROVAL_INVALID`
- `AXAG_SCOPE_VIOLATION`
- `AXAG_TENANT_BOUNDARY`
- `AXAG_ROLE_INSUFFICIENT`
- `AXAG_INTENT_NOT_FOUND`
- `AXAG_VERSION_MISMATCH` (reserved for future use)
- `AXAG_RATE_LIMITED` (reserved for future use)

## Reserved Lint Rule IDs

All IDs matching `AXAG-LINT-XXX` are reserved. `axag-lint` doesn't load custom rules yet; name checks of your own — a CI script over the manifest, say — `AXAG-CUSTOM-XXX` so they can't collide with future built-in rules.
