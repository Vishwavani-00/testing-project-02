import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#006666', '#800000', '#0088a9', '#e6a817', '#5c6bc0', '#26a69a', '#ef5350'];

export default function ChartView({ result, chart }) {
  if (!result || !result.rows || result.rows.length === 0) {
    return <div style={styles.empty}>No data to visualize.</div>;
  }

  // Build chart data
  const data = result.rows.map((row) => {
    const obj = {};
    result.columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });

  const xKey = chart.x_axis || result.columns[0];
  const yKey = chart.y_axis || result.columns[1] || result.columns[0];

  const renderChart = () => {
    switch (chart.chart_type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xKey} angle={-30} textAnchor="end" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#006666" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xKey} angle={-30} textAnchor="end" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#006666" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={120} label>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <TableView result={result} />;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>📊 {chart.title}</span>
        <span style={styles.badge}>{chart.chart_type.toUpperCase()}</span>
      </div>
      {renderChart()}
    </div>
  );
}

function TableView({ result }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>{result.columns.map((col, i) => <th key={i} style={styles.th}>{col}</th>)}</tr>
        </thead>
        <tbody>
          {result.rows.slice(0, 50).map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#f9f9f9' : '#fff' }}>
              {row.map((cell, ci) => <td key={ci} style={styles.td}>{String(cell ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { background: '#fff', borderRadius: 12, padding: '20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 15, fontWeight: 600, color: '#1a1a2e' },
  badge: { background: '#006666', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 12, fontWeight: 600 },
  empty: { padding: 20, color: '#888', textAlign: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { background: '#006666', color: '#fff', padding: '10px 14px', textAlign: 'left', fontWeight: 600 },
  td: { padding: '8px 14px', borderBottom: '1px solid #eee', color: '#333' },
};
