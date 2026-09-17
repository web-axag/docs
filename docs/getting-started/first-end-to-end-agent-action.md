---
id: first-end-to-end-agent-action
title: First End-to-End Agent Action
sidebar_label: End-to-End Agent Action
slug: /getting-started/first-end-to-end-agent-action
description: Walk through a complete agent interaction powered by AXAG.
keywords: [end-to-end, agent action, complete flow]
---

# First End-to-End Agent Action

This page walks through a complete agent interaction — from user request to executed operation — powered by AXAG semantic contracts.

## Scenario

A user asks their AI agent: *"Find me blue running shoes under $80."*

## Step 1: Agent Discovers Available Tools

The agent queries the MCP Tool Registry and finds:

```json title="Tool registry — product_search" showLineNumbers
{
  "name": "product_search",
  "description": "Search the product catalog by text query with optional filters",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "category": { "type": "string" },
      "price_min": { "type": "number" },
      "price_max": { "type": "number" }
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

## Step 2: Agent Plans the Invocation

The agent determines:
- Tool: `product_search`
- Parameters: `query = "blue running shoes"`, `price_max = 80`
- Safety: Read-only, no risk, no confirmation needed → proceed directly

## Step 3: Agent Validates Parameters

- ✅ `query` is present and is a string
- ✅ `price_max` is a number
- ✅ No preconditions to check
- ✅ Safety allows direct execution

## Step 4: Agent Executes

The agent invokes `product_search` with:
```json title="Agent invocation — structured parameters"
{
  "query": "blue running shoes",
  "price_max": 80
}
```

## Step 5: Agent Returns Results

The operation returns matching products. The agent presents them to the user with relevant details.

## How the Tool Reached the Agent

Nothing above was hand-written for the agent. The tool came from the annotation, by one of two routes:

1. **At build time**, [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) read the annotated search form and emitted the tool alongside the manifest.
2. **In the page**, [`@web-axag/webmcp`](/docs/frameworks/runtime) registered it with the browser's `document.modelContext` while the search form was on screen — and unregistered it when the person navigated away.

An agent running in the browser sees it there. An agent outside the browser — a desktop client — reaches the same tool through [`@web-axag/bridge`](/docs/frameworks/bridge).

When the agent called `product_search`, the runtime filled the form with those parameters and pressed Search, exactly as a person would. An app can pass its own handler instead, to call its API directly.

## What Made This Possible

Without AXAG, the agent would need to:
1. Parse the page DOM to find a search input
2. Guess that the input labeled "Search" is for products
3. Figure out how to apply price filters (dropdown? slider? text input?)
4. Submit the form by simulating a button click
5. Wait for dynamic content to load
6. Scrape the results from rendered DOM elements

With AXAG, the agent:
1. Reads structured tool definitions
2. Constructs typed parameters
3. Invokes a semantic operation
4. Receives structured results

**No scraping. No guessing. No brittle selectors.**

## Next Steps

- [Implementation Prerequisites](/docs/getting-started/implementation-prerequisites)
- [The SDK](/docs/getting-started/sdk)
- [Core Concepts](/docs/concepts/agent-experience)
- [Authoring Guide](/docs/authoring-guide/annotating-buttons)
