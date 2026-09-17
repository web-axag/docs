---
id: guide
title: Contributor Guide
sidebar_label: Contributor Guide
slug: /contributors/guide
---

# Contributor Guide

Thank you for your interest in contributing to the AXAG Standard! This guide explains how to get involved, the types of contributions we welcome, and the process for submitting changes.

## Ways to Contribute

### 📝 Documentation
- Fix typos, clarify explanations, improve examples
- Add new tutorials or how-to guides
- Translate documentation

### 🗂 Use-Case Domains
- Add annotated examples for new industry verticals
- Expand existing domain examples with additional intents
- See [Adding Use Cases](/docs/contributors/adding-use-cases)

### 🔧 Tooling
- Build linters, validators, or IDE plugins
- Improve the manifest generator pipeline
- Create framework-specific AXAG helper libraries

### 📐 Specification
- Propose new annotation attributes via RFC
- Report ambiguities or inconsistencies
- Suggest improvements to the conformance model

### 🐛 Bug Reports
- Report documentation inaccuracies
- Report schema validation issues
- Report broken examples

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm (documentation) or pnpm (SDK)
- Git

### Where things live

| Repository | Contains |
|------------|----------|
| [web-axag/docs](https://github.com/web-axag/docs) | This site: the specification, guides, tutorials and examples |
| [web-axag/sdk](https://github.com/web-axag/sdk) | The SDK: core, compiler, runtime, bindings, server, linter and CLI |

### Local Development Setup — documentation

```bash
git clone https://github.com/web-axag/docs.git
cd axag-docs
npm install
npm start
```

### Local Development Setup — SDK

```bash
git clone https://github.com/web-axag/sdk.git
cd axag-sdk
pnpm install
pnpm test
```

The site will be available at `http://localhost:3000`.

### Project Structure

```
axag/
├── docs/                    # Documentation pages (Markdown/MDX)
│   ├── intro/               # Introduction section
│   ├── getting-started/     # Getting started guides
│   ├── concepts/            # Core concepts
│   ├── specification/       # Formal specification
│   ├── semantic-manifest/   # Manifest documentation
│   ├── tool-generation/     # Tool generation docs
│   ├── authoring-guide/     # Annotation authoring guide
│   ├── use-cases/           # Domain-specific use cases
│   ├── validation/          # Validation documentation
│   ├── governance/          # Governance processes
│   ├── reference/           # Reference materials
│   ├── tutorials/           # Step-by-step tutorials
│   ├── examples/            # Examples and galleries
│   ├── contributors/        # Contributor documentation
│   └── faq.md               # FAQ
├── src/
│   ├── components/          # Custom React components
│   ├── css/                 # Custom styles
│   └── pages/               # Custom pages (homepage)
├── static/                  # Static assets
├── docusaurus.config.ts     # Docusaurus configuration
├── sidebars.ts              # Sidebar navigation
└── package.json             # Dependencies
```

---

## Contribution Workflow

### 1. Find or Create an Issue

- Browse open issues for the [documentation](https://github.com/web-axag/docs/issues) or the [SDK](https://github.com/web-axag/sdk/issues)
- If your contribution isn't covered by an existing issue, create one first
- Wait for maintainer acknowledgement before starting large changes

### 2. Fork and Branch

```bash
# Fork the repo on GitHub, then:
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` — new features or content
- `fix/` — bug fixes or corrections
- `docs/` — documentation-only changes
- `rfc/` — specification proposals

### 3. Make Changes

- Follow the [Style Guide](/docs/contributors/style-guide)
- Add or update tests if applicable
- Ensure all examples validate with `npm run validate:axag`

### 4. Test Locally

```bash
# Build the site
npm run build

# Run validation
npm run validate:axag

# Run linting
npm run lint
```

### 5. Submit a Pull Request

- Write a clear PR description
- Reference the related issue
- Fill out the PR template
- Request review from maintainers

### 6. Review Process

- At least one maintainer review required
- CI checks must pass (build, lint, validate)
- Address review feedback promptly
- See [Review Checklist](/docs/contributors/review-checklist)

---

## Code of Conduct

All contributors are expected to follow our Code of Conduct:

- **Be respectful** — treat everyone with dignity
- **Be constructive** — focus on improving the standard
- **Be inclusive** — welcome diverse perspectives
- **Be patient** — review takes time

---

## Recognition

All contributors are recognised in the project's CONTRIBUTORS file and release notes. Significant contributions are highlighted in the changelog.
