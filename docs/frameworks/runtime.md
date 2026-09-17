---
id: runtime
title: Agent Runtime
sidebar_label: Runtime (WebMCP)
slug: /frameworks/runtime
description: Register AXAG actions as WebMCP tools for exactly as long as their UI is on screen.
keywords: [webmcp, modelcontext, runtime, abortsignal, registration]
---

# Agent Runtime

A manifest tells an agent what a page *can* do. The runtime tells it what the page can do **right now** — which actions are on screen, enabled, and permitted for this user.

```bash
npm install @web-axag/webmcp
```

## Registration follows the UI

```ts
import { registerManifest } from '@web-axag/webmcp';
import { tools } from 'virtual:axag/tools';

const route = new AbortController();
registerManifest(tools, { signal: route.signal, handlers });

// Leaving the route takes its tools with it.
route.abort();
```

The `AbortSignal` is the whole lifecycle: [WebMCP](https://github.com/webmachinelearning/webmcp) has no `unregisterTool`, and aborting the signal you registered with is how a tool goes away. Tie that signal to whatever owns the action — a component, a route, a dialog — and the agent's list can't drift from the screen.

:::note Why not register everything at startup
The earlier `provideContext()` call was removed from the specification in March 2026 because it encouraged registering every tool up front, leaving ghost tools pointing at UI that had since unmounted. Registration scoped to a signal is the replacement.
:::

## Visibility and operability

AXAG distinguishes [visibility from operability](/docs/concepts/visibility-vs-operability). The runtime enforces it: an action is unregistered while its element is

- disabled (including through a disabled `<fieldset>`),
- `hidden`, `inert`, `aria-hidden="true"` or `aria-disabled="true"`,
- or no longer in the document,

and registered again when the element becomes operable. One `MutationObserver` serves every registration on the page.

This is what keeps an agent from being offered a button a person couldn't press.

## Executing an action

Without a handler, the runtime does what a person would: it fills the form the annotation points at using the tool's arguments, then presses the control.

- Parameters are matched by the name in the manifest, so `display_name` finds `displayName`.
- Values are assigned through the prototype setter, so React and Vue notice the change.
- Checkboxes, radio groups and multi-selects are set by value.

Pass a `handler` to call your own code instead.

## Middleware

```ts
registerManifest(tools, {
  signal: route.signal,
  middleware: [requireConfirmation, withTenantScope, auditLog],
});
```

Middleware wraps every invocation, in order, and can refuse the call. Safety enforcement belongs here rather than inside each handler.

:::warning Client-side checks are not enforcement
An agent running in the page can call your API directly. Middleware improves what the agent does; the server still has to enforce confirmation, approval and tenant boundaries.
:::

## Pages without a build step

```ts
import { registerDocument } from '@web-axag/webmcp';
registerDocument({ signal: controller.signal });
```

Reads the annotated elements on the page, harvesting parameters from their forms. Costs a DOM scan; prefer `registerManifest` with build-time tools where you have a bundler.

## Browser support

The runtime uses `document.modelContext`, falling back to `navigator.modelContext` (deprecated in Chromium 150). Where neither exists, registration reports through `onError` instead of throwing, so a page that annotates for agents still works for people.

## Framework bindings

| Framework | Package | Reach for |
|-----------|---------|-----------|
| React | [`@web-axag/react`](/docs/frameworks/react) | `useAxag`, `<AxagAction>` |
| Vue | [`@web-axag/vue`](/docs/frameworks/vue) | `useAxag`, `v-axag` |
| Angular | [`@web-axag/angular`](/docs/frameworks/angular) | `[axag]` directive |
