---
id: generate-semantic-manifest
title: "Tutorial: Generate a Semantic Manifest"
sidebar_label: Generate Semantic Manifest
slug: /tutorials/generate-semantic-manifest
---

# Tutorial: Generate a Semantic Manifest

This tutorial walks through generating an AXAG Semantic Manifest from annotated HTML/JSX source files.

## Prerequisites
- Source files with AXAG annotations (see [Add AXAG to a Page](/docs/tutorials/add-axag-to-page))
- Node.js 18+

## Step 1: Install the CLI

```bash title="Install AXAG CLI"
npm install -D @web-axag/cli
```

## Step 2: Scan Source Files

```bash title="Scan & generate manifest"
npx @web-axag/cli scan src/ --no-interactive --manifest axag-manifest.json --validate
```

The scanner:
1. Finds `.html`, `.htm`, `.jsx` and `.tsx` files (skipping `node_modules`, `dist`, `build`)
2. Reads every element that declares `axag-intent`
3. Builds one action per intent, sorted by intent, and warns about duplicates
4. Writes the manifest and, with `--validate`, checks it against the JSON Schema

## Step 3: Review the Generated Manifest

```json title="axag-manifest.json" showLineNumbers
{
  "version": "1.1.0",
  "generated_at": "2026-09-14T10:30:00.000Z",
  "source": { "paths": ["/app/src"], "tool": "@web-axag/cli", "tool_version": "1.1.1" },
  "conformance": "intermediate",
  "actions": [
    {
      "intent": "product.search",
      "entity": "product",
      "action_type": "read",
      "operation_id": "product_search",
      "description": "Search the product catalog",
      "required_parameters": [{ "name": "query", "type": "string" }],
      "optional_parameters": [],
      "risk_level": "none",
      "idempotent": true,
      "source_file": "/app/src/SearchPage.tsx",
      "source_line": 14
    }
  ]
}
```

## Step 4: Check the Output

With `--validate`, the scan ends with:
```bash title="Validation output"
✔ Manifest written to /app/axag-manifest.json
  Actions: 12
  Conformance: intermediate
✔ Manifest passes schema validation ✅
```

Any `AXAG-CORE-*` warnings (invalid enum values, invalid JSON arrays, duplicate intents) are printed with the file and line to fix.

## Step 5: Or generate it from your bundler

An app with a bundler doesn't need a separate scan step. [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) reads the same sources on every build and writes the manifest into the output:

```ts title="vite.config.ts"
import axag from '@web-axag/compiler/vite';
export default { plugins: [axag()] };
```

`axag scan` and `axag generate` stay useful for CI checks and for pages that aren't part of a bundled app.

## Step 6: Serve the Manifest

Make the manifest discoverable by agents:

### Option A: Well-Known URL
```http title="Well-known endpoint"
https://yoursite.com/.well-known/axag-manifest.json
```

### Option B: HTTP Header
```http title="HTTP Link header"
Link: </.well-known/axag-manifest.json>; rel="axag-manifest"
```

### Option C: HTML Meta Tag
```html title="HTML meta tag"
<meta name="axag-manifest" content="/.well-known/axag-manifest.json">
```

## Step 7: Automate in CI

```yaml title=".github/workflows/axag.yml" showLineNumbers
# .github/workflows/axag.yml
- name: Generate and validate manifest
  run: npx @web-axag/cli generate src --manifest axag-manifest.json --validate

- name: Deploy manifest
  run: cp axag-manifest.json public/.well-known/axag-manifest.json
```

## Next Steps
- [Generate MCP Tools](/docs/tutorials/generate-mcp-tools) from the manifest
- [Add Validation to CI](/docs/tutorials/add-validation-to-ci)
