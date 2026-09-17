---
id: schema-reference
title: Schema Reference
sidebar_label: Schema Reference
slug: /reference/schema-reference
---

# Schema Reference

Complete JSON Schema reference for all AXAG artifacts.

## Annotation Attribute Schema

Every AXAG-annotated HTML element uses the following attributes:

### Required Attributes

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| `axag-intent` | string | `entity.action` pattern | Canonical intent identifier |
| `axag-entity` | string | snake_case | Entity this action operates on |
| `axag-action-type` | string | `read` \| `write` \| `delete` \| `navigate` | Operation category |

### Recommended Attributes

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| `axag-description` | string | Free text | Human-readable action description |
| `axag-risk-level` | string | `none` \| `low` \| `medium` \| `high` \| `critical` | Risk classification |
| `axag-idempotent` | boolean | `true` \| `false` | Whether repeated calls are safe |
| `axag-required-parameters` | JSON array | `["param1","param2"]` | Parameters that MUST be provided |
| `axag-optional-parameters` | JSON array | `["param1","param2"]` | Parameters that MAY be provided |

### Safety Attributes

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| `axag-confirmation-required` | boolean | `true` \| `false` | Whether user confirmation is needed |
| `axag-approval-required` | boolean | `true` \| `false` | Whether role-based approval is needed |
| `axag-approval-roles` | JSON array | `["role1","role2"]` | Roles authorized to approve |
| `axag-preconditions` | JSON array | `["condition"]` | Conditions that MUST be true before execution |
| `axag-postconditions` | JSON array | `["condition"]` | Conditions guaranteed after successful execution |
| `axag-side-effects` | JSON array | `["effect"]` | Side-effects of execution |

### Scope Attributes

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| `axag-scope` | string | `public` \| `user` \| `tenant` \| `global` | Data access scope |
| `axag-tenant-boundary` | string | `strict` \| `relaxed` | Tenant isolation enforcement |

### Execution Attributes

| Attribute | Type | Values | Description |
|-----------|------|--------|-------------|
| `axag-async` | boolean | `true` \| `false` | Whether operation is asynchronous |

## Manifest Schema

The canonical JSON Schema is published at [`/schema/v1.1/axag-manifest.schema.json`](pathname:///schema/v1.1/axag-manifest.schema.json); every field is listed in [Manifest Fields](/docs/reference/manifest-fields), and [Schema Conformance](/docs/validation/schema-conformance) covers validating against it.

## Tool Schema

Generated MCP tools follow this structure:

```json
{
  "name": "entity_action",
  "description": "Description of the action",
  "input_schema": {
    "type": "object",
    "properties": { "param_name": { "type": "string", "description": "Parameter description" } },
    "required": ["param_name"]
  },
  "metadata": {
    "action_type": "read",
    "risk_level": "medium",
    "idempotent": true,
    "confirmation_required": true,
    "approval_required": false,
    "side_effects": ["state_change"],
    "preconditions": ["entity exists"],
    "source_intent": "entity.action",
    "source_entity": "entity"
  }
}
```

The same action as a WebMCP tool definition uses `inputSchema`, and puts the AXAG fields under `annotations.axag` alongside the standard hints:

```json
{
  "name": "entity_action",
  "description": "Description of the action",
  "inputSchema": {
    "type": "object",
    "properties": { "param_name": { "type": "string", "description": "Parameter description" } },
    "required": ["param_name"]
  },
  "annotations": {
    "readOnlyHint": true,
    "destructiveHint": false,
    "idempotentHint": true,
    "axag": {
      "action_type": "read",
      "risk_level": "medium",
      "idempotent": true,
      "confirmation_required": true,
      "approval_required": false,
      "source_intent": "entity.action",
      "source_entity": "entity"
    }
  }
}
```

`axag generate` writes the first shape with `--tools` and the second with `--webmcp`. See [Tool Mapping Rules](/docs/reference/tool-mapping-rules).

