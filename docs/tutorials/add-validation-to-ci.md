---
id: add-validation-to-ci
title: "Tutorial: Add Validation to CI"
sidebar_label: Add Validation to CI
slug: /tutorials/add-validation-to-ci
---

# Tutorial: Add Validation to CI

This tutorial shows how to integrate AXAG validation into your CI/CD pipeline to catch annotation errors before deployment.

## Step 1: Install Dependencies

```bash title="Install AXAG dev dependencies"
npm install -D @web-axag/cli @web-axag/lint
```

## Step 2: Create Lint Configuration

Create `.axaglintrc.json`. Every rule has a default severity, so list only the ones you want to change:

```json title=".axaglintrc.json" showLineNumbers
{
  "include": ["**/*.{html,htm,jsx,tsx,vue}"],
  "exclude": ["node_modules/**", "dist/**", "**/*.test.*", "**/*.spec.*"],
  "manifestPath": "./axag-manifest.json",
  "rules": {
    "AXAG-LINT-032": "warning"
  }
}
```

`npx axag-lint --init` writes the file with every rule at its default.

## Step 3: Add npm Scripts

```json title="package.json — AXAG scripts"
{
  "scripts": {
    "axag:generate": "axag generate src --manifest axag-manifest.json --validate",
    "axag:lint": "axag-lint src --manifest axag-manifest.json",
    "axag:check": "npm run axag:generate && npm run axag:lint"
  }
}
```

`axag generate` compiles the manifest from your sources and `--validate` checks it against the JSON Schema. Generating the manifest first means the cross-reference rules have something current to compare with.

An app with a bundler can skip the generate step: [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) writes the manifest on every build.

## Step 4: GitHub Actions Workflow

Create `.github/workflows/axag-validation.yml`:

```yaml title=".github/workflows/axag-validation.yml" showLineNumbers
name: AXAG Validation

on:
  pull_request:
    paths:
      - 'src/**'
      - 'axag-manifest.json'
      - '.axaglintrc.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate and validate the manifest
        run: npm run axag:generate

      - name: Lint annotations
        run: npx axag-lint src --manifest axag-manifest.json --format github

      - name: Upload manifest artifact
        uses: actions/upload-artifact@v4
        with:
          name: axag-manifest
          path: axag-manifest.json
```

`--format github` turns findings into annotations on the pull request, at the file and line they came from.

## Step 5: Add Pre-Commit Hook

```bash title=".husky/pre-commit"
git diff --cached --name-only --diff-filter=ACM \
  | grep -E '\.(html|htm|jsx|tsx|vue)$' \
  | xargs -r npx axag-lint
```

## Step 6: Add Status Badge

```markdown title="README.md badge"
![AXAG Validation](https://github.com/your-org/your-repo/actions/workflows/axag-validation.yml/badge.svg)
```

## Troubleshooting

### CI fails with AXAG-LINT-010 (Intent not found in manifest)

The manifest is out of date. Regenerate it with `npm run axag:generate`, and generate it before linting in CI.

### CI fails on the conformance level you target

The manifest's `conformance` field is computed from what the annotations actually declare, so it drops when an action is missing risk, scope or idempotency. To fail the build on annotations below a level:

```bash title="Check annotations against a conformance level"
npx axag validate src --level intermediate --strict
```

### Lint reports AXAG-LINT-033 for a component action

`axag={spec}` is read at build time only when the spec is a module-level `const` or a `defineAction({...})` call. A spec built from props is registered at runtime and can't be in the manifest.
