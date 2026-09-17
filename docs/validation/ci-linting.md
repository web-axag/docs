---
id: ci-linting
title: CI/CD Linting
sidebar_label: CI/CD Linting
slug: /validation/ci-linting
---

# CI/CD Linting

Integrating AXAG validation into your CI/CD pipeline ensures that annotation errors are caught before deployment. This page shows how to set up automated linting with GitHub Actions, GitLab CI, and other platforms.


## GitHub Actions Workflow

```yaml title=".github/workflows/axag-validation.yml" showLineNumbers
name: AXAG Validation

on:
  pull_request:
    paths:
      - 'src/**'
      - 'axag-manifest.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate and validate the manifest
        run: npx axag generate src --manifest axag-manifest.json --validate

      - name: Run AXAG lint rules
        run: npx axag-lint src --manifest axag-manifest.json --format github

      - name: Check conformance level
        run: npx axag validate src --level intermediate --strict
```

## GitLab CI Configuration

```yaml title=".gitlab-ci.yml"
axag-validate:
  stage: test
  image: node:20
  script:
    - npm ci
    - npx axag generate src --manifest axag-manifest.json --validate
    - npx axag-lint src --manifest axag-manifest.json --format json
  rules:
    - changes:
        - src/**
        - axag-manifest.json
```

## Lint Configuration File

Create `.axaglintrc.json` in your project root, or put the same object under an `"axag-lint"` key in `package.json`. Anything you leave out keeps its default.

```json title=".axaglintrc.json" showLineNumbers
{
  "include": ["**/*.{html,htm,jsx,tsx,vue}"],
  "exclude": ["node_modules/**", "dist/**", "build/**", "**/*.test.*"],
  "manifestPath": "./axag-manifest.json",
  "rules": {
    "AXAG-LINT-025": "off",
    "AXAG-LINT-031": "warning",
    "AXAG-LINT-032": "off"
  }
}
```

Each rule takes `"error"`, `"warning"`, `"info"` or `"off"`. Run `npx axag-lint --init` to write the file with every rule at its default severity.

### What the rules cover

| Rules | Cover |
|-------|-------|
| 001–003, 034–035 | Identity: intent, entity and action type present and correctly shaped |
| 004–005 | Enum values |
| 006–007, 023–026 | Safety: risk, confirmation, approval, idempotency |
| 008–009 | Parameters |
| 010 | Cross-reference against the manifest (needs `manifestPath`) |
| 011, 018–022 | Scope and tenancy |
| 012–016 | Contradictions between attributes |
| 017 | Unsafe mutations |
| 027–028 | Macro syntax and macro/longhand conflicts |
| 029–032 | Harvesting: unnamed controls, schema drift, accessible names, labels |
| 033 | Annotations that only exist at runtime |
| 036–037 | Server enforcement: tenant identifiers exposed as parameters, high-risk actions no server enforces |

The full list with default severities is in the [Error Codes Reference](/docs/reference/error-codes#validation-error-codes).

## Pre-Commit Hook

Use Husky to validate annotations before commit:

```bash title=".husky/pre-commit"
# .husky/pre-commit — lint the files about to be committed
git diff --cached --name-only --diff-filter=ACM \
  | grep -E '\.(html|htm|jsx|tsx|vue)$' \
  | xargs -r npx axag-lint
```

## CI Output Formats

The `--format` flag controls output format:

| Format | Use Case |
|--------|----------|
| `console` | Local terminal output (default) |
| `github` | Annotations shown inline on the pull request |
| `sarif` | GitHub code scanning — the Security tab |
| `json` | Machine-readable for custom tooling |

`--output <path>` writes the report to a file, `--quiet` shows errors only, and `--manifest <path>` turns on the rules that compare annotations with a generated manifest.

## The action

```yaml title=".github/workflows/axag.yml"
name: AXAG

on: pull_request

permissions:
  contents: read
  security-events: write

jobs:
  axag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }

      - name: Generate the manifest
        run: npx --yes @web-axag/cli generate src --manifest axag-manifest.json --validate

      - uses: web-axag/sdk/.github/actions/axag-lint@main
        with:
          path: src
          manifest: axag-manifest.json
          changed-since: origin/${{ github.base_ref }}

      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: axag-lint.sarif
```

## Turning it on in an existing codebase

Rules like AXAG-LINT-031 (no accessible name) can fire hundreds of times on a codebase that predates them. A baseline records what is already there, so only new findings fail:

```bash
npx axag-lint src --update-baseline   # writes .axag-lint-baseline.json
npx axag-lint src --baseline          # from now on, only new findings
```

The baseline records rule and file, not line numbers, so unrelated edits don't reset it — and a *new* finding of the same kind in the same file still reports.

`--changed-since origin/main` narrows a run to the files a pull request touched, which pairs well with a baseline while a team works through the backlog.

## Enforcing Conformance Levels in CI

```bash
# Fail on annotations below a level (basic | intermediate | full)
npx axag validate src --level intermediate --strict
```

`axag validate` runs the same rules as `axag-lint`, limited to the categories that level asks for: identity, enums, parameters and macro syntax at `basic`; safety, scope and harvesting at `intermediate`; contradictions, manifest cross-references and enforcement at `full`.

`axag validate` exits with code 1 when an annotation misses what the level requires, blocking the pipeline. The manifest also records the level it reached in its `conformance` field, so `axag generate --validate` shows where a codebase stands without failing the build.
