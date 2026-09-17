---
id: annotating-search-filters
title: Annotating Search and Filters
sidebar_label: Search & Filters
slug: /authoring-guide/annotating-search-filters
---
# Annotating Search and Filters

Search and filter controls combine a read operation with several optional parameters. Annotate the form once: its controls are [harvested](/docs/semantic-manifest/schema-harvesting) into parameters, with their names, types, labels and HTML constraints.

```html title="Search with filters — form-level annotation" showLineNumbers
<form axag-intent="product.search" axag-entity="product" axag-action-type="read"
  axag-scope="public" axag-risk-level="none" axag-idempotent="true">
  <label for="q">Search</label>
  <input id="q" name="query" axag-parameter-required="true" />

  <label for="category">Category</label>
  <select id="category" name="category"
    axag-parameter-enum='["electronics","clothing","home"]'>
    <option value="">All Categories</option>
  </select>

  <label for="price_min">Minimum price</label>
  <input id="price_min" name="price_min" type="number" min="0" step="0.01" />

  <label for="price_max">Maximum price</label>
  <input id="price_max" name="price_max" type="number" min="0" step="0.01" />

  <button type="submit">Search</button>
</form>
```

The manifest this produces declares every filter, without any of them being listed on the annotation:

```json title="Harvested parameters"
{
  "intent": "product.search",
  "required_parameters": [
    { "name": "query", "type": "string", "description": "Search", "source": "harvested:html" }
  ],
  "optional_parameters": [
    { "name": "category", "type": "string", "description": "Category",
      "enum": ["electronics", "clothing", "home"], "source": "harvested:html" },
    { "name": "price_min", "type": "number", "min": 0, "description": "Minimum price", "source": "harvested:html" },
    { "name": "price_max", "type": "number", "min": 0, "description": "Maximum price", "source": "harvested:html" }
  ]
}
```

Notes on what the harvester read:

- The control's `name` becomes the parameter name, and its `<label>` becomes the description an agent reads.
- `type="number"` with a decimal `step` becomes `number`; without one it becomes `integer`. `min` and `max` carry over.
- A control is required when the HTML says so (`required`) or when `axag-parameter-required="true"` says so.
- `axag-parameter-*` attributes fill what the markup can't express — here, the category values, since the `<option>` list is a placeholder plus a server-rendered set.

A filter that isn't a form control at all — a set of chips, a custom dropdown — can't be harvested. Declare those in `axag-optional-parameters` on the annotation.

