import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import HomepagePlayground from '@site/src/components/HomepagePlayground';
import HomepagePipeline from '@site/src/components/HomepagePipeline';
import HomepageAgentView from '@site/src/components/HomepageAgentView';
import HomepageStats from '@site/src/components/HomepageStats';
import HomepageDomainCarousel from '@site/src/components/HomepageDomainCarousel';
import NetBackground from '@site/src/components/NetBackground';
import styles from './index.module.css';

/* ─── Typewriter phrases ─────────────────────── */
const phrases = [
  'Eliminate brittle DOM scraping.',
  'Give agents machine-readable intent.',
  'Ship semantic contracts, not CSS selectors.',
  'One annotation → Manifest → Tool → Agent.',
  'Make every UI element agent-accessible.',
];

function useTypewriter(
  items: string[],
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 2200,
) {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');

  useEffect(() => {
    const currentPhrase = items[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length + 1));
        }, typingSpeed);
      } else {
        // Pause then start deleting
        timeout = setTimeout(() => setPhase('deleting'), pauseDuration);
      }
    } else {
      // deleting
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentPhrase.slice(0, text.length - 1));
        }, deletingSpeed);
      } else {
        // Move to next phrase and start typing
        setPhraseIndex((prev) => (prev + 1) % items.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, phraseIndex, items, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
}

/* ─── Hero Section ───────────────────────────── */
function HomepageHero() {
  const typedText = useTypewriter(phrases);

  return (
    <header className={styles.hero}>
      <div className="container">
        <div className={styles.heroLogoRow}>
          <img
            src="/img/axag-logo.svg"
            alt="AXAG Logo"
            className={styles.heroLogo}
            width={120}
            height={125}
          />
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleAx}>AXAG</span>
            <span className={styles.heroTitleSub}>Standard</span>
          </h1>
        </div>
        <p className={styles.heroSubtitle}>Agent Experience Accessibility Guidelines</p>
        <div className={styles.typewriterContainer}>
          <span className={styles.typewriterText}>{typedText}</span>
          <span className={styles.typewriterCursor}>|</span>
        </div>
        <p className={styles.heroAnchor}>
          AX defines the discipline. AXAG defines the executable semantic contract.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/mental-model"
          >
            🚀 Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─── Feature Cards ──────────────────────────── */
const features = [
  {
    title: 'Semantic Contract',
    emoji: '📝',
    description:
      'Every annotated element carries machine-readable intent, constraints, safety rules, and execution semantics.',
    link: '/docs/concepts/semantic-contract',
  },
  {
    title: 'One Attribute',
    emoji: '⚡',
    description:
      'axag="write:user.deactivate!critical?approval" says in one attribute what used to take five. Convert either way with axag fmt.',
    link: '/docs/specification/macro-syntax',
  },
  {
    title: 'Parameters From Your Forms',
    emoji: '📋',
    description:
      'Names, types, constraints and labels are read from the form you already have — or from a Zod schema or OpenAPI operation.',
    link: '/docs/semantic-manifest/schema-harvesting',
  },
  {
    title: 'Built Into Your App',
    emoji: '🔧',
    description:
      'A Vite or webpack plugin emits the manifest and WebMCP tools on every build; React, Vue and Angular bindings register them.',
    link: '/docs/getting-started/sdk',
  },
  {
    title: 'Enforced, Not Just Declared',
    emoji: '🛡️',
    description:
      'Confirmation, approval and tenant boundaries are checked in the page and again on the server, where an agent can\'t skip them.',
    link: '/docs/frameworks/safety',
  },
  {
    title: 'Standards-Grade',
    emoji: '🏆',
    description:
      'A versioned spec, conformance levels, 37 lint rules with SARIF and baselines, and a governance model for enterprise adoption.',
    link: '/docs/specification/conformance-levels',
  },
];

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Why AXAG?</h2>
        <p className={styles.sectionSubtitle}>
          A complete framework for making human interfaces agent-accessible.
        </p>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <Link key={feature.title} to={feature.link} className={styles.featureCard}>
              <span className={styles.featureEmoji}>{feature.emoji}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ─── Install ────────────────────────────────── */
const installSteps = [
  {
    label: 'Check your annotations',
    command: 'npx axag-lint src',
    note: 'No install needed — 37 rules over HTML, JSX, TSX and Vue.',
  },
  {
    label: 'Generate the manifest and tools',
    command: 'npm install -D @web-axag/compiler',
    note: 'A Vite, webpack, Rollup, Rspack or esbuild plugin that runs on every build.',
  },
  {
    label: 'Register tools with the agent',
    command: 'npm install @web-axag/webmcp',
    note: 'Plus @web-axag/react, /vue or /angular to register from components.',
  },
  {
    label: 'Enforce it on your server',
    command: 'npm install @web-axag/server',
    note: 'Confirmation tokens, approvals, roles and tenant boundaries an agent cannot skip.',
  },
];

function HomepageInstall() {
  return (
    <section className={styles.install} id="install">
      <div className="container">
        <h2 className={styles.sectionTitle}>Install the SDK</h2>
        <p className={styles.sectionSubtitle}>
          Thirteen packages under the <code>@web-axag</code> scope, plus the <code>axag</code> and{' '}
          <code>axag-lint</code> commands. Take only the ones you need.
        </p>
        <div className={styles.installGrid}>
          {installSteps.map((step) => (
            <div key={step.command} className={styles.installCard}>
              <span className={styles.installLabel}>{step.label}</span>
              <code className={styles.installCommand}>{step.command}</code>
              <p className={styles.installNote}>{step.note}</p>
            </div>
          ))}
        </div>
        <Link className={styles.installLink} to="/docs/getting-started/sdk">
          Which package does what →
        </Link>
      </div>
    </section>
  );
}

/* ─── Quick Links ────────────────────────────── */
function HomepageQuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Dive Deeper</h2>
        <div className={styles.quickGrid}>
          <Link to="/docs/tutorials/add-axag-to-page" className={styles.quickCard}>
            <span className={styles.quickIcon}>📖</span>
            <div>
              <h4>Tutorials</h4>
              <p>Step-by-step guides from first annotation to agent action.</p>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>
          <Link to="/docs/use-cases/overview" className={styles.quickCard}>
            <span className={styles.quickIcon}>🏭</span>
            <div>
              <h4>Use Cases</h4>
              <p>E-commerce, CRM, marketing, travel — AXAG across industries.</p>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>
          <Link to="/docs/examples/anti-patterns" className={styles.quickCard}>
            <span className={styles.quickIcon}>⚠️</span>
            <div>
              <h4>Anti-Patterns</h4>
              <p>Common mistakes that break agent interaction and how to fix them.</p>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>
          <Link to="/docs/getting-started/sdk" className={styles.quickCard}>
            <span className={styles.quickIcon}>📦</span>
            <div>
              <h4>The SDK</h4>
              <p>Compiler, WebMCP runtime, React, Vue and Angular bindings, server enforcement and a linter.</p>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Banner ─────────────────────────────── */
function HomepageCTA() {
  return (
    <section className={styles.cta}>
      <div className="container">
        <h2>Ready to make your UI agent-accessible?</h2>
        <p>Start with a single annotation. Let your build turn it into tools an agent can use.</p>
        <div className={styles.ctaButtons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/first-annotated-action"
          >
            Add Your First Annotation
          </Link>
          <Link className="button button--outline button--lg" to="/#install">
            ⚡ Install the SDK
          </Link>
          <Link className="button button--outline button--lg" to="/docs/getting-started/sdk">
            📦 Explore the SDK
          </Link>
          <Link
            className="button button--outline button--lg"
            to="https://github.com/web-axag/sdk"
          >
            ⭐ Star on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function Home(): JSX.Element {
  return (
    <Layout
      title="AXAG Standard — Agent Experience Accessibility Guidelines"
      description="A semantic contract standard that makes human interfaces machine-readable for AI agents. Eliminate scraping. Ship semantic contracts."
    >
      <NetBackground />
      <HomepageHero />
      <main>
        <HomepagePipeline />
        <HomepagePlayground />
        <HomepageAgentView />
        <HomepageStats />
        <HomepageFeatures />
        <HomepageInstall />
        <HomepageDomainCarousel />
        <HomepageQuickLinks />
        <HomepageCTA />
      </main>
    </Layout>
  );
}
