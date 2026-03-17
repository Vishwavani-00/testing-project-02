import React from 'react';

export default function InsightSummary({ summary, rowCount }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.icon}>🧠</span>
        <span style={styles.title}>Insight Summary</span>
        <span style={styles.rows}>{rowCount} rows returned</span>
      </div>
      <p style={styles.text}>{summary}</p>
    </div>
  );
}

const styles = {
  container: { background: 'linear-gradient(135deg, #e8f5e9, #f0f7ff)', border: '1px solid #c8e6c9', borderRadius: 12, padding: '18px 22px', marginBottom: 20 },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  icon: { fontSize: 20 },
  title: { fontWeight: 700, fontSize: 15, color: '#1a3a2a', flex: 1 },
  rows: { fontSize: 12, color: '#666', background: '#fff', padding: '3px 10px', borderRadius: 12, border: '1px solid #ddd' },
  text: { margin: 0, fontSize: 14, lineHeight: 1.7, color: '#2d4a3e' },
};
