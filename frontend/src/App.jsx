import React, { useState, useEffect } from 'react';
import QueryInput from './components/QueryInput';
import SQLViewer from './components/SQLViewer';
import ChartView from './components/ChartView';
import InsightSummary from './components/InsightSummary';
import QueryHistory from './components/QueryHistory';
import { runQuery, getHistory, clearHistory } from './services/api';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('query');

  const fetchHistory = async () => {
    try {
      const h = await getHistory();
      setHistory(h);
    } catch (_) {}
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleQuery = async (question) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveTab('query');
    try {
      const data = await runQuery(question);
      setResult(data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await clearHistory();
    fetchHistory();
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>🧠 NLQ App</div>
        <div style={styles.subtitle}>Natural Language Query — Ask your data anything</div>
        <div style={styles.musigma}>Powered by Mu Sigma</div>
      </header>

      <div style={styles.layout}>
        {/* Main Content */}
        <main style={styles.main}>
          <QueryInput onSubmit={handleQuery} loading={loading} />

          {loading && (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <span>Generating SQL and fetching results...</span>
            </div>
          )}

          {error && (
            <div style={styles.error}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {result && (
            <>
              {/* Tabs */}
              <div style={styles.tabs}>
                {['query', 'sql', 'data'].map(tab => (
                  <button
                    key={tab}
                    style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'query' ? '📊 Chart' : tab === 'sql' ? '⚡ SQL' : '📋 Raw Data'}
                  </button>
                ))}
              </div>

              {activeTab === 'query' && (
                <>
                  <InsightSummary summary={result.summary} rowCount={result.result.row_count} />
                  <ChartView result={result.result} chart={result.chart} />
                </>
              )}
              {activeTab === 'sql' && (
                <SQLViewer sql={result.sql} executionTime={result.execution_time_ms} />
              )}
              {activeTab === 'data' && (
                <div style={styles.rawData}>
                  <table style={styles.table}>
                    <thead>
                      <tr>{result.result.columns.map((col, i) => <th key={i} style={styles.th}>{col}</th>)}</tr>
                    </thead>
                    <tbody>
                      {result.result.rows.slice(0, 100).map((row, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                          {row.map((cell, ci) => <td key={ci} style={styles.td}>{String(cell ?? '')}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <QueryHistory history={history} onSelect={handleQuery} onClear={handleClearHistory} />
        </aside>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh' },
  header: { background: 'linear-gradient(135deg, #006666, #1a1a2e)', padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 16 },
  logo: { fontSize: 22, fontWeight: 800, color: '#fff' },
  subtitle: { fontSize: 14, color: '#a0d4d4', flex: 1 },
  musigma: { fontSize: 12, color: '#a0d4a0', background: 'rgba(255,255,255,0.1)', padding: '4px 14px', borderRadius: 20 },
  layout: { display: 'flex', gap: 24, padding: '24px 32px', maxWidth: 1400, margin: '0 auto' },
  main: { flex: 1, minWidth: 0 },
  sidebar: { width: 320, flexShrink: 0 },
  loading: { display: 'flex', alignItems: 'center', gap: 12, padding: '20px', background: '#fff', borderRadius: 10, marginBottom: 20, color: '#666' },
  spinner: { width: 20, height: 20, border: '3px solid #eee', borderTop: '3px solid #006666', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  error: { background: '#fff5f5', border: '1px solid #ffcccc', borderRadius: 10, padding: '16px 20px', marginBottom: 20, color: '#c0392b', fontSize: 14 },
  tabs: { display: 'flex', gap: 4, marginBottom: 16, background: '#fff', padding: 4, borderRadius: 10, width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  tab: { padding: '8px 20px', border: 'none', borderRadius: 7, background: 'transparent', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#666' },
  activeTab: { background: '#006666', color: '#fff', fontWeight: 600 },
  rawData: { background: '#fff', borderRadius: 12, padding: 20, overflowX: 'auto', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { background: '#006666', color: '#fff', padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' },
  td: { padding: '8px 14px', borderBottom: '1px solid #eee', color: '#333' },
};
