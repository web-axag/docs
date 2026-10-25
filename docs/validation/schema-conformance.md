---
id: schema-conformance
title: Schema Conformance
sidebar_label: Schema Conformance
slug: /validation/schema-conformance
---

# Schema Conformance

Schema conformance verifies that AXAG annotations and manifests comply with the formal AXAG schema definition. This ensures interoperability across tools, runtimes, and agent frameworks.

## AXAG JSON Schema

The canonical AXAG manifest schema is a JSON Schema document:

```json title="AXAG Manifest JSON Schema" showLineNumbers
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://axag.org/schema/manifest/1.0.0",
  "title": "AXAG Semantic Manifest",
  "type": "object",
  "required": ["version", "entities"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+(-[a-zA-Z0-9]+)?$"
    },
    "entities": {
      "type": "array",
      "items": { "$ref": "#/$defs/Entity" }
    },
    "metadata": { "$ref": "#/$defs/Metadata" }
  },
  "$defs": {
    "Entity": {
      "type": "object",
      "required": ["name", "actions"],
      "properties": {
        "name": { "type": "string", "pattern": "^[a-z_]+$" },
        "description": { "type": "string" },
        "actions": {
          "type": "array",
          "items": { "$ref": "#/$defs/Action" }
        }
      }
    },
    "Action": {
      "type": "object",
      "required": ["intent", "action_type"],
      "properties": {
        "intent": { "type": "string", "pattern": "^[a-z_]+\\.[a-z_]+$" },
        "action_type": { "enum": ["read", "write", "delete"] },
        "risk_level": { "enum": ["none", "low", "medium", "high", "critical"] },
        "idempotent": { "type": "boolean" },
        "confirmation_required": { "type": "boolean" },
        "approval_required": { "type": "boolean" },
        "parameters": { "$ref": "#/$defs/Parameters" }
      }
    },
    "Parameters": {
      "type": "object",
      "additionalProperties": { "$ref": "#/$defs/ParameterDef" }
    },
    "ParameterDef": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": { "type": "string" },
        "required": { "type": "boolean" },
        "enum": { "type": "array" },
        "minimum": { "type": "number" },
        "maximum": { "type": "number" },
        "maxLength": { "type": "integer" },
        "format": { "type": "string" },
        "default": {}
      }
    },
    "Metadata": {
      "type": "object",
      "properties": {
        "generator": { "type": "string" },
        "generated_at": { "type": "string", "format": "date-time" },
        "source_url": { "type": "string", "format": "uri" }
      }
    }
  }
}
```

## Conformance Levels

### Level 1: Basic
All required fields present. Intent, entity, and action_type declared for every annotation.

### Level 2: Intermediate
Basic + parameters declared with types, risk levels assigned, idempotency declared, scope declared.

### Level 3: Full
Intermediate + preconditions/postconditions, side-effects, approval roles, error semantics, tenant boundaries.

## Validation Commands

```bash
# Generate the manifest and validate it against the schema in one step
npx @web-axag/cli generate src --manifest axag-manifest.json --validate

# Validate a manifest you already have, against a published schema version
curl -sO https://axag.org/schema/v1.1/axag-manifest.schema.json
npx ajv-cli validate -s axag-manifest.schema.json -d axag-manifest.json

# Check annotations against a conformance level
npx @web-axag/cli validate src --level full --strict
```

A manifest also reports the level it reached in its own `conformance` field, computed from what its actions declare.

## Schema Evolution

The AXAG schema follows semantic versioning:
- **Patch** (0.1.x): Bug fixes in schema definitions
- **Minor** (0.x.0): New optional fields added (backward-compatible)
- **Major** (x.0.0): Breaking changes to required fields or structure
