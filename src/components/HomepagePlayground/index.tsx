import React, { useState, useCallback, useMemo } from 'react';
import styles from './styles.module.css';

const DEFAULT_HTML = `<button
  axag-intent="product.search"
  axag-entity="product"
  axag-action-type="read"
  axag-required-parameters='["query"]'
  axag-optional-parameters='["category","price_min","price_max"]'
  axag-risk-level="none"
  axag-idempotent="true"
  axag-description="Search the product catalogue"
>
  Search Products
</button>`;

interface ParsedAnnotation {
  intent?: string;
  entity?: string;
  actionType?: string;
  requiredParameters?: string[];
  optionalParameters?: string[];
  riskLevel?: string;
  idempotent?: boolean;
  description?: string;
  confirmationRequired?: boolean;
  approvalRequired?: boolean;
  approvalRoles?: string[];
  preconditions?: string[];
  postconditions?: string[];
  sideEffects?: string[];
  scope?: string;
  requiredRoles?: string[];
  constraints?: string;
}

function parseAxagAttributes(html: string): ParsedAnnotation {
  const result: ParsedAnnotation = {};

  const attrMap: Record<string, keyof ParsedAnnotation> = {
    'axag-intent': 'intent',
    'axag-entity': 'entity',
    'axag-action-type': 'actionType',
    'axag-risk-level': 'riskLevel',
    'axag-description': 'description',
    'axag-scope': 'scope',
    'axag-constraints': 'constraints',
  };

  const boolMap: Record<string, keyof ParsedAnnotation> = {
    'axag-idempotent': 'idempotent',
    'axag-confirmation-required': 'confirmationRequired',
    'axag-approval-required': 'approvalRequired',
  };

  const arrayMap: Record<string, keyof ParsedAnnotation> = {
    'axag-required-parameters': 'requiredParameters',
    'axag-optional-parameters': 'optionalParameters',
    'axag-approval-roles': 'approvalRoles',
    'axag-preconditions': 'preconditions',
    'axag-postconditions': 'postconditions',
    'axag-side-effects': 'sideEffects',
    'axag-required-roles': 'requiredRoles',
  };

  // Parse string attributes
  for (const [attr, key] of Object.entries(attrMap)) {
    const match = html.match(new RegExp(`${attr}=["']([^"']*)["']`));
    if (match) {
      (result as any)[key] = match[1];
    }
  }

  // Parse boolean attributes
  for (const [attr, key] of Object.entries(boolMap)) {
    const match = html.match(new RegExp(`${attr}=["']([^"']*)["']`));
    if (match) {
      (result as any)[key] = match[1] === 'true';
    }
  }

  // Parse array attributes (JSON arrays in single quotes)
  for (const [attr, key] of Object.entries(arrayMap)) {
    const match = html.match(new RegExp(`${attr}='(\\[.*?\\])'`));
    if (match) {
      try {
        (result as any)[key] = JSON.parse(match[1]);
      } catch {
        // skip invalid JSON
      }
    }
  }

  return result;
}

