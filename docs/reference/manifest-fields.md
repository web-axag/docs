---
id: manifest-fields
title: Manifest Fields Reference
sidebar_label: Manifest Fields
slug: /reference/manifest-fields
---

# Manifest Fields Reference

Every Semantic Manifest field, and the annotation attribute it is generated from. The JSON Schema that enforces these fields is described in [Manifest Schema](/docs/semantic-manifest/manifest-schema).

## Top-Level Fields

| Field | Type | Required | Filled from |
|-------|------|----------|-------------|
| `version` | string | MUST | Specification version of the generator (`"1.1.0"`) |
| `generated_at` | string (ISO 8601) | MUST | Time of generation |
| `source` | object | MUST | `url`, `paths`, `tool`, `tool_version` of the run |
| `conformance` | string | MUST | Computed — see [Conformance Levels](/docs/specification/conformance-levels) |
| `actions` | Action[] | MUST | One entry per distinct `axag-intent`, sorted by intent |
| `dynamic_actions` | object[] | MAY | Annotations that couldn't be read at build time and are registered at runtime instead (1.1). Each has `source_file`, `source_line` and `reason` |

When two elements declare the same intent, generators keep the first and report the second (`AXAG-CORE-003`).

## Action Object

| Field | Type | Required | Filled from |
|-------|------|----------|-------------|
| `intent` | string | MUST | `axag-intent` |
| `entity` | string | MUST | `axag-entity`, or the part of the intent before the dot |
| `action_type` | string | MUST | `axag-action-type` (`read` when absent) |
| `description` | string | MUST | `axag-description`, or the intent in words (`cart.add_item` → `Cart Add Item`) |
| `operation_id` | string | SHOULD | `axag-operation-id`, or the intent with `.` → `_` |
| `required_parameters` | Parameter[] | SHOULD | `axag-required-parameters` |
| `optional_parameters` | Parameter[] | MAY | `axag-optional-parameters` |
| `risk_level` | string | SHOULD | `axag-risk-level` |
| `confirmation_required` | boolean | MUST (high/critical) | `axag-confirmation-required` |
| `approval_required` | boolean | MAY | `axag-approval-required` |
| `approval_roles` | string[] | MUST (if approval) | `axag-approval-roles` |
| `idempotent` | boolean | SHOULD (write/delete) | `axag-idempotent` |
| `async` | boolean | MAY | `axag-async` |
| `scope` | string | SHOULD | `axag-scope` |
| `tenant_boundary` | string | MAY | `axag-tenant-boundary` |
| `required_roles` | string[] | MAY | `axag-required-roles` |
| `preconditions` | string[] | MAY | `axag-preconditions` |
| `postconditions` | string[] | MAY | `axag-postconditions` |
| `side_effects` | string[] | MAY | `axag-side-effects` |
| `element_selector` | string | MAY | CSS path, when read from a live page |
| `source_file` / `source_line` | string / integer | MAY | Where the annotation was found |

Optional fields appear only when the annotation declares them.

## Parameter Object

Besides declared parameters, generators add parameters from bound schemas and from form controls; see [Schema Harvesting](/docs/semantic-manifest/schema-harvesting). Parameters listed by name (`'["query"]'`) become `{ "name": "query", "type": "string" }`. The object form carries types and constraints through unchanged:

```html
axag-required-parameters='[{"name":"quantity","type":"integer","min":1,"max":99}]'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | MUST | Parameter name |
| `type` | string | MUST | `string`, `number`, `integer`, `boolean`, `array`, `object` |
| `description` | string | MAY | Parameter description |
| `enum` | any[] | MAY | Allowed values |
| `min` / `max` | number | MAY | Numeric bounds |
| `minLength` / `maxLength` | integer | MAY | String length bounds |
| `pattern` | string | MAY | Regular expression the value must match |
| `format` | string | MAY | `email`, `url`, `date`, `datetime`, `uuid` |
| `default` | any | MAY | Value used when omitted |
| `items` | object | MAY | JSON Schema for array elements |
| `properties` | object | MAY | JSON Schema properties for objects |
| `source` | string | MAY | `harvested:html`, `zod` or `openapi` for parameters not declared on the annotation — see [Schema Harvesting](/docs/semantic-manifest/schema-harvesting) |

## Example Manifest

```json
{
  "version": "1.1.0",
  "generated_at": "2026-09-14T10:30:00.000Z",
  "source": { "url": "https://example.com", "paths": ["src"], "tool": "@web-axag/cli", "tool_version": "1.1.1" },
  "conformance": "intermediate",
  "actions": [
    {
      "intent": "product.search",
      "entity": "product",
      "action_type": "read",
      "operation_id": "product_search",
      "description": "Search the product catalog",
      "required_parameters": [{ "name": "query", "type": "string" }],
      "optional_parameters": [{ "name": "category", "type": "string" }],
      "risk_level": "none",
      "idempotent": true,
      "scope": "public",
      "source_file": "src/search.html",
      "source_line": 12
    }
  ]
}
```
