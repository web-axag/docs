---
id: build-time-compilation
title: Build-Time Compilation
sidebar_label: Build-Time Compilation
slug: /tool-generation/build-time-compilation
description: Generate the manifest and WebMCP tools from your bundler, on every build.
keywords: [vite, webpack, rollup, unplugin, build, webmcp, virtual module]
---

# Build-Time Compilation

A bundler plugin reads annotations while your app builds, so the manifest and the agent-facing tools are produced from the same sources, at the same moment, as the code that ships.

```bash
npm install -D @web-axag/compiler
```

```ts title="vite.config.ts"
import { defineConfig } from 'vite';
import axag from '@web-axag/compiler/vite';

export default defineConfig({ plugins: [axag()] });
```

The plugin is built on [unplugin](https://github.com/unjs/unplugin), so the same implementation ships for Vite, Rollup, webpack, Rspack and esbuild — import from `@web-axag/compiler/webpack`, `/rollup`, `/rspack` or `/esbuild`.

## What a build produces

| Output | Purpose |
|--------|---------|
| `.well-known/axag-manifest.json` | The Semantic Manifest, at the [discovery](/docs/semantic-manifest/discovery-model) location |
| `axag-tools.webmcp.json` | The same actions as WebMCP tool definitions |
| `virtual:axag/tools` | A module your app imports to register the tools |

```ts title="src/agent.ts"
import { tools, manifest, dynamicActions } from 'virtual:axag/tools';
```

Nothing from the compiler ends up in your bundle: the parsers run at build time, and what reaches the browser is the JSON it produced.

In dev, Vite serves both files from memory and recompiles when an annotated file changes.

## Sources it reads

| Source | Notes |
|--------|-------|
| `.html`, `.htm` | Plain HTML |
| `.jsx`, `.tsx` | Attributes, and `axag={spec}` objects |
| `.vue` | The `<template>` block |
| `*.component.html` | Angular templates |

## Action specs

Components can carry the annotation as an object instead of a string. `defineAction` is an identity function — it exists so the value has a name the compiler recognises:

```tsx title="src/admin/actions.ts"
import { defineAction } from '@web-axag/core';

export const deactivateUser = defineAction({
  intent: 'user.deactivate',
  actionType: 'write',
  riskLevel: 'critical',
  confirmationRequired: true,
  approvalRoles: ['security_admin'],
  requiredParameters: [{ name: 'user_id', type: 'string', format: 'uuid' }],
  handler: async ({ user_id }) => api.deactivate(user_id),
});
```

```tsx
<button axag={deactivateUser}>Deactivate</button>
```

The compiler reads a spec when it is a module-level `const` or a `defineAction({...})` call, in that file or one it imports with a relative path. The `handler` is ignored: it belongs to the runtime, not the manifest.

## Dynamic actions

A value the compiler can't read — a prop, something built at runtime — can't appear in the manifest, because its intent isn't known until the page runs. Those elements are listed instead:

```json title="axag-manifest.json"
{
  "actions": [],
  "dynamic_actions": [
    { "source_file": "src/Admin.tsx", "source_line": 16, "reason": "<button> has a dynamic axag value that could not be read at build time" }
  ]
}
```

A runtime reading this manifest knows the list of actions is incomplete for that page. `axag-lint` reports the same elements as **AXAG-LINT-033** (info), so you can find them without reading the manifest.

## In CI

Without a bundler, the CLI runs the same compiler:

```bash
npx @web-axag/cli generate src --manifest public/.well-known/axag-manifest.json --validate
```

## Next Steps

- [Tool Registry Generation](/docs/tool-generation/tool-registry-generation)
- [Runtime Consumption Patterns](/docs/tool-generation/runtime-consumption-patterns)

## What the Plugin Doesn't Do

`axag-schema` bindings — a Zod export or an OpenAPI operation — are resolved by the CLI, not by the plugin. A bundler build harvests form markup and reads declared parameters, but an action whose parameters come only from a bound schema will appear without them. Run `npx @web-axag/cli generate src --manifest axag-manifest.json` where those bindings matter. See [Schema Harvesting](/docs/semantic-manifest/schema-harvesting#where-bindings-are-resolved).

