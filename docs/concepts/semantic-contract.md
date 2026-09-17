---
id: semantic-contract
title: "Core Concept: Semantic Contract"
sidebar_label: Semantic Contract
slug: /concepts/semantic-contract
description: The semantic contract model that underpins AXAG annotations.
keywords: [semantic contract, core concept]
---

# Semantic Contract

A semantic contract is a formal, machine-readable declaration of what an interface interaction means, what it requires, and what it guarantees. AXAG annotations express semantic contracts.

## Contract vs Description

A **description** tells you about something. A **contract** binds you to something.

When AXAG declares `axag-preconditions='["cart_validated"]'`, this is not informational — it is contractual. It means:
- The operation MUST NOT be invoked unless `cart_validated` is true
- The manifest MUST include this precondition
- The tool definition MUST surface this constraint, so the agent can plan around it
- The operation MUST refuse a call that breaks it, with `AXAG_PRECONDITION_FAILED`

Preconditions are written for people and agents to reason about, not evaluated by a machine: nothing checks `cart_validated` for you. The refusal is what makes the contract binding, and it belongs in the handler or API that performs the operation.

## Contract Components

Every AXAG semantic contract consists of:

1. **Identity** — Intent and entity declarations
2. **Interface** — Parameters, types, and constraints
3. **Preconditions** — Required state before execution
4. **Postconditions** — Guaranteed state after execution
5. **Safety** — Risk level, confirmation, approval requirements
6. **Execution semantics** — Action type, idempotency, side effects

## Contract Lifecycle

```mermaid
graph LR
    A[Author] --> B[Validate]
    B --> C[Generate Manifest]
    C --> D[Generate Tools]
    D --> E[Agent Consumes]
    E --> F[Monitor Drift]
    F --> A
```

Contracts are authored by frontend engineers, validated by CI, transformed into manifests and tools, consumed by agents, and monitored for drift.

## Next Steps

- [Intent vs Presentation](/docs/concepts/intent-vs-presentation)
- [Specification Overview](/docs/specification/overview)
