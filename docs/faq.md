---
id: faq
title: Frequently Asked Questions
sidebar_label: FAQ
slug: /faq
---

# Frequently Asked Questions

## General

### What does AXAG stand for?

**Agent Experience Accessibility Guidelines.** AXAG is a semantic annotation standard that makes web UIs machine-readable so AI agents can operate them without scraping.

### How is AXAG different from WCAG?

WCAG makes UIs accessible to *humans* with disabilities. AXAG makes UIs accessible to *AI agents*. WCAG uses ARIA roles and labels; AXAG uses semantic annotations like `axag-intent`, `axag-entity`, and `axag-action-type`. They are complementary — a page can (and should) have both.

### Do I need to change my existing UI framework?

No. Annotations are HTML attributes, so they work in any framework, or none. Where you'd rather annotate from component state than from markup, there are bindings: `useAxag` for [React](/docs/frameworks/react) and [Vue](/docs/frameworks/vue), and an `[axag]` directive for [Angular](/docs/frameworks/angular). They register the action for as long as the component is on screen.

### Is AXAG an official W3C standard?

Not yet. AXAG is a proposed community standard, currently at **v1.1.0**. The goal is to evolve it through community adoption and eventually pursue formal standardisation.

---

## Annotations

### What is the minimum viable annotation?

Every annotated element needs an intent, an entity and an action type. With the [macro](/docs/specification/macro-syntax), that is one attribute — the entity is implied by the intent:

```html
<button axag="read:product.search">Search</button>
```

In longhand, the same annotation is:
- `axag-intent` — the semantic intent (e.g., `product.search`)
- `axag-entity` — the domain entity (e.g., `product`)
- `axag-action-type` — the operation type: `read`, `write`, `delete` or `navigate`

### How do I annotate a multi-step workflow?

Use a separate annotation on each step's submit/action element. Include `axag-preconditions` to encode step ordering (e.g., `"previous step completed"`). See [Multi-Step Workflows](/docs/authoring-guide/annotating-multi-step-workflows).

### Can I annotate dynamically rendered components?

Yes, in two ways:

- **As markup.** Annotations are attributes, so anything that renders them works — including the [`axag` macro](/docs/specification/macro-syntax), which fits in one attribute.
- **As a spec.** `defineAction({...})` passed to `axag={spec}`, `useAxag`, `v-axag` or `[axag]`. A spec held in a module-level `const` is read at build time and lands in the manifest. One built at runtime — from props, say — is registered in the page instead, and listed in the manifest's `dynamic_actions` so a runtime knows the manifest isn't complete.

See [Build-Time Compilation](/docs/tool-generation/build-time-compilation).

### What if an action has no clear entity?

Every action operates on *something*. If it seems entity-less, you may be looking at a composite flow. Break it down. For utility operations (e.g., "export current view"), the entity is the thing being exported (e.g., `report`, `dataset`).

---

## Semantic Manifest

### What is the relationship between annotations and the manifest?

Annotations live *in the HTML*. A semantic manifest is a JSON document *generated from* annotations that describes all available intents, entities, parameters, and constraints for a page or application. Agents consume the manifest, not the raw HTML.

### Where should I host my manifest?

Recommended discovery methods (in priority order):
1. **Well-known URL:** `/.well-known/axag-manifest.json` — where [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) writes it on every build
2. **HTTP header:** `Link: </.well-known/axag-manifest.json>; rel="axag-manifest"`
3. **HTML meta tag:** `<meta name="axag-manifest" content="<url>">`

See the [Discovery Model](/docs/semantic-manifest/discovery-model).

### Can I have multiple manifests?

Yes. Large applications may publish one manifest per section or per page. Agents can discover the relevant manifest through the above discovery mechanisms.

---

## Tool Generation

### How are MCP tools generated from the manifest?

Each intent in the manifest maps to one MCP tool:
- `intent` → tool `name` (dots replaced with underscores)
- `required_parameters`, `optional_parameters` → `input_schema`
- parameter constraints → JSON Schema validations (`enum`, `minimum`, `maximum`, etc.)
- `risk_level`, `confirmation_required` and other safety fields → tool `metadata`

