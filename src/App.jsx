import React, { useState, useEffect } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import ProspectList from './components/ProspectList';
import LookAlikeRadar from './components/LookAlikeRadar';
import Auth from './components/Auth';
import Analytics from './components/Analytics';
import Pipeline from './components/Pipeline';
import Cohorts from './components/Cohorts';
import DataSources from './components/DataSources';
import Settings from './components/Settings';
import About from './components/About';
import CommandPalette from './components/CommandPalette';
import NetworkMap from './components/NetworkMap';
import AcceptInvite from './components/AcceptInvite';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/invite" element={<AcceptInvite onLogin={setUser} />} />
          <Route path="*" element={<Auth onLogin={setUser} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/accelera-logo.png" alt="Accelera Consulting" style={{ width: '100%', maxWidth: '220px' }} />
        </div>
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </div>
          <div 
            className={`nav-item ${activeTab === 'prospects' ? 'active' : ''}`}
            onClick={() => setActiveTab('prospects')}
          >
            Prospect List
          </div>
          <div 
            className={`nav-item ${activeTab === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            Persona Engine
          </div>
          <div 
            className={`nav-item ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            Pipeline
          </div>
          <div 
            className={`nav-item ${activeTab === 'network' ? 'active' : ''}`}
            onClick={() => setActiveTab('network')}
          >
            Global Network Map
          </div>
          <div 
            className={`nav-item ${activeTab === 'cohorts' ? 'active' : ''}`}
            onClick={() => setActiveTab('cohorts')}
          >
            Cohorts & NLQ
          </div>
          <div 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics & Conversion
          </div>
          <div 
            className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data & Workspaces
          </div>
        </nav>
        <div style={{ marginTop: 'auto', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
          {user.email} <button className="btn btn-secondary" style={{ padding: '2px 6px', fontSize: '0.7rem', marginLeft: '5px' }} onClick={() => setUser(null)}>Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-title" style={{fontWeight: 600}}>
            {activeTab === 'dashboard' && 'Intelligence Dashboard'}
            {activeTab === 'prospects' && 'Prospects Directory'}
            {activeTab === 'radar' && 'Persona & Behavioral Engine'}
            {activeTab === 'pipeline' && 'Outreach Pipeline'}
            {activeTab === 'network' && 'Global Network Topology'}
            {activeTab === 'cohorts' && 'Nested Cohorts'}
            {activeTab === 'analytics' && 'Analytics & Conversion'}
            {activeTab === 'data' && 'Data Ingestion & Workspaces'}
            {activeTab === 'settings' && 'Admin Panel & Documentation'}
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => setActiveTab('settings')}>Settings</button>
          </div>
        </header>
        
        <div className="page-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'prospects' && <ProspectList />}
          {activeTab === 'radar' && <LookAlikeRadar />}
          {activeTab === 'pipeline' && <Pipeline />}
          {activeTab === 'network' && <NetworkMap />}
          {activeTab === 'cohorts' && <Cohorts />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'data' && <DataSources />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* Global Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
        navigateTo={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}

export default App;
