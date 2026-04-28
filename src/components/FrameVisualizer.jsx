import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALGO_META = {
  fifo: { label: 'FIFO', color: '#4f46e5', bg: 'rgba(79,70,229,0.12)', border: 'rgba(79,70,229,0.4)' },
  lru: { label: 'LRU', color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.4)' },
  optimal: { label: 'Optimal', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.4)' },
};

/**
 * Single FrameVisualizer for one algorithm
 */
function SingleVisualizer({ algo, stepData, numFrames, pages, currentStep }) {
  const meta = ALGO_META[algo];

  if (!stepData) {
    // Empty "ready" state
    return (
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AlgoHeader meta={meta} stepData={null} />
        <EmptyFrames numFrames={numFrames} />
      </div>
    );
  }

  const { frames, page, fault, hitFrameIndex, replacedIndex } = stepData;

  return (
    <motion.div
      className="glass-card"
      style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      animate={fault
        ? { boxShadow: ['0 0 0 0 rgba(244,63,94,0)', '0 0 30px 4px rgba(244,63,94,0.35)', '0 0 0 0 rgba(244,63,94,0)'] }
        : { boxShadow: ['0 0 0 0 rgba(16,185,129,0)', '0 0 30px 4px rgba(16,185,129,0.3)', '0 0 0 0 rgba(16,185,129,0)'] }
      }
      transition={{ duration: 0.6 }}
      key={`${algo}-${currentStep}`}
    >
      <AlgoHeader meta={meta} stepData={stepData} />

      {/* Current page indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          Requesting
        </span>
        <motion.div
          key={`page-${page}-${currentStep}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-mono font-bold text-xl"
          style={{
            padding: '4px 16px',
            borderRadius: '10px',
            border: `1px solid ${meta.border}`,
            background: meta.bg,
            color: meta.color,
          }}
        >
          {page}
        </motion.div>
        <motion.div
          key={`badge-${fault}-${currentStep}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {fault
            ? <span className="badge-fault">FAULT</span>
            : <span className="badge-hit">HIT</span>
          }
        </motion.div>
      </div>

      {/* Frames */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '4px 0', justifyContent: 'space-evenly' }}>
        <AnimatePresence mode="popLayout">
          {Array.from({ length: numFrames }, (_, fi) => {
            const value = frames[fi];
            const isHit = !fault && hitFrameIndex === fi;
            const isFault = fault && replacedIndex === fi;
            const isEmpty = value === null;

            return (
              <motion.div
                key={`frame-${fi}`}
                layout
                className="flex flex-col items-center gap-1.5"
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  F{fi + 1}
                </span>
                <motion.div
                  className={`frame-card ${isHit ? 'hit' : ''} ${isFault ? 'fault' : ''} ${isEmpty ? 'empty' : ''}`}
                  animate={isHit
                    ? { scale: [1, 1.12, 1], transition: { duration: 0.4 } }
                    : isFault
                      ? { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } }
                      : {}
                  }
                  layout
                >
                  <AnimatePresence mode="wait">
                    {isEmpty ? (
                      <motion.span
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}
                      >
                        —
                      </motion.span>
                    ) : (
                      <motion.span
                        key={`val-${value}-${fi}`}
                        initial={{ y: isFault ? -30 : 0, opacity: 0, scale: 0.7 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: isFault ? 30 : 0, opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {value}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Step fault/hit counters */}
      <div style={{
        display: 'flex',
        gap: '0',
        padding: '14px 0 2px',
        borderTop: '1px solid var(--border-color)',
        marginTop: '4px',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 6px',
          borderRadius: '10px',
          background: 'rgba(244,63,94,0.06)',
          border: '1px solid rgba(244,63,94,0.15)',
          marginRight: '8px',
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fb7185' }}>Faults</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fb7185', fontFamily: 'JetBrains Mono, monospace' }}>{stepData.faultCount}</span>
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 6px',
          borderRadius: '10px',
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.15)',
          marginRight: '8px',
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4ade80' }}>Hits</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80', fontFamily: 'JetBrains Mono, monospace' }}>{stepData.hitCount}</span>
        </div>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 6px',
          borderRadius: '10px',
          background: `rgba(${meta.color === '#4f46e5' ? '79,70,229' : meta.color === '#7c3aed' ? '124,58,237' : '6,182,212'}, 0.06)`,
          border: `1px solid rgba(${meta.color === '#4f46e5' ? '79,70,229' : meta.color === '#7c3aed' ? '124,58,237' : '6,182,212'}, 0.2)`,
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: meta.color }}>Ratio</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: meta.color, fontFamily: 'JetBrains Mono, monospace' }}>
            {stepData.hitCount + stepData.faultCount > 0
              ? (stepData.hitCount / (stepData.hitCount + stepData.faultCount) * 100).toFixed(0) + '%'
              : '—'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function AlgoHeader({ meta, stepData }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '14px',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: meta.color,
          boxShadow: `0 0 8px ${meta.color}`,
          flexShrink: 0,
        }} />
        <h3 style={{ fontWeight: 700, fontSize: '1rem', color: meta.color, letterSpacing: '0.01em' }}>
          {meta.label}
        </h3>
      </div>
      {stepData && (
        <span style={{
          fontSize: '0.78rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 600,
          padding: '5px 12px',
          borderRadius: '8px',
          background: meta.bg,
          color: meta.color,
          border: `1px solid ${meta.border}`,
          letterSpacing: '0.02em',
        }}>
          Step {stepData.stepIndex + 1}
        </span>
      )}
    </div>
  );
}

