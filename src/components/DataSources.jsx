import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

function DataSources() {
  const [activeTab, setActiveTab] = useState('credentials');
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      Papa.parse(file, {
        header: true,
        complete: async (results) => {
          try {
            let count = 0;
            for (let row of results.data) {
              if (row.name || row.Company) {
                await addDoc(collection(db, 'prospects'), {
                  name: row.name || row.Company || 'Unknown',
                  industry: row.industry || row.Industry || 'Unknown',
                  revenue: row.revenue || row.Revenue || '0',
                  stage: 'Discovered',
                  createdAt: new Date().toISOString()
                });
                count++;
              }
            }
            alert(`Successfully ingested ${count} prospects from CSV!`);
          } catch(err) {
            alert('Upload failed: ' + err.message);
          }
          setIsUploading(false);
          e.target.value = null; // reset
        }
      });
    }
  };
  
  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="header-title" style={{ margin: 0 }}>Workspaces & Data Ingestion</h1>
        <button className="btn">+ New Scenario Workspace</button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeTab === 'credentials' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('credentials')}
        >
          API Credentials
        </button>
        <button 
          className={`btn ${activeTab === 'workspaces' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('workspaces')}
        >
          Active Workspaces
        </button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {activeTab === 'credentials' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card">
              <h3 className="card-title">Licensed APIs</h3>
              <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--color-success)', borderRadius: '4px' }}>
                <strong>ZoomInfo</strong> - Active (Valid to 2027)
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '5px' }}>Quota: 45,000 / 100,000 calls</div>
              </div>
              <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(0,255,0,0.1)', border: '1px solid var(--color-success)', borderRadius: '4px' }}>
                <strong>OpenAI</strong> - Active (Scraping engine)
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '5px' }}>Model: gpt-4o</div>
              </div>
              <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,0,0,0.1)', border: '1px solid var(--color-danger)', borderRadius: '4px' }}>
                <strong>Coface Trade Feed</strong> - Expired
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '5px' }}>Requires renewal.</div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Add Credential</button>
            </div>
            
            <div className="card">
              <h3 className="card-title">Manual Imports & Data Cubes</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '15px' }}>
                Upload manual CSVs or define custom Data Cubes to normalize into the Canonical Schema.
              </p>
              <input 
                type="file" 
                accept=".csv" 
                style={{ display: 'none' }} 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
              <div 
                onClick={() => !isUploading && fileInputRef.current.click()}
                style={{ padding: '30px', border: '1px dashed rgba(255,255,255,0.2)', textAlign: 'center', borderRadius: '8px', cursor: isUploading ? 'not-allowed' : 'pointer', background: isUploading ? 'rgba(255,255,255,0.05)' : 'transparent' }}
              >
                {isUploading ? 'Ingesting data to Firestore...' : 'Upload .CSV'}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workspaces' && (
          <div className="card">
            <h3 className="card-title">Multi-Tenant Scenarios</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: '10px' }}>Workspace</th>
                  <th style={{ padding: '10px' }}>Scenario Focus</th>
                  <th style={{ padding: '10px' }}>Members</th>
                  <th style={{ padding: '10px' }}>Access</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>Accelera Main</td>
                  <td style={{ padding: '10px' }}>Global Prospecting (Default)</td>
                  <td style={{ padding: '10px' }}>5 users</td>
                  <td style={{ padding: '10px', color: 'var(--color-success)' }}>Owner</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>CEE Auto Expansion</td>
                  <td style={{ padding: '10px' }}>Tier 1 Automotive Supply Chain</td>
                  <td style={{ padding: '10px' }}>2 users</td>
                  <td style={{ padding: '10px', color: 'var(--color-success)' }}>Editor</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DataSources;
