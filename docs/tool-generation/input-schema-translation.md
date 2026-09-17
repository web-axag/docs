---
id: input-schema-translation
title: Input Schema Translation
sidebar_label: Input Schema
slug: /tool-generation/input-schema-translation
---
# Input Schema Translation

Manifest parameters translate to JSON Schema: `input_schema` in the tool registry, `inputSchema` in WebMCP tool definitions. Required parameters are listed in the schema's `required` array.

## Type Mapping

| AXAG Parameter | JSON Schema |
|----------------|-------------|
| `"type": "string"` | `"type": "string"` |
| `"type": "number"` | `"type": "number"` |
| `"type": "integer"` | `"type": "integer"` |
| `"type": "boolean"` | `"type": "boolean"` |
| `"type": "array"`, `items` | `"type": "array"`, `"items": {...}` |
| `"type": "object"`, `properties` | `"type": "object"`, `"properties": {...}` |

## Constraint Translation

| AXAG Constraint | JSON Schema |
|----------------|-------------|
| `min` | `"minimum"` |
| `max` | `"maximum"` |
| `minLength` | `"minLength"` |
| `maxLength` | `"maxLength"` |
| `pattern` | `"pattern"` |
| `enum` | `"enum"` |
| `default` | `"default"` |
| `description` | `"description"` |
| `format: "date"` | `"format": "date"` |
| `format: "datetime"` | `"format": "date-time"` |
| `format: "url"` | `"format": "uri"` |
| `format: "email"`, `"uuid"` | `"format"` unchanged |

## Example

```json title="Manifest parameter"
{ "name": "check_in", "type": "string", "format": "datetime" }
```

```json title="JSON Schema property"
{
  "check_in": { "type": "string", "format": "date-time" }
}
```
