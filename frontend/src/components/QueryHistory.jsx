import React from 'react';

export default function QueryHistory({ history, onSelect, onClear }) {
  if (!history || history.length === 0) {
    return (
      <div style={styles.empty}>
        <span>🕑 No query history yet</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>🕑 Query History</span>
        <button style={styles.clearBtn} onClick={onClear}>Clear All</button>
      </div>
      <div style={styles.list}>
        {history.items.map((item, i) => (
          <div key={i} style={styles.item} onClick={() => onSelect(item.question)}>
            <div style={styles.question}>{item.question}</div>
            <div style={styles.meta}>
              <span style={styles.badge}>{item.chart_type}</span>
              <span style={styles.rows}>{item.row_count} rows</span>
              <span style={styles.time}>{new Date(item.created_at).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontWeight: 700, fontSize: 15, color: '#1a1a2e' },
  clearBtn: { background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#888', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: 10 },
  item: { padding: '12px 14px', borderRadius: 8, background: '#f8f9fa', cursor: 'pointer', border: '1px solid #eee', transition: 'background 0.2s' },
  question: { fontSize: 14, fontWeight: 500, color: '#1a1a2e', marginBottom: 6 },
  meta: { display: 'flex', gap: 10, alignItems: 'center' },
  badge: { background: '#006666', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, textTransform: 'uppercase' },
  rows: { fontSize: 12, color: '#666' },
  time: { fontSize: 11, color: '#aaa', marginLeft: 'auto' },
  empty: { padding: '30px', textAlign: 'center', color: '#aaa', fontSize: 14 },
};
