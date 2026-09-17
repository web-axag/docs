---
id: vue
title: Vue
sidebar_label: Vue
slug: /frameworks/vue
description: Register agent actions for as long as the component is mounted.
---

# Vue

```bash
npm install @web-axag/vue
```

## Composable

```vue
<script setup lang="ts">
import { defineAction, useAxag } from '@web-axag/vue';

const addItem = defineAction({
  intent: 'cart.add_item',
  actionType: 'write',
  riskLevel: 'low',
  requiredParameters: [{ name: 'product_id', type: 'string' }],
});

const { el, attrs } = useAxag(addItem, { handler: ({ product_id }) => cart.add(product_id) });
</script>

<template>
  <button ref="el" v-bind="attrs">Add to cart</button>
</template>
```

`enabled` takes a ref or getter, so an action can follow a permission check:

```ts
const { el, attrs } = useAxag(addItem, { enabled: () => user.canOrder });
```

Registration is undone by `onScopeDispose`, so unmounting or leaving a route removes the tool.

## Directive

```ts
import { AxagPlugin } from '@web-axag/vue';
app.use(AxagPlugin);
```

```vue
<button v-axag="addItem">Add to cart</button>
<button v-axag="{ spec: addItem, handler: add }">Add to cart</button>
```

The directive writes the `axag-*` attributes onto the element and registers the action, re-registering when the value changes.

## Templates are read at build time too

[`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) reads `<template>` blocks in `.vue` files, so a static `axag="write:cart.add_item!low"` appears in the manifest. A bound `:axag="spec"` is only known at runtime and is listed under `dynamic_actions`.
