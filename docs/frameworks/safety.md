---
id: safety
title: Safety Enforcers
sidebar_label: Safety Enforcers
slug: /frameworks/safety
description: Confirmation, approval, tenant scope, CSRF and audit — in the page and on the server.
keywords: [confirmation, approval, tenant, csrf, audit, enforcement]
---

# Safety Enforcers

An annotation that says `risk-level="critical"` and `confirmation-required="true"` is a promise. Two pieces keep it: middleware in the page, so a cooperative agent behaves and a person gets the chance to refuse; and checks on the server, so the promise holds even when the agent doesn't cooperate.

:::warning The client half is not enforcement
An agent running in the page holds the page's credentials. It can skip the dialog and call your API directly. Client middleware improves what an agent does; only the server decides what it may do.
:::

## In the page

```ts
import { createEnforcers, registerManifest } from '@web-axag/webmcp';

const safety = createEnforcers({
  confirm: { from: 'high', endpoint: '/axag/confirm' },
  tenant: { id: () => session.tenantId },
  csrf: {},
  audit: event => analytics.track('agent_action', event),
});

registerManifest(tools, { signal: route.signal, handlers, ...safety });
```

| Enforcer | What it does |
|----------|--------------|
| `confirm` | Shows the action and its parameters, read-only, in a closed shadow root the page cannot script. Declining refuses the call with `AXAG_CONFIRMATION_MISSING`. With `endpoint`, the answer is exchanged for a single-use token the server can check. |
| `tenant` | Removes tenant parameters from the agent-facing schema — an agent can't choose a tenant — and attaches the session's tenant instead. |
| `csrf` | Attaches the token from `<meta name="csrf-token">`. |
| `audit` | Records every call with its outcome, and **parameter names only**. |

What the enforcers add travels in a reserved `_axag` entry beside the agent's parameters, so a handler can forward it:

```ts
import { axagHeaders, withoutEnvelope } from '@web-axag/webmcp';

const handler = input =>
  fetch('/api/users/deactivate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...axagHeaders(input) },
    body: JSON.stringify(withoutEnvelope(input)),
  });
```

## On the server

```ts
import { createEnforcer } from '@web-axag/server';
import { axagGuard, axagConfirmRoute } from '@web-axag/server/express';
import manifest from './public/.well-known/axag-manifest.json' with { type: 'json' };

const enforcer = createEnforcer({
  manifest,
  approvals: ({ action, actor }) => approvals.exists(action.intent, actor.id),
  csrfOf: request => request.session.csrfToken,
  audit: record => log.info(record),
});

const actorOf = req => ({ id: req.session.userId, tenant: req.session.tenant, roles: req.session.roles });

app.post('/axag/confirm', express.json(), axagConfirmRoute(enforcer, { actorOf }));
app.use('/api', express.json(), axagGuard(enforcer, { actorOf }));
```

Enforcement follows the generated manifest, not anything the caller sent:

| Declared | Checked |
|----------|---------|
| `risk_level` ≥ `high`, or `confirmation_required` | A confirmation token bound to this intent, these parameters and this person; single use; expires |
| `approval_required` | Your `approvals` hook grants it, with `approval_roles` in hand |
| `required_roles` | The actor holds one |
| `scope: "tenant"` | The session has a tenant; a claimed tenant matches; under `tenant_boundary: "strict"`, no parameter points elsewhere |

Refusals carry the codes from [Error Codes](/docs/reference/error-codes) — `AXAG_CONFIRMATION_MISSING` (428), `AXAG_TENANT_BOUNDARY` (403), `AXAG_ROLE_INSUFFICIENT` (403) — so the same refusal reads the same way in the page, in the manifest and in your logs.

Any framework works: `enforcer.check({ intent, parameters, headers, actor })` throws an `AxagError` with the code and status. The Express adapter is a convenience over that one call.

## Confirmation tokens

A token proves a person saw this action with these parameters and agreed:

1. The page asks `POST /axag/confirm` after the person confirms.
2. The server binds a token to the intent, a hash of the parameters and the actor, with a short expiry.
3. The call carries it as `X-AXAG-Confirmation`.
4. The server consumes it once. Replaying it, changing a parameter, or using someone else's is refused.

`MemoryConfirmationStore` suits a single process. Across several, implement `ConfirmationStore` — `issue` and `consume` — over Redis or your database.

## Checking your coverage

```ts
writeFileSync('axag-enforced.json', JSON.stringify({ intents: enforcer.enforcedIntents() }));
```

With `enforcedIntentsPath` set in `.axaglintrc.json`, **AXAG-LINT-037** warns about any high-risk action the server isn't enforcing, and **AXAG-LINT-036** flags a tenant-scoped action that still takes the tenant as a parameter.
