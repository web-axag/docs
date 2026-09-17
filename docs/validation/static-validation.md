---
id: static-validation
title: Static Validation
sidebar_label: Static Validation
slug: /validation/static-validation
---

# Static Validation

Static validation checks AXAG annotations at build time — before the page is served. This catches errors early, prevents invalid annotations from reaching production, and integrates with CI/CD pipelines.

## What Static Validation Checks

### Structural Validation
- All `axag-intent` values follow the `entity.action` naming convention
- Required attributes (`axag-intent`, `axag-entity`, `axag-action-type`) are present
- JSON attribute values (`axag-required-parameters`, `axag-optional-parameters`) are valid JSON
- Enum values for `axag-action-type`, `axag-risk-level` are from the allowed set

### Semantic Validation
- `axag-required-parameters` and `axag-optional-parameters` don't overlap
- `axag-confirmation-required="true"` is set when `axag-risk-level` is `high` or `critical`
- `axag-approval-required="true"` has a corresponding `axag-approval-roles`
- `axag-idempotent` is declared for all write/delete operations
- `axag-scope` is declared for delete operations and for actions with role requirements
- Tenant-scoped actions don't take the tenant as a parameter

### Cross-Reference Validation
- With `--manifest`, every intent in the source must exist in that manifest (AXAG-LINT-010) — useful when the manifest is reviewed and committed separately from the code

When the manifest is generated from the same source on every build, as `@web-axag/compiler` does, the two can't drift and this check has nothing to find.

## Validation Tool Example

```bash title="Static validation output"
npx axag-lint src --manifest axag-manifest.json
```

```text
src/components/Cart.html
  12:5  warning  axag-action-type="delete" should declare axag-idempotent  AXAG-LINT-007
  12:5  warning  Intent "cart.remove_item" not found in manifest  AXAG-LINT-010
  12:5  warning  Delete action should declare axag-scope to indicate blast radius  AXAG-LINT-021

✗ 3 warnings in 1 file
```

Findings are grouped by file, with line and column, severity, message and rule ID. The exit code is non-zero when there are errors.

## Integration with Build Tools

`@web-axag/compiler` reads annotations during the build and fails it on error diagnostics, so a broken annotation never reaches a deploy. See [Build-Time Compilation](/docs/tool-generation/build-time-compilation).

### Vite
```typescript title="vite.config.ts"
import { defineConfig } from 'vite';
import axag from '@web-axag/compiler/vite';

export default defineConfig({
  plugins: [axag({ failOnError: true })],
});
```

### webpack
```javascript title="webpack.config.js"
const axag = require('@web-axag/compiler/webpack').default;

module.exports = {
  plugins: [axag({ failOnError: true })],
};
```

Rollup, Rspack and esbuild import from `@web-axag/compiler/rollup`, `/rspack` and `/esbuild`.

## Lint Rules

`axag-lint` ships 37 rules, grouped by what they protect:

| Rules | Cover |
|-------|-------|
| 001–003, 034–035 | Identity: intent, entity and action type present and correctly shaped |
| 004–005 | Enum values |
| 006–007, 023–026 | Safety: risk, confirmation, approval, idempotency |
| 008–009 | Parameters |
| 010 | Cross-reference against a generated manifest |
| 011, 018–022 | Scope and tenancy |
| 012–016 | Contradictions between attributes |
| 017 | Unsafe mutations |
| 027–028 | Macro syntax and macro/longhand conflicts |
| 029–032 | Harvesting: unnamed controls, schema drift, accessible names, labels |
| 033 | Annotations that exist only at runtime |
| 036–037 | Server enforcement: tenant identifiers exposed as parameters, high-risk actions no server enforces |

Each has a default severity you can change per project. See [CI/CD Linting](/docs/validation/ci-linting) for the configuration file, and the [Error Codes Reference](/docs/reference/error-codes#validation-error-codes) for every rule and its default severity.

## Project-Specific Severities

Rules are turned up, down or off per project rather than rewritten:

```json title=".axaglintrc.json"
{
  "rules": {
    "AXAG-LINT-024": "error",
    "AXAG-LINT-025": "off"
  }
}
```

Domain rules of your own — "every billing action must be high risk or above" — aren't part of the linter yet; today that check belongs in a CI script over the generated manifest, which is JSON:

```bash title="A domain rule over the manifest"
npx axag generate src --manifest axag-manifest.json
node -e "const m=require('./axag-manifest.json');\
  const bad=m.actions.filter(a=>['billing','payment','refund'].includes(a.entity) && !['high','critical'].includes(a.risk_level));\
  if (bad.length) { console.error('Financial actions below high risk:', bad.map(a=>a.intent)); process.exit(1); }"
```
