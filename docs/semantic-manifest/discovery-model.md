---
id: discovery-model
title: Manifest Discovery Model
sidebar_label: Discovery Model
slug: /semantic-manifest/discovery-model
---
# Manifest Discovery Model

An agent finds out what a site can do in one of two ways: the page registers tools with it directly, or the agent fetches the site's manifest.

## In the Page: WebMCP Registration

An agent running in the browser doesn't need to fetch anything. [`@web-axag/webmcp`](/docs/frameworks/runtime) registers each annotated action with `document.modelContext` while its element is on screen, and removes it when the element goes. This is the most precise form of discovery, because the tool list always matches what the person can see.

## Outside the Page: The Manifest

Agents that don't run in the page — crawlers, server-side agents, tool registries — fetch the manifest.

### Well-Known URL
```
https://example.com/.well-known/axag-manifest.json
```

`@web-axag/compiler` writes the manifest here on every build, and the WebMCP tool definitions to `/axag-tools.webmcp.json`.

### HTTP Header
```
Link: </.well-known/axag-manifest.json>; rel="axag-manifest"
```

### Meta Tag
```html
<meta name="axag-manifest" content="/.well-known/axag-manifest.json" />
```

The header and the meta tag let a site serve its manifest from another path, or point different sections at different manifests. Neither is added for you; set them in your server or HTML template.

### Service Registry
For microservice architectures, manifests can be registered in a central manifest registry.

## Discovery Flow
1. Agent navigates to a domain
2. In the page, agent reads the tools registered with `document.modelContext`
3. Otherwise, agent checks for the HTTP header or meta tag, then the well-known URL
4. Agent fetches the manifest
5. Agent generates or consumes tool definitions

A manifest lists what can be *built* from the source. Actions listed in its `dynamic_actions` exist only at runtime, so an agent that needs those must use the page.
