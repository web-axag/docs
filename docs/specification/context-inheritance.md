---
id: context-inheritance
title: Context Inheritance
sidebar_label: Context Inheritance
slug: /specification/context-inheritance
---
# Context Inheritance

AXAG supports context inheritance — child elements inherit scope, tenant, and role context from parent containers.

## Inheritance Rules
1. `axag-scope` on a parent element applies to all child annotations
2. `axag-tenant-boundary` on a parent element applies to all children
3. `axag-required-roles` on a parent element constrains all children
4. Child elements MAY override inherited context with more restrictive values
5. Child elements MUST NOT override inherited context with less restrictive values

## Example
```html
<section axag-scope="tenant" axag-tenant-boundary="strict" axag-required-roles='["admin"]'>
  <!-- Both buttons inherit scope="tenant", tenant-boundary="strict", required-roles=["admin"] -->
  <button axag-intent="user.create" axag-entity="user" axag-action-type="write">Add User</button>
  <button axag-intent="user.delete" axag-entity="user" axag-action-type="delete"
    axag-required-roles='["super_admin"]'>Delete User</button>
  <!-- Delete overrides to require super_admin (more restrictive) — valid -->
</section>
```

## How Tooling Applies It

The linter, `@web-axag/compiler`, `axag generate` and the in-page runtime all read an annotation's context the same way: for each of `axag-scope`, `axag-tenant-boundary` and `axag-required-roles` the element doesn't declare, the nearest ancestor that does supplies it. The manifest records the result on each action, so nothing downstream has to know the value was inherited.

- **Nearest wins.** A nested container overrides an outer one.
- **Whole values.** An element that declares `axag-required-roles` replaces the inherited list; the two aren't merged.
- **Within one tree.** In JSX, inheritance follows the markup in a file. A component rendered inside a `<section axag-scope="tenant">` in a different file doesn't see that section at build time — declare the context on the component, or register it with a binding.

Rule 5 — a child must not loosen what it inherits — isn't checked by `axag-lint` yet. Review overrides of `axag-scope` and `axag-tenant-boundary` by hand.