function EmptyFrames({ numFrames }) {
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '4px 0' }}>
      {Array.from({ length: numFrames }, (_, fi) => (
        <div key={fi} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>F{fi + 1}</span>
          <div className="frame-card empty">—</div>
        </div>
      ))}
    </div>
  );
}

/**
 * Step progress mini-map
 */
function StepMap({ steps, currentStep }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '6px 0' }}>
      {steps.map((s, i) => (
        <motion.div
          key={i}
          className={`step-dot ${i === currentStep ? 'active' : i < currentStep ? (s.fault ? 'fault-dot done' : 'hit-dot done') : ''}`}
          animate={i === currentStep ? { scale: [1, 1.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      ))}
    </div>
  );
}

/**
 * Main FrameVisualizer exported component
 */
export default function FrameVisualizer({ selectedAlgo, getStepData, numFrames, steps, currentStep }) {
  const algos = selectedAlgo === 'all' ? ['fifo', 'lru', 'optimal'] : [selectedAlgo];
  const pages = steps.fifo?.map(s => s.page) || [];

  return (
    <div className="space-y-4">
      {/* Step map — single algo */}
      {selectedAlgo !== 'all' && steps[selectedAlgo]?.length > 0 && (
        <motion.div
          style={{ padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Step Overview &mdash;&nbsp;
            <span style={{ color: '#4ade80' }}>● Hit</span>&nbsp;&nbsp;
            <span style={{ color: '#fb7185' }}>● Fault</span>
          </p>
          <StepMap steps={steps[selectedAlgo]} currentStep={currentStep} />
        </motion.div>
      )}

      {/* Step map — compare all: one row per algorithm */}
      {selectedAlgo === 'all' && (steps.fifo?.length > 0 || steps.lru?.length > 0 || steps.optimal?.length > 0) && (
        <motion.div
          style={{ padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backdropFilter: 'blur(16px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Step Overview &mdash;&nbsp;
            <span style={{ color: '#4ade80' }}>● Hit</span>&nbsp;&nbsp;
            <span style={{ color: '#fb7185' }}>● Fault</span>
          </p>
          {['fifo', 'lru', 'optimal'].map(algo => {
            const meta = { fifo: { label: 'FIFO', color: '#4f46e5' }, lru: { label: 'LRU', color: '#7c3aed' }, optimal: { label: 'Optimal', color: '#06b6d4' } }[algo];
            if (!steps[algo]?.length) return null;
            return (
              <div key={algo} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: meta.color, minWidth: '52px', letterSpacing: '0.04em' }}>{meta.label}</span>
                <StepMap steps={steps[algo]} currentStep={currentStep} />
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Visualizers grid */}
      <div className={selectedAlgo === 'all' ? 'grid grid-cols-1 lg:grid-cols-3 gap-4' : 'grid grid-cols-1 gap-4'}>
        {algos.map(algo => (
          <SingleVisualizer
            key={algo}
            algo={algo}
            stepData={getStepData(algo)}
            numFrames={numFrames}
            pages={pages}
            currentStep={currentStep}
          />
        ))}
      </div>
    </div>
  );
}
