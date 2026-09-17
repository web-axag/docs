---
id: retry-and-recovery
title: Failure Recovery and Retry Flows
sidebar_label: Retry & Recovery
slug: /use-cases/retry-and-recovery
---

# Failure Recovery and Retry Flows

Agent-operated workflows will encounter failures — network timeouts, validation errors, rate limits, transient service outages. AXAG provides the semantic metadata agents need to decide whether to retry, how to recover, and when to escalate.

## Problem Statement

When an agent executes an operation and it fails, the agent needs to answer:

1. **Can I safely retry?** — Is the operation idempotent?
2. **What went wrong?** — Is this a transient error or a permanent failure?
3. **What are the preconditions?** — Do I need to re-establish state before retrying?
4. **Are there side effects?** — Has anything already happened that shouldn't repeat?
5. **Should I escalate?** — Is this a failure a human should handle?

Without AXAG, the agent has no structured way to answer these questions.

## Why Human-Only Semantics Fail Agents

When an operation fails in a human interface:
- A toast notification appears ("Something went wrong, try again")
- An error modal pops up with a generic message
- The page redirects to an error state

Agents cannot interpret these visual cues. They need machine-readable error semantics and retry guidance.

## AXAG Retry Metadata

### Idempotent Operations (Safe to Retry)

```html title="✅ Idempotent — safe to retry"
<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-idempotent="true"
  axag-risk-level="none"
  axag-description="Search products — safe to retry on failure"
>Search</button>
```

When `axag-idempotent="true"`, the agent can safely retry without concern about duplicate side effects.

### Non-Idempotent Operations (Retry with Caution)

```html title="⚠️ Non-idempotent — do NOT retry blindly" showLineNumbers
<button
  axag-intent="order.place"
  axag-entity="order"
  axag-action-type="write"
  axag-idempotent="false"
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-side-effects='["payment_charged","inventory_deducted","confirmation_email_sent"]'
  axag-description="Place an order — do NOT retry blindly"
>Place Order</button>
```

When `axag-idempotent="false"` and side effects are declared, the agent knows:
- Retrying may cause duplicate charges
- It should check order status before retrying
- Escalation to a human may be safer than automatic retry

## Error Semantics

A refused call comes back in one flat shape, with a code an agent can branch on:

```json title="AXAG refusal — structured failure info"
{
  "error": "AXAG_PRECONDITION_FAILED",
  "status": 412,
  "message": "Precondition not met: cart must not be empty",
  "intent": "order.place",
  "details": { "failed_precondition": "cart_not_empty" }
}
```

### Deciding Whether to Retry

The code says what went wrong; the annotation says whether trying again is safe.

| Error Code | Retry? | Agent Action |
|-----------|--------|-------------|
| `AXAG_PRECONDITION_FAILED` | After fixing state | Satisfy the precondition, then retry |
| `AXAG_MISSING_PARAM`, `AXAG_INVALID_TYPE`, `AXAG_OUT_OF_RANGE`, `AXAG_INVALID_ENUM`, `AXAG_INVALID_FORMAT` | With corrected parameters | Fix parameters, then retry |
| `AXAG_CONFIRMATION_MISSING` | After the person confirms | Ask the person, then retry with the new token |
| `AXAG_APPROVAL_MISSING` | After approval is granted | Request approval, then retry |
| `AXAG_ROLE_INSUFFICIENT`, `AXAG_APPROVAL_INVALID` | No | Escalate to a person |
| `AXAG_SCOPE_VIOLATION`, `AXAG_TENANT_BOUNDARY` | No | Stop — the call was out of bounds |
| `AXAG_INTENT_NOT_FOUND` | After refreshing tools | The action may no longer be on the page |
| Network failure or HTTP 5xx | Only if `idempotent` is `true` | Retry with exponential backoff; otherwise check state first |

Transport failures — timeouts, 5xx — aren't AXAG refusals, and they are where `axag-idempotent` matters most: the agent can't tell whether a non-idempotent write happened, so it should read the entity's state before trying again. See the [Error Codes Reference](/docs/reference/error-codes).

## Recovery Flow Example

### Checkout with Automatic Recovery

