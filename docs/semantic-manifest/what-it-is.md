---
id: what-it-is
title: "Semantic Manifest: What It Is"
sidebar_label: What It Is
slug: /semantic-manifest/what-it-is
---

# What Is the Semantic Manifest?

The Semantic Manifest is a **structured JSON document** generated from AXAG annotations. It serves as the intermediate artifact between annotated UI elements and MCP tool definitions.

## Purpose

The manifest:
1. **Catalogs** all annotated operations in a structured format
2. **Normalizes** annotation data into a consistent schema
3. **Enables discovery** — agents query the manifest to find available operations
4. **Serves as input** for MCP tool generation
5. **Provides a validation target** for CI/CD pipelines

## Structure

```json title="axag-manifest.json — example structure" showLineNumbers
{
  "version": "1.1.0",
  "generated_at": "2026-09-14T00:00:00.000Z",
  "source": {
    "paths": ["src"],
    "tool": "@web-axag/cli",
    "tool_version": "1.1.0"
  },
  "conformance": "intermediate",
  "actions": [
    {
      "intent": "product.search",
      "entity": "product",
      "action_type": "read",
      "operation_id": "product_search",
      "description": "Search the product catalog by text query with optional filters",
      "required_parameters": [
        { "name": "query", "type": "string" }
      ],
      "optional_parameters": [
        { "name": "category", "type": "string" },
        { "name": "price_min", "type": "string" },
        { "name": "price_max", "type": "string" }
      ],
      "risk_level": "none",
      "idempotent": true,
      "scope": "public",
      "source_file": "src/pages/search.html",
      "source_line": 1
    }
  ]
}
```

## Manifest vs Annotations

| Aspect | Annotations | Manifest |
|--------|------------|---------|
| Format | HTML attributes | JSON document |
| Location | Inline in UI code | Standalone file |
| Scope | Single element | Entire page/application |
| Consumer | Build tools, extractors | Agent runtimes, validators |
| Mutability | Changed by developers | Generated from annotations |

The manifest is a **derived artifact**. The annotations are the source of truth.

## Next Steps

- [Why It Exists](/docs/semantic-manifest/why-it-exists)
- [Manifest Schema](/docs/semantic-manifest/manifest-schema)
