import React, { useState, useEffect } from 'react';
import About from './About';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

function Settings() {
  const [activeTab, setActiveTab] = useState('system');
  const [dbStats, setDbStats] = useState({ count: '...', lastSync: '...' });
  const [users, setUsers] = useState([]);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Read Only');
  const [inviteLink, setInviteLink] = useState(null);

  useEffect(() => {
    if (activeTab === 'system') {
      getDocs(collection(db, 'prospects')).then(snap => {
        setDbStats({ count: snap.size, lastSync: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
      }).catch(e => console.error(e));
    }
    
    if (activeTab === 'users') {
      getDocs(collection(db, 'users')).then(snap => {
        const liveUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(liveUsers.length > 0 ? liveUsers : [{ email: 'admin@acceleraconsulting.com', role: 'System Admin', status: 'Active' }]);
      }).catch(e => console.error(e));
    }
  }, [activeTab]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'invites'), {
        email: inviteEmail,
        role: inviteRole,
        createdAt: new Date().toISOString()
      });
      setInviteLink(window.location.origin + '/invite?token=' + docRef.id);
    } catch (err) {
      alert("Error creating invite: " + err.message);
    }
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="header-title" style={{ margin: 0 }}>Admin Panel & Settings</h1>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeTab === 'system' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('system')}
        >
          System Configuration
        </button>
        <button 
          className={`btn ${activeTab === 'users' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`btn ${activeTab === 'docs' ? '' : 'btn-secondary'}`}
          onClick={() => setActiveTab('docs')}
        >
          Documentation & Manual
        </button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {activeTab === 'system' && (
          <div style={{ display: 'flex', gap: '20px' }}>
            <div className="card" style={{ flex: 1, maxWidth: '600px' }}>
              <h3 className="card-title">System Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Default Compliance Review Policy</label>
                  <select style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }}>
                    <option>Strict (Require review for all soft traits)</option>
                    <option>Standard (Require review for demographics only)</option>
                    <option>Lenient</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Automated Background Scrape Rate</label>
                  <select style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }}>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Manual Only</option>
                  </select>
                </div>

                <button className="btn" style={{ marginTop: '10px' }}>Save System Settings</button>
              </div>
            </div>

            <div className="card" style={{ flex: 1, maxWidth: '400px', background: 'radial-gradient(circle at center, rgba(0,229,255,0.08) 0%, rgba(1,5,11,0.9) 70%)' }}>
              <h3 className="card-title" style={{ color: 'var(--color-accent-primary)' }}>Database Telemetry</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Active Records</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00E5FF', textShadow: '0 0 15px rgba(0,229,255,0.5)' }}>{dbStats.count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Data Load</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B5CF6', textShadow: '0 0 15px rgba(139,92,246,0.5)' }}>{dbStats.lastSync}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Data Types Active</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-success)', textShadow: '0 0 10px rgba(57,255,20,0.3)' }}>100% AI Scraped</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <h3 className="card-title">User Management</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: '10px' }}>User Email</th>
                  <th style={{ padding: '10px' }}>Role</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '10px' }}>{u.email}</td>
                    <td style={{ padding: '10px', color: u.role === 'System Admin' ? 'var(--color-accent-primary)' : 'inherit' }}>{u.role}</td>
                    <td style={{ padding: '10px', color: 'var(--color-success)' }}>{u.status}</td>
                    <td style={{ padding: '10px' }}>
                      <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', marginRight: '5px' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn" style={{ marginTop: '20px' }} onClick={() => setShowInviteModal(true)}>+ Invite User</button>
            
            {showInviteModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                <div className="card" style={{ width: '500px', background: '#0a101d' }}>
                  <h3 className="card-title">Invite New User</h3>
                  {inviteLink ? (
                    <div>
                      <p style={{ color: 'var(--color-success)', marginBottom: '15px' }}>Invite generated successfully!</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Copy this magic link and send it to the user so they can securely register their account:</p>
                      <div style={{ background: '#000', padding: '15px', borderRadius: '4px', wordBreak: 'break-all', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.3)', marginBottom: '20px', fontFamily: 'monospace' }}>
                        {inviteLink}
                      </div>
                      <button className="btn" onClick={() => { setShowInviteModal(false); setInviteLink(null); }}>Done</button>
                    </div>
                  ) : (
                    <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>User Email Address</label>
                        <input type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem' }}>Assign Role</label>
                        <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}>
                          <option>Read Only</option>
                          <option>BD Editor</option>
                          <option>System Admin</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="btn">Generate Invite Link</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <About />
        )}
      </div>
    </div>
  );
}

export default Settings;
