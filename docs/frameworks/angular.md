---
id: angular
title: Angular
sidebar_label: Angular
slug: /frameworks/angular
description: Register agent actions for as long as the element is in the view.
---

# Angular

```bash
npm install @web-axag/angular
```

```ts
import { Component } from '@angular/core';
import { AxagDirective } from '@web-axag/angular';
import { defineAction } from '@web-axag/core';

@Component({
  standalone: true,
  imports: [AxagDirective],
  template: `<button [axag]="deactivateUser" [axagHandler]="deactivate">Deactivate</button>`,
})
export class UserRowComponent {
  deactivateUser = defineAction({
    intent: 'user.deactivate',
    actionType: 'write',
    riskLevel: 'critical',
    approvalRequired: true,
    approvalRoles: ['security_admin'],
    requiredParameters: [{ name: 'user_id', type: 'string', format: 'uuid' }],
  });

  deactivate = ({ user_id }: { user_id: string }) => this.api.deactivate(user_id);
}
```

## Inputs

| Input | Description |
|-------|-------------|
| `axag` | The action spec (required) |
| `axagHandler` | What the tool does; defaults to filling the form and pressing the control |
| `axagMiddleware` | Wraps every call |
| `axagEnabled` | `false` keeps the action off the agent's list |

## Behaviour worth knowing

- **Routing and `@if` unregister the action**, because destroying the directive aborts its signal.
- **Changing an input re-registers** rather than adding a second tool.
- **SSR is a no-op**: on the server there is no model context to register with, and nothing to drive.
- The directive is standalone and works with Angular 16+.

## Templates are read at build time too

[`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) reads `*.component.html` templates, so a static `axag="write:user.deactivate!critical"` appears in the manifest. A bound `[axag]="spec"` is known only at runtime and is listed under `dynamic_actions`.
