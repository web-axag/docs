#!/usr/bin/env node

/**
 * Generate the homepage numbers from the docs, so they can't go stale.
 *
 * Counts that live in this repository are computed here. The two that live in
 * the SDK repository (lint rules, packages) are set below with where they come
 * from — update them when the SDK changes.
 *
 * Usage: node scripts/generate-site-stats.mjs
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const DOCS = join(process.cwd(), 'docs');

/**
 * From axag-sdk: the rule files under packages/lint/src/rules, and the packages
 * that carry an implementation (the two unscoped command wrappers don't count).
 * Read from a sibling checkout when there is one, so they can't drift; the
 * fallbacks are what the last check found.
 */
const SDK_ROOT = [join(process.cwd(), '..', 'sdk'), join(process.cwd(), '..', 'axag-sdk')].find(existsSync) ?? '';
const SDK = { lintRules: 37, packages: 13 };

try {
  const rules = files(join(SDK_ROOT, 'packages', 'lint', 'src', 'rules'), ['.ts']).filter(file =>
    /AXAG-LINT-\d{3}\.ts$/.test(file),
  );
  if (rules.length > 0) SDK.lintRules = rules.length;

  const packages = readdirSync(join(SDK_ROOT, 'packages')).filter(
    entry => !entry.startsWith('alias-') && statSync(join(SDK_ROOT, 'packages', entry)).isDirectory(),
  );
  if (packages.length > 0) SDK.packages = packages.length;
} catch {
  // No sibling checkout — keep the fallbacks above.
}

function files(dir, extensions = ['.md', '.mdx']) {
  return readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return files(full, extensions);
    return extensions.includes(extname(full)) ? [full] : [];
  });
}

const docs = files(DOCS);
const sources = docs.map(file => readFileSync(file, 'utf-8'));

// Every ```json and ```html block is checked by scripts/validate-axag-examples.mjs.
const examples = sources.reduce((total, source) => total + (source.match(/```(json|html)(?:[ \t][^\n]*)?\n/g) ?? []).length, 0);

const domains = readdirSync(join(DOCS, 'use-cases')).filter(entry => statSync(join(DOCS, 'use-cases', entry)).isDirectory()).length;

const vocabulary = readFileSync(join(DOCS, 'specification', 'vocabulary.md'), 'utf-8');
const attributes = (vocabulary.match(/^\| `axag[^`]*`/gm) ?? []).length;

const stats = {
  documentationPages: docs.length,
  industryDomains: domains,
  validatedExamples: examples,
  specificationAttributes: attributes,
  lintRules: SDK.lintRules,
  sdkPackages: SDK.packages,
};

writeFileSync(join(process.cwd(), 'src', 'data', 'site-stats.json'), JSON.stringify(stats, null, 2) + '\n');
console.log('site stats', stats);
