import React, { useState } from 'react';
import NLQSearch from './NLQSearch';
import mockCohortsData from '../data/mockCohorts.json';

function Cohorts() {
  const [cohorts, setCohorts] = useState(mockCohortsData?.cohorts || []);
  const [activeCohort, setActiveCohort] = useState(mockCohortsData?.cohorts?.[0] || null);

  const handleNewCohort = (newCohortInfo) => {
    const newCohort = {
      cohortId: `nlq-${Date.now()}`,
      name: newCohortInfo.name,
      rankBy: newCohortInfo.rankBy,
      sourceQuery: { description: newCohortInfo.sourceQuery },
      memberCompanyIds: Array(newCohortInfo.count).fill('mock-id')
    };
    setCohorts([newCohort, ...cohorts]);
    setActiveCohort(newCohort);
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <h1 className="header-title" style={{ marginBottom: '20px' }}>Nested Cohort Engine</h1>
      
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 className="card-title" style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Natural Language Query (NLQ)</h3>
        <NLQSearch onSearchComplete={handleNewCohort} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', flexGrow: 1, overflow: 'hidden' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h3 className="card-title">Saved Cohorts</h3>
          {cohorts.map(cohort => (
            <div 
              key={cohort.cohortId}
              onClick={() => setActiveCohort(cohort)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeCohort?.cohortId === cohort.cohortId ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                border: activeCohort?.cohortId === cohort.cohortId ? '1px solid var(--color-accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '5px', color: activeCohort?.cohortId === cohort.cohortId ? 'var(--color-accent-primary)' : 'var(--color-text-primary)' }}>
                {cohort.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Ranked by: {cohort.rankBy}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          {activeCohort ? (
            <>
              <h3 className="card-title" style={{ color: 'var(--color-accent-primary)' }}>
                {activeCohort.name} <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginLeft: '10px' }}>({activeCohort.memberCompanyIds.length} companies)</span>
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                <strong>Source Query:</strong> {activeCohort.sourceQuery.description || JSON.stringify(activeCohort.sourceQuery)}
              </p>
              
              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 229, 255, 0.2)', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
                {/* Fake Quadrant Chart Grid Lines */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                
                {/* Fake Scatter Points */}
                {activeCohort.memberCompanyIds.map((_, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: i % 3 === 0 ? 'var(--color-danger)' : 'var(--color-accent-primary)',
                    boxShadow: '0 0 10px var(--color-accent-primary)'
                  }} />
                ))}

                {/* Labels */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>High Propensity / Low Risk</div>
                <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>High Propensity / High Risk</div>
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Low Propensity / Low Risk</div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Low Propensity / High Risk</div>
              </div>
            </>
          ) : (
            <div style={{ margin: 'auto', color: 'var(--color-text-secondary)' }}>Select a cohort to analyze</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cohorts;
