import React from 'react';
import { motion } from 'framer-motion';

const ALGO_META = [
  {
    key: 'fifo',
    label: 'FIFO',
    fullName: 'First-In, First-Out',
    color: '#4f46e5',
    complexity: 'O(n)',
    complexityNote: 'Linear — iterate through frames',
    description: 'Evicts the page that has been in memory the longest. Simple circular pointer.',
  },
  {
    key: 'lru',
    label: 'LRU',
    fullName: 'Least Recently Used',
    color: '#7c3aed',
    complexity: 'O(n)',
    complexityNote: 'Linear — scan recency timestamps',
    description: 'Evicts the page that was least recently accessed. Tracks usage timestamps.',
  },
  {
    key: 'optimal',
    label: 'Optimal',
    fullName: 'Bélády\'s Optimal',
    color: '#06b6d4',
    complexity: 'O(n²)',
    complexityNote: 'Quadratic — look-ahead scan per fault',
    description: 'Evicts the page used furthest in the future. Theoretical minimum faults benchmark.',
  },
];

export default function ComparisonTable({ getStats }) {
  const rows = ALGO_META.map(m => ({ ...m, stats: getStats(m.key) }));
  const hasData = rows.some(r => r.stats !== null);

  // Find best performer (most hits / fewest faults)
  let bestFaultIdx = -1;
  if (hasData) {
    let minFaults = Infinity;
    rows.forEach((r, i) => {
      if (r.stats && r.stats.faults < minFaults) {
        minFaults = r.stats.faults;
        bestFaultIdx = i;
      }
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Comparison Table */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Performance Comparison
          </h3>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            Algorithm results side-by-side
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Hits</th>
                <th>Faults</th>
                <th>Hit Ratio</th>
                <th>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={i === bestFaultIdx && hasData
                    ? { background: 'rgba(16,185,129,0.05)' }
                    : {}}
                >
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: row.color }} />
                      <div>
                        <div className="font-bold text-sm" style={{ color: row.color }}>{row.label}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{row.fullName}</div>
                      </div>
                      {i === bestFaultIdx && hasData && (
                        <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(16,185,129,0.15)', color: '#4ade80', border: '1px solid rgba(16,185,129,0.3)' }}>
                          BEST
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="font-mono font-bold" style={{ color: '#4ade80' }}>
                      {row.stats ? row.stats.hits : '—'}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono font-bold" style={{ color: '#fb7185' }}>
                      {row.stats ? row.stats.faults : '—'}
                    </span>
                  </td>
                  <td>
                    {row.stats ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--border-color)', maxWidth: 80 }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: row.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${row.stats.hitRatio}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                        <span className="font-mono font-bold text-sm" style={{ color: row.color }}>
                          {row.stats.hitRatio}%
                        </span>
                      </div>
                    ) : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                  </td>
                  <td>
                    <span className="font-mono text-sm px-2 py-0.5 rounded-lg"
                      style={{ background: `${row.color}20`, color: row.color }}>
                      {row.complexity}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Best Algorithm Spotlight */}
      {hasData && bestFaultIdx >= 0 && (() => {
        const best = rows[bestFaultIdx];
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              padding: '20px 28px',
              borderRadius: 'var(--radius)',
              background: 'rgba(16,185,129,0.07)',
              border: '1px solid rgba(16,185,129,0.25)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(16,185,129,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>🏆</div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ade80', marginBottom: '4px' }}>
                  Best Algorithm
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: best.color }}>
                  {best.label}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    — {best.fullName}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Faults</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fb7185', fontFamily: 'JetBrains Mono, monospace' }}>{best.stats?.faults ?? '—'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hits</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4ade80', fontFamily: 'JetBrains Mono, monospace' }}>{best.stats?.hits ?? '—'}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hit Ratio</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: best.color, fontFamily: 'JetBrains Mono, monospace' }}>{best.stats?.hitRatio ?? '—'}%</div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* Algorithm Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ALGO_META.map((m, i) => (
          <motion.div
            key={m.key}
            style={{ padding: '24px' }}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span className="font-bold text-base" style={{ color: m.color }}>{m.label}</span>
              <span className="font-mono text-xs"
                style={{ padding: '4px 10px', borderRadius: '8px', background: `${m.color}20`, color: m.color }}>
                {m.complexity}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.6 }}>{m.description}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{m.complexityNote}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
