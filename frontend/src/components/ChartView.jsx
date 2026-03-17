import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#006666', '#800000', '#0088a9', '#e6a817', '#5c6bc0', '#26a69a', '#ef5350', '#ab47bc'];

export default function ChartView({ result, chart }) {
  if (!result?.rows?.length) return <div style={styles.empty}>📭 No data to visualize.</div>;

  const data = result.rows.map(row => {
    const obj = {};
    result.columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });

  const xKey = chart.x_axis || result.columns[0];
  const yKey = chart.y_axis || result.columns[1] || result.columns[0];

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>📊 {chart.title}</span>
        <span style={styles.badge}>{chart.chart_type.toUpperCase()}</span>
      </div>

      {chart.chart_type === 'bar' && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} angle={-30} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Bar dataKey={yKey} fill="#006666" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      {chart.chart_type === 'line' && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xKey} angle={-30} textAnchor="end" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke="#006666" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {chart.chart_type === 'pie' && (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={110} label>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      {chart.chart_type === 'table' && (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>{result.columns.map((c, i) => <th key={i} style={styles.th}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {result.rows.slice(0, 50).map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? '#f9fbfc' : '#fff' }}>
                  {row.map((cell, ci) => <td key={ci} style={styles.td}>{String(cell ?? '')}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 12, padding: '20px 24px', marginBottom: 20, border: '1px solid #E8ECF1', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 14, fontWeight: 600, color: '#1a1a2e' },
  badge: { background: '#006666', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 12, fontWeight: 700 },
  empty: { padding: 40, textAlign: 'center', color: '#aaa', fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { background: '#006666', color: '#fff', padding: '10px 14px', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' },
  td: { padding: '8px 14px', borderBottom: '1px solid #f0f0f0', color: '#333' },
};
