---
id: release-notes-model
title: Release Notes Model
sidebar_label: Release Notes Model
slug: /governance/release-notes-model
---

# Release Notes Model

Every AXAG specification release includes structured release notes that communicate changes clearly to all stakeholders.

## Release Note Structure

```markdown
# AXAG v1.1.0 Release Notes

**Release Date**: 2026-09-17
**Status**: Stable
**Previous Version**: 1.0.0

## Highlights
- Brief summary of the most important changes

## New Features
- Feature descriptions with links to documentation

## Breaking Changes
- ⚠️ List of breaking changes with migration guides

## Deprecations
- Features deprecated in this release with removal timeline

## Bug Fixes
- Validation and schema fixes

## Documentation
- New or updated documentation pages

## Migration Guide
- Step-by-step upgrade instructions
```

## Change Categories

| Category | Label | Description |
|----------|-------|-------------|
| New Feature | `feature` | New capability added |
| Breaking Change | `breaking` | Requires consumer changes |
| Deprecation | `deprecated` | Feature scheduled for removal |
| Bug Fix | `fix` | Correction to existing behavior |
| Documentation | `docs` | Documentation-only change |
| Internal | `internal` | Tooling, CI, build changes |

## Audience-Specific Sections

Release notes include audience-specific impact sections:

### For Annotation Authors
What annotations to update, new attributes available, deprecated attributes.

### For Agent Framework Developers
What manifest changes affect tool generation, new fields to consume, removed fields.

### For Platform/DevOps Teams
What CI rules changed, new validation requirements, infrastructure changes.

## Changelog

Each release SHOULD also be recorded in a `CHANGELOG.md` following the [Keep a Changelog](https://keepachangelog.com/) format. For 1.1.0 that entry reads:

```markdown
# Changelog

## [Unreleased]

## [1.1.0] - 2026-09-17
### Added
- `axag` macro attribute (proposed pattern)
- Parameters harvested from form controls, or bound from Zod and OpenAPI schemas
- Manifest fields `tenant_boundary`, `required_roles`, `async` and `dynamic_actions`
- Server-side enforcement requirement for actions at `high` risk and above
- Lint rules AXAG-LINT-027 to AXAG-LINT-037
### Changed
- Conformance levels are named `basic`, `intermediate`, `full`
### Deprecated
- Conformance names `A`, `AA`, `AAA` (still accepted; removal in 2.0.0)
### Fixed
- Vocabulary pages listed action types and scopes the schema never accepted

## [1.0.0]
### Added
- Initial specification
- Core annotation attributes
- Semantic Manifest schema
- Tool generation mapping rules
```
