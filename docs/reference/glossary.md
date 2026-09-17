---
id: glossary
title: Glossary
sidebar_label: Glossary
slug: /reference/glossary
---

# Glossary

Canonical definitions of terms used throughout the AXAG specification.

## A

**Action** — A discrete operation that an agent can perform on an entity. Defined by an intent, entity, and action type.

**Action Type** — Classification of an action as `read`, `write`, `delete` or `navigate`.

**Affordance** — A property of an interface element that communicates what actions are possible. In AXAG, affordances are declared via `axag-*` attributes rather than visual cues.

**Agent** — An AI system that performs tasks autonomously on behalf of a user by interpreting semantic contracts and invoking tools.

**Agent Experience (AX)** — The discipline of designing interfaces and systems that are optimized for autonomous agent consumption, distinct from User Experience (UX).

**Annotation** — An `axag-*` HTML attribute added to a UI element to declare its semantic intent, parameters, and constraints.

**Approval** — A gate that requires authorization from a designated role before an action can execute. Stronger than confirmation.

**AXAG** — Agent Experience Accessibility Guidelines. The specification that defines how to annotate web interfaces for agent consumption.

## C

**Confirmation** — A gate that requires explicit user acknowledgment before a high-risk action executes.

**Conformance Level** — A tier of AXAG compliance: `basic` (required fields), `intermediate` (risk and safety metadata), `full` (scope and declared conditions as well). The legacy names `A`, `AA`, `AAA` map onto these.

**Constraint** — A validation rule on a parameter (type, range, enum, format, pattern).

## D

**Determinism** — The property that an action produces predictable, consistent results given the same inputs and preconditions.

## E

**Entity** — A domain object that actions operate on (e.g., product, cart, user, ticket).

## I

**Idempotent** — An operation that produces the same result when called multiple times with the same parameters.

**Intent** — The canonical identifier for an action, following the `entity.verb` pattern in snake_case (e.g., `product.search`, `cart.add_item`).

**Inheritance** — A container's `axag-scope`, `axag-tenant-boundary` and `axag-required-roles` apply to the annotations inside it. See [Context Inheritance](/docs/specification/context-inheritance).

## M

**Manifest** — See Semantic Manifest.

**Macro** — The `axag` shorthand attribute that packs identity and safety fields into one string, e.g. `axag="write:user.deactivate!critical?approval"`. Expands to the longhand attributes.

**MCP** — Model Context Protocol. A standard for AI agent tool integration. AXAG-generated tools target MCP format.

## H

**Harvesting** — Reading parameters from the markup — a form's controls, their names, labels, types and HTML constraints — rather than declaring them on the annotation. See [Schema Harvesting](/docs/semantic-manifest/schema-harvesting).

## P

**Postcondition** — A condition guaranteed to be true after successful execution of an action.

**Precondition** — A condition that MUST be true before an action can execute.

## R

**Risk Level** — Classification of an action's potential impact: `none`, `low`, `medium`, `high`, `critical`.

## S

**Safety Boundary** — The set of constraints (confirmation, approval, scope, tenant boundary) that protect against unintended agent actions.

**Scope** — The data access boundary for an action: `public`, `user`, `tenant`, `global`.

**Semantic Contract** — The machine-readable agreement between a UI and its agent consumers, defined by AXAG annotations and the Semantic Manifest.

**Semantic Manifest** — A JSON document that aggregates all AXAG annotations from a site into a discoverable, machine-readable contract.

**Side Effect** — An external consequence of executing an action (e.g., email sent, payment processed, inventory updated).

## T

**Tenant Boundary** — The isolation enforcement level for multi-tenant operations: `strict` (no cross-tenant access) or `relaxed`.

**Tool** — A callable function generated from a Semantic Manifest action, consumable by AI agents via MCP or similar protocols.

**Tool Generation** — The process of converting Semantic Manifest actions into MCP-compatible tool definitions.

## W

**WebMCP** — The browser API (`document.modelContext`) through which a page registers tools with an agent running in the browser. See [Agent Runtime](/docs/frameworks/runtime).
