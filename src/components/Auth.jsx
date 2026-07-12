import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === "your_firebase_api_key_here") {
      onLogin({ email: email || 'demo@accelera.consulting' });
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    setRecoverySent(true);
    setTimeout(() => {
      setIsRecovering(false);
      setRecoverySent(false);
    }, 3000);
  };

  if (isRecovering) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg-primary)' }}>
        <div className="card" style={{ width: '400px', textAlign: 'center', padding: '40px 30px' }}>
          <img src="/accelera-logo.png" alt="Accelera Logo" style={{ width: '220px', marginBottom: '30px' }} />
          <h2 style={{ marginBottom: '20px', color: 'var(--color-text-primary)' }}>Password Recovery</h2>
          
          {recoverySent ? (
            <div style={{ color: 'var(--color-success)', padding: '15px', background: 'rgba(0,255,153,0.1)', borderRadius: '8px' }}>
              Recovery instructions sent to {email || 'your email'}.
            </div>
          ) : (
            <form onSubmit={handleRecovery} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fff' }}
                required
              />
              <button type="submit" className="btn" style={{ padding: '12px', fontSize: '1rem' }}>Send Recovery Link</button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsRecovering(false)} style={{ padding: '12px', fontSize: '1rem' }}>Back to Sign In</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg-primary)' }}>
      <div className="card" style={{ width: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/accelera-logo.png" alt="Accelera Consulting" style={{ width: '100%', maxWidth: '280px', marginBottom: '35px', filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.2))' }} />
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '10px', textAlign: 'center', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase' }}>TCI Intelligence</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px', textAlign: 'center' }}>Sign in to continue</p>
        
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-bg-tertiary)', background: 'var(--color-bg-primary)', color: 'white' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-bg-tertiary)', background: 'var(--color-bg-primary)', color: 'white' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <button type="submit" className="btn">Sign In</button>
            <span 
              onClick={() => setIsRecovering(true)}
              style={{ color: 'var(--color-accent-primary)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forgot Password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
