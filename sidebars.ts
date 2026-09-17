import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    // ─── Introduction ───────────────────────────────
    {
      type: 'category',
      label: 'Introduction',
      collapsed: false,
      items: [
        'intro/what-is-ax',
        'intro/what-is-axag',
        'intro/why-human-interfaces-fail-agents',
        'intro/what-problems-axag-solves',
        'intro/axag-as-semantic-contract',
        'intro/who-should-use-axag',
      ],
    },

    // ─── Getting Started ────────────────────────────
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: true,
      items: [
        'getting-started/mental-model',
        'getting-started/first-annotated-action',
        'getting-started/first-semantic-manifest',
        'getting-started/first-generated-tool',
        'getting-started/first-end-to-end-agent-action',
        'getting-started/implementation-prerequisites',
        'getting-started/sdk',
      ],
    },

    // ─── Core Concepts ──────────────────────────────
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: true,
      items: [
        'concepts/agent-experience',
        'concepts/semantic-contract',
        'concepts/intent-vs-presentation',
        'concepts/affordances',
        'concepts/constraints',
        'concepts/preconditions-postconditions',
        'concepts/context-and-scope',
        'concepts/visibility-vs-operability',
        'concepts/determinism-and-trust',
        'concepts/safety-boundaries',
        'concepts/idempotency-side-effects',
        'concepts/role-awareness-tenant-boundaries',
      ],
    },

    // ─── AXAG Specification ─────────────────────────
    {
      type: 'category',
      label: 'AXAG Specification',
      collapsed: true,
      items: [
        'specification/overview',
        'specification/vocabulary',
        'specification/annotation-primitives',
        'specification/macro-syntax',
        'specification/required-fields',
        'specification/optional-fields',
        'specification/entities',
        'specification/actions',
        'specification/parameters',
        'specification/constraints',
        'specification/risk-classification',
        'specification/safety-boundaries',
        'specification/confirmation-requirements',
        'specification/approval-requirements',
        'specification/context-inheritance',
        'specification/namespacing',
        'specification/versioning',
        'specification/error-semantics',
        'specification/conformance-levels',
      ],
    },

    // ─── Semantic Manifest ──────────────────────────
    {
      type: 'category',
      label: 'Semantic Manifest',
      collapsed: true,
      items: [
        'semantic-manifest/what-it-is',
        'semantic-manifest/why-it-exists',
        'semantic-manifest/manifest-schema',
        'semantic-manifest/generation-model',
        'semantic-manifest/schema-harvesting',
        'semantic-manifest/discovery-model',
        'semantic-manifest/execution-planning-role',
        'semantic-manifest/field-reference',
        'semantic-manifest/manifest-validation',
      ],
    },

    // ─── MCP Tool Generation ────────────────────────
    {
      type: 'category',
      label: 'MCP Tool Generation',
      collapsed: true,
      items: [
        'tool-generation/mapping-rules',
        'tool-generation/tool-signatures',
        'tool-generation/input-schema-translation',
        'tool-generation/constraints-safety-translation',
        'tool-generation/authorization-identity',
        'tool-generation/build-time-compilation',
        'tool-generation/tool-registry-generation',
        'tool-generation/generated-examples',
        'tool-generation/runtime-consumption-patterns',
      ],
    },

    // ─── Frameworks ─────────────────────────────────
    {
      type: 'category',
      label: 'Frameworks',
      collapsed: true,
      items: [
        'frameworks/runtime',
        'frameworks/react',
        'frameworks/vue',
        'frameworks/angular',
        'frameworks/safety',
        'frameworks/bridge',
      ],
    },

    // ─── Authoring Guide ────────────────────────────
    {
      type: 'category',
      label: 'Authoring Guide',
      collapsed: true,
      items: [
        'authoring-guide/annotating-buttons',
        'authoring-guide/annotating-links',
        'authoring-guide/annotating-forms',
        'authoring-guide/annotating-tables',
        'authoring-guide/annotating-search-filters',
        'authoring-guide/annotating-multi-step-workflows',
        'authoring-guide/annotating-approval-gates',
        'authoring-guide/annotating-destructive-actions',
        'authoring-guide/annotating-async-operations',
        'authoring-guide/annotating-composite-flows',
        'authoring-guide/annotating-embedded-widgets',
        'authoring-guide/annotation-reuse',
      ],
    },

    // ─── Use Cases ──────────────────────────────────
    {
      type: 'category',
      label: 'Use Cases',
      collapsed: true,
      items: [
        'use-cases/overview',
        {
          type: 'category',
          label: 'E-Commerce',
          items: [
            'use-cases/ecommerce/product-search',
            'use-cases/ecommerce/cart-and-checkout',
            'use-cases/ecommerce/order-tracking',
            'use-cases/ecommerce/returns',
          ],
        },
        {
          type: 'category',
          label: 'Marketing Automation',
          items: [
            'use-cases/marketing/campaign-creation',
            'use-cases/marketing/audience-segmentation',
            'use-cases/marketing/campaign-scheduling',
          ],
        },
        {
          type: 'category',
          label: 'Sales & CRM',
          items: [
            'use-cases/crm/lead-creation',
            'use-cases/crm/opportunity-progression',
            'use-cases/crm/sales-forecasting',
          ],
        },
        {
          type: 'category',
          label: 'Travel & Booking',
          items: [
            'use-cases/travel/search-and-reservation',
            'use-cases/travel/booking-cancellation',
          ],
        },
        {
          type: 'category',
          label: 'Job Platforms',
          items: [
            'use-cases/jobs/job-search',
            'use-cases/jobs/application-submission',
            'use-cases/jobs/interview-scheduling',
          ],
        },
        {
          type: 'category',
          label: 'Analytics & BI',
          items: [
            'use-cases/analytics/dashboard-filtering',
            'use-cases/analytics/report-generation',
            'use-cases/analytics/dataset-export',
          ],
        },
        {
          type: 'category',
          label: 'Customer Support',
          items: [
            'use-cases/support/ticket-creation',
            'use-cases/support/escalation',
          ],
        },
        {
          type: 'category',
          label: 'Enterprise & SaaS',
          items: [
            'use-cases/enterprise/crud-dashboard',
            'use-cases/enterprise/admin-guarded-actions',
            'use-cases/enterprise/multi-step-approval',
            'use-cases/enterprise/tenant-scoped-admin',
          ],
        },
        'use-cases/cross-domain-comparison',
        'use-cases/accessibility-patterns',
        'use-cases/retry-and-recovery',
      ],
    },

    // ─── Validation ─────────────────────────────────
    {
      type: 'category',
      label: 'Validation',
      collapsed: true,
      items: [
        'validation/static-validation',
        'validation/runtime-validation',
        'validation/ci-linting',
        'validation/schema-conformance',
        'validation/contradictory-annotation-detection',
        'validation/missing-intent-detection',
        'validation/unsafe-mutation-detection',
        'validation/scope-mismatch-detection',
        'validation/risk-level-validation',
        'validation/common-failures',
        'validation/remediation-guidance',
      ],
    },

    // ─── Governance ─────────────────────────────────
    {
      type: 'category',
      label: 'Governance',
      collapsed: true,
      items: [
        'governance/ownership-model',
        'governance/change-review-workflow',
        'governance/version-policy',
        'governance/backward-compatibility',
        'governance/deprecation-strategy',
        'governance/release-notes-model',
        'governance/standard-evolution-process',
        'governance/conformance-adoption-levels',
      ],
    },

    // ─── Reference ──────────────────────────────────
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/schema-reference',
        'reference/annotation-attributes',
        'reference/reserved-terms',
        'reference/error-codes',
        'reference/manifest-fields',
        'reference/tool-mapping-rules',
        'reference/glossary',
        'reference/term-disambiguation',
      ],
    },

    // ─── Tutorials ──────────────────────────────────
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: true,
      items: [
        'tutorials/add-axag-to-page',
        'tutorials/convert-scraping-to-semantic',
        'tutorials/generate-semantic-manifest',
        'tutorials/bind-schemas',
        'tutorials/generate-mcp-tools',
        'tutorials/add-validation-to-ci',
        'tutorials/incremental-rollout',
        'tutorials/cross-domain-example',
      ],
    },

    // ─── Examples ───────────────────────────────────
    {
      type: 'category',
      label: 'Examples',
      collapsed: true,
      items: [
        'examples/overview',
        'examples/before-and-after',
        'examples/anti-patterns',
        'examples/copy-paste-snippets',
        'examples/domain-gallery',
        'examples/proposed-vs-normative',
      ],
    },

    // ─── FAQ ────────────────────────────────────────
    'faq',

    // ─── Contributor Guide ──────────────────────────
    {
      type: 'category',
      label: 'Contributor Guide',
      collapsed: true,
      items: [
        'contributors/guide',
        'contributors/style-guide',
        'contributors/adding-use-cases',
        'contributors/review-checklist',
      ],
    },
  ],
};

export default sidebars;
