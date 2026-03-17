import React from 'react';

export default function QueryHistory({ history, onSelect, onClear }) {
  if (!history?.items?.length) return (
    <div style={styles.card}>
      <div style={styles.hdr}><span style={styles.title}>🕑 Query History</span></div>
      <div style={styles.empty}>No queries yet. Ask something!</div>
    </div>
  );

  return (
    <div style={styles.card}>
      <div style={styles.hdr}>
        <span style={styles.title}>🕑 Query History</span>
        <span style={styles.count}>{history.total}</span>
        <button style={styles.clearBtn} onClick={onClear}>Clear</button>
      </div>
      <div style={styles.list}>
        {history.items.map((item, i) => (
          <div key={i} style={styles.item} onClick={() => onSelect(item.question)}>
            <div style={styles.q}>{item.question}</div>
            <div style={styles.meta}>
              <span style={styles.typeBadge}>{item.chart_type.toUpperCase()}</span>
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
  card: { background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #E8ECF1', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  hdr: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  title: { fontWeight: 700, fontSize: 14, color: '#1a1a2e', flex: 1 },
  count: { background: '#F4F6F9', color: '#666', fontSize: 11, padding: '2px 8px', borderRadius: 10, fontWeight: 600 },
  clearBtn: { background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#999', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  item: { padding: '12px 14px', borderRadius: 8, background: '#F4F6F9', cursor: 'pointer', border: '1px solid #E8ECF1', transition: 'background 0.15s' },
  q: { fontSize: 13, fontWeight: 500, color: '#1a1a2e', marginBottom: 6, lineHeight: 1.4 },
  meta: { display: 'flex', gap: 8, alignItems: 'center' },
  typeBadge: { background: '#006666', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700 },
  rows: { fontSize: 11, color: '#666' },
  time: { fontSize: 11, color: '#bbb', marginLeft: 'auto' },
  empty: { padding: '24px 0', textAlign: 'center', color: '#bbb', fontSize: 13 },
};
