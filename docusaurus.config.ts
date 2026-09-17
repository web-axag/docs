import { axagLight, axagDark } from './src/theme/prism-themes';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AXAG Standard',
  tagline: 'Agent Experience Accessibility Guidelines — Designing Interfaces for AI Agents as First-Class Clients',
  favicon: 'img/favicon.svg',

  url: 'https://axag.org',
  baseUrl: '/',

  organizationName: 'web-axag',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AXAG Standard',
        alternateName: 'Agent Experience Accessibility Guidelines',
        url: 'https://axag.org',
        description:
          'An open standard for designing web interfaces that AI agents can understand and interact with as first-class clients.',
        publisher: {
          '@type': 'Organization',
          name: 'AXAG Standard Contributors',
          url: 'https://github.com/web-axag',
        },
      }),
    },
    // Plain-text entry points, so a model can read the standard without rendering it.
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        href: 'https://axag.org/llms.txt',
        title: 'AXAG for language models — page index',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        href: 'https://axag.org/llms-full.txt',
        title: 'AXAG for language models — full text',
      },
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/web-axag/docs/tree/main/',
          showLastUpdateTime: true,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: {
          customCss: [
            './src/css/custom.css',
            './src/css/code-blocks.css',
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/axag-social-card.png',

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },

    /* Global copy button on all code blocks */
    codeBlock: {
      showCopyButton: true,
    },

    navbar: {
      title: 'AXAG',
      logo: {
        alt: 'AXAG Standard Logo',
        src: 'img/axag-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/specification/overview',
          label: 'Specification',
          position: 'left',
        },
        {
          to: '/docs/use-cases/overview',
          label: 'Use Cases',
          position: 'left',
        },
        {
          to: '/docs/examples/overview',
          label: 'Examples',
          position: 'left',
        },
        {
          to: '/docs/reference/schema-reference',
          label: 'Reference',
          position: 'left',
        },
        {
          to: '/docs/getting-started/sdk',
          label: 'SDK',
          position: 'right',
        },
        {
          href: 'https://cli.axag.org',
          label: 'CLI',
          position: 'right',
        },
        {
          href: 'https://github.com/web-axag/docs',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            { label: 'Introduction', to: '/docs/intro/what-is-ax' },
            { label: 'Getting Started', to: '/docs/getting-started/mental-model' },
            { label: 'Core Concepts', to: '/docs/concepts/agent-experience' },
            { label: 'Tutorials', to: '/docs/tutorials/add-axag-to-page' },
            { label: 'The SDK', to: '/docs/getting-started/sdk' },
            { label: 'Frameworks', to: '/docs/frameworks/runtime' },
          ],
        },
        {
          title: 'Specification',
          items: [
            { label: 'Overview', to: '/docs/specification/overview' },
            { label: 'Vocabulary', to: '/docs/specification/vocabulary' },
            { label: 'Semantic Manifest', to: '/docs/semantic-manifest/what-it-is' },
            { label: 'Tool Generation', to: '/docs/tool-generation/mapping-rules' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Contributing', to: '/docs/contributors/guide' },
            { label: 'Governance', to: '/docs/governance/ownership-model' },
            { label: 'GitHub (Docs)', href: 'https://github.com/web-axag/docs' },
            { label: 'GitHub (SDK)', href: 'https://github.com/web-axag/sdk' },
            { label: 'CLI Documentation', href: 'https://cli.axag.org' },
            { label: 'Discussions', href: 'https://github.com/web-axag/docs/discussions' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'FAQ', to: '/docs/faq' },
            { label: 'Glossary', to: '/docs/reference/glossary' },
            { label: 'Anti-Patterns', to: '/docs/examples/anti-patterns' },
            { label: 'Reference', to: '/docs/reference/schema-reference' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AXAG Standard Contributors. Built with Docusaurus.`,
    },

    prism: {
      theme: axagLight,
      darkTheme: axagDark,
      defaultLanguage: 'html',
      additionalLanguages: [
        'json',
        'bash',
        'typescript',
        'jsx',
        'tsx',
        'yaml',
        'markup',
        'css',
        'python',
        'diff',
        'http',
        'graphql',
        'sql',
      ],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'axag-attr-highlight',
          line: 'axag-highlight-next-line',
          block: { start: 'axag-highlight-start', end: 'axag-highlight-end' },
        },
      ],
    },

    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    metadata: [
      {
        name: 'description',
        content: 'AXAG (Agent Experience Accessibility Guidelines) is an open standard for designing web interfaces that AI agents can understand and interact with as first-class clients.',
      },
      {
        name: 'keywords',
        content: 'AXAG, Agent Experience Accessibility Guidelines, agent experience, semantic contract, MCP, Model Context Protocol, AI agents, accessibility, web standards, semantic HTML, agent-first design',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'AXAG Standard' },
      {
        property: 'og:title',
        content: 'AXAG Standard — Agent Experience Accessibility Guidelines',
      },
      {
        property: 'og:description',
        content: 'An open standard for designing web interfaces that AI agents can understand and interact with as first-class clients.',
      },
      { property: 'og:url', content: 'https://axag.org' },
      { property: 'og:image', content: 'https://axag.org/img/axag-social-card.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'AXAG Standard — Agent Experience Accessibility Guidelines',
      },
      {
        name: 'twitter:description',
        content: 'An open standard for designing web interfaces that AI agents can understand and interact with as first-class clients.',
      },
      { name: 'twitter:image', content: 'https://axag.org/img/axag-social-card.png' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'AXAG Standard Contributors' },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