See [Mapping Rules](/docs/tool-generation/mapping-rules).

### Do generated tools handle authentication?

Tools don't carry credentials. A call runs in the page, in the session the person is already signed into, so it authenticates the way the app already does.

What tools *do* carry is the authorization an action needs — `required_roles`, `approval_roles`, `scope` and `tenant_boundary` — and [`@web-axag/server`](/docs/frameworks/safety) checks those on every call, against the manifest rather than anything the caller sent.

### Can I customize generated tool names?

No. A tool's name is its intent with `.` replaced by `_` — `product.search` becomes `product_search` — so the name an agent sees can always be traced back to the annotation. To change a tool's name, change the intent.

`axag-operation-id` sets the manifest's `operation_id`, which is separate from the tool name.

---

## Validation

### What validation tools are available?

- **`axag-lint`** — 37 rules over HTML, JSX, TSX and Vue, covering identity, safety, scope, harvesting, macro syntax and server enforcement. Outputs console, JSON, GitHub annotations or SARIF.
- **`axag validate`** — the same rules, limited to a [conformance level](/docs/specification/conformance-levels).
- **`axag generate --validate`** — builds the manifest and checks it against the JSON Schema.
- **A GitHub Action** that annotates pull requests and feeds code scanning, with baselines so an existing codebase fails only on new findings.

See [CI/CD Linting](/docs/validation/ci-linting).

### How do I add AXAG validation to CI?

Use the AXAG Lint action, or run `npx axag-lint src --format github` yourself. The action annotates the pull request and writes SARIF for code scanning; `--changed-since origin/main` and a baseline keep an existing codebase from failing on findings it already had. See [Add Validation to CI](/docs/tutorials/add-validation-to-ci).

---

## Safety & Risk

### How does risk classification work?

Five levels:
| Level | Meaning | Required safety |
|-------|---------|-----------------|
| `none` | No risk (reads, navigation) | None |
| `low` | Easily reversible (cart operations) | None; logging recommended |
| `medium` | State changes requiring attention | Confirmation recommended |
| `high` | Financial or significant data impact | Confirmation, enforced on the server |
| `critical` | Irreversible, high impact | Confirmation and approval, enforced on the server |

See [Risk Classification](/docs/specification/risk-classification).

### What happens if an agent ignores safety metadata?

It can't get past the server, if the server is doing its part.

In the page, [safety enforcers](/docs/frameworks/safety) ask a person to confirm high-risk actions, keep the tenant out of the agent's hands, and audit every call. But an agent running in the page holds the page's credentials and can call your API directly, so declarations alone constrain nothing.

`@web-axag/server` closes that gap: a high-risk call needs a confirmation token bound to that exact call and person, approval and roles are checked, and tenant boundaries are enforced. The specification requires this server-side enforcement for any action at `high` risk or above. **AXAG-LINT-037** warns about high-risk actions your server isn't enforcing.

---

## Governance

### Who owns the AXAG standard?

Currently maintained by the community. The governance model follows an open RFC process. See [Ownership Model](/docs/governance/ownership-model).

### How do I propose a change?

1. Open an issue describing the change
2. Create an RFC document following the template
3. Submit a PR and go through the review process

See [Change Review Workflow](/docs/governance/change-review-workflow).

### How is backward compatibility maintained?

AXAG follows semantic versioning. New attributes are additive (non-breaking). Removed or renamed attributes go through a deprecation cycle with at least one minor version of deprecation warnings. See [Backward Compatibility](/docs/governance/backward-compatibility).

---

## Contributing

### How can I contribute?

- Add new use-case domain examples
- Improve documentation and tutorials — [web-axag/docs](https://github.com/web-axag/docs)
- Improve the linter, compiler, runtime and bindings — [web-axag/sdk](https://github.com/web-axag/sdk)
- Report issues and propose RFCs

See the [Contributor Guide](/docs/contributors/guide).

### What style conventions should I follow?

See the [Style Guide](/docs/contributors/style-guide) for terminology, formatting, and annotation conventions.
