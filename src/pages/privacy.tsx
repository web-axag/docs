import React from 'react';
import Layout from '@theme/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout
      title="Privacy Policy — AXAG DevTools"
      description="Privacy policy for the AXAG DevTools Chrome extension"
    >
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'inherit' }}>
        <h1>Privacy Policy — AXAG DevTools Chrome Extension</h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Last updated: March 22, 2026
        </p>

        <hr />

        <h2>1. Overview</h2>
        <p>
          This Privacy Policy describes how the <strong>AXAG DevTools</strong> Chrome extension ("the Extension")
          operates with respect to your data. The Extension is developed and maintained by the AXAG Standard
          contributors and is available at{' '}
          <a href="https://axag.org">axag.org</a>.
        </p>
        <p>
          <strong>
            The AXAG DevTools extension does not collect, store, transmit, share, or sell any personal data or
            user information of any kind.
          </strong>
        </p>

        <h2>2. What the Extension Does</h2>
        <p>
          AXAG DevTools is a browser developer tool that helps web developers visualize and inspect
          <code> axag-*</code> semantic annotation attributes on the currently active browser tab. When activated
          by the user, it:
        </p>
        <ul>
          <li>Reads the DOM of the current tab to count and highlight elements that have <code>axag-*</code> attributes</li>
          <li>Injects a visual overlay (CSS outlines and labels) onto the page to highlight annotated elements</li>
          <li>Displays summary statistics (total elements, action types, critical risk elements) in the popup</li>
        </ul>

        <h2>3. Data We Do Not Collect</h2>
        <p>The Extension does <strong>not</strong>:</p>
        <ul>
          <li>Collect, store, or transmit any personally identifiable information (PII)</li>
          <li>Access or read any form input values, passwords, cookies, or session tokens</li>
          <li>Send any data to any external server, API, or third-party service</li>
          <li>Use analytics, telemetry, crash reporting, or tracking of any kind</li>
          <li>Access your browsing history, bookmarks, or any data outside the current active tab</li>
          <li>Store any data persistently (no localStorage, IndexedDB, or sync storage is used)</li>
          <li>Access page content when the popup is not open</li>
        </ul>

        <h2>4. Permissions Used</h2>
        <p>The Extension requests the following Chrome permissions:</p>
        <ul>
          <li>
            <strong>activeTab</strong> — Required to access the DOM of the currently active tab when the user
            clicks the extension popup. The extension only reads <code>axag-*</code> HTML attributes to count
            annotated elements and display statistics.
          </li>
          <li>
            <strong>scripting</strong> — Required to inject the visual overlay CSS and run DOM queries in the
            active tab when the user explicitly activates the overlay via the popup toggle button.
          </li>
        </ul>
        <p>
          Both permissions are used solely on-demand (only when the user opens the popup or toggles the overlay)
          and operate entirely within the browser. No data leaves the browser at any point.
        </p>

        <h2>5. Local Operation Only</h2>
        <p>
          All processing performed by the Extension happens entirely locally within your browser. No network
          requests are made by the Extension. No data is ever transmitted to the extension developers, AXAG
          contributors, or any third party.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          The Extension does not integrate with, or send data to, any third-party services, analytics providers,
          advertising networks, or data brokers.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
          The Extension is a developer tool intended for use by web developers. It does not knowingly collect any
          information from anyone, including children under the age of 13.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          If this privacy policy changes in the future (for example, if a new version of the extension introduces
          new features that handle data differently), an updated policy will be posted at this URL with a revised
          "Last updated" date. We encourage you to review this page periodically.
        </p>

        <h2>9. Contact</h2>
        <p>
          If you have any questions about this Privacy Policy or the AXAG DevTools extension, please open an
          issue on the GitHub repository:{' '}
          <a href="https://github.com/web-axag/devtools" target="_blank" rel="noopener noreferrer">
            github.com/web-axag/devtools
          </a>.
        </p>

        <hr />
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          © 2026 AXAG Standard Contributors. Published at{' '}
          <a href="https://axag.org/privacy">axag.org/privacy</a>.
        </p>
      </main>
    </Layout>
  );
}
