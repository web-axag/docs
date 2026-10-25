---
id: first-generated-tool
title: Your First Generated Tool
sidebar_label: First Generated Tool
slug: /getting-started/first-generated-tool
description: Generate your first MCP tool definition from a Semantic Manifest.
keywords: [MCP, tool generation, quickstart]
---

# Your First Generated Tool

MCP tool definitions are generated from the Semantic Manifest. Each manifest operation becomes a callable tool that agent runtimes can discover and invoke.

You don't write them. [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) emits them on every build, or run `npx @web-axag/cli generate src --tools tools/tool-registry.json` in CI.

## From Manifest to Tool

Given the manifest entry from the previous step, the generated MCP tool definition is:

```json title="MCP tool — product_search" showLineNumbers
{
  "name": "product_search",
  "description": "Search the product catalog by text query with optional filters",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Free-text search query for product name, description, or SKU"
      },
      "category": { "type": "string", "description": "Filter by product category" },
      "price_min": { "type": "number", "description": "Minimum price filter" },
      "price_max": { "type": "number", "description": "Maximum price filter" }
    },
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

## Tool Structure

MCP tool definitions contain:

| Field | Purpose |
|-------|---------|
| `name` | Unique identifier derived from the intent (`product.search` → `product_search`) |
| `description` | Human-readable description for agent planning |
| `input_schema` | JSON Schema for tool parameters |
| `metadata` | Action type, risk, idempotency, confirmation, and the source intent |

## How Agents Use This Tool

An agent runtime:

1. **Discovers** `product_search` in the tool registry
2. **Plans** to use it based on user request (e.g., "Find red running shoes under $100")
3. **Constructs** parameters: `{ "query": "red running shoes", "price_max": 100 }`
4. **Validates** that required parameters are present
5. **Checks safety** — read operation, no risk, no confirmation needed
6. **Executes** the tool
7. **Returns** results to the user

## Next Steps

- [First End-to-End Agent Action](/docs/getting-started/first-end-to-end-agent-action)
- [Tool Generation: Mapping Rules](/docs/tool-generation/mapping-rules)
