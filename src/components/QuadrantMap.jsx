import React from 'react';

function QuadrantMap({ prospects }) {
  // Simple SVG scatter plot
  // X-axis: RES (Risk Exposure Score) 0-100
  // Y-axis: APS (Acceptance Propensity Score) 0-100 (inverted for SVG coords)
  // Bubble Size: ACS (Accessibility Score)

  const getColor = (res, aps) => {
    if (res >= 50 && aps >= 50) return 'var(--color-success)'; // Hot
    if (res >= 50 && aps < 50) return 'var(--color-warning)'; // Nurture
    if (res < 50 && aps >= 50) return 'var(--color-accent-neon)'; // Opportunistic
    return 'var(--color-danger)'; // Deprioritize
  };

  return (
    <div style={{ width: '100%', height: 'calc(100% - 40px)', position: 'relative', border: '1px solid var(--color-bg-tertiary)' }}>
      {/* Background Quadrants */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', borderRight: '1px dashed var(--color-bg-tertiary)', borderBottom: '1px dashed var(--color-bg-tertiary)' }}>
        <span style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Opportunistic (Low RES, High APS)</span>
      </div>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', borderBottom: '1px dashed var(--color-bg-tertiary)' }}>
        <span style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Hot (High RES, High APS)</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', borderRight: '1px dashed var(--color-bg-tertiary)' }}>
        <span style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Deprioritize (Low RES, Low APS)</span>
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%' }}>
        <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Nurture (High RES, Low APS)</span>
      </div>

      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        {prospects.map(p => {
          const cx = `${p.res}%`;
          const cy = `${100 - p.aps}%`;
          const r = 5 + (p.acs / 100) * 15; // Min radius 5, Max 20

          return (
            <g key={p.id} className="bubble">
              <circle 
                cx={cx} 
                cy={cy} 
                r={r} 
                fill={getColor(p.res, p.aps)} 
                opacity="0.8" 
                stroke="#fff" 
                strokeWidth="1"
                style={{ filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))', transition: 'all 0.3s' }}
              />
              <text 
                x={cx} 
                y={cy} 
                dy="-25" 
                textAnchor="middle" 
                fill="var(--color-text-primary)" 
                fontSize="12px"
                fontWeight="500"
                style={{ pointerEvents: 'none' }}
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Axes labels */}
      <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
        Risk Exposure Score (RES) &rarr;
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '-30px', transform: 'translateY(-50%) rotate(-90deg)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
        Acceptance Propensity (APS) &rarr;
      </div>
    </div>
  );
}

export default QuadrantMap;
