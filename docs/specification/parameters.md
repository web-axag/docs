---
id: parameters
title: Parameters
sidebar_label: Parameters
slug: /specification/parameters
---
# Parameters

Parameters are the inputs required and accepted by an AXAG-annotated operation.

## Declaration Methods

### On the action element

List names, or give a full definition where the type or constraints matter:

```html
<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-required-parameters='[{"name":"query","type":"string","minLength":1,"maxLength":200}]'
  axag-optional-parameters='["category",{"name":"price_min","type":"number","min":0},{"name":"price_max","type":"number","min":0}]'
>Search</button>
```

A name on its own is a `string` unless a schema binding or a harvested control says otherwise.

### On individual input elements

```html
<input
  axag-parameter="query"
  axag-parameter-type="string"
  axag-parameter-required="true"
  axag-parameter-description="Search query text"
  axag-parameter-min-length="1"
  axag-parameter-max-length="200"
/>
```

`axag-parameter-*` attributes override what would otherwise be read from the control's HTML (`type`, `required`, `min`, `maxlength`, …).

### From the form, or a schema

Often nothing needs declaring: controls inside an annotated form, or the form named by `axag-params-from`, are [harvested](/docs/semantic-manifest/schema-harvesting) as parameters, and `axag-schema` binds a Zod or OpenAPI schema. When several sources describe the same parameter, the annotation wins over the schema, and the schema over the HTML.

## Parameter Types
`string`, `number`, `integer`, `boolean`, `array`, `object`

Dates and enumerations aren't separate types: use `string` with `format` (`date`, `datetime`) or with `enum`.

## Parameter Constraints
- `axag-parameter-min` / `axag-parameter-max` — Numeric range
- `axag-parameter-min-length` / `axag-parameter-max-length` — String length
- `axag-parameter-pattern` — Regex validation
- `axag-parameter-enum` — Allowed values
- `axag-parameter-format` — `email`, `url`, `date`, `datetime` or `uuid`

In the object form, the same constraints are `min`, `max`, `minLength`, `maxLength`, `pattern`, `enum` and `format`.
