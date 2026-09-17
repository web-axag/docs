---
id: risk-classification
title: Risk Classification
sidebar_label: Risk Classification
slug: /specification/risk-classification
---
# Risk Classification

Every mutating operation MUST declare a risk level. Risk classification drives safety requirements.

| Level | Description | Required Safety |
|-------|-------------|----------------|
| `none` | No risk (reads, navigation) | None |
| `low` | Easily reversible (cart operations) | None required, logging recommended |
| `medium` | State changes requiring attention | Confirmation recommended |
| `high` | Financial or significant data impact | Confirmation MUST be required |
| `critical` | Irreversible, high-impact operations | Confirmation AND approval MUST be required |

## Classification Guidelines

- **Payment processing** → `high`
- **Account deletion** → `critical`
- **Profile update** → `medium`
- **Adding bookmark** → `low`
- **Searching products** → `none`

Implementations MUST NOT classify a `delete` action as `none` risk unless the deletion is trivially reversible (e.g., removing an unsaved draft).

Actions at `high` risk and above MUST also be [enforced on the server](/docs/frameworks/safety): a confirmation or approval the agent could skip protects nothing.

## What the Linter Checks

| Rule | Checks |
|------|--------|
| AXAG-LINT-023 | `write` and `delete` actions declare a risk level |
| AXAG-LINT-006 | `high` and `critical` actions require confirmation |
| AXAG-LINT-026 | Each level declares the safety metadata it needs — `critical` adds approval and approval roles |
| AXAG-LINT-024 | `delete` actions below `high` are flagged for review |
| AXAG-LINT-013 | `read` actions aren't `critical` |
| AXAG-LINT-037 | `high` and `critical` actions are enforced by your server |
