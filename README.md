# AXAG — Agent Experience Accessibility Guidelines

[![Build](https://img.shields.io/github/actions/workflow/status/web-axag/docs/ci.yml?branch=main&label=build)](https://github.com/web-axag/docs/actions)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://axag.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**AXAG** is a semantic annotation standard that makes web UIs machine-readable for AI agents. Instead of scraping ambiguous HTML, agents consume structured semantic manifests generated from AXAG annotations.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/web-axag/docs.git
cd axag-docs
npm install

# Start development server
npm start
```

Visit `http://localhost:3000` to view the documentation site.

## 📖 What is AXAG?

AXAG defines a vocabulary of HTML data attributes (`axag-*`) that encode:

- **Intent** — what the action does (`product.search`, `order.place`)
- **Entity** — the domain object (`product`, `order`, `ticket`)
- **Action type** — the operation class (`read`, `write`, `delete`)
- **Parameters** — required and optional inputs
- **Constraints** — validation rules (enums, ranges, formats)
- **Safety metadata** — risk level, confirmation, approval requirements

### Example

```html
<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-required-parameters='["query"]'
  axag-optional-parameters='["category","price_min","price_max"]'
  axag-risk-level="none"
  axag-idempotent="true"
  axag-description="Search the product catalogue"
>Search</button>
```

This annotation generates a **semantic manifest** (JSON) which is then transformed into an **MCP tool** that any AI agent can discover and invoke.

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐     ┌───────────┐
│  HTML + AXAG │ ──▶ │ Semantic Manifest │ ──▶ │  MCP Tools  │ ──▶ │ AI Agent  │
│  Annotations │     │     (JSON)        │     │ (Generated) │     │           │
└─────────────┘     └──────────────────┘     └─────────────┘     └───────────┘
```

## 📚 Documentation Structure

| Section | Description |
|---------|-------------|
| **Introduction** | What AXAG is and why it exists |
| **Getting Started** | First annotation to first agent action |
| **Core Concepts** | Foundational ideas (semantic contracts, affordances, trust) |
| **Specification** | Formal vocabulary, attributes, conformance levels |
| **Semantic Manifest** | Manifest schema, generation, and discovery |
| **Tool Generation** | Mapping rules and generated tool examples |
| **Authoring Guide** | How to annotate buttons, forms, tables, workflows |
| **Use Cases** | 8 industry domains with 25+ annotated examples |
| **Validation** | Static, runtime, and CI validation |
| **Governance** | Versioning, deprecation, RFC process |
| **Reference** | Schema reference, glossary, error codes |
| **Tutorials** | Step-by-step guides |
| **Examples** | Before/after, anti-patterns, domain gallery |
| **FAQ** | Frequently asked questions |

## 🛠 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build |
| `npm run validate:axag` | Validate AXAG examples |
| `npm run generate:llms` | Regenerate `llms.txt` and `llms-full.txt` (runs as part of the build) |
| `npm run typecheck` | Type-check site components |
| `npm run format` | Format code |

## 🤖 For language models

The site publishes plain-text entry points, so an agent can read the standard without rendering it:

| File | Contents |
|------|----------|
| [`/llms.txt`](https://axag.org/llms.txt) | Every page, one line each, in reading order |
| [`/llms-full.txt`](https://axag.org/llms-full.txt) | The whole specification as plain text |
| [`/schema/v1.1/axag-manifest.schema.json`](https://axag.org/schema/v1.1/axag-manifest.schema.json) | The manifest schema |

Both text files are generated from the documentation during the build, so they can't drift from it.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

##  License

MIT — see [LICENSE](LICENSE) for details.
