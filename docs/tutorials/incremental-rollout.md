---
id: incremental-rollout
title: "Tutorial: Incremental Rollout"
sidebar_label: Incremental Rollout
slug: /tutorials/incremental-rollout
---

# Tutorial: Incremental Rollout

This tutorial shows how to adopt AXAG incrementally — starting with a single page and scaling to your entire application.

## Phase 1: Single Page Pilot (Week 1)

### Choose a pilot page
Pick a page with 2–5 interactive elements, ideally with a mix of read and write operations. Good candidates:
- A search page (read-only, low risk)
- A settings page (read + write, medium risk)

### Annotate
```html title="Pilot page — read + write annotations" showLineNumbers
<!-- Search (read) -->
<button axag-intent="product.search" axag-entity="product" axag-action-type="read"
  axag-required-parameters='["query"]' axag-risk-level="none" axag-idempotent="true"
  axag-description="Search products">Search</button>

<!-- Update settings (write) -->
<button axag-intent="settings.update" axag-entity="settings" axag-action-type="write"
  axag-required-parameters='["setting_key","setting_value"]' axag-risk-level="low"
  axag-idempotent="true" axag-description="Update a setting">Save</button>
```

### Generate and test
```bash title="Generate manifest & tools from pilot page"
npx @web-axag/cli generate src/pages/pilot --manifest axag-manifest.json --tools tools/tool-registry.json --validate
npx axag-lint src/pages/pilot --manifest axag-manifest.json
```

### Success criteria
- [ ] Annotations pass validation
- [ ] Manifest generates without errors
- [ ] An agent can discover and call the tools

## Phase 2: Core Flows (Weeks 2–4)

Expand to all customer-facing user flows:

### Priority order
1. **Read operations** (search, list, view) — lowest risk
2. **Create operations** (new record) — low risk
3. **Update operations** (edit record) — medium risk
4. **Delete operations** (remove, cancel) — high risk
5. **Financial operations** (billing, payments) — critical risk

### Add CI validation
```bash title="Add linting to CI"
npm install -D @web-axag/lint
# Add the GitHub Actions workflow from the Add Validation to CI tutorial
```

### Success criteria
- [ ] All user-facing actions annotated
- [ ] CI validation passing on every PR
- [ ] Intermediate conformance level achieved

## Phase 3: Full Coverage (Months 2–3)

### Annotate admin and internal flows
- Admin dashboards
- Approval workflows
- Tenant management

### Add safety metadata
- Preconditions and postconditions for all write operations
- Side-effects for operations with external consequences
- Tenant boundary declarations for multi-tenant operations

### Target full conformance
```bash title="Target full conformance"
npx @web-axag/cli validate src --level full --strict
```

The manifest's own `conformance` field is computed from what the annotations declare, so `axag generate --validate` shows where you have reached.

### Success criteria
- [ ] 100% of actionable elements annotated
- [ ] Full conformance level achieved
- [ ] Runtime validation enforcing contracts

## Phase 4: Optimization (Ongoing)

- Monitor agent success rates
- Refine parameter schemas based on agent usage patterns
- Contribute domain-specific patterns back to the AXAG community
- Track annotation coverage metrics

## Rollout Metrics Dashboard

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| Annotated actions | 2–5 | 20–50 | 100% | 100% |
| Conformance level | Basic | Intermediate | Full | Full |
| CI validation | No | Yes | Yes | Yes |
| Runtime validation | No | No | Yes | Yes |
| Agent frameworks supported | 1 | 1–2 | All | All |
