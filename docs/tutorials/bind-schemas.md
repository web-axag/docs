---
id: bind-schemas
title: "Tutorial: Bind Zod or OpenAPI Schemas"
sidebar_label: Bind Zod or OpenAPI Schemas
slug: /tutorials/bind-schemas
---

# Tutorial: Bind Zod or OpenAPI Schemas

If your API already validates requests with Zod or describes them in OpenAPI, point AXAG at that definition instead of declaring parameters again. AXAG attributes then only carry intent and safety.

## Prerequisites
- `@web-axag/cli` installed (see [Generate a Semantic Manifest](/docs/tutorials/generate-semantic-manifest))
- For Zod: `zod@4` in your project

## Option A: a Zod schema

```ts title="src/schemas/user.ts"
import { z } from 'zod';

export const InviteUser = z
  .object({
    email: z.email().describe('Work email'),
    role: z.enum(['admin', 'member']).default('member'),
    seats: z.number().int().min(1).max(500),
  })
  .describe('Invite a user to the workspace');
```

Bind it on the element:

```html title="src/pages/team.html"
<form axag="write:user.invite!medium?idempotent=false" axag-schema="zod:./src/schemas/user.ts#InviteUser">
  <input name="email" type="email" aria-label="Email">
  <button type="submit">Invite</button>
</form>
```

Paths resolve from the directory of `axag.config.*`, or the current directory when there is none. TypeScript schema files are loaded directly; no build step is needed.

## Option B: an OpenAPI operation

```yaml title="openapi.yaml"
paths:
  /users/{userId}/deactivate:
    post:
      operationId: deactivateUser
      summary: Deactivate a user and revoke their sessions
      x-axag-risk-level: critical
      parameters:
        - { name: userId, in: path, required: true, schema: { type: string, format: uuid } }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [reason]
              properties:
                reason: { type: string, enum: [offboarding, security, other] }
```

Bind it in config so the markup stays unchanged:

```json title="axag.config.json"
{
  "openapi": "./openapi.yaml",
  "bindings": {
    "user.deactivate": "openapi:deactivateUser"
  }
}
```

Path and query parameters and the `application/json` body are used; header and cookie parameters are not. Local `$ref`s and `allOf` are resolved.

## Generate the manifest

```bash
npx @web-axag/cli scan src --no-interactive --manifest axag-manifest.json --validate
```

```json title="axag-manifest.json — user.invite"
{
  "intent": "user.invite",
  "entity": "user",
  "action_type": "write",
  "operation_id": "user_invite",
  "description": "Invite a user to the workspace",
  "required_parameters": [
    { "name": "email", "type": "string", "format": "email", "description": "Work email", "source": "zod" },
    { "name": "seats", "type": "integer", "min": 1, "max": 500, "source": "zod" }
  ],
  "optional_parameters": [
    { "name": "role", "type": "string", "enum": ["admin", "member"], "default": "member", "source": "zod" }
  ],
  "risk_level": "medium",
  "idempotent": false
}
```

The schema's description was used because the annotation declares none. Zod's email `pattern` is also emitted and is left out here for brevity.

A binding that can't be loaded (missing file or export, unknown operation) is reported as an `AXAG-CORE-006` warning, and the action falls back to declared and harvested parameters.

## Keep the form and the schema in step

Lint with the generated manifest to catch drift between the form and the API:

```bash
npx axag-lint src --manifest axag-manifest.json
```

**AXAG-LINT-030** reports fields that are required in one and optional in the other, have different types, or allow different values.

## Next Steps
- [Schema Harvesting](/docs/semantic-manifest/schema-harvesting) — precedence rules in full
- [Generate MCP Tools](/docs/tutorials/generate-mcp-tools)
