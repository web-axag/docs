---
id: adding-use-cases
title: Adding Use Cases
sidebar_label: Adding Use Cases
slug: /contributors/adding-use-cases
---

# Adding Use Cases

This guide explains how to add new domain-specific use cases to the AXAG documentation.

---

## Why Add Use Cases?

Use cases demonstrate AXAG's applicability across industries. Each new domain:
- Validates the standard's expressiveness
- Provides ready-to-use templates for adopters in that industry
- Highlights domain-specific patterns and edge cases

---

## Structure of a Use-Case Page

Every use-case page follows this template:

```markdown
---
id: domain-action
title: "Domain — Action Name"
sidebar_label: Action Name
slug: /use-cases/domain/action-name
---

# Domain — Action Name

## Problem Statement

Describe the user action and its business context. What does the UI look like?
What does the user click, fill in, or interact with?

## Why Human-Only Semantics Fail Agents

Explain why a scraping-based agent would struggle. Mention:
- Ambiguous button labels
- Missing parameter metadata
- Unclear preconditions or risk
- Dynamic rendering challenges

## AXAG-Annotated UI

\`\`\`html
<button
  axag-intent="entity.action"
  axag-entity="entity"
  axag-action-type="write"
  axag-required-parameters='["param1","param2"]'
  ...
>Label</button>
\`\`\`

## Semantic Manifest Excerpt

\`\`\`json
{
  "intent": "entity.action",
  ...
}
\`\`\`

## Generated MCP Tool

\`\`\`json
{
  "name": "entity_action",
  "description": "...",
  "inputSchema": { ... }
}
\`\`\`

## Constraints and Safety

- Risk level and why
- Preconditions and postconditions
- Confirmation/approval requirements
- Side effects

## Why Scraping Fails Here

Specific examples of how a scraping agent would misinterpret
or miss critical metadata for this action.
```

---

## Step-by-Step Process

### 1. Choose a Domain

Check existing domains in `docs/use-cases/`:
- E-Commerce, Marketing, CRM, Travel, Jobs, Analytics, Support, Enterprise

If your domain isn't listed, create a new subdirectory.

### 2. Identify Intents

List the key user actions in the domain. Aim for 2-4 intents per domain:
- At least one **read** operation (search, list, get)
- At least one **write** operation (create, update)
- Optionally a **delete** or **approval** operation

### 3. Create the Directory

```bash
mkdir -p docs/use-cases/your-domain
```

### 4. Write the Pages

Create one `.md` file per intent following the template above.

### 5. Update the Sidebar

Add your domain to `sidebars.ts` under the `use-cases` category:

```typescript
{
  type: 'category',
  label: 'Your Domain',
  items: [
    'use-cases/your-domain/intent-one',
    'use-cases/your-domain/intent-two',
  ],
},
```

### 6. Update the Overview

Add your domain to `docs/use-cases/overview.md`:
- Add a row to the domain comparison table
- Add a brief description

### 7. Validate

```bash
npm run build
npm run validate:axag
```

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Directory | kebab-case | `your-domain/` |
| File | kebab-case | `action-name.md` |
| Intent | entity.action | `invoice.create` |
| Entity | singular lowercase | `invoice` |
| Page ID | `domain-action` | `finance-invoice-create` |

---

## Quality Checklist

Before submitting:

- [ ] Page follows the standard template structure
- [ ] All six sections present (problem, why agents fail, annotation, manifest, tool, safety)
- [ ] Annotations include all required attributes (`axag-intent`, `axag-entity`, `axag-action-type`)
- [ ] Risk level is appropriate for the action
- [ ] Preconditions and postconditions are realistic
- [ ] Manifest excerpt is valid JSON
- [ ] Generated tool example is valid JSON
- [ ] Page builds without errors
- [ ] Sidebar entry added
- [ ] Overview page updated

---

## Example PR

Here's what a good use-case contribution PR looks like:

```
feat(use-cases): add finance domain with invoice and payment intents

- Add docs/use-cases/finance/invoice-creation.md
- Add docs/use-cases/finance/payment-processing.md
- Update sidebars.ts with finance category
- Update use-cases/overview.md with finance domain
- All examples validate against AXAG schema

Closes #42
```
