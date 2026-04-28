import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

import { useSimulator } from './hooks/useSimulator';
import Controls from './components/Controls';
import FrameVisualizer from './components/FrameVisualizer';
import Charts from './components/Charts';
import ComparisonTable from './components/ComparisonTable';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('simulator'); // 'simulator' | 'analytics'

  const simulator = useSimulator();
  const {
    referenceString, setReferenceString,
    numFrames, setNumFrames,
    selectedAlgo, setSelectedAlgo,
    speed, setSpeed,
    steps, currentStep, isPlaying, isFinished, maxSteps,
    runSimulation, stepForward, play, pause, reset,
    getStepData, getStats,
  } = simulator;

  // Apply dark/light mode class
  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  // Handle play with updated speed
  const handlePlay = () => play();

  const isStarted = currentStep >= 0;
  const hasResults = steps.fifo.length > 0;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient meshes */}
      <div className="gradient-mesh" style={{ background: '#4f46e5', top: '-200px', left: '-200px' }} />
      <div className="gradient-mesh" style={{ background: '#7c3aed', bottom: '-200px', right: '-150px' }} />

      {/* ── HEADER ────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}
            >
              🧠
            </motion.div>
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                PageSim
              </h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
                PAGE REPLACEMENT SIMULATOR
              </p>
            </div>
          </div>

          {/* Nav tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '4px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {['simulator', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  transition: 'all 0.2s',
                  background: activeSection === tab
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    : 'transparent',
                  color: activeSection === tab ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {tab === 'simulator' ? '⚡ Simulator' : '📊 Analytics'}
              </button>
            ))}
          </div>

          {/* Dark mode toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={darkMode ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {darkMode ? '☀️' : '🌙'}
              </motion.span>
            </AnimatePresence>
            {darkMode ? 'Light' : 'Dark'}
          </motion.button>
        </div>
      </header>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <main style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 28px', position: 'relative', zIndex: 1 }}>

        <AnimatePresence mode="wait">
          {activeSection === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero text */}
              <div style={{ marginBottom: 36, textAlign: 'center' }}>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 8 }}
                >
                  Compare Page Replacement Algorithms
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto', fontSize: '0.95rem' }}
                >
                  Visualize FIFO, LRU, and Optimal algorithms step-by-step with real-time animations and performance analytics.
                </motion.p>
              </div>

              {/* Layout: sidebar + main */}
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
                {/* Controls Panel */}
                <div style={{ position: 'sticky', top: 84 }}>
                  <Controls
                    referenceString={referenceString}
                    setReferenceString={setReferenceString}
                    numFrames={numFrames}
                    setNumFrames={setNumFrames}
                    selectedAlgo={selectedAlgo}
                    setSelectedAlgo={setSelectedAlgo}
                    speed={speed}
                    setSpeed={setSpeed}
                    isPlaying={isPlaying}
                    isFinished={isFinished}
                    currentStep={currentStep}
                    maxSteps={maxSteps}
                    onRun={runSimulation}
                    onPlay={handlePlay}
                    onPause={pause}
                    onReset={reset}
                    onStep={stepForward}
                  />
                </div>

                {/* Simulation Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Status banner */}
                  <AnimatePresence>
                    {isFinished && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card"
                        style={{
                          padding: '16px 20px',
                          borderColor: 'rgba(16,185,129,0.3)',
                          background: 'rgba(16,185,129,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1.3rem' }}>✅</span>
                          <div>
                            <p style={{ fontWeight: 700, color: '#4ade80', fontSize: '0.9rem' }}>Simulation Complete!</p>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>View analytics in the Analytics tab</p>
                          </div>
                        </div>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                          onClick={() => setActiveSection('analytics')}
                        >
                          View Analytics →
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Frame Visualizer */}
                  <FrameVisualizer
                    selectedAlgo={selectedAlgo}
                    getStepData={getStepData}
                    numFrames={numFrames}
                    steps={steps}
                    currentStep={currentStep}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 6 }}>
                  Analytics Dashboard
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {hasResults
                    ? 'Detailed performance comparison across all three algorithms'
                    : 'Run a simulation first to see analytics'}
                </p>
              </div>

              <Charts getStats={getStats} steps={steps} />
              <ComparisonTable getStats={getStats} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        marginTop: 60,
        padding: '20px 24px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          PageSim — Comparative Study of Page Replacement Algorithms
          <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
          Built with React, Framer Motion &amp; Chart.js
        </p>
      </footer>
    </div>
  );
}
