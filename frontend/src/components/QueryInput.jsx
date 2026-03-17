import React, { useState } from 'react';

const SUGGESTIONS = [
  "Show total sales by region",
  "Top 5 products by revenue",
  "List all customers",
  "Which salesperson has highest sales?",
  "Show all products with rating above 4.5",
];

export default function QueryInput({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) onSubmit(question.trim());
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🔍</span>
        <h2 style={styles.title}>Ask Your Data Anything</h2>
        <span style={styles.model}>⚡ TinyLlama · Local</span>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder='e.g. "Show total sales by region" or "Top 5 products by revenue"'
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={{ ...styles.btn, opacity: loading || !question.trim() ? 0.6 : 1 }}
          disabled={loading || !question.trim()}>
          {loading ? '⏳ Running...' : 'Ask →'}
        </button>
      </form>
      <div style={styles.suggestions}>
        <span style={styles.tryLabel}>Try:</span>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} style={styles.suggBtn} onClick={() => setQuestion(s)}>{s}</button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 14, padding: '24px 28px', marginBottom: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #E8ECF1' },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 },
  icon: { fontSize: 22 },
  title: { margin: 0, fontSize: 17, fontWeight: 700, color: '#1a1a2e', flex: 1 },
  model: { background: '#f0f9f0', color: '#006644', fontSize: 11, padding: '4px 12px', borderRadius: 20, fontWeight: 600, border: '1px solid #c8e6c9' },
  form: { display: 'flex', gap: 12, marginBottom: 14 },
  input: { flex: 1, padding: '12px 18px', fontSize: 14, border: '2px solid #E8ECF1', borderRadius: 10, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#1a1a2e', transition: 'border-color 0.2s' },
  btn: { padding: '12px 28px', background: 'linear-gradient(135deg, #006666, #1a1a2e)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' },
  suggestions: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  tryLabel: { fontSize: 12, color: '#999', fontWeight: 600 },
  suggBtn: { background: '#F4F6F9', border: '1px solid #E8ECF1', borderRadius: 20, padding: '5px 14px', fontSize: 12, cursor: 'pointer', color: '#555', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s' },
};
