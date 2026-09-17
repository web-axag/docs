---
id: implementation-prerequisites
title: Implementation Prerequisites
sidebar_label: Prerequisites
slug: /getting-started/implementation-prerequisites
description: What you need before implementing AXAG in your product.
keywords: [prerequisites, requirements, setup]
---

# Implementation Prerequisites

Before implementing AXAG, ensure the following prerequisites are in place.

## Technical Prerequisites

1. **Frontend framework** — Any. Annotations are HTML attributes; React, Vue and Angular also have [bindings](/docs/getting-started/sdk).
2. **A way to produce the manifest** — a bundler that can run [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) (Vite, webpack, Rollup, Rspack, esbuild), or `axag generate` in CI for a site without one.
3. **Somewhere to serve JSON** — the manifest belongs at `/.well-known/axag-manifest.json`.
4. **CI/CD pipeline** — for `axag-lint` on each pull request.
5. **Server-side enforcement** — for any action at `high` risk or above, a server that can check confirmation, approval and tenant scope, such as [`@web-axag/server`](/docs/frameworks/safety).

:::note Getting the tools
The SDK is on npm under the `@web-axag` scope — see [The SDK](/docs/getting-started/sdk#availability) for which package does what.
:::

## Organizational Prerequisites

1. **Vocabulary ownership** — Identify who owns the intent and entity vocabulary for your product
2. **Governance model** — Define who reviews and approves changes to annotations
3. **Agent consumer identification** — Know which agents will use your tools: one in the browser through WebMCP, or one outside it through the [bridge](/docs/frameworks/bridge)
4. **Risk classification policy** — Define how your organization classifies operation risk levels

## Recommended Knowledge

- Familiarity with HTML data attributes
- Understanding of JSON Schema
- Basic knowledge of the Model Context Protocol (MCP)
- Understanding of your product's domain entities and operations

## Next Steps

- [Core Concepts](/docs/concepts/agent-experience)
- [Authoring Guide](/docs/authoring-guide/annotating-buttons)
- [Specification Overview](/docs/specification/overview)
