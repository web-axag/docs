---
id: execution-planning-role
title: Execution Planning Role
sidebar_label: Execution Planning
slug: /semantic-manifest/execution-planning-role
---
# Execution Planning Role

The manifest enables agent runtimes to plan multi-step workflows by analyzing operation preconditions and postconditions.

## Workflow Planning

Given operations with declared pre/postconditions, an agent can automatically determine execution order:

```
validate_cart       → post: cart_validated
reserve_inventory   → pre: cart_validated → post: inventory_reserved
checkout_begin      → pre: cart_validated, inventory_reserved → post: checkout_session_created
process_payment     → pre: checkout_session_created → post: payment_processed
confirm_order       → pre: payment_processed → post: order_confirmed
```

The agent constructs a dependency graph and executes operations in the correct sequence.

Preconditions and postconditions are strings written for people and agents to read, matched by convention rather than evaluated by AXAG tooling. Use the same wording on both sides — `cart_validated`, not "cart has been validated" in one place and "cart valid" in another — or the chain an agent infers will have gaps. Each operation must still refuse a call whose precondition isn't met, with `AXAG_PRECONDITION_FAILED`.

## Conflict Detection
The manifest also enables agents to detect conflicting operations — for example, two operations that both modify the same entity with incompatible postconditions.