```html title="3-step checkout with recovery annotations" showLineNumbers
<!-- Step 1: Validate Cart (idempotent, safe to retry) -->
<button
  axag-intent="cart.validate"
  axag-entity="cart"
  axag-action-type="read"
  axag-required-parameters='["cart_id"]'
  axag-idempotent="true"
  axag-postconditions='["cart_valid"]'
  axag-risk-level="none"
>Validate Cart</button>

<!-- Step 2: Reserve Inventory (idempotent with same cart_id) -->
<button
  axag-intent="inventory.reserve"
  axag-entity="inventory"
  axag-action-type="write"
  axag-required-parameters='["cart_id"]'
  axag-preconditions='["cart_valid"]'
  axag-postconditions='["inventory_reserved"]'
  axag-idempotent="true"
  axag-risk-level="low"
  axag-side-effects='["inventory_hold_created"]'
>Reserve Inventory</button>

<!-- Step 3: Process Payment (NOT idempotent) -->
<button
  axag-intent="payment.charge"
  axag-entity="payment"
  axag-action-type="write"
  axag-required-parameters='["cart_id","payment_method_id",{"name":"amount","type":"number","min":0.01}]'
  axag-preconditions='["inventory_reserved","payment_method_valid"]'
  axag-postconditions='["payment_processed"]'
  axag-idempotent="false"
  axag-risk-level="high"
  axag-confirmation-required="true"
  axag-side-effects='["payment_charged"]'
  axag-description="Charge the payment method for the cart. Not idempotent: check payment status before retrying"
>Process Payment</button>
```

**Agent recovery logic:**
1. If Step 1 fails → retry immediately (idempotent read)
2. If Step 2 fails → retry (idempotent with same cart_id)
3. If Step 3 fails → **do NOT retry** — check payment status first, then decide

## Semantic Manifest

Retry behaviour isn't a separate block in the manifest. It follows from fields the action already has — `idempotent`, `side_effects`, `preconditions` — and the description is the place for a recovery hint written for the agent.

```json title="Manifest — payment.charge" showLineNumbers
{
  "intent": "payment.charge",
  "entity": "payment",
  "action_type": "write",
  "operation_id": "payment_charge",
  "description": "Charge the payment method for the cart. Not idempotent: check payment status before retrying",
  "required_parameters": [
    { "name": "cart_id", "type": "string" },
    { "name": "payment_method_id", "type": "string" },
    { "name": "amount", "type": "number", "min": 0.01 }
  ],
  "optional_parameters": [],
  "risk_level": "high",
  "confirmation_required": true,
  "idempotent": false,
  "side_effects": ["payment_charged"],
  "preconditions": ["inventory_reserved", "payment_method_valid"],
  "postconditions": ["payment_processed"]
}
```

## Generated WebMCP Tool

`idempotent: false` becomes `idempotentHint: false`, which agent hosts read to decide whether a failed call may be retried automatically.

```json title="Tool — payment_charge (no auto-retry)" showLineNumbers
{
  "name": "payment_charge",
  "description": "Charge the payment method for the cart. Not idempotent: check payment status before retrying",
  "inputSchema": {
    "type": "object",
    "properties": {
      "cart_id": { "type": "string" },
      "payment_method_id": { "type": "string" },
      "amount": { "type": "number", "minimum": 0.01 }
    },
    "required": ["cart_id", "payment_method_id", "amount"]
  },
  "annotations": {
    "readOnlyHint": false,
    "destructiveHint": false,
    "idempotentHint": false,
    "axag": {
      "action_type": "write",
      "risk_level": "high",
      "idempotent": false,
      "confirmation_required": true,
      "approval_required": false,
      "source_intent": "payment.charge",
      "source_entity": "payment",
      "side_effects": ["payment_charged"],
      "preconditions": ["inventory_reserved", "payment_method_valid"],
      "postconditions": ["payment_processed"]
    }
  }
}
```

## Why Scraping Fails Here

When an agent scrapes a checkout page and encounters an error:
- It sees a toast saying "Payment failed, please try again"
- It cannot determine if the payment was partially processed
- It cannot tell if retrying will cause a double charge
- It has no structured error code to interpret

## How AXAG Eliminates Scraping

With AXAG:
- `axag-idempotent="false"` tells the agent: **do not retry blindly**
- `axag-side-effects='["payment_charged"]'` warns of irreversible consequences
- Structured error codes provide machine-readable failure categories
- Recovery hints guide the agent to safe next steps

## Next Steps

- [Accessibility-Aligned Patterns](/docs/use-cases/accessibility-patterns)
- [Error Semantics](/docs/specification/error-semantics)
- [Error Codes Reference](/docs/reference/error-codes)
