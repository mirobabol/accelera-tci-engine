import React, { useState, useEffect, useMemo } from 'react';
import ProspectDrawer from './ProspectDrawer';
import { getProspects } from '../services/db';

const REGION_MAP = {
  'CEE': ['Slovakia', 'Czechia', 'Poland', 'Hungary', 'Romania', 'Bulgaria'],
  'DACH': ['Germany', 'Austria', 'Switzerland'],
  'Nordics': ['Norway', 'Sweden', 'Denmark', 'Finland'],
  'UKI': ['United Kingdom', 'Ireland', 'UK'],
  'Americas': ['USA', 'United States', 'Canada', 'Mexico', 'Brazil'],
  'APAC': ['Japan', 'China', 'Singapore', 'Australia', 'India']
};

function ProspectList() {
  const [prospects, setProspects] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState(null);
  
  // Advanced Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [activeCountry, setActiveCountry] = useState('All');
  const [minRevenue, setMinRevenue] = useState('All'); // 'All', '50', '100', '250'
  const [minAps, setMinAps] = useState('All'); // 'All', '70', '80', '90'
  const [activeSector, setActiveSector] = useState('All');

  // Loading state for semantic search
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProspects();
      setProspects(data);
    }
    load();
  }, []);

  // Extract all unique countries from the dataset
  const availableCountries = useMemo(() => {
    const countries = new Set();
    prospects.forEach(p => {
      if (p.headquarters) {
        const parts = p.headquarters.split(',');
        const country = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
        countries.add(country);
      }
    });
    return Array.from(countries).sort();
  }, [prospects]);

  // Extract all unique sectors from dataset
  const availableSectors = useMemo(() => {
    const sectors = new Set();
    prospects.forEach(p => sectors.add(p.industry || p.sector || 'Unknown'));
    return Array.from(sectors).sort();
  }, [prospects]);

  // Simulate Semantic Search delay when typing
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true);
      const timeout = setTimeout(() => setIsSearching(false), 400); // 400ms fake delay
      return () => clearTimeout(timeout);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Main Filtering Logic
  const filtered = useMemo(() => {
    return prospects.filter(p => {
      // 1. Semantic Fuzzy Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchCorpus = [
          p.companyName || p.name || '',
          p.industry || p.sector || '',
          p.headquarters || '',
          p.description || '',
          ...(p.recentSignals || []),
          p.signals || ''
        ].join(' ').toLowerCase();

        if (!searchCorpus.includes(q)) return false;
      }

      // Extract Country for Geography filters
      let pCountry = '';
      if (p.headquarters) {
        const parts = p.headquarters.split(',');
        pCountry = parts.length > 1 ? parts[parts.length - 1].trim() : parts[0].trim();
      }

      // 2. Region Filter
      if (activeRegion !== 'All') {
        const countriesInRegion = REGION_MAP[activeRegion] || [];
        if (!countriesInRegion.includes(pCountry)) return false;
      }

      // 3. Country Filter
      if (activeCountry !== 'All' && pCountry !== activeCountry) return false;

      // 4. Sector Filter
      const pSector = p.industry || p.sector || 'Unknown';
      if (activeSector !== 'All' && pSector !== activeSector) return false;

      // 5. Revenue Filter
      if (minRevenue !== 'All') {
        const rev = parseInt(p.annualRevenue || p.turnover || 0, 10);
        if (rev < parseInt(minRevenue, 10)) return false;
      }

      // 6. AI Score (APS) Filter
      if (minAps !== 'All') {
        const aps = parseInt(p.aps || p.aiScore || 0, 10);
        if (aps < parseInt(minAps, 10)) return false;
      }

      return true;
    });
  }, [prospects, searchQuery, activeRegion, activeCountry, minRevenue, minAps, activeSector]);


  // Handlers for Active Filter Tags
  const clearFilter = (type) => {
    if (type === 'search') setSearchQuery('');
    if (type === 'region') setActiveRegion('All');
    if (type === 'country') setActiveCountry('All');
    if (type === 'revenue') setMinRevenue('All');
    if (type === 'aps') setMinAps('All');
    if (type === 'sector') setActiveSector('All');
  };

  return (
    <div className="prospect-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* COMMAND CENTER: ADVANCED SEARCH & FILTERS */}
      <div className="card" style={{ padding: '25px', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Directory Search</h2>
          {isSearching && <span style={{ color: 'var(--color-accent-primary)', fontSize: '0.9rem', animation: 'pulse 1s infinite' }}>⚙️ Semantic Engine Thinking...</span>}
        </div>

        {/* Semantic Search Bar */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <span style={{ position: 'absolute', left: '15px', top: '12px', fontSize: '1.2rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search by company name, technology stack, region, or natural language..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 45px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--color-accent-primary)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        {/* Multi-Level Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Region</label>
            <select className="filter-select" value={activeRegion} onChange={(e) => { setActiveRegion(e.target.value); setActiveCountry('All'); }}>
              <option value="All">Global (All)</option>
              {Object.keys(REGION_MAP).map(reg => <option key={reg} value={reg}>{reg}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Country</label>
            <select className="filter-select" value={activeCountry} onChange={(e) => setActiveCountry(e.target.value)}>
              <option value="All">All Countries</option>
              {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Sector</label>
            <select className="filter-select" value={activeSector} onChange={(e) => setActiveSector(e.target.value)}>
              <option value="All">All Sectors</option>
              {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Revenue Size</label>
            <select className="filter-select" value={minRevenue} onChange={(e) => setMinRevenue(e.target.value)}>
              <option value="All">Any Turnover</option>
              <option value="50">&gt; $50M</option>
              <option value="100">&gt; $100M</option>
              <option value="250">&gt; $250M</option>
              <option value="500">&gt; $500M</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>AI Propensity (APS)</label>
            <select className="filter-select" value={minAps} onChange={(e) => setMinAps(e.target.value)}>
              <option value="All">All Scores</option>
              <option value="70">High (70+)</option>
              <option value="80">Very High (80+)</option>
              <option value="90">Exceptional (90+)</option>
            </select>
          </div>

        </div>

        {/* Active Filter Tags Row */}
        {(searchQuery || activeRegion !== 'All' || activeCountry !== 'All' || minRevenue !== 'All' || minAps !== 'All' || activeSector !== 'All') && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', alignSelf: 'center', marginRight: '10px' }}>Active Filters:</span>
            
            {searchQuery && (
              <span className="filter-tag" onClick={() => clearFilter('search')}>Query: "{searchQuery}" ✕</span>
            )}
            {activeRegion !== 'All' && (
              <span className="filter-tag" onClick={() => clearFilter('region')}>Region: {activeRegion} ✕</span>
            )}
            {activeCountry !== 'All' && (
              <span className="filter-tag" onClick={() => clearFilter('country')}>Country: {activeCountry} ✕</span>
            )}
            {activeSector !== 'All' && (
              <span className="filter-tag" onClick={() => clearFilter('sector')}>Sector: {activeSector} ✕</span>
            )}
            {minRevenue !== 'All' && (
              <span className="filter-tag" onClick={() => clearFilter('revenue')}>Revenue: &gt;${minRevenue}M ✕</span>
            )}
            {minAps !== 'All' && (
              <span className="filter-tag" onClick={() => clearFilter('aps')}>APS: &gt;{minAps} ✕</span>
            )}
            
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '4px 10px', marginLeft: 'auto', border: 'none' }} onClick={() => {
              setSearchQuery(''); setActiveRegion('All'); setActiveCountry('All'); setMinRevenue('All'); setMinAps('All'); setActiveSector('All');
            }}>Clear All</button>
          </div>
        )}
      </div>

      {/* RESULTS TABLE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Showing {filtered.length} of {prospects.length} prospects
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' }}>
              <th style={{ padding: '12px' }}>Company</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Sector</th>
              <th style={{ padding: '12px' }}>Turnover</th>
              <th style={{ padding: '12px' }}>RES</th>
              <th style={{ padding: '12px' }}>APS</th>
              <th style={{ padding: '12px' }}>Quadrant</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const quadrant = p.aiScore > 85 ? 'Hot' : p.aiScore > 65 ? 'Nurture' : p.aiScore > 40 ? 'Opportunistic' : 'Deprioritize';
              return (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--color-bg-tertiary)', cursor: 'pointer', transition: 'background 0.2s' }} 
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setSelectedProspect(p)}>
                <td style={{ padding: '12px', fontWeight: '500', color: 'var(--color-text-primary)' }}>{p.companyName || p.name}</td>
                <td style={{ padding: '12px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{p.headquarters}</td>
                <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>{p.industry || p.sector}</td>
                <td style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>${p.annualRevenue}M</td>
                <td style={{ padding: '12px', color: 'var(--color-danger)' }}>{p.res || (100 - Math.floor((p.aiScore||50) / 2))}</td>
                <td style={{ padding: '12px', color: 'var(--color-accent-primary)' }}>{p.aps || p.aiScore}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    backgroundColor: quadrant === 'Hot' ? 'rgba(16, 185, 129, 0.1)' : 
                                     quadrant === 'Nurture' ? 'rgba(245, 158, 11, 0.1)' : 
                                     quadrant === 'Opportunistic' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: quadrant === 'Hot' ? 'var(--color-success)' : 
                           quadrant === 'Nurture' ? 'var(--color-warning)' : 
                           quadrant === 'Opportunistic' ? 'var(--color-accent-neon)' : 'var(--color-danger)',
                  }}>
                    {quadrant}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={(e) => { e.stopPropagation(); setSelectedProspect(p); }}
                  >
                    Open Drawer
                  </button>
                </td>
              </tr>
              );
            })}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  No prospects match your exact filter criteria.<br/>
                  <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={() => clearFilter('all')}>Clear Filters</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ProspectDrawer prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />
      </div>
      
      <style>{`
        .filter-select {
          padding: 8px 12px;
          border-radius: 6px;
          background: rgba(0,0,0,0.3);
          color: var(--color-text-primary);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s;
        }
        .filter-select:hover {
          border-color: rgba(255,255,255,0.3);
        }
        .filter-select:focus {
          border-color: var(--color-accent-primary);
          box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.2);
        }
        .filter-tag {
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--color-accent-primary);
          color: var(--color-accent-primary);
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
        }
        .filter-tag:hover {
          background: rgba(0, 229, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

export default ProspectList;
