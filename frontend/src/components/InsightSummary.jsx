import React from 'react';

export default function InsightSummary({ summary, rowCount, executionTime, model }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🧠</span>
        <span style={styles.title}>Insight Summary</span>
        <div style={styles.meta}>
          <span style={styles.badge}>{rowCount} rows</span>
          <span style={styles.badge2}>{executionTime}ms</span>
          <span style={styles.badge3}>⚡ {model}</span>
        </div>
      </div>
      <p style={styles.text}>{summary}</p>
    </div>
  );
}

const styles = {
  card: { background: 'linear-gradient(135deg, #e8f5e9, #e8f4f8)', border: '1px solid #c8e6c9', borderRadius: 12, padding: '18px 22px', marginBottom: 20 },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  icon: { fontSize: 20 },
  title: { fontWeight: 700, fontSize: 14, color: '#1a3a2a', flex: 1 },
  meta: { display: 'flex', gap: 8 },
  badge: { background: '#006644', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 12, fontWeight: 600 },
  badge2: { background: '#1a1a2e', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 12 },
  badge3: { background: '#f0f9f0', color: '#006644', fontSize: 11, padding: '3px 10px', borderRadius: 12, border: '1px solid #c8e6c9', fontWeight: 600 },
  text: { margin: 0, fontSize: 14, lineHeight: 1.7, color: '#2d4a3e' },
};
