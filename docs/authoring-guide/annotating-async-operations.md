---
id: annotating-async-operations
title: Annotating Async Operations
sidebar_label: Async Operations
slug: /authoring-guide/annotating-async-operations
---
# Annotating Async Operations

Asynchronous operations return before their result is ready. Mark them with `axag-async="true"`, and declare what becomes true once the work finishes as a postcondition, so an agent knows not to treat the first response as the result.

```html title="Async operation — report generation" showLineNumbers
<button
  axag-intent="report.generate"
  axag-entity="report"
  axag-action-type="write"
  axag-required-parameters='["report_type","date_range"]'
  axag-risk-level="low"
  axag-idempotent="false"
  axag-async="true"
  axag-postconditions='["report_ready"]'
  axag-description="Starts generating a report; it is ready when report.get_status returns complete"
>Generate Report</button>

<button
  axag-intent="report.get_status"
  axag-entity="report"
  axag-action-type="read"
  axag-required-parameters='["report_id"]'
  axag-risk-level="none"
  axag-idempotent="true"
>Check Status</button>
```

`axag-async` is carried into the manifest as `async: true` and into the generated tool's metadata. The agent should then poll the companion read action rather than blocking on, or retrying, the call that started the work.

## Polling Hints

AXAG 1.1 has no attribute for a polling endpoint or an expected duration. Expose status as its own read action, as above, which every agent can already call. If you also want to publish hints, use a [namespaced extension](/docs/specification/namespacing) — `axag-x-acme-poll-interval="5s"` — though AXAG tooling ignores extensions, so the hints reach only the agents you tell about them. Polling hints as manifest fields are a [proposed pattern](/docs/examples/proposed-vs-normative).
