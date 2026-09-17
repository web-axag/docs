---
id: term-disambiguation
title: Term Disambiguation
sidebar_label: Term Disambiguation
slug: /reference/term-disambiguation
---

# Term Disambiguation

Some terms in the AXAG ecosystem overlap with terms from related fields. This page clarifies the specific AXAG meaning.

## Action vs. Event

| Term | AXAG Meaning | Common Meaning |
|------|-------------|----------------|
| **Action** | An agent-invocable operation declared with `axag-intent` | Any user interaction (click, scroll, type) |

In AXAG, "action" specifically means a declared, tool-generatable operation — not every user interaction.

## Annotation vs. Attribute

| Term | AXAG Meaning | HTML Meaning |
|------|-------------|--------------|
| **Annotation** | The complete set of `axag-*` attributes on an element | Any HTML attribute |
| **Attribute** | A single `axag-*` key-value pair | A single HTML attribute |

An annotation is composed of multiple attributes. An element with `axag-intent`, `axag-entity`, and `axag-action-type` has one annotation consisting of three attributes.

## Intent vs. Event vs. Command

| Term | Meaning in AXAG | Similar Concepts |
|------|----------------|------------------|
| **Intent** | What the action is meant to accomplish (`product.search`) | REST endpoint, RPC method name |
| **Event** | Not an AXAG concept | DOM events, webhooks, pub/sub messages |
| **Command** | Not an AXAG concept | CQRS commands, CLI commands |

AXAG uses "intent" to emphasize that the annotation describes *purpose*, not *mechanism*.

## Manifest vs. Schema vs. Spec

| Term | AXAG Meaning |
|------|-------------|
| **Semantic Manifest** | The JSON document containing all actions for a site |
| **Schema** | The JSON Schema definition that validates a manifest |
| **Specification** | The AXAG standard itself (this documentation) |
| **Spec (object)** | In the SDK, the object `defineAction({...})` returns — one action described in TypeScript instead of attributes. See [React](/docs/frameworks/react). |

## Confirmation vs. Approval

| Term | What It Is | When Required | Who Decides |
|------|-----------|---------------|-------------|
| **Confirmation** | User acknowledges the action | `risk_level >= high` | The user themselves |
| **Approval** | Authorized role authorizes the action | Business rule | A designated approver role |

Confirmation is "Are you sure?" — the user agrees.  
Approval is "Is this authorized?" — a privileged role agrees.

An action can require both: the user confirms, then a super_admin approves.

## Scope vs. Tenant Boundary

| Term | What It Defines |
|------|----------------|
| **Scope** | What data the action can access (`public`, `user`, `tenant`, `global`) |
| **Tenant Boundary** | How strictly tenant isolation is enforced (`strict`, `relaxed`) |

Scope declares the *access level*. Tenant boundary declares the *enforcement level*.

## Idempotent vs. Safe

| Term | Meaning |
|------|---------|
| **Idempotent** | Calling twice produces the same result (but may have side-effects the first time) |
| **Safe (read-only)** | Has no side-effects at all |

All read actions are safe AND idempotent.  
Some write actions are idempotent but NOT safe (e.g., `PUT` that updates a record).

## Risk Level vs. Action Type

Risk level and action type are orthogonal:

| | `read` | `write` | `delete` |
|--|--------|---------|----------|
| `none` | ✅ Common | Rare | Never |
| `low` | Possible | ✅ Common | Rare |
| `medium` | Possible | ✅ Common | Possible |
| `high` | Rare | ✅ Common | ✅ Common |
| `critical` | Rare | ✅ Common | Possible |

## Manifest vs Tool Registry vs Registered Tools

| Term | What It Is |
|------|-----------|
| **Semantic Manifest** | Every action a build could find, as JSON — the source of truth |
| **Tool Registry** | Those actions rewritten as MCP tool definitions, in a file |
| **Registered tools** | What an agent in the browser actually sees right now: the actions whose elements are on screen, registered with `document.modelContext` |

The first two are files produced at build time. The third is live, and smaller: a tool disappears when its control does.

