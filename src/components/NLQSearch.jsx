import React, { useState } from 'react';

function NLQSearch({ onSearchComplete }) {
  const [query, setQuery] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedFilter, setParsedFilter] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleAnalyze = () => {
    if (!query) return;
    setParsing(true);
    setParsedFilter(null);

    // Simulate an AI call that parses natural language into a Firmographic/SectorFilter
    setTimeout(() => {
      // Dynamic extraction for simulation
      const hasAutomotive = query.toLowerCase().includes('auto');
      const hasCeo = query.toLowerCase().includes('ceo');
      
      setParsedFilter({
        firmographic: { turnoverMin: 10, turnoverMax: 500 },
        sector: { sectorTag: hasAutomotive ? 'automotive' : 'technology', includeNaceMismatch: true },
        personAttributes: { interests: hasCeo ? ['leadership', 'c-suite transitions'] : ['golf', 'tennis'] },
        confidence: 0.94
      });
      setParsing(false);
    }, 1500);
  };

  const handleRunSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setParsedFilter(null);
      setQuery('');
      if (onSearchComplete) {
        onSearchComplete({
          name: query.substring(0, 25) + '...',
          rankBy: 'aiScore',
          sourceQuery: query,
          count: Math.floor(Math.random() * 15) + 3
        });
      }
    }, 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'automotive sector companies with a new ceo...'" 
          style={{ flexGrow: 1, fontSize: '1rem', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-bg-tertiary)', color: '#fff', borderRadius: '4px' }}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
        />
        <button className="btn" onClick={handleAnalyze} disabled={parsing || !query || isSearching}>
          {parsing ? 'Parsing...' : 'Analyze Query'}
        </button>
      </div>

      {parsedFilter && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '8px', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ color: 'var(--color-accent-primary)', fontWeight: '600', marginBottom: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
            Parsed Filter Definition (Confidence: {parsedFilter.confidence * 100}%)
          </div>
          <pre style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.85rem', overflowX: 'auto' }}>
            {JSON.stringify(parsedFilter, null, 2)}
          </pre>
          {parsedFilter.personAttributes && (
            <div style={{ marginTop: '10px', color: 'var(--color-warning)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
              ⚠️ Requires Compliance Review (contains demographic/interest attributes)
            </div>
          )}
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button className="btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={handleRunSearch} disabled={isSearching}>
              {isSearching ? '⚙️ Executing Vector Search...' : 'Run Search'}
            </button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} disabled={isSearching}>Edit Filter</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NLQSearch;
