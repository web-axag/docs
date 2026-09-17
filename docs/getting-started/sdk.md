---
id: sdk
title: The AXAG SDK
sidebar_label: The SDK
slug: /getting-started/sdk
description: The thirteen packages that read, compile, lint, run and enforce AXAG annotations — and which ones you need.
keywords: [sdk, packages, npm, compiler, runtime, react, vue, angular, server, bridge, lint, cli]
---

# The AXAG SDK

Annotations describe what a page can do. The SDK is what reads them, turns them into tools, registers those tools with an agent, and checks that the promises they make are kept.

Source: [github.com/web-axag/sdk](https://github.com/web-axag/sdk)

## Which packages you need

| You want to… | Install |
|--------------|---------|
| Check annotations in CI | `@web-axag/lint` |
| Generate a manifest without a bundler | `@web-axag/cli` |
| Generate a manifest and tools on every build | `@web-axag/compiler` |
| Register tools with an agent in the browser | `@web-axag/webmcp` |
| …from React, Vue or Angular components | `@web-axag/react`, `@web-axag/vue` or `@web-axag/angular` |
| Enforce confirmation, approval and tenant scope | `@web-axag/server` (plus `@web-axag/webmcp` in the page) |
| Take parameters from a Zod schema or OpenAPI | `@web-axag/schema-zod` or `@web-axag/schema-openapi` |
| Support browsers without WebMCP | `@web-axag/shim` |
| Let a desktop agent reach a browser tab | `@web-axag/bridge` |
| Run a one-off check or build, with no install | `npx axag-lint`, `npx axag` |

`@web-axag/core` sits under all of them; you rarely install it directly.

## The packages

### Authoring and checking

| Package | What it does |
|---------|--------------|
| [`@web-axag/core`](https://github.com/web-axag/sdk/tree/main/packages/core) | The shared model: vocabulary, macro parser, annotation reader, [parameter harvesting](/docs/semantic-manifest/schema-harvesting), manifest and tool generation. Every other package reads annotations through it, so they all agree. |
| [`@web-axag/lint`](https://github.com/web-axag/sdk/tree/main/packages/lint) | 37 rules over HTML, JSX, TSX and Vue. SARIF for code scanning, baselines for existing codebases, and a [GitHub Action](/docs/validation/ci-linting). |
| [`@web-axag/cli`](https://github.com/web-axag/sdk/tree/main/packages/cli) | `axag generate`, `axag validate`, `axag fmt` between [macro](/docs/specification/macro-syntax) and longhand, and `axag scan` to infer annotations for an unannotated site. |

### Commands

| Package | What it does |
|---------|--------------|
| [`axag`](https://www.npmjs.com/package/axag) | The `axag` command, unscoped so `npx axag …` works without an install. Depends on `@web-axag/cli` and runs its binary; it holds no logic of its own. |
| [`axag-lint`](https://www.npmjs.com/package/axag-lint) | The `axag-lint` command, the same wrapper arrangement over `@web-axag/lint`. |

Installing `@web-axag/cli` or `@web-axag/lint` as a dev dependency gives you the same commands — these two exist so the one-off `npx` form in this documentation works as written.

### Building

| Package | What it does |
|---------|--------------|
| [`@web-axag/compiler`](https://github.com/web-axag/sdk/tree/main/packages/compiler) | A plugin for Vite, Rollup, webpack, Rspack and esbuild. Emits the manifest and WebMCP tools on every build, reading HTML, JSX, Vue and Angular templates. See [Build-Time Compilation](/docs/tool-generation/build-time-compilation). |
| [`@web-axag/schema-zod`](https://github.com/web-axag/sdk/tree/main/packages/schema-zod) | Uses a Zod 4 schema as an action's parameters. |
| [`@web-axag/schema-openapi`](https://github.com/web-axag/sdk/tree/main/packages/schema-openapi) | Uses an OpenAPI 3.0/3.1 operation as an action's parameters. |

### Running

| Package | What it does |
|---------|--------------|
| [`@web-axag/webmcp`](https://github.com/web-axag/sdk/tree/main/packages/webmcp) | Registers actions as WebMCP tools for exactly as long as their UI is on screen, and ships the in-page [safety enforcers](/docs/frameworks/safety). See [Agent Runtime](/docs/frameworks/runtime). |
| [`@web-axag/react`](https://github.com/web-axag/sdk/tree/main/packages/react) | `useAxag` and `<AxagAction>`. See [React](/docs/frameworks/react). |
| [`@web-axag/vue`](https://github.com/web-axag/sdk/tree/main/packages/vue) | `useAxag` and `v-axag`. See [Vue](/docs/frameworks/vue). |
| [`@web-axag/angular`](https://github.com/web-axag/sdk/tree/main/packages/angular) | The `[axag]` directive. See [Angular](/docs/frameworks/angular). |

### Enforcing and bridging

| Package | What it does |
|---------|--------------|
| [`@web-axag/server`](https://github.com/web-axag/sdk/tree/main/packages/server) | Checks confirmation tokens, approval, roles and tenant boundaries on the server, where an agent can't skip them. See [Safety Enforcers](/docs/frameworks/safety). |
| [`@web-axag/shim`](https://github.com/web-axag/sdk/tree/main/packages/shim) | A `document.modelContext` for browsers that don't have one. |
| [`@web-axag/bridge`](https://github.com/web-axag/sdk/tree/main/packages/bridge) | `npx axag-bridge` relays a tab's tools to any MCP client. See [Shim & Bridge](/docs/frameworks/bridge). |

## How they fit together

```text
 your markup / components
        │
        ├── axag-lint ─────────────── checks, in CI
        │
        ├── @web-axag/compiler ────────── manifest + tools, at build
        │        (schema-zod, schema-openapi add parameters)
        │
        └── @web-axag/webmcp ──────────── registers tools, in the page
                 │   (react / vue / angular bind them to components)
                 │
                 ├── document.modelContext ── the agent in the browser
                 │        (@web-axag/shim where the browser has none)
                 │
                 └── @web-axag/bridge ─────────── agents outside the browser

 the call reaches your API
        └── @web-axag/server ──────────── enforces what the annotation declared
```

## Availability

The thirteen `@web-axag` packages are published on npm at **1.1.0**, alongside the two unscoped commands `axag` and `axag-lint` at the same version. Every package name on this page is the name you install.

```bash
npm install -D @web-axag/lint @web-axag/cli
npm install @web-axag/webmcp
```

The two command-line tools are also published under their bare command names, so they run without an install:

```bash
npx axag-lint src
npx axag generate src --manifest axag-manifest.json
```

`axag` and `axag-lint` contain no logic — each one depends on `@web-axag/cli` or `@web-axag/lint` and runs its binary. Install the scoped package when you want the library too.

:::note Renamed in 1.1
`@web-axag/axag-cli` and `@web-axag/axag-lint` are the earlier names of `@web-axag/cli` and `@web-axag/lint`. They are deprecated and stop at their pre-1.1 versions; switch the dependency name to get 1.1.
:::

To work on the SDK itself, build it from source:

```bash
git clone https://github.com/web-axag/sdk.git
cd axag-sdk
pnpm install && pnpm build
```
