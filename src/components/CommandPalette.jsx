import React, { useState, useEffect } from 'react';

function CommandPalette({ isOpen, onClose, navigateTo }) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open logic handled by parent via state, but we can't trigger parent state directly from here if it's not open.
          // The parent should listen for Cmd+K. So this component only handles the internal state when open.
        }
      }
      
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // If not open, render nothing
  if (!isOpen) return null;

  const actions = [
    { label: 'Go to Pipeline', action: () => { navigateTo('pipeline'); onClose(); } },
    { label: 'Go to Persona Engine', action: () => { navigateTo('radar'); onClose(); } },
    { label: 'Go to Analytics', action: () => { navigateTo('analytics'); onClose(); } },
    { label: 'Go to Settings / Admin', action: () => { navigateTo('settings'); onClose(); } },
    { label: 'Open Network Map', action: () => { navigateTo('network'); onClose(); } },
    { label: 'Search All Prospects', action: () => { navigateTo('prospects'); onClose(); } },
  ];

  const filteredActions = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
      zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '15vh'
    }} onClick={onClose}>
      
      <div 
        style={{
          width: '600px', background: 'rgba(2,22,58,0.9)', borderRadius: '12px',
          border: '1px solid rgba(0,255,255,0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,255,0.1)',
          overflow: 'hidden', animation: 'fadeInDown 0.2s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <input 
            autoFocus
            type="text" 
            placeholder="Type a command or search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', background: 'transparent', border: 'none', color: '#fff', 
              fontSize: '1.2rem', outline: 'none' 
            }}
          />
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {filteredActions.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>No actions found.</div>
          ) : (
            filteredActions.map((item, idx) => (
              <div 
                key={idx}
                onClick={item.action}
                style={{
                  padding: '15px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.02)', color: 'var(--color-text-primary)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ marginRight: '15px', color: 'var(--color-accent-primary)' }}>⚡</span>
                {item.label}
              </div>
            ))
          )}
        </div>
        
        <div style={{ padding: '10px 20px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          Tip: Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>ESC</kbd> to close.
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default CommandPalette;
