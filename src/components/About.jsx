import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

function About() {
  const manualRef = useRef(null);

  const exportPDF = () => {
    const element = manualRef.current;
    
    // We create a pristine, temporary clone specifically for PDF export
    // This completely bypasses all dark mode CSS variables, ensuring 100% readability.
    const clone = element.cloneNode(true);
    clone.style.background = '#ffffff';
    clone.style.color = '#000000';
    clone.style.padding = '40px';
    clone.style.fontFamily = 'Arial, sans-serif';
    clone.style.width = '800px'; // Force width for A4 proportion
    
    // Override specific text colors on the clone to guarantee black text
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      el.style.color = '#000000';
      el.style.borderColor = '#cccccc';
      if (el.style.backgroundColor && el.style.backgroundColor.includes('rgba')) {
        el.style.backgroundColor = '#f0f0f0'; // Strip transparent backgrounds
      }
    });

    document.body.appendChild(clone);
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';

    const opt = {
      margin:       10,
      filename:     'Accelera_AI_Prospecting_Manual.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(clone).save().then(() => {
      document.body.removeChild(clone);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Platform Documentation</h2>
        <button className="btn" onClick={exportPDF}>
          Export Readable PDF
        </button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        
        {/* The visual container seen in the UI (Dark Mode) */}
        <div className="card" style={{ padding: '40px', marginBottom: '20px' }}>
          
          {/* We attach the ref to this inner div so the clone grabs the clean HTML structure */}
          <div ref={manualRef}>
            <h1 style={{ color: 'var(--color-accent-primary)', marginBottom: '25px', fontSize: '2rem', borderBottom: '2px solid var(--color-accent-primary)', paddingBottom: '10px' }}>
              Accelera Prospecting Engine - Official Manual
            </h1>
            
            <p style={{ lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '30px' }}>
              Welcome to the Accelera AI Prospecting Engine. This platform is a multi-tenant, AI-driven lead generation suite designed to transition static company lists into dynamic, predictive pipeline flows.
            </p>

            <h2 style={{ marginTop: '30px', marginBottom: '15px', color: 'var(--color-text-primary)' }}>Step-by-Step Workflow</h2>
            
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: '1' }}>
                <h3 style={{ color: 'var(--color-accent-primary)' }}>1. Ingestion & Data Management</h3>
                <p style={{ lineHeight: '1.6' }}>
                  Navigate to the <strong>Data & Workspaces</strong> tab. Ensure your API keys (ZoomInfo, Coface) are active. The engine will automatically scrape public signals from these providers into the Canonical Data Model.
                </p>
              </div>
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="100" height="60" viewBox="0 0 100 60">
                  <rect x="10" y="10" width="30" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M45,30 L65,30 M60,25 L65,30 L60,35" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="80" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: '1' }}>
                <h3 style={{ color: 'var(--color-success)' }}>2. Persona Matching & Cohorts</h3>
                <p style={{ lineHeight: '1.6' }}>
                  Use the <strong>Nested Cohorts</strong> tab to filter targets using Natural Language (e.g. "Find high margin manufacturing"). The AI automatically scores them against your active Personas (Hard/Soft traits).
                </p>
              </div>
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="100" height="60" viewBox="0 0 100 60">
                  <polygon points="50,10 90,50 10,50" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="50" cy="35" r="5" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: '1' }}>
                <h3 style={{ color: '#b28dff' }}>3. Due Diligence & Pipeline Execution</h3>
                <p style={{ lineHeight: '1.6' }}>
                  Move high-scoring targets to the <strong>Outreach Pipeline</strong>. Use the built-in Ancillary Register checks (Insolvency, Tax Debtor) on their profile cards before executing outreach.
                </p>
              </div>
              <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <svg width="100" height="60" viewBox="0 0 100 60">
                  <rect x="10" y="10" width="80" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <line x1="35" y1="10" x2="35" y2="50" stroke="currentColor" strokeWidth="2"/>
                  <line x1="65" y1="10" x2="65" y2="50" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
            
            <h2 style={{ marginTop: '40px', marginBottom: '15px' }}>Platform Features List</h2>
            <ul style={{ lineHeight: '1.8', marginLeft: '20px', marginBottom: '40px' }}>
              <li><strong>Global Command Palette:</strong> Press <code>Cmd+K</code> or <code>Ctrl+K</code> from anywhere to instantly search and navigate across the app.</li>
              <li><strong>Intelligence Dashboard:</strong> A high-level overview of active signals, top prospects, and immediate AI recommended actions.</li>
              <li><strong>Persona & Behavioral Engine:</strong> Select high-converting seed companies to define behavioral templates.</li>
              <li><strong>Global Network Topology:</strong> A visual node-based map revealing shared sectors and supply chain overlaps. Hot targets glow red.</li>
              <li><strong>Advanced Outreach Pipeline:</strong> Features a semantic search bar, funnel drop-off visualization, and drag-and-drop Kanban interface.</li>
              <li><strong>AI Explainability Drawer:</strong> Click on any prospect card to reveal the Chain of Thought Analytics, displaying exactly why the AI assigned specific Risk and Propensity scores.</li>
            </ul>

            <h2 style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>Version History</h2>
            <div style={{ paddingLeft: '15px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '15px' }}>v5.0.0 - Advanced Visualizations & Transparency (Current)</div>
              <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                Introduced the Global Command Palette (Cmd+K) and interactive Network Map. Completely overhauled the Outreach Pipeline with Semantic Search and conversion Funnels. Deployed the AI Explainability Drawer to provide transparent "Chain of Thought" reasoning behind all AI-generated scores. Fixed the Sidebar scrolling and PDF rendering logic.
              </p>
              
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '25px', color: 'var(--color-text-secondary)' }}>v4.0.0 - The Signal & Ingestion Architecture</div>
              <p style={{ fontSize: '0.9rem', marginTop: '5px', color: 'var(--color-text-secondary)' }}>
                Rebuilt the Look-Alike Radar into a robust Persona Engine with 1-to-5 Star rating feedback loops. Implemented OpenAI-powered Natural Language Query (NLQ) parsing. Added Nested Cohort drill-down analysis, Multi-Tenant Workspaces, and Ancillary Due Diligence Mock checks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
