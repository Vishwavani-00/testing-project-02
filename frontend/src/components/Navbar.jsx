import React from 'react';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.left}>
          <div style={styles.logoBox}>🧠</div>
          <div>
            <div style={styles.appName}>NLQ App <span style={styles.version}>v2.0</span></div>
            <div style={styles.tagline}>Natural Language Query · Powered by TinyLlama (Local)</div>
          </div>
        </div>
        <div style={styles.right}>
          <div style={styles.statusPill}><span style={styles.dot}></span>System Ready</div>
          <div style={styles.avatar}>VR</div>
          <span style={styles.userName}>Vishwavani Ravi</span>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: 'linear-gradient(135deg, #1a1a2e 0%, #006666 100%)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.2)' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1360, margin: '0 auto' },
  left: { display: 'flex', alignItems: 'center', gap: 14 },
  logoBox: { fontSize: 28, background: 'rgba(255,255,255,0.1)', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  appName: { color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: 0.3 },
  version: { background: 'rgba(255,255,255,0.15)', color: '#a0d4d4', fontSize: 11, padding: '2px 8px', borderRadius: 10, marginLeft: 8, fontWeight: 500 },
  tagline: { color: '#7ecece', fontSize: 11, marginTop: 2 },
  right: { display: 'flex', alignItems: 'center', gap: 14 },
  statusPill: { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', color: '#a0f0a0', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 500 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' },
  avatar: { background: '#006666', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 },
  userName: { color: '#d0f0f0', fontSize: 13, fontWeight: 500 },
};
