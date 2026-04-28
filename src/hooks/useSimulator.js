import { useState, useRef, useCallback } from 'react';
import { runFIFO } from '../algorithms/fifo';
import { runLRU } from '../algorithms/lru';
import { runOptimal } from '../algorithms/optimal';

const ALGO_RUNNERS = {
  fifo: runFIFO,
  lru: runLRU,
  optimal: runOptimal,
};

/**
 * Central simulator hook.
 * Manages step-by-step playback for one or all three algorithms.
 */
export function useSimulator() {
  const [referenceString, setReferenceString] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2');
  const [numFrames, setNumFrames] = useState(3);
  const [selectedAlgo, setSelectedAlgo] = useState('all'); // 'fifo' | 'lru' | 'optimal' | 'all'
  const [speed, setSpeed] = useState(1.5); // steps per second

  // Per-algorithm step arrays (populated on run)
  const [steps, setSteps] = useState({ fifo: [], lru: [], optimal: [] });
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef(null);

  /** Parse the reference string into a validated integer array */
  const parsedPages = useCallback(() => {
    return referenceString
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n >= 0);
  }, [referenceString]);

  /** Run all algorithms and compute steps */
  const runSimulation = useCallback(() => {
    const pages = parsedPages();
    if (pages.length === 0 || numFrames < 1) return;

    const algos = ['fifo', 'lru', 'optimal'];
    const computed = {};
    algos.forEach(a => {
      computed[a] = ALGO_RUNNERS[a](pages, numFrames);
    });

    setSteps(computed);
    setCurrentStep(0);
    setIsFinished(false);
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  }, [parsedPages, numFrames]);

  /** Maximum step count across all algorithms */
  const maxSteps = Math.max(
    steps.fifo.length,
    steps.lru.length,
    steps.optimal.length,
    1
  ) - 1;

  /** Advance one step */
  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next > maxSteps) {
        setIsPlaying(false);
        setIsFinished(true);
        clearInterval(intervalRef.current);
        return prev;
      }
      return next;
    });
  }, [maxSteps]);

  /** Start auto-play */
  const play = useCallback(() => {
    if (isFinished || steps.fifo.length === 0) return;
    setIsPlaying(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next > maxSteps) {
          setIsPlaying(false);
          setIsFinished(true);
          clearInterval(intervalRef.current);
          return prev;
        }
        return next;
      });
    }, 1000 / speed);
  }, [speed, maxSteps, isFinished, steps.fifo.length]);

  /** Pause auto-play */
  const pause = useCallback(() => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  }, []);

  /** Reset everything */
  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentStep(-1);
    setSteps({ fifo: [], lru: [], optimal: [] });
    clearInterval(intervalRef.current);
  }, []);

  /** Get step data for a specific algorithm at the current step */
  const getStepData = useCallback((algo) => {
    if (currentStep < 0 || steps[algo].length === 0) return null;
    return steps[algo][Math.min(currentStep, steps[algo].length - 1)] || null;
  }, [steps, currentStep]);

  /** Summary stats for the analytics dashboard */
  const getStats = useCallback((algo) => {
    const allSteps = steps[algo];
    if (allSteps.length === 0) return null;
    const last = allSteps[allSteps.length - 1];
    return {
      hits: last.hitCount,
      faults: last.faultCount,
      hitRatio: (last.hitCount / allSteps.length * 100).toFixed(1),
      total: allSteps.length,
    };
  }, [steps]);

  return {
    // Inputs
    referenceString, setReferenceString,
    numFrames, setNumFrames,
    selectedAlgo, setSelectedAlgo,
    speed, setSpeed,
    // State
    steps, currentStep, isPlaying, isFinished, maxSteps,
    // Actions
    runSimulation, stepForward, play, pause, reset,
    // Helpers
    getStepData, getStats, parsedPages,
  };
}
