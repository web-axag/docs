---
id: conformance-levels
title: Conformance Levels
sidebar_label: Conformance Levels
slug: /specification/conformance-levels
---
# Conformance Levels

AXAG defines three conformance levels that represent progressive implementation maturity.

## Basic Conformance
**Minimum viable annotation.** Required fields: `axag-intent`, `axag-entity`, `axag-action-type`.

Suitable for: initial adoption, proof of concept, internal tooling.

## Intermediate Conformance
**Production-ready annotation.** Adds: `axag-required-parameters`, `axag-scope`, `axag-risk-level`, `axag-description`.

Suitable for: production deployments, external-facing products, agent-accessible interfaces.

## Full Conformance
**Enterprise-grade annotation.** Adds all applicable optional dimensions: preconditions, postconditions, side effects, confirmation, approval, idempotency, roles, rate limits.

Suitable for: regulated industries, high-trust agent interactions, enterprise standards compliance.

## Claiming Conformance
Every Semantic Manifest declares its conformance level in the `conformance` field. Generators compute it from the metadata the actions actually declare, so a claim can't exceed what the annotations support:
```json
{
  "version": "1.1.0",
  "conformance": "intermediate",
  "actions": []
}
```

### How Generators Compute It

`@web-axag/compiler` and `axag generate` compute the level from every action in the manifest:

| Level | Every action has | And |
|-------|------------------|-----|
| `basic` | `intent`, `entity`, `action_type`, `description` | — |
| `intermediate` | the above, plus `risk_level`, and `idempotent` on every write or delete | — |
| `full` | the above, plus `scope` | at least one action declares preconditions or side effects |

A manifest that fails a level's checks is reported at the level below it, so the claim never overstates the annotations. Note that the generator looks for `axag-scope` at `full` rather than at `intermediate`, and doesn't require parameters to be declared — an action can legitimately take none.

### Validating Against a Level

`axag validate --level basic|intermediate|full` runs only the lint rules that belong to that level and below: identity, vocabulary and parameters at `basic`; safety, scope and harvesting at `intermediate`; contradictions, manifest cross-references and server enforcement at `full`. The earlier `A`, `AA`, `AAA` names are still accepted and map to `basic`, `intermediate`, `full`.
