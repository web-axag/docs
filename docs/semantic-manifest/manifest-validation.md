---
id: manifest-validation
title: Manifest Validation
sidebar_label: Manifest Validation
slug: /semantic-manifest/manifest-validation
---
# Manifest Validation

Manifests MUST be validated before consumption by agent runtimes.

## Validation Checks

1. **Schema conformance** — Manifest matches the expected JSON schema
2. **Required field presence** — All required fields for the declared conformance level are present
3. **Value validity** — Enum values are from the allowed set
4. **Parameter consistency** — Required parameters have definitions
5. **Safety consistency** — High/critical risk operations have confirmation requirements
6. **Drift detection** — Manifest matches current annotation source (when possible)

## Validation in CI

```yaml
# Generate the manifest and check it against the JSON Schema
- name: Generate and validate the manifest
  run: npx @web-axag/cli generate src --manifest axag-manifest.json --validate

# Check the annotations themselves at a conformance level
- name: Validate annotations
  run: npx @web-axag/cli validate src --level intermediate --strict
```

`--validate` on `generate` is the schema check: the manifest must match [`axag-manifest.schema.json`](pathname:///schema/v1.1/axag-manifest.schema.json), which rejects unknown fields as well as invalid ones. `axag validate` checks the source annotations instead. A build that generates the manifest with [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) validates on every build and fails on error diagnostics.

## Common Validation Failures

| Failure | Cause | Fix |
|---------|-------|-----|
| Missing required fields | Annotations incomplete | Add missing `axag-*` attributes |
| Invalid enum value | Typo in action type or risk level | Use values from canonical vocabulary |
| Manifest drift | A committed manifest generated from older source | Regenerate it, or generate on every build |
| Safety violation | High-risk mutation without confirmation | Add `axag-confirmation-required="true"` |
