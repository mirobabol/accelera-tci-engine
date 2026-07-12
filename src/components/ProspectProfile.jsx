import React from 'react';

function RadarChart({ res, aps, acs }) {
  // Simple SVG Radar Chart (Triangle for 3 axes)
  const size = 200;
  const center = size / 2;
  const maxRadius = size / 2 - 20;

  // Angles for the 3 axes: 0 (top), 120 (bottom right), 240 (bottom left)
  const getPoint = (score, angleDeg) => {
    const r = (score / 100) * maxRadius;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    return {
      x: center + r * Math.cos(angleRad),
      y: center + r * Math.sin(angleRad)
    };
  };

  const p1 = getPoint(res, 0);
  const p2 = getPoint(aps, 120);
  const p3 = getPoint(acs, 240);
  const pathData = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`;

  // Background Grid Triangles
  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      {/* Grid */}
      {gridLevels.map(level => {
        const g1 = getPoint(level, 0);
        const g2 = getPoint(level, 120);
        const g3 = getPoint(level, 240);
        return (
          <path 
            key={level}
            d={`M ${g1.x} ${g1.y} L ${g2.x} ${g2.y} L ${g3.x} ${g3.y} Z`}
            fill="none" 
            stroke="var(--color-bg-tertiary)" 
            strokeWidth="1"
            strokeDasharray={level === 100 ? "0" : "4 4"}
          />
        );
      })}

      {/* Axes Lines */}
      {[0, 120, 240].map(angle => {
        const end = getPoint(100, angle);
        return <line key={angle} x1={center} y1={center} x2={end.x} y2={end.y} stroke="var(--color-bg-tertiary)" strokeWidth="1" />;
      })}

      {/* Data Polygon */}
      <path 
        d={pathData} 
        fill="rgba(59, 130, 246, 0.3)" 
        stroke="var(--color-accent-primary)" 
        strokeWidth="2" 
        style={{ filter: 'drop-shadow(0 0 5px rgba(59,130,246,0.5))' }}
      />
      
      {/* Points */}
      <circle cx={p1.x} cy={p1.y} r="4" fill="var(--color-accent-primary)" />
      <circle cx={p2.x} cy={p2.y} r="4" fill="var(--color-accent-primary)" />
      <circle cx={p3.x} cy={p3.y} r="4" fill="var(--color-accent-primary)" />

      {/* Labels */}
      <text x={center} y={15} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10px">RES</text>
      <text x={size - 5} y={size - 25} textAnchor="end" fill="var(--color-text-secondary)" fontSize="10px">APS</text>
      <text x={5} y={size - 25} textAnchor="start" fill="var(--color-text-secondary)" fontSize="10px">ACS</text>
    </svg>
  );
}

function ProspectProfile({ prospect, onBack }) {
  if (!prospect) return <div>No prospect selected</div>;

  return (
    <div className="prospect-profile">
      <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>&larr; Back to List</button>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
        {/* Main Info */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '5px' }}>{prospect.name}</h1>
              <div style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>{prospect.sector} &bull; Turnover: {prospect.turnover}</div>
            </div>
            <span style={{
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backgroundColor: prospect.type === 'Hot' ? 'rgba(16, 185, 129, 0.1)' : 
                                   prospect.type === 'Nurture' ? 'rgba(245, 158, 11, 0.1)' : 
                                   prospect.type === 'Opportunistic' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: prospect.type === 'Hot' ? 'var(--color-success)' : 
                         prospect.type === 'Nurture' ? 'var(--color-warning)' : 
                         prospect.type === 'Opportunistic' ? 'var(--color-accent-neon)' : 'var(--color-danger)',
                }}>
              {prospect.type} Quadrant
            </span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ marginBottom: '10px', color: 'var(--color-text-secondary)' }}>Key Risk Signals (RES)</h3>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
              <li>High concentration in {prospect.sector} sector (Weight: 1.2)</li>
              <li>Receivables growth outpacing revenue (Flagged in Finstat)</li>
            </ul>

            <h3 style={{ marginBottom: '10px', color: 'var(--color-text-secondary)' }}>Propensity Signals (APS)</h3>
            <ul style={{ paddingLeft: '20px', marginBottom: '20px', color: 'var(--color-text-primary)' }}>
              <li>Spin-off pattern detected: Founder previously at large competitor</li>
              <li>Strong export language on website</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '30px' }}>
             <button className="btn">Move to Outreach Pipeline</button>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="card">
          <div className="card-title">Score Breakdown</div>
          <RadarChart res={prospect.res} aps={prospect.aps} acs={prospect.acs} />
          
          <div style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Risk Exposure (RES)</span>
              <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>{prospect.res}/100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Acceptance Propensity (APS)</span>
              <span style={{ color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>{prospect.aps}/100</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Accessibility (ACS)</span>
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>{prospect.acs}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProspectProfile;
