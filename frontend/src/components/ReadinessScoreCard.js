import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import '../styles/ReadinessScoreCard.css';

const MOCK_DATA = {
  skillScore: 70,
  interviewScore: 80,
  profileCompletion: 90,
};

const getStatus = (score) => {
  if (score >= 75) return { label: 'Job Ready', color: '#10b981', bg: '#d1fae5' };
  if (score >= 50) return { label: 'Almost Ready', color: '#f59e0b', bg: '#fef3c7' };
  return { label: 'Not Ready', color: '#ef4444', bg: '#fee2e2' };
};

const BARS = [
  { key: 'skillScore',        label: 'Skills',    color: '#3b82f6' },
  { key: 'interviewScore',    label: 'Interview', color: '#8b5cf6' },
  { key: 'profileCompletion', label: 'Profile',   color: '#10b981' },
];

const ReadinessScoreCard = ({ data = MOCK_DATA }) => {
  const { skillScore, interviewScore, profileCompletion } = data;
  const overall = Math.round(skillScore * 0.4 + interviewScore * 0.4 + profileCompletion * 0.2);
  const status = getStatus(overall);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  // SVG dimensions
  const W = 260, H = 130, barW = 44, gap = 20, baseline = H - 20, topPad = 10;

  const values = { skillScore, interviewScore, profileCompletion };

  return (
    <div className="rsc-card">
      {/* Header */}
      <div className="rsc-header">
        <h3 className="rsc-title">Career Readiness</h3>
        <span className="rsc-status-badge" style={{ color: status.color, background: status.bg }}>
          {status.label}
        </span>
      </div>

      {/* Score + trend */}
      <div className="rsc-score-row">
        <span className="rsc-score-num" style={{ color: status.color }}>{overall}%</span>
        <div className="rsc-trend">
          <TrendingUp size={12} strokeWidth={3} />
          +12%
        </div>
      </div>

      {/* SVG Bar Graph */}
      <div className="rsc-graph-wrapper">
        <svg viewBox={`0 0 ${W} ${H}`} className="rsc-svg">
          {/* Y-axis gridlines */}
          {[25, 50, 75, 100].map((pct) => {
            const y = baseline - ((pct / 100) * (baseline - topPad));
            return (
              <g key={pct}>
                <line x1={0} y1={y} x2={W} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                <text x={W - 2} y={y - 3} fontSize={8} fill="#cbd5e1" textAnchor="end">{pct}%</text>
              </g>
            );
          })}

          {/* Bars */}
          {BARS.map((bar, i) => {
            const val = values[bar.key];
            const maxH = baseline - topPad;
            const barH = animated ? (val / 100) * maxH : 0;
            const x = gap + i * (barW + gap);
            const y = baseline - barH;

            return (
              <g key={bar.key}>
                {/* Shadow / base */}
                <rect
                  x={x} y={topPad} width={barW} height={baseline - topPad}
                  fill="#f8fafc" rx={6}
                />
                {/* Animated bar */}
                <rect
                  x={x} y={y} width={barW} height={barH}
                  fill={bar.color} rx={6}
                  style={{ transition: 'y 1s cubic-bezier(.4,0,.2,1), height 1s cubic-bezier(.4,0,.2,1)', opacity: 0.9 }}
                />
                {/* Value label on top */}
                <text
                  x={x + barW / 2} y={animated ? y - 5 : baseline - 5}
                  fontSize={9} fontWeight="700" fill={bar.color} textAnchor="middle"
                  style={{ transition: 'y 1s cubic-bezier(.4,0,.2,1)' }}
                >
                  {val}%
                </text>
                {/* Bar label below */}
                <text x={x + barW / 2} y={baseline + 14} fontSize={9} fill="#94a3b8" textAnchor="middle" fontWeight="600">
                  {bar.label}
                </text>
              </g>
            );
          })}

          {/* Overall score line */}
          {animated && (
            <line
              x1={gap / 2} y1={baseline - (overall / 100) * (baseline - topPad)}
              x2={W - gap / 2} y2={baseline - (overall / 100) * (baseline - topPad)}
              stroke={status.color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.7}
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="rsc-legend">
        {BARS.map((bar) => (
          <div key={bar.key} className="rsc-legend-item">
            <span className="rsc-legend-dot" style={{ background: bar.color }} />
            <span className="rsc-legend-label">{bar.label}</span>
          </div>
        ))}
        <div className="rsc-legend-item">
          <span className="rsc-legend-dash" style={{ background: status.color }} />
          <span className="rsc-legend-label">Overall</span>
        </div>
      </div>
    </div>
  );
};

export default ReadinessScoreCard;
