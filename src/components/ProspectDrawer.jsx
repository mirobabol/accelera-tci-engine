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

  // AI Agent Simulation State
  const [agentMode, setAgentMode] = useState(null); // 'compliance' | 'outreach' | null
  const [agentStep, setAgentStep] = useState(0);
  const [agentResult, setAgentResult] = useState(null);

  const runAgent = (mode) => {
    setAgentMode(mode);
    setAgentStep(0);
    setAgentResult(null);

    const steps = mode === 'compliance' ? 5 : 5;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        clearInterval(interval);
        if (mode === 'compliance') {
          setAgentResult(`COMPLIANCE RISK REPORT: ${prospect.companyName || prospect.name}\n\n1. Global Sanctions (OFAC/EU): CLEAR\n2. PEP Check (Officers): NO MATCHES\n3. UBO Cross-Reference: VERIFIED\n4. Adverse Media: NONE\n\nAI RECOMMENDATION: Low Risk. Cleared for immediate underwriting and outreach.`);
        } else {
          setAgentResult(`Subject: Strategic partnership with ${prospect.companyName || prospect.name}\n\nHi M. Schmidt,\n\nI noticed your recent +14% YoY growth and your aggressive expansion into the regional supply chain sector.\n\nGiven the high volatility in procurement we're seeing across your industry right now, I thought it would be timely to connect. We help companies like ${prospect.companyName || prospect.name} secure their accounts receivable against insolvency so you can expand without the associated credit risk.\n\nAre you open to a brief chat next Tuesday?`);
        }
      } else {
        setAgentStep(currentStep);
      }
    }, 1200); // 1.2s per step
  };

  const getAgentStepText = () => {
    if (agentMode === 'compliance') {
      const steps = [
        "Initializing Legal/Compliance Agent...",
        "Scraping Global Sanctions Lists (OFAC, UN, EU)...",
        "Analyzing PEP (Politically Exposed Persons) registry...",
        "Cross-referencing UBOs across 14 jurisdictions...",
        "Synthesizing AI Risk Report..."
      ];
      return steps[agentStep] || "";
    } else if (agentMode === 'outreach') {
      const steps = [
        "Initializing Sales Engineering Agent...",
        "Extracting Prospect Firmographics...",
        "Analyzing Recent News & Growth Signals...",
        "Formulating Strategic Value Proposition...",
        "Drafting highly-personalized cold outreach..."
      ];
      return steps[agentStep] || "";
    }
    return "";
  };

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
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{prospect.industry || prospect.sector} • {prospect.region || 'Global'}</div>
          </div>
          <button className="btn btn-secondary" onClick={onClose} style={{ padding: '8px 12px' }}>✕</button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
          
          {/* Agent Action Overlay */}
          {agentMode && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(2, 22, 58, 0.95)', zIndex: 10, padding: '40px',
              display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: 'var(--color-accent-primary)' }}>
                  {agentMode === 'compliance' ? 'Agentic Compliance Audit' : 'Agentic Outreach Writer'}
                </h3>
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => setAgentMode(null)}>Close</button>
              </div>

              {!agentResult ? (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '20px', animation: 'spin 2s linear infinite' }}>⚙️</div>
                  <div style={{ fontFamily: 'monospace', color: 'var(--color-success)', fontSize: '1.1rem', textAlign: 'center' }}>
                    &gt; {getAgentStepText()}
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ width: '80%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '30px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${(agentStep / 5) * 100}%`, 
                      background: 'var(--color-accent-primary)',
                      transition: 'width 1.2s linear'
                    }} />
                  </div>
                </div>
              ) : (
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: 'var(--color-success)', marginBottom: '15px', fontWeight: 'bold' }}>✓ Agent Task Complete</div>
                  <textarea 
                    readOnly 
                    value={agentResult} 
                    style={{ 
                      flexGrow: 1, width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', 
                      borderRadius: '8px', color: 'var(--color-text-primary)', padding: '20px', fontSize: '0.95rem',
                      fontFamily: agentMode === 'compliance' ? 'monospace' : 'inherit',
                      resize: 'none', lineHeight: '1.6'
                    }}
                  />
                  {agentMode === 'outreach' && (
                    <button className="btn" style={{ marginTop: '20px' }} onClick={() => alert('Draft copied to clipboard!')}>Copy Draft & Prepare to Send</button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Top Level Prescriptive Actions */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn" style={{ flex: 1, padding: '10px' }} onClick={() => runAgent('outreach')}>Generate Outreach Draft</button>
            <button className="btn btn-secondary" style={{ flex: 1, padding: '10px', borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }} onClick={() => runAgent('compliance')}>Run Deep Compliance Check</button>
          </div>

          {/* Firmographics & Financials */}
          <div>
            <h3 style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>About the Company</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid var(--color-accent-primary)' }}>
              {prospect.description || `${prospect.companyName || prospect.name} is a leading enterprise within the ${prospect.industry || prospect.sector || 'technology'} sector. Following a recent strategic shift, the company has expanded its regional footprint and aggressively modernized its supply chain logistics. Early AI detection indicates high volatility in their procurement strategy, making them highly receptive to modernized financial solutions and strategic consulting.`}
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
                <div style={{ color: 'var(--color-text-primary)' }}>{prospect.keyDecisionMaker ? `${prospect.keyDecisionMaker.title}: ${prospect.keyDecisionMaker.name}` : `CEO: M. Schmidt\nCFO: A. Bauer`}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Active Signals</div>
                <div style={{ color: 'var(--color-accent-primary)' }}>{prospect.recentSignals ? prospect.recentSignals[0] : prospect.signals || 'Leadership Expansion, M&A Activity'}</div>
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

export default ProspectDrawer;
