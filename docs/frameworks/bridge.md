---
id: bridge
title: Browsers Without WebMCP
sidebar_label: Shim & Bridge
slug: /frameworks/bridge
description: A registry for browsers that lack WebMCP, and a local relay that lets any MCP client reach a tab's tools.
keywords: [shim, polyfill, bridge, mcp, relay, websocket]
---

# Browsers Without WebMCP

WebMCP is a draft. Annotating a page for agents shouldn't wait for it to ship everywhere, so two small pieces cover the gap: a registry where the browser has none, and a relay that connects a tab to agents that live outside it.

## The shim

```bash
npm install @web-axag/shim
```

```ts
import { installShim } from '@web-axag/shim';

installShim(); // does nothing where the browser has its own implementation
```

It implements the part of the draft a page calls — `registerTool(tool, { signal })`, with abort unregistering — so [`@web-axag/webmcp`](/docs/frameworks/runtime) and the framework bindings work unchanged. Under 2 KB gzipped, no dependencies.

Installing it connects no agent. It is the socket a connection plugs into.

## The bridge

```bash
npx axag-bridge --origin https://app.example.com
```

```text
[axag-bridge] listening on ws://127.0.0.1:53422
[axag-bridge] pairing code: 7f3a91c2
```

```ts
import { connectBridge } from '@web-axag/bridge/client';

connectBridge({ url: 'ws://127.0.0.1:53422', pairingCode: '7f3a91c2' });
```

Any MCP client can now list and call that tab's tools, and the list changes as the person navigates.

```text
browser tab  ──websocket──▶  axag-bridge  ──MCP (stdio)──▶  agent
```

### Why a relay rather than a server in the page

A tab has no address an agent can dial, and isn't running when the agent starts. So the tab connects **out** to a small local process, and that process is the MCP server the agent talks to.

Calls run **in the tab**, in the session the person is already signed into. No credentials pass through the relay, and the page's [safety enforcers](/docs/frameworks/safety) wrap every call — a bridged agent meets the same confirmation and tenant checks as one running inside the browser.

### What keeps it closed

- **Loopback only** — the relay binds `127.0.0.1`.
- **A pairing code** printed in the terminal and copied into the page.
- **An origin allowlist** via `--origin`, repeatable.
- **One tab at a time** — a second connection is refused, not silently promoted.
- **Calls expire** rather than hanging the agent when a tab stops answering.

### Configuring an MCP client

```json title="MCP server configuration"
{
  "mcpServers": {
    "axag-bridge": { "command": "npx", "args": ["axag-bridge", "--origin", "https://app.example.com"] }
  }
}
```

## Which to use

| Situation | Reach for |
|-----------|-----------|
| Browser ships WebMCP | Nothing extra — [`@web-axag/webmcp`](/docs/frameworks/runtime) uses it |
| Browser has no WebMCP, agent runs in the page | `@web-axag/shim` |
| Agent runs outside the browser (desktop client, terminal) | `@web-axag/shim` + `@web-axag/bridge` |

MCP is an open protocol, and its remote transport is Streamable HTTP; the standalone SSE transport is deprecated. The bridge speaks stdio by default because that is what desktop clients configure most easily.
