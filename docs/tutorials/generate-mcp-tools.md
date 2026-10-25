---
id: generate-mcp-tools
title: "Tutorial: Generate MCP Tools"
sidebar_label: Generate MCP Tools
slug: /tutorials/generate-mcp-tools
---

# Tutorial: Generate MCP Tools

This tutorial shows how to generate Model Context Protocol (MCP) tool definitions from an AXAG Semantic Manifest.

## Prerequisites
- A valid `axag-manifest.json` (see [Generate Semantic Manifest](/docs/tutorials/generate-semantic-manifest))
- Node.js 18+

## Step 1: Generate Tool Definitions

```bash title="Generate MCP tools from manifest"
npx @web-axag/cli generate-tools --manifest axag-manifest.json --output tools/
```

This writes a single registry file, `tools/tool-registry.json`, and prints each tool with its parameter count and risk level:

```bash title="Generated registry"
tools/
└── tool-registry.json   # { schema_version, generated_at, source_manifest, tools: [...] }
```

## Step 2: Review a Generated Tool

```json title="tools/tool-registry.json — tools[0]" showLineNumbers
{
  "name": "product_search",
  "description": "Search the product catalog",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "category": { "type": "string" },
      "price_min": { "type": "number", "minimum": 0 },
      "price_max": { "type": "number", "minimum": 0 }
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

## Step 3: Register Tools with MCP Server

The registry's `input_schema` is plain JSON Schema, so it can be served directly with the low-level MCP SDK server:

```typescript title="server.ts" showLineNumbers
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import registry from "./tools/tool-registry.json" with { type: "json" };

const server = new Server(
  { name: "my-axag-server", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: registry.tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.input_schema,
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Route to your API based on the tool name
  const result = await apiRouter.handle(request.params.name, request.params.arguments ?? {});
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
```

## Step 4: Test with an Agent

```typescript title="agent-client.ts"
// Agent discovers and uses the tool
const { tools } = await client.listTools();
const searchTool = tools.find((t) => t.name === "product_search");

const result = await client.callTool({
  name: "product_search",
  arguments: { query: "wireless headphones", price_max: 100 },
});

console.log(result.content); // Structured product data
```

## Step 5: Safety-Aware Execution

Safety fields live in each tool's `metadata`. Check them before dispatching a call:

```typescript title="safe-execution.ts" showLineNumbers
async function safeToolCall(name, args) {
  const tool = registry.tools.find((t) => t.name === name);

  // Check confirmation requirement
  if (tool.metadata.confirmation_required) {
    const confirmed = await promptUser(
      `This action requires confirmation: ${tool.description}. Proceed?`
    );
    if (!confirmed) return { error: "User declined confirmation" };
  }

  // Check approval requirement
  if (tool.metadata.approval_required) {
    const approval = await requestApproval(tool.metadata.approval_roles ?? []);
    if (!approval) return { error: "Approval not granted" };
  }

  return await client.callTool({ name, arguments: args });
}
```

:::warning
Client-side checks only guide a cooperative agent. Enforce confirmation, approval and tenant boundaries on the server as well.
:::

## Next Steps
- [Add Validation to CI](/docs/tutorials/add-validation-to-ci)
- Review the [Tool Mapping Rules Reference](/docs/reference/tool-mapping-rules)
