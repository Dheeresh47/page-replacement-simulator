import React from 'react';
import { motion } from 'framer-motion';

const EXAMPLES = [
  { label: 'Classic', value: '7,0,1,2,0,3,0,4,2,3,0,3,2', frames: 3 },
  { label: 'Thrashing', value: '1,2,3,4,1,2,5,1,2,3,4,5', frames: 3 },
  { label: 'Many Hits', value: '1,2,1,3,1,4,1,5,1,2', frames: 4 },
];

const ALGO_OPTIONS = [
  { value: 'fifo', label: 'FIFO', color: '#4f46e5' },
  { value: 'lru', label: 'LRU', color: '#7c3aed' },
  { value: 'optimal', label: 'Optimal', color: '#06b6d4' },
  { value: 'all', label: 'Compare All', color: '#f59e0b' },
];

export default function Controls({
  referenceString, setReferenceString,
  numFrames, setNumFrames,
  selectedAlgo, setSelectedAlgo,
  speed, setSpeed,
  isPlaying, isFinished,
  currentStep, maxSteps,
  onRun, onPlay, onPause, onReset, onStep,
}) {
  const isStarted = currentStep >= 0;

  return (
    <motion.div
      className="glass-card"
      style={{ padding: '28px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ paddingBottom: '4px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
          Input Controls
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure the simulation parameters
        </p>
      </div>

      {/* Example Presets */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
          Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map(ex => (
            <motion.button
              key={ex.label}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-secondary text-xs"
              style={{ borderRadius: '8px', padding: '8px 14px', fontSize: '0.82rem' }}
              onClick={() => {
                setReferenceString(ex.value);
                setNumFrames(ex.frames);
              }}
            >
              {ex.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reference String */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
          Page Reference String
        </label>
        <input
          className="ctrl-input font-mono"
          placeholder="e.g. 7,0,1,2,0,3,0,4,2,3"
          value={referenceString}
          onChange={e => setReferenceString(e.target.value)}
        />
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          Comma-separated integers
        </p>
      </div>

      {/* Frames + Algorithm row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
            Frames
          </label>
          <input
            type="number"
            className="ctrl-input text-center"
            min={1}
            max={10}
            value={numFrames}
            onChange={e => setNumFrames(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          />
        </div>
        <div className="flex-[2]">
          <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-secondary)' }}>
            Algorithm
          </label>
          <select
            className="ctrl-input"
            value={selectedAlgo}
            onChange={e => setSelectedAlgo(e.target.value)}
          >
            {ALGO_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            Animation Speed
          </label>
          <span className="text-xs font-mono font-bold" style={{ color: 'var(--accent-indigo)' }}>
            {speed.toFixed(1)}×
          </span>
        </div>
        <input
          type="range"
          min={0.25}
          max={4}
          step={0.25}
          value={speed}
          onChange={e => setSpeed(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
          <span>Slow</span><span>Fast</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {!isStarted ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={onRun}
          >
            <PlayIcon /> Run Simulation
          </motion.button>
        ) : (
          <div className="flex gap-2">
            {!isFinished && (
              isPlaying ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={onPause}
                >
                  <PauseIcon /> Pause
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={onPlay}
                >
                  <PlayIcon /> Play
                </motion.button>
              )
            )}
            {!isFinished && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary flex items-center gap-2"
                onClick={onStep}
                style={{ padding: '10px 14px' }}
              >
                <StepIcon /> Step
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-danger flex items-center gap-2"
              onClick={onReset}
              style={{ padding: '10px 14px' }}
            >
              <ResetIcon />
            </motion.button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isStarted && maxSteps > 0 && (
        <div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            <span>Step {currentStep + 1} / {maxSteps + 1}</span>
            <span>{Math.round(((currentStep + 1) / (maxSteps + 1)) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--border-color)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #4f46e5, #7c3aed)' }}
              animate={{ width: `${((currentStep + 1) / (maxSteps + 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}

function StepIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 17,12 5,21" />
      <rect x="19" y="3" width="2" height="18" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 .49-3" />
    </svg>
  );
}
