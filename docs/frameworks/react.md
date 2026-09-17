---
id: react
title: React
sidebar_label: React
slug: /frameworks/react
description: Register agent actions for as long as the component is mounted.
---

# React

```bash
npm install @web-axag/react
```

```tsx
import { defineAction, useAxag } from '@web-axag/react';

const deactivateUser = defineAction({
  intent: 'user.deactivate',
  actionType: 'write',
  riskLevel: 'critical',
  confirmationRequired: true,
  requiredParameters: [{ name: 'user_id', type: 'string', format: 'uuid' }],
});

export function DeactivateButton({ userId }: { userId: string }) {
  const axag = useAxag(deactivateUser, { handler: () => api.deactivate(userId) });
  return <button {...axag}>Deactivate</button>;
}
```

The hook returns the `axag-*` attributes and a ref. Spreading them puts the annotation in the DOM — where browser DevTools, the linter's DOM checks and any other reader can see it — and registers the action while the component is mounted.

## Options

| Option | Description |
|--------|-------------|
| `handler` | What the tool does. Without one, the element's form is filled and the control is pressed |
| `middleware` | Wraps every call |
| `enabled` | `false` keeps the action off the agent's list, e.g. by role |
| `onError` | Registration failures, including browsers without WebMCP |

## Components you don't own

```tsx
import { AxagAction } from '@web-axag/react';

<AxagAction spec={deactivateUser} handler={deactivate}>
  <Button variant="danger">Deactivate</Button>
</AxagAction>
```

Renders a `display: contents` span, so it changes no layout. `as` renders a different element.

## Behaviour worth knowing

- **StrictMode is safe.** Each mount gets its own `AbortController`; the double mount registers, unregisters and registers again cleanly.
- **Re-registration is by annotation, not by render.** Changing `riskLevel` re-registers; re-rendering with the same spec doesn't.
- **Unmounting unregisters**, so conditional rendering and route changes keep the agent's tools in step with the screen.

## Build-time extraction

A spec held in a module-level `const` is also read by [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) at build time, so the same action appears in the manifest without running the app. A spec built from props can't be, and is listed under `dynamic_actions`.
