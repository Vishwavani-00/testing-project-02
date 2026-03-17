import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import QueryInput from './components/QueryInput';
import InsightSummary from './components/InsightSummary';
import SQLViewer from './components/SQLViewer';
import ChartView from './components/ChartView';
import QueryHistory from './components/QueryHistory';
import { runQuery, getHistory, clearHistory } from './services/api';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(null);
  const [tab, setTab] = useState('chart');

  const fetchHistory = async () => {
    try { setHistory(await getHistory()); } catch (_) {}
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleQuery = async (question) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setTab('chart');
    try {
      const data = await runQuery(question);
      setResult(data);
      fetchHistory();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => { await clearHistory(); fetchHistory(); };

  const tabs = [
    { id: 'chart', label: '📊 Chart' },
    { id: 'sql', label: '⚡ SQL' },
    { id: 'data', label: '📋 Raw Data' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6F9', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={styles.layout}>
        <main style={styles.main}>
          <QueryInput onSubmit={handleQuery} loading={loading} />

          {loading && (
            <div style={styles.loadingCard}>
              <div style={styles.spinner}></div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>Processing your question...</div>
                <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>TinyLlama is generating SQL · Local inference</div>
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorCard}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, color: '#c0392b', fontSize: 14 }}>Error</div>
                <div style={{ color: '#c0392b', fontSize: 13, marginTop: 2 }}>{error}</div>
              </div>
            </div>
          )}

          {result && (
            <>
              <div style={styles.tabs}>
                {tabs.map(t => (
                  <button key={t.id} style={{ ...styles.tab, ...(tab === t.id ? styles.activeTab : {}) }}
                    onClick={() => setTab(t.id)}>{t.label}</button>
                ))}
              </div>

              {tab === 'chart' && (
                <>
                  <InsightSummary summary={result.summary} rowCount={result.result.row_count}
                    executionTime={result.execution_time_ms} model={result.model} />
                  <ChartView result={result.result} chart={result.chart} />
                </>
              )}
              {tab === 'sql' && <SQLViewer sql={result.sql} />}
              {tab === 'data' && (
                <div style={styles.rawCard}>
                  <table style={styles.table}>
                    <thead>
                      <tr>{result.result.columns.map((c, i) => <th key={i} style={styles.th}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {result.result.rows.slice(0, 100).map((row, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? '#f9fbfc' : '#fff' }}>
                          {row.map((cell, ci) => <td key={ci} style={styles.td}>{String(cell ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {!result && !loading && !error && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔍</div>
              <div style={styles.emptyTitle}>Ask your data anything</div>
              <div style={styles.emptySubtitle}>Type a question above or click a suggestion to get started.<br />
                NLQ converts your question to SQL using TinyLlama — 100% local, no API key needed.</div>
            </div>
          )}
        </main>

        <aside style={styles.sidebar}>
          <QueryHistory history={history} onSelect={handleQuery} onClear={handleClear} />
        </aside>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #006666 !important; box-shadow: 0 0 0 3px rgba(0,102,102,0.1); }
      `}</style>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', gap: 24, padding: '28px 32px', maxWidth: 1360, margin: '0 auto' },
  main: { flex: 1, minWidth: 0 },
  sidebar: { width: 300, flexShrink: 0 },
  loadingCard: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 20, border: '1px solid #E8ECF1', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  spinner: { width: 24, height: 24, border: '3px solid #E8ECF1', borderTop: '3px solid #006666', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 },
  errorCard: { display: 'flex', alignItems: 'flex-start', gap: 14, background: '#fff5f5', border: '1px solid #ffd0d0', borderRadius: 12, padding: '18px 22px', marginBottom: 20 },
  tabs: { display: 'flex', gap: 4, marginBottom: 18, background: '#fff', padding: 5, borderRadius: 12, width: 'fit-content', border: '1px solid #E8ECF1' },
  tab: { padding: '8px 20px', border: 'none', borderRadius: 8, background: 'transparent', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#666', fontFamily: 'Inter, sans-serif' },
  activeTab: { background: 'linear-gradient(135deg, #006666, #1a1a2e)', color: '#fff', fontWeight: 700 },
  rawCard: { background: '#fff', borderRadius: 12, padding: 20, overflowX: 'auto', border: '1px solid #E8ECF1', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { background: '#006666', color: '#fff', padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' },
  td: { padding: '8px 14px', borderBottom: '1px solid #f0f0f0', color: '#333' },
  emptyState: { background: '#fff', borderRadius: 14, padding: '60px 40px', textAlign: 'center', border: '1px solid #E8ECF1' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: '#888', lineHeight: 1.7 },
};
