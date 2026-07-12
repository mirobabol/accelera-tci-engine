import React, { useState, useEffect } from 'react';
import { generateChainOfThought } from '../services/llm';

function ProspectDrawer({ prospect, onClose }) {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!prospect) return;
    setAiData(null);
    setLoading(true);
    generateChainOfThought(prospect).then(data => {
      setAiData(data);
      setLoading(false);
    });
  }, [prospect]);

  if (!prospect) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '600px', background: 'rgba(2, 22, 58, 0.95)',
        borderLeft: '1px solid var(--color-accent-primary)', boxShadow: '-10px 0 30px rgba(0,255,255,0.1)',
        backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out'
      }}>
        
        {/* Header */}
        <div style={{ padding: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: 'var(--color-text-primary)' }}>{prospect.companyName || prospect.name}</h2>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{prospect.industry} • {prospect.region || 'Global'}</div>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 12px' }}>✕</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Top Level Prescriptive Actions */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn" style={{ flex: 1, padding: '10px' }}>Generate Outreach Draft</button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}>Run Deep Compliance Check</button>
          </div>

          {/* Firmographics & Financials */}
          <div>
            <h3 style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>About the Company</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--color-accent-primary)' }}>
              {prospect.description || `${prospect.companyName || prospect.name} is a leading enterprise within the ${prospect.industry || 'technology'} sector. Following a recent strategic shift, the company has expanded its regional footprint and aggressively modernized its supply chain logistics. Early AI detection indicates high volatility in their procurement strategy, making them highly receptive to modernized financial solutions and strategic consulting.`}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.9rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Turnover / Revenue</div>
                <div style={{ color: 'var(--color-text-primary)', fontSize: '1.2rem', fontWeight: 'bold' }}>${prospect.annualRevenue || prospect.turnover || '45'}M</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '5px' }}>YOY Growth</div>
                <div style={{ color: prospect.growth?.startsWith('+') ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '1.2rem', fontWeight: 'bold' }}>{prospect.growth || '+14%'}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Key Personnel</div>
                <div style={{ color: 'var(--color-text-primary)' }}>CEO: M. Schmidt<br/>CFO: A. Bauer</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Active Signals</div>
                <div style={{ color: 'var(--color-accent-primary)' }}>{prospect.signals || 'Leadership Expansion, M&A Activity'}</div>
              </div>
            </div>
          </div>

          {/* AI Explainability Layer */}
          <div>
            <h3 style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>AI Explainability & Driver Logic</h3>
            
            {/* Scoring Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
              
              <div style={{ background: 'rgba(255,51,102,0.05)', borderLeft: '4px solid var(--color-danger)', padding: '15px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Risk Exposure (RES)</strong>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-danger)' }}>{aiData?.scores?.res || prospect.res || 65}/100</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div><strong style={{ color: '#fff' }}>Primary Driver:</strong> High macro-economic exposure within local supply chains.</div>
                  <div><strong style={{ color: '#fff' }}>Secondary Logic:</strong> Over-leveraged in Q2 due to sudden raw material cost spikes.</div>
                  <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>AI Confidence: 94% (High) | Trend: Escalating</div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,255,153,0.05)', borderLeft: '4px solid var(--color-success)', padding: '15px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Acceptance Propensity (APS)</strong>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{aiData?.scores?.aps || prospect.aps || 88}/100</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div><strong style={{ color: '#fff' }}>Primary Driver:</strong> Sector-wide pattern matching. 88% of manufacturing personas convert during similar distress events.</div>
                  <div><strong style={{ color: '#fff' }}>Secondary Logic:</strong> Recent leadership reshuffle indicates a willingness to absorb new operational software.</div>
                  <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>AI Confidence: 89% (High) | Trend: Stable</div>
                </div>
              </div>

              <div style={{ background: 'rgba(0,255,255,0.05)', borderLeft: '4px solid var(--color-accent-primary)', padding: '15px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '1.1rem' }}>Accessibility (ACS)</strong>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent-primary)' }}>{aiData?.scores?.acs || prospect.acs || 92}/100</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <div><strong style={{ color: '#fff' }}>Primary Driver:</strong> 3 shared 2nd-degree network connections on LinkedIn via Accelera Partners.</div>
                  <div><strong style={{ color: '#fff' }}>Secondary Logic:</strong> ZoomInfo API retrieved highly accurate direct-dials for the CFO and Procurement Head.</div>
                  <div style={{ marginTop: '5px', padding: '5px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', display: 'inline-block', border: '1px solid rgba(255,255,255,0.1)' }}>AI Confidence: 98% (Very High) | Trend: Verified</div>
                </div>
              </div>
            </div>

            {/* Chain of Thought */}
            <div style={{ background: '#000', border: '1px solid rgba(0,255,255,0.2)', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.8rem', marginBottom: '25px' }}>
              <div style={{ color: 'var(--color-accent-primary)', marginBottom: '10px' }}>[Chain-of-Thought Execution]</div>
              
              {loading ? (
                <div style={{ color: '#00FF99', animation: 'pulse 1.5s infinite' }}>
                  &gt; INITIATING NEURAL LINK TO GEMINI...<br/>
                  &gt; FETCHING FIRMOGRAPHICS...
                </div>
              ) : aiData ? (
                aiData.reasoning.map((line, i) => (
                  <div key={i} style={{ color: i % 2 === 0 ? '#00FF99' : 'var(--color-text-secondary)', marginBottom: '5px' }}>{line}</div>
                ))
              ) : (
                <div style={{ color: 'var(--color-text-secondary)' }}>&gt; AWAITING AI DATA...</div>
              )}
              
              {!loading && aiData && (
                <div style={{ color: '#FFF', fontWeight: 'bold', marginTop: '10px' }}>&gt; RESULT: High Priority (Score: {prospect.aiScore || prospect.matchScore || 85})</div>
              )}
            </div>
            
            {/* Activity Timeline */}
            <h3 style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Chronological Signal History</h3>
            <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(0,255,255,0.2)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-primary)', border: '2px solid #000' }}></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Today, 09:41 AM</div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>AI Re-Scored Prospect to {prospect.aiScore || 85}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Triggered by structural shift in M&A rumors.</div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', border: '2px solid #000' }}></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Yesterday, 14:22 PM</div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Stage Change: Moved to "Researched"</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Action executed by System Agent.</div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', border: '2px solid #000' }}></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Oct 12, 11:05 AM</div>
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Initial Ingestion</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Sourced from CEE Regional Expansion Workspace.</div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

export default ProspectDrawer;
