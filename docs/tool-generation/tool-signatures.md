---
id: tool-signatures
title: Tool Signatures
sidebar_label: Tool Signatures
slug: /tool-generation/tool-signatures
---
# Tool Signatures

Each MCP tool has a signature consisting of: name, description, input schema, and safety metadata.

## Signature Components

```json title="MCP tool signature — product_search" showLineNumbers
{
  "name": "product_search",
  "description": "Search the product catalogue",
  "input_schema": {
    "type": "object",
    "properties": { "query": { "type": "string", "description": "Search query" } },
    "required": ["query"]
  },
  "metadata": {
    "action_type": "read",
    "risk_level": "none",
    "idempotent": true,
    "confirmation_required": false,
    "approval_required": false,
    "source_intent": "product.search",
    "source_entity": "product"
  }
}
```

The same action in a WebMCP tool definition carries `inputSchema` and `annotations.axag` instead of `input_schema` and `metadata` — the fields are the same. See [Mapping Rules](/docs/tool-generation/mapping-rules).

## Naming Conventions
- Tool names MUST be unique within a tool registry
- A tool's name is its intent with `.` replaced by `_`, so `product.search` becomes `product_search` — snake_case, `entity_verb`, and always traceable back to the annotation
- Names are not configurable: to change a tool's name, change the intent