// Mirrors @web-axag/core's readAnnotation and actionToTool so the playground shows real output.
function humanizeIntent(intent: string): string {
  return intent.replace(/\./g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function generateManifest(parsed: ParsedAnnotation): object | null {
  if (!parsed.intent) return null;

  const toParams = (names?: string[]) => (names ?? []).map(name => ({ name, type: 'string' }));
  const action: any = {
    intent: parsed.intent,
    entity: parsed.entity || parsed.intent.split('.')[0],
    action_type: parsed.actionType || 'read',
    operation_id: parsed.intent.replace(/\./g, '_'),
    description: parsed.description || humanizeIntent(parsed.intent),
    required_parameters: toParams(parsed.requiredParameters),
    optional_parameters: toParams(parsed.optionalParameters),
  };

  if (parsed.riskLevel) action.risk_level = parsed.riskLevel;
  if (parsed.confirmationRequired !== undefined) action.confirmation_required = parsed.confirmationRequired;
  if (parsed.approvalRequired !== undefined) action.approval_required = parsed.approvalRequired;
  if (parsed.approvalRoles) action.approval_roles = parsed.approvalRoles;
  if (parsed.idempotent !== undefined) action.idempotent = parsed.idempotent;
  if (parsed.scope) action.scope = parsed.scope;
  if (parsed.requiredRoles) action.required_roles = parsed.requiredRoles;
  if (parsed.sideEffects) action.side_effects = parsed.sideEffects;
  if (parsed.preconditions) action.preconditions = parsed.preconditions;
  if (parsed.postconditions) action.postconditions = parsed.postconditions;

  return action;
}

function generateMCPTool(parsed: ParsedAnnotation): object | null {
  const action = generateManifest(parsed) as any;
  if (!action) return null;

  const properties: Record<string, { type: string }> = {};
  for (const param of [...action.required_parameters, ...action.optional_parameters]) {
    properties[param.name] = { type: param.type };
  }

  const metadata: any = {
    action_type: action.action_type,
    risk_level: action.risk_level ?? 'none',
    idempotent: action.idempotent ?? false,
    confirmation_required: action.confirmation_required ?? false,
    approval_required: action.approval_required ?? false,
    source_intent: action.intent,
    source_entity: action.entity,
  };
  for (const key of ['approval_roles', 'scope', 'required_roles', 'side_effects', 'preconditions', 'postconditions']) {
    if (action[key] !== undefined && action[key].length !== 0) metadata[key] = action[key];
  }

  return {
    name: action.intent.replace(/\./g, '_'),
    description: action.description,
    input_schema: {
      type: 'object',
      properties,
      required: action.required_parameters.map((p: { name: string }) => p.name),
    },
    metadata,
  };
}

type TabId = 'manifest' | 'mcp-tool';

export default function HomepagePlayground(): JSX.Element {
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [activeTab, setActiveTab] = useState<TabId>('manifest');

  const parsed = useMemo(() => parseAxagAttributes(html), [html]);
  const manifest = useMemo(() => generateManifest(parsed), [parsed]);
  const mcpTool = useMemo(() => generateMCPTool(parsed), [parsed]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtml(e.target.value);
  }, []);

  const outputJson = activeTab === 'manifest' ? manifest : mcpTool;
  const attributeCount = Object.keys(parsed).filter(k => (parsed as any)[k] !== undefined).length;

  return (
    <section className={styles.playground}>
      <div className="container">
        <div className={styles.header}>
          <h2>Try It Live</h2>
          <p>
            Edit the HTML below — watch the Semantic Manifest and MCP Tool
            generate in real time.
          </p>
        </div>

        <div className={styles.editorContainer}>
          {/* Left Panel — HTML Editor */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} style={{ background: '#ef4444' }} />
              <span className={styles.panelDot} style={{ background: '#f59e0b' }} />
              <span className={styles.panelDot} style={{ background: '#22c55e' }} />
              <span className={styles.panelTitle}>index.html</span>
              <span className={styles.badge}>
                {attributeCount} attribute{attributeCount !== 1 ? 's' : ''} detected
              </span>
            </div>
            <textarea
              className={styles.codeEditor}
              value={html}
              onChange={handleChange}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          {/* Connector Arrow */}
          <div className={styles.connector}>
            <div className={styles.connectorArrow}>
              <svg width="40" height="24" viewBox="0 0 40 24">
                <defs>
                  <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--ifm-color-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--ifm-color-primary)" />
                  </linearGradient>
                </defs>
                <path d="M0 12 L30 12 M24 6 L32 12 L24 18" stroke="url(#arrowGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className={styles.connectorLabel}>generates</span>
          </div>

          {/* Right Panel — Output */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelDot} style={{ background: '#ef4444' }} />
              <span className={styles.panelDot} style={{ background: '#f59e0b' }} />
              <span className={styles.panelDot} style={{ background: '#22c55e' }} />
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === 'manifest' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('manifest')}
                >
                  Manifest
                </button>
                <button
                  className={`${styles.tab} ${activeTab === 'mcp-tool' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('mcp-tool')}
                >
                  MCP Tool
                </button>
              </div>
            </div>
            <pre className={styles.codeOutput}>
              <code>
                {outputJson
                  ? JSON.stringify(outputJson, null, 2)
                  : '// Add axag-intent to see output'}
              </code>
            </pre>
          </div>
        </div>

        <p className={styles.hint}>
          💡 Try changing <code>axag-action-type</code> to <code>"write"</code> and
          adding <code>axag-risk-level="high"</code> — watch the safety metadata appear.
        </p>
      </div>
    </section>
  );
}
