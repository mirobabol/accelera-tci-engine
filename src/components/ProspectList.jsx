import React, { useState } from 'react';
import ProspectDrawer from './ProspectDrawer';

// Mock data to be replaced with data from connectors
const mockProspects = [
  { id: '1', name: 'DyneXor, s.r.o.', res: 85, aps: 90, acs: 70, sector: 'IT Services', type: 'Hot', turnover: '€2.5M' },
  { id: '2', name: 'MD COMPANY s.r.o.', res: 75, aps: 80, acs: 60, sector: 'Manufacturing', type: 'Hot', turnover: '€5.1M' },
  { id: '3', name: 'STEELINVEST, s.r.o.', res: 95, aps: 40, acs: 85, sector: 'Non-ferrous metals', type: 'Nurture', turnover: '€12M' },
  { id: '4', name: 'MJ-TRADING, s.r.o.', res: 30, aps: 85, acs: 90, sector: 'Retail', type: 'Opportunistic', turnover: '€1.5M' },
  { id: '5', name: 'GAS Familia, s.r.o.', res: 40, aps: 30, acs: 50, sector: 'Spirits', type: 'Deprioritize', turnover: '€8M' },
];

function ProspectList() {
  const [filter, setFilter] = useState('All');
  const [naceFilter, setNaceFilter] = useState('All');
  const [selectedProspect, setSelectedProspect] = useState(null);

  const filtered = mockProspects.filter(p => {
    const passQuadrant = filter === 'All' || p.type === filter;
    const passNace = naceFilter === 'All' || p.sector.includes(naceFilter);
    return passQuadrant && passNace;
  });

  return (
    <div className="prospect-list card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="card-title" style={{ margin: 0 }}>Prospect Directory</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={naceFilter} 
            onChange={(e) => setNaceFilter(e.target.value)}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              background: 'var(--color-bg-tertiary)', 
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-bg-secondary)'
            }}
          >
            <option value="All">All NACE Sectors</option>
            <option value="IT Services">IT Services</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="metals">Non-ferrous metals</option>
            <option value="Retail">Retail</option>
            <option value="Spirits">Spirits</option>
          </select>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
              padding: '8px', 
              borderRadius: '4px', 
              background: 'var(--color-bg-tertiary)', 
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-bg-secondary)'
            }}
          >
            <option value="All">All Quadrants</option>
            <option value="Hot">Hot</option>
            <option value="Nurture">Nurture</option>
            <option value="Opportunistic">Opportunistic</option>
            <option value="Deprioritize">Deprioritize</option>
          </select>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
            <th style={{ padding: '12px' }}>Company</th>
            <th style={{ padding: '12px' }}>Sector</th>
            <th style={{ padding: '12px' }}>Turnover</th>
            <th style={{ padding: '12px' }}>RES</th>
            <th style={{ padding: '12px' }}>APS</th>
            <th style={{ padding: '12px' }}>Quadrant</th>
            <th style={{ padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid var(--color-bg-tertiary)', cursor: 'pointer' }} onClick={() => setSelectedProspect(p)}>
              <td style={{ padding: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{p.name}</td>
              <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>{p.sector}</td>
              <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>{p.turnover}</td>
              <td style={{ padding: '12px', color: 'var(--color-danger)' }}>{p.res}</td>
              <td style={{ padding: '12px', color: 'var(--color-accent-primary)' }}>{p.aps}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  backgroundColor: p.type === 'Hot' ? 'rgba(16, 185, 129, 0.1)' : 
                                   p.type === 'Nurture' ? 'rgba(245, 158, 11, 0.1)' : 
                                   p.type === 'Opportunistic' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: p.type === 'Hot' ? 'var(--color-success)' : 
                         p.type === 'Nurture' ? 'var(--color-warning)' : 
                         p.type === 'Opportunistic' ? 'var(--color-accent-neon)' : 'var(--color-danger)',
                }}>
                  {p.type}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '15px' }}>
                  <div style={{ color: 'var(--color-text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Ancillary Due Diligence</div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); alert(`Checking National Insolvency Register for ${p.name}...\nResult: CLEAR (No Hits)`); }}>
                      Check Insolvency Register
                    </button>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={(e) => { e.stopPropagation(); alert(`Checking Debtors Register for ${p.name}...\nResult: CLEAR`); }}>
                      Check Tax Debtor Register
                    </button>
                  </div>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                  onClick={() => setSelectedProspect(p)}
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProspectDrawer prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />
    </div>
  );
}

export default ProspectList;
