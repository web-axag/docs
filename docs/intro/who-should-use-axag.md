---
id: who-should-use-axag
title: Who Should Use AXAG
sidebar_label: Who Should Use AXAG
slug: /intro/who-should-use-axag
description: Target audiences for the AXAG standard and their specific use cases.
keywords: [audience, adoption, roles, teams]
---

# Who Should Use AXAG

AXAG is designed for multiple audiences across the software development lifecycle.

## Frontend Engineers
Annotate UI components with semantic contracts. You add `axag-*` attributes to buttons, forms, tables, and navigation elements to declare their intent, parameters, and constraints.

## Platform Teams
Wire up manifest generation and validation across the product surface — [`@web-axag/compiler`](/docs/tool-generation/build-time-compilation) in the build, [`axag-lint`](/docs/validation/ci-linting) in CI — or build your own tooling against the [manifest schema](/docs/semantic-manifest/manifest-schema).

## Agent Runtime Builders
Consume tool registries generated from AXAG manifests. Your agents discover operations, validate parameters, and execute actions through the semantic contract rather than through scraping.

## Product Architects
Design interaction semantics for your product. Define the vocabulary of intents, entities, and action types that your product exposes to agents.

## API and Integration Teams
Align AXAG semantic contracts with existing API contracts (REST, GraphQL, gRPC). Ensure that UI-facing operations and API-facing operations share consistent semantics.

## Enterprise Standards Committees
Govern the AXAG vocabulary for your organization. Define conformance levels, review processes, and adoption roadmaps.

## Security and Compliance Teams
Review risk classifications, approval requirements, and safety boundaries declared in AXAG annotations. Validate that high-risk operations are gated where it counts — [on the server](/docs/frameworks/safety), not only in the page.

## Next Steps

- [Getting Started: Mental Model](/docs/getting-started/mental-model)
- [Core Concepts](/docs/concepts/agent-experience)
