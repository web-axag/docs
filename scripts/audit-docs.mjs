#!/usr/bin/env node

/**
 * Check the documentation against what the SDK actually implements.
 *
 * Attributes, enum values, error codes, lint rule IDs, package names and CLI
 * flags are all read from the SDK sources, so a page that describes behaviour
 * the tools don't have is reported here rather than by a reader.
 *
 * Usage: node scripts/audit-docs.mjs [sdk-root]
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const DOCS_ROOT = process.cwd();
const SDK_ROOT =
  process.argv[2] ??
  [join(DOCS_ROOT, '..', 'sdk'), join(DOCS_ROOT, '..', 'axag-sdk')].find(dir => existsSync(dir));

if (!SDK_ROOT || !existsSync(SDK_ROOT)) {
  console.error('No SDK checkout found. Pass its path: node scripts/audit-docs.mjs ../sdk');
  process.exit(2);
}

const read = p => readFileSync(p, 'utf-8');
const files = (dir, exts) =>
  readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? files(full, exts) : exts.includes(extname(full)) ? [full] : [];
  });

/* ── what the SDK actually defines ────────────── */
const vocabulary = read(join(SDK_ROOT, 'packages/core/src/vocabulary.ts'));
const attributes = new Set([...vocabulary.matchAll(/'(axag(?:-[a-z-]+)?)'/g)].map(m => m[1]));
for (const m of read(join(DOCS_ROOT, 'docs/specification/vocabulary.md')).matchAll(/^\| `(axag-[a-z-]+)`/gm)) {
  attributes.add(m[1]);
}

const enums = {};
for (const [, name, body] of vocabulary.matchAll(/export const ([A-Z_]+) = \[([^\]]+)\] as const/g)) {
  enums[name] = [...body.matchAll(/'([^']+)'/g)].map(m => m[1]);
}
const enumFor = {
  'axag-action-type': enums.ACTION_TYPES,
  'axag-risk-level': enums.RISK_LEVELS,
  'axag-scope': enums.SCOPES,
  'axag-tenant-boundary': enums.TENANT_BOUNDARIES,
  'axag-parameter-type': enums.PARAMETER_TYPES,
  'axag-parameter-format': enums.PARAMETER_FORMATS,
};

const errorCodes = new Set(
  [...read(join(SDK_ROOT, 'packages/core/src/errors.ts')).matchAll(/^\s{2}(AXAG_[A-Z_]+):/gm)].map(m => m[1]),
);
/** Named in prose without being raised: the exported constant, a placeholder, reserved codes. */
const ALLOWED_CODE_MENTIONS = ['AXAG_ERRORS', 'AXAG_NAME', 'AXAG_VERSION_MISMATCH', 'AXAG_RATE_LIMITED'];

const ruleIds = new Set(
  files(join(SDK_ROOT, 'packages/lint/src/rules'), ['.ts'])
    .map(file => file.match(/(AXAG-LINT-\d{3})\.ts$/)?.[1])
    .filter(Boolean),
);

const packages = new Set(
  readdirSync(join(SDK_ROOT, 'packages')).map(dir => JSON.parse(read(join(SDK_ROOT, 'packages', dir, 'package.json'))).name),
);
/** Published before the 1.1 rename; named in docs only to say they are deprecated. */
for (const deprecated of ['@web-axag/axag-cli', '@web-axag/axag-lint']) packages.add(deprecated);

