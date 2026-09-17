---
id: manifest-schema
title: Manifest Schema
sidebar_label: Manifest Schema
slug: /semantic-manifest/manifest-schema
---
# Manifest Schema

The Semantic Manifest is validated by a JSON Schema published at [`/schema/v1.1/axag-manifest.schema.json`](pathname:///schema/v1.1/axag-manifest.schema.json). The [v1 schema](pathname:///schema/v1/axag-manifest.schema.json) stays published for existing manifests; v1.1 only adds optional fields and enum values, so every valid v1 manifest is also valid under v1.1.

## Top-Level Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | `string` (semver) | Yes | AXAG specification version |
| `generated_at` | `date-time` | Yes | ISO 8601 timestamp |
| `source` | `Source` | Yes | Where the annotations were read from |
| `conformance` | `enum` | Yes | `basic`, `intermediate`, `full` |
| `actions` | `Action[]` | Yes | Operation definitions |
| `dynamic_actions` | `object[]` | No | Annotations registered at runtime rather than read at build time (1.1) — `source_file`, `source_line`, `reason` |

## Source Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | `uri` | No | Application URL |
| `paths` | `string[]` | No | Source paths scanned |
| `tool` | `string` | No | Generator name |
| `tool_version` | `string` | No | Generator version |

## Action Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `intent` | `string` | Yes | Semantic intent, `entity.verb` (`^[a-z_]+\.[a-z_]+$`) |
| `entity` | `string` | Yes | Domain entity (`^[a-z_]+$`) |
| `action_type` | `enum` | Yes | `read`, `write`, `delete`, `navigate` |
| `description` | `string` | Yes | Human-readable description |
| `operation_id` | `string` | No | Unique operation identifier |
| `required_parameters` | `Parameter[]` | No | Parameters that must be provided |
| `optional_parameters` | `Parameter[]` | No | Parameters that may be provided |
| `risk_level` | `enum` | No | `none`, `low`, `medium`, `high`, `critical` |
| `confirmation_required` | `boolean` | No | Human confirmation gate |
| `approval_required` | `boolean` | No | Role-based approval gate |
| `approval_roles` | `string[]` | No | Roles that can approve |
| `idempotent` | `boolean` | No | Retry safety |
| `async` | `boolean` | No | Completes asynchronously (1.1) |
| `scope` | `enum` | No | `public`, `user`, `tenant`, `global` (`public` added in 1.1) |
| `tenant_boundary` | `enum` | No | `strict`, `relaxed` (1.1) |
| `required_roles` | `string[]` | No | Roles permitted to invoke (1.1) |
| `side_effects` | `string[]` | No | Observable changes |
| `preconditions` | `string[]` | No | Required state |
| `postconditions` | `string[]` | No | Guaranteed state |
| `element_selector` | `string` | No | CSS selector of the source element |
| `source_file` | `string` | No | File the annotation lives in |
| `source_line` | `integer` | No | Line in that file (1-based) |

## Parameter Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Parameter name |
| `type` | `enum` | Yes | `string`, `number`, `integer`, `boolean`, `array`, `object` (`integer` added in 1.1) |
| `description` | `string` | No | Human-readable description |
| `enum` | `array` | No | Allowed values |
| `min` / `max` | `number` | No | Numeric bounds |
| `minLength` / `maxLength` | `integer` | No | String length bounds (`minLength` added in 1.1) |
| `pattern` | `string` | No | Regular expression the value must match (1.1) |
| `format` | `enum` | No | `email`, `url`, `date`, `datetime`, `uuid` |
| `default` | any | No | Value used when omitted |
| `items` | `object` | No | JSON Schema for array elements (1.1) |
| `properties` | `object` | No | JSON Schema properties for objects (1.1) |
| `source` | `enum` | No | `harvested:html`, `zod`, `openapi` — where an undeclared parameter came from (1.1) |

Which optional fields a manifest fills in determines its [conformance level](/docs/specification/conformance-levels).

The schema sets `additionalProperties: false`, so a field it doesn't define makes the manifest invalid. Extensions belong in [namespaced attributes](/docs/specification/namespacing), not in the manifest.
