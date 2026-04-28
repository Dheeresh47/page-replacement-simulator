import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, Filler
);

const COLORS = {
  fifo: { solid: '#4f46e5', faded: 'rgba(79,70,229,0.15)', border: '#4f46e5' },
  lru: { solid: '#7c3aed', faded: 'rgba(124,58,237,0.15)', border: '#7c3aed' },
  optimal: { solid: '#06b6d4', faded: 'rgba(6,182,212,0.15)', border: '#06b6d4' },
};

const getChartOptions = () => {
  const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label').trim() || '#9090b0';
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim() || 'rgba(255,255,255,0.05)';

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: labelColor,
          font: { family: 'Inter', size: 12 },
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 4,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(30,30,58,0.97)',
        titleColor: '#f0f0ff',
        bodyColor: '#9090b0',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        ticks: { color: labelColor, font: { family: 'Inter', size: 11 } },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: labelColor, font: { family: 'Inter', size: 11 } },
        grid: { color: gridColor },
      },
    },
  };
};

export default function Charts({ getStats, steps }) {
  const algos = ['fifo', 'lru', 'optimal'];
  const labels = ['FIFO', 'LRU', 'Optimal'];
  const stats = algos.map(a => getStats(a));
  const hasData = stats.some(s => s !== null);

  if (!hasData) {
    return (
      <motion.div
        className="glass-card p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-4xl mb-3" role="img" aria-label="chart">📊</div>
        <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
          Run a simulation to see analytics
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
          Charts will update dynamically after each step
        </p>
      </motion.div>
    );
  }

  // Bar chart: faults comparison
  const faultData = {
    labels,
    datasets: [{
      label: 'Page Faults',
      data: stats.map(s => s ? s.faults : 0),
      backgroundColor: algos.map(a => COLORS[a].faded),
      borderColor: algos.map(a => COLORS[a].solid),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  // Bar chart: hit ratio
  const hitRatioData = {
    labels,
    datasets: [{
      label: 'Hit Ratio (%)',
      data: stats.map(s => s ? parseFloat(s.hitRatio) : 0),
      backgroundColor: algos.map(a => COLORS[a].faded),
      borderColor: algos.map(a => COLORS[a].solid),
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  // Line chart: cumulative faults over steps
  const maxLen = Math.max(...algos.map(a => steps[a].length));
  const lineLabels = Array.from({ length: maxLen }, (_, i) => `${i + 1}`);
  const lineData = {
    labels: lineLabels,
    datasets: algos.map(a => ({
      label: a.toUpperCase(),
      data: steps[a].map(s => s.faultCount),
      borderColor: COLORS[a].solid,
      backgroundColor: COLORS[a].faded,
      borderWidth: 2.5,
      pointRadius: maxLen > 20 ? 0 : 3,
      pointHoverRadius: 5,
      tension: 0.4,
      fill: false,
    })),
  };

  const CHART_OPTIONS_BASE = getChartOptions();
  const labelColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-label').trim() || '#9090b0';

  const barFaultOptions = {
    ...CHART_OPTIONS_BASE,
    plugins: {
      ...CHART_OPTIONS_BASE.plugins,
      title: { display: false },
    },
    scales: {
      ...CHART_OPTIONS_BASE.scales,
      y: { ...CHART_OPTIONS_BASE.scales.y, beginAtZero: true, title: { display: true, text: 'Faults', color: labelColor } },
    },
  };

  const barHitOptions = {
    ...CHART_OPTIONS_BASE,
    plugins: { ...CHART_OPTIONS_BASE.plugins, title: { display: false } },
    scales: {
      ...CHART_OPTIONS_BASE.scales,
      y: { ...CHART_OPTIONS_BASE.scales.y, beginAtZero: true, max: 100, title: { display: true, text: 'Hit %', color: labelColor } },
    },
  };

  const lineOptions = {
    ...CHART_OPTIONS_BASE,
    plugins: { ...CHART_OPTIONS_BASE.plugins, title: { display: false } },
    scales: {
      ...CHART_OPTIONS_BASE.scales,
      x: { ...CHART_OPTIONS_BASE.scales.x, title: { display: true, text: 'Step', color: labelColor } },
      y: { ...CHART_OPTIONS_BASE.scales.y, beginAtZero: true, title: { display: true, text: 'Cumulative Faults', color: labelColor } },
    },
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChartCard title="Page Faults" subtitle="Lower is better">
        <div style={{ height: 240 }}>
          <Bar data={faultData} options={barFaultOptions} />
        </div>
      </ChartCard>

      <ChartCard title="Hit Ratio" subtitle="Higher is better">
        <div style={{ height: 240 }}>
          <Bar data={hitRatioData} options={barHitOptions} />
        </div>
      </ChartCard>

      <ChartCard title="Fault Progression" subtitle="Cumulative over steps">
        <div style={{ height: 240 }}>
          <Line data={lineData} options={lineOptions} />
        </div>
      </ChartCard>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backdropFilter: 'blur(20px)' }}>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</h4>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
