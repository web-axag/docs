---
id: schema-harvesting
title: Schema Harvesting
sidebar_label: Schema Harvesting
slug: /semantic-manifest/schema-harvesting
description: How manifest generators derive action parameters from form markup and bound schemas.
keywords: [harvesting, parameters, forms, aria, zod, openapi]
---

# Schema Harvesting

An action's parameters don't have to be written out in `axag-*` attributes. Generators combine three sources, highest precedence first:

| Source | Where it comes from | `source` in the manifest |
|--------|---------------------|--------------------------|
| **Declared** | `axag-required-parameters` / `axag-optional-parameters`, `req=` / `opt=` in the macro | *(omitted)* |
| **Schema binding** | A Zod schema or OpenAPI operation named by `axag-schema` or the CLI's `bindings` config | `zod` or `openapi` |
| **Harvested** | The form's controls, constraints and labels | `harvested:html` |

## Precedence

1. A higher source decides whether a parameter is **required or optional** and keeps every field it sets.
2. Lower sources **fill fields the higher one left out**, such as a description from a `<label>` or `maxLength` from a schema.
3. A parameter declared **by name only** (`'["email"]'`) has no type of its own, so its type also comes from a lower source.
4. Parameters found only in a lower source are **added**.
5. A binding's `x-axag-risk-level` and summary are used only when the annotation declares no risk level or description.

## Which controls are harvested

The parameter scope of an annotated element is:

- the element itself, if it is a `<form>`;
- its form, if it is a submit button (`<button>` without `type`, `type="submit"`, or `<input type="submit|image">`), including a form linked with `form="id"`;
- the element named by `axag-params-from="#id"`.

Inside that scope, `<input>`, `<select>`, `<textarea>` and elements with a form-control role (`textbox`, `combobox`, `switch`, `checkbox`, `slider`, `spinbutton`) are harvested, plus controls elsewhere on the page with `form="<scope id>"`. Disabled controls and `hidden`, `file`, `submit`, `button`, `reset` and `image` inputs are skipped.

## HTML to parameter mapping

| Markup | Parameter |
|--------|-----------|
| `axag-parameter`, else `name`, else `id` | `name` (converted to snake_case) |
| `required`, `aria-required="true"` | listed in `required_parameters` |
| `type="number"` / `"range"`, `role="slider"` / `"spinbutton"` | `type: "integer"`, or `"number"` when `step` is fractional or `any` |
| `min`, `max` (`aria-valuemin`, `aria-valuemax`) | `min`, `max` |
| `type="email"` / `"url"` / `"date"` / `"datetime-local"` | `format: "email"` / `"url"` / `"date"` / `"datetime"` |
| `minlength`, `maxlength`, `pattern` | `minLength`, `maxLength`, `pattern` |
| `<select>` options | `enum` |
| `<select multiple>` | `type: "array"`, `items.enum` |
| Radio buttons sharing a `name` | `enum` of their values |
| Single checkbox, `role="switch"` | `type: "boolean"` |
| Checkboxes sharing a `name` | `type: "array"`, `items.enum` |
| `aria-labelledby`, `aria-label`, `<label for>`, wrapping `<label>` | `description` |
| Group `<legend>` or `role="radiogroup"` label | `description` of a radio or checkbox group |
| `aria-describedby` | appended to `description` |
| `axag-parameter-type`, `-required`, `-description`, `-format`, `-enum`, `-min`, `-max`, `-min-length`, `-max-length`, `-pattern` | override the harvested value |

JSX spellings (`htmlFor`, `maxLength`, `minLength`) read the same as HTML. JSX expressions such as `required={isRequired}` are dynamic and are ignored.

## Schema bindings

```html title="Inline binding"
<form axag="write:user.invite!medium" axag-schema="zod:./src/schemas/user.ts#InviteUser">…</form>
```

| Ref | Meaning |
|-----|---------|
| `zod:<file>#<export>` | A Zod 4 `z.object()` export; `#<export>` defaults to `default` |
| `openapi:<file>#<operationId>` | Path and query parameters plus the JSON request body of an operation |
| `openapi:<operationId>` | Same, using the `openapi` document set in the CLI config |

See [Bind Zod or OpenAPI Schemas](/docs/tutorials/bind-schemas).

## Related lint rules

| Rule | Checks |
|------|--------|
| AXAG-LINT-029 | A submitted control has no name, so agents can't fill it |
| AXAG-LINT-030 | The form disagrees with a schema-sourced parameter in the manifest (required, type or enum) |
| AXAG-LINT-031 | An annotated button, link or control has no accessible name |
| AXAG-LINT-032 | A harvested parameter has no label or description |

To turn harvesting off, run `axag scan … --no-harvest`.

## Where Bindings Are Resolved

Loading a Zod module or an OpenAPI document is work the bundler plugin doesn't do: `axag-schema` is resolved by the CLI — `axag generate` and `axag scan` — which ships `@web-axag/schema-zod` and `@web-axag/schema-openapi` as dependencies.

A build that uses [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) alone will harvest the markup and read declared parameters, but leaves `axag-schema` unresolved. Where you want bound parameters in the manifest, generate it with the CLI in CI rather than from the bundler, or declare the parameters on the annotation.

