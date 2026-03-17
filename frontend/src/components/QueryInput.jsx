import React, { useState } from 'react';

const SUGGESTED = [
  "Show total sales by region",
  "Top 5 products by revenue",
  "Monthly sales trend for 2024",
  "Which customers spent the most?",
  "List all products with rating above 4.5",
];

export default function QueryInput({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim()) onSubmit(question.trim());
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔍 Ask a Question</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Show total sales by region..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.btn} disabled={loading || !question.trim()}>
          {loading ? 'Running...' : 'Ask →'}
        </button>
      </form>

      <div style={styles.suggestions}>
        <span style={styles.suggLabel}>Try:</span>
        {SUGGESTED.map((s, i) => (
          <button key={i} style={styles.suggBtn} onClick={() => setQuestion(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { background: '#fff', borderRadius: 12, padding: '24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  heading: { margin: '0 0 16px', fontSize: 18, color: '#1a1a2e' },
  form: { display: 'flex', gap: 12 },
  input: { flex: 1, padding: '12px 16px', fontSize: 15, border: '2px solid #e0e0e0', borderRadius: 8, outline: 'none', transition: 'border-color 0.2s' },
  btn: { padding: '12px 28px', background: '#006666', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  suggestions: { marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  suggLabel: { fontSize: 13, color: '#888', fontWeight: 600 },
  suggBtn: { background: '#f0f4f8', border: '1px solid #dde1e7', borderRadius: 20, padding: '4px 14px', fontSize: 12, cursor: 'pointer', color: '#444' },
};
