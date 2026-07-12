import React, { useState, useEffect } from 'react';
import mockProspects from '../data/mockProspects.json';
import ProspectDrawer from './ProspectDrawer';

function NetworkMap() {
  const [prospects, setProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState(null);

  useEffect(() => {
    setProspects(mockProspects || []);
  }, []);

  // Generate deterministic "random" positions for nodes in a circle
  const nodes = prospects.map((p, i) => {
    const angle = (i / prospects.length) * 2 * Math.PI;
    const radius = 200 + (i % 2 === 0 ? 50 : -50); // Stagger radius
    const cx = 400 + Math.cos(angle) * radius;
    const cy = 300 + Math.sin(angle) * radius;
    return { ...p, cx, cy };
  });

  // Generate some fake relationships (edges) based on shared industry
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].industry === nodes[j].industry) {
        edges.push({ source: nodes[i], target: nodes[j], type: 'Shared Sector' });
      } else if (i % 3 === j % 3) {
        edges.push({ source: nodes[i], target: nodes[j], type: 'Supply Chain Link' });
      }
    }
  }

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <h1 className="header-title" style={{ marginBottom: '10px' }}>Global Network Map</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>Visualizing structural relationships, shared directors, and supply chain overlaps.</p>
      
      <div className="card" style={{ flexGrow: 1, padding: 0, position: 'relative', background: '#020A15' }}>
        
        {/* SVG Network Graph */}
        <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 255, 255, 0.8)" />
              <stop offset="100%" stopColor="rgba(0, 255, 255, 0)" />
            </radialGradient>
            <radialGradient id="nodeGlowHot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 51, 102, 0.8)" />
              <stop offset="100%" stopColor="rgba(255, 51, 102, 0)" />
            </radialGradient>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, idx) => (
            <line 
              key={`edge-${idx}`}
              x1={edge.source.cx} y1={edge.source.cy}
              x2={edge.target.cx} y2={edge.target.cy}
              stroke={edge.type === 'Shared Sector' ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.05)'}
              strokeWidth="2"
            />
          ))}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const isHot = node.aiScore >= 85 || node.matchScore >= 85;
            return (
              <g 
                key={node.id} 
                transform={`translate(${node.cx}, ${node.cy})`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProspect(node)}
                className="node-group"
              >
                <circle r="30" fill={`url(${isHot ? '#nodeGlowHot' : '#nodeGlow'})`} opacity="0.5" />
                <circle r="12" fill={isHot ? 'var(--color-danger)' : 'var(--color-accent-primary)'} stroke="#fff" strokeWidth="2" />
                <text 
                  y="25" 
                  textAnchor="middle" 
                  fill="#FFF" 
                  fontSize="12" 
                  fontWeight="bold" 
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                >
                  {node.companyName || node.name}
                </text>
                <text 
                  y="40" 
                  textAnchor="middle" 
                  fill="var(--color-text-secondary)" 
                  fontSize="10" 
                >
                  {node.industry}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>Topology Legend</h4>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-danger)', marginRight: '10px' }}></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Hot Target (AI &gt; 85)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-accent-primary)', marginRight: '10px' }}></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Active Prospect</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ width: '20px', height: '2px', background: 'rgba(0,255,255,0.3)', marginRight: '5px' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Shared Sector</span>
          </div>
        </div>

      </div>

      <ProspectDrawer prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />
      
      <style>{`
        .node-group { transition: transform 0.2s ease; }
        .node-group:hover { transform: translate(cx, cy) scale(1.2); }
      `}</style>
    </div>
  );
}

export default NetworkMap;
