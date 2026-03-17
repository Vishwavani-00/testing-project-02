import React, { useState } from 'react';

export default function SQLViewer({ sql, executionTime }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.label}>⚡ Generated SQL</span>
        <div style={styles.meta}>
          <span style={styles.time}>⏱ {executionTime} ms</span>
          <button style={styles.copyBtn} onClick={handleCopy}>
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
        </div>
      </div>
      <pre style={styles.code}>{sql}</pre>
    </div>
  );
}

const styles = {
  container: { background: '#1e1e2e', borderRadius: 10, padding: '16px 20px', marginBottom: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { color: '#a0d4a0', fontSize: 13, fontWeight: 600 },
  meta: { display: 'flex', gap: 12, alignItems: 'center' },
  time: { color: '#888', fontSize: 12 },
  copyBtn: { background: '#2d2d3e', color: '#ccc', border: '1px solid #444', borderRadius: 6, padding: '4px 12px', fontSize: 12, cursor: 'pointer' },
  code: { color: '#e0e0e0', fontSize: 13, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'monospace' },
};
