import React, { useState } from 'react';
import NLQSearch from './NLQSearch';
import mockCohorts from '../data/mockCohorts.json';

function Cohorts() {
  const [activeCohort, setActiveCohort] = useState(mockCohorts?.cohorts?.[0] || null);

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <h1 className="header-title" style={{ marginBottom: '20px' }}>Nested Cohort Engine</h1>
      
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 className="card-title" style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Natural Language Query (NLQ)</h3>
        <NLQSearch />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px', flexGrow: 1, overflow: 'hidden' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <h3 className="card-title">Saved Cohorts</h3>
          {mockCohorts?.cohorts?.map(cohort => (
            <div 
              key={cohort.cohortId}
              onClick={() => setActiveCohort(cohort)}
              style={{
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: activeCohort?.cohortId === cohort.cohortId ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
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
              
              <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(0, 255, 255, 0.2)', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
                  Quadrant Analysis for {activeCohort.rankBy} will render here.
                </div>
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
