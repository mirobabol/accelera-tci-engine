import React, { useState } from 'react';
import mockCohorts from '../data/mockCohorts.json';

function LookAlikeRadar() {
  const [personas] = useState(mockCohorts?.personas || []);
  const [activePersona, setActivePersona] = useState(personas[0] || null);

  const renderStarRating = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? 'var(--color-warning)' : 'rgba(255,255,255,0.2)', fontSize: '1.2rem', marginRight: '2px' }}>
        ★
      </span>
    ));
  };

  const renderFeatureBar = (label, value) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>
        <span>{label}</span>
        <span style={{ color: 'var(--color-accent-primary)' }}>{(value * 100).toFixed(0)}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value * 100}%`, background: 'var(--color-accent-primary)', boxShadow: 'var(--shadow-neon)' }} />
      </div>
    </div>
  );

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="header-title" style={{ margin: 0 }}>Behavioral Persona Library</h1>
        <button className="btn">+ Define New Persona</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', flexGrow: 1, overflow: 'hidden' }}>
        {/* Persona Library List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h3 className="card-title">Library</h3>
          {personas.map(persona => (
            <div 
              key={persona.personaId}
              onClick={() => setActivePersona(persona)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activePersona?.personaId === persona.personaId ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                border: activePersona?.personaId === persona.personaId ? '1px solid var(--color-accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '8px', color: activePersona?.personaId === persona.personaId ? 'var(--color-accent-primary)' : 'var(--color-text-primary)' }}>
                {persona.name}
              </div>
              <div>
                {renderStarRating(persona.starRating)}
              </div>
              {persona.starRating === 5 ? (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-success)', display: 'inline-block', background: 'rgba(0,255,153,0.1)', padding: '2px 6px', borderRadius: '4px' }}>✓ Validated Template</div>
              ) : (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>[Heuristic]</div>
              )}
            </div>
          ))}
        </div>

        {/* Persona Detail / Feature Vector */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {activePersona ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <h2 style={{ margin: '0 0 10px 0', color: 'var(--color-text-primary)' }}>{activePersona.name}</h2>
                  <div>{renderStarRating(activePersona.starRating)}</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '8px 12px' }}>Promote / Calibrate</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <h4 style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', marginBottom: '15px' }}>
                    Hard Indicators (Financial Trends)
                  </h4>
                  {renderFeatureBar('Turnover Growth Steepness', activePersona.featureVector.turnoverGrowthSteepness)}
                  {renderFeatureBar('Margin Trend', activePersona.featureVector.marginTrend)}
                  {renderFeatureBar('Profitability Trend', activePersona.featureVector.profitabilityTrend)}
                  {renderFeatureBar('Export Share Trend', activePersona.featureVector.exportShareTrend)}
                  {renderFeatureBar('Headcount Growth', activePersona.featureVector.headcountGrowthTrend)}
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', marginBottom: '15px' }}>
                    Soft Indicators (OSINT / External)
                  </h4>
                  {renderFeatureBar('Social Media Activity', activePersona.featureVector.socialMediaActivityLevel)}
                  {renderFeatureBar('News Mention Frequency', activePersona.featureVector.newsMentionFrequency)}
                  
                  <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Seed Companies Used:</div>
                    <div style={{ fontFamily: 'monospace', color: 'var(--color-accent-primary)', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                      {activePersona.seedCompanyIds.join(', ')}
                    </div>
                  </div>
                  
                  <button className="btn" style={{ width: '100%', marginTop: '20px' }}>
                    Scan Universe for Matches
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', color: 'var(--color-text-secondary)' }}>Select a persona to view its feature vector.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LookAlikeRadar;