const cliSource = read(join(SDK_ROOT, 'packages/cli/bin/axag.ts'));
const cliCommands = {};
let command = null;
for (const line of cliSource.split('\n')) {
  const found = line.match(/\.command\('([a-z-]+)/);
  if (found) {
    command = found[1];
    cliCommands[command] = new Set();
  }
  const option = line.match(/\.(?:option|requiredOption)\('([^']+)'/);
  if (option && command) for (const flag of option[1].match(/--?[a-z][a-z-]*/g) ?? []) cliCommands[command].add(flag);
}
const lintFlags = new Set(
  [...read(join(SDK_ROOT, 'packages/lint/src/cli.ts')).matchAll(/\.option\('([^']+)'/g)].flatMap(
    m => m[1].match(/--?[a-z][a-z-]*/g) ?? [],
  ),
);

/** Pages that deliberately show annotations the linter rejects. */
const SHOWS_FAILURES =
  /anti-patterns|common-failures|proposed-vs-normative|missing-intent|unsafe-mutation|contradictory|scope-mismatch|risk-level-validation|remediation|static-validation|schema-conformance|deprecation-strategy/;

const findings = [];
const add = (file, line, kind, message) => findings.push({ file: relative(DOCS_ROOT, file), line, kind, message });

const pages = files(join(DOCS_ROOT, 'docs'), ['.md', '.mdx']);
for (const file of pages) {
  const source = read(file);
  const lineOf = index => source.slice(0, index).split('\n').length;
  const showsFailures = SHOWS_FAILURES.test(file);

  for (const m of source.matchAll(/(?<![\w-])(axag-[a-z-]+)=/g)) {
    if (!m[1].startsWith('axag-x-') && !attributes.has(m[1])) {
      add(file, lineOf(m.index), 'attribute', `unknown attribute ${m[1]}`);
    }
  }

  for (const [attribute, allowed] of Object.entries(enumFor)) {
    if (!allowed) continue;
    for (const m of source.matchAll(new RegExp(`${attribute}=["']([^"']+)["']`, 'g'))) {
      if (allowed.includes(m[1]) || /[A-Z]{3,}|\{|\$|\|/.test(m[1]) || showsFailures) continue;
      add(file, lineOf(m.index), 'enum', `${attribute}="${m[1]}" is not one of ${allowed.join('|')}`);
    }
  }

  for (const m of source.matchAll(/\bAXAG_[A-Z_]{4,}\b/g)) {
    if (!errorCodes.has(m[0]) && !ALLOWED_CODE_MENTIONS.includes(m[0])) {
      add(file, lineOf(m.index), 'error-code', `${m[0]} is not a defined error code`);
    }
  }

  for (const m of source.matchAll(/AXAG-LINT-(\d{3})/g)) {
    if (!ruleIds.has(`AXAG-LINT-${m[1]}`)) add(file, lineOf(m.index), 'rule', `AXAG-LINT-${m[1]} does not exist`);
  }

  for (const m of source.matchAll(/@(?:axag|web-axag)\/[a-z][a-z0-9-]*/g)) {
    if (!packages.has(m[0])) add(file, lineOf(m.index), 'package', `${m[0]} is not an SDK package`);
  }

  for (const m of source.matchAll(/\bnpx (?:--yes )?(?:@web-axag\/cli |axag )([a-z-]+)([^\n`]*)/g)) {
    const [, name, rest] = m;
    if (!cliCommands[name]) {
      add(file, lineOf(m.index), 'command', `"axag ${name}" is not a CLI command`);
      continue;
    }
    for (const flag of rest.match(/(?<![\w-])--?[a-z][a-z-]*/g) ?? []) {
      if (!cliCommands[name].has(flag)) add(file, lineOf(m.index), 'flag', `"axag ${name}" has no ${flag}`);
    }
  }

  for (const m of source.matchAll(/\bnpx (?:--yes )?(?:@web-axag\/lint|axag-lint)([^\n`]*)/g)) {
    for (const flag of m[1].match(/(?<![\w-])--?[a-z][a-z-]*/g) ?? []) {
      if (!lintFlags.has(flag)) add(file, lineOf(m.index), 'flag', `axag-lint has no ${flag}`);
    }
  }
}

const byKind = {};
for (const finding of findings) (byKind[finding.kind] ??= []).push(finding);

console.log(`${pages.length} pages audited against ${relative(DOCS_ROOT, SDK_ROOT)}, ${findings.length} findings`);
for (const [kind, list] of Object.entries(byKind)) {
  console.log(`\n── ${kind} (${list.length})`);
  for (const f of list) console.log(`  ${f.file}:${f.line}  ${f.message}`);
}
process.exit(findings.length > 0 ? 1 : 0);
