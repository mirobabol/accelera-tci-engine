import React, { useState } from 'react';

function NLQSearch() {
  const [query, setQuery] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedFilter, setParsedFilter] = useState(null);

  const handleSearch = () => {
    if (!query) return;
    setParsing(true);
    setParsedFilter(null);

    // Simulate an AI call that parses natural language into a Firmographic/SectorFilter
    setTimeout(() => {
      setParsedFilter({
        firmographic: { turnoverMin: 10, turnoverMax: 50 },
        sector: { sectorTag: 'automotive', includeNaceMismatch: true },
        personAttributes: { interests: ['golf', 'tennis'] },
        confidence: 0.92
      });
      setParsing(false);
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'automotive sector companies where a shareholder is a golf player...'" 
          style={{ flexGrow: 1, fontSize: '1rem' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn" onClick={handleSearch} disabled={parsing || !query}>
          {parsing ? 'Parsing...' : 'Analyze Query'}
        </button>
      </div>

      {parsedFilter && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.2)', borderRadius: '8px' }}>
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
            <button className="btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Run Search</button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Edit Filter</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NLQSearch;
