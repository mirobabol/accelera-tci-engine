import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function AcceptInvite({ onLogin }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('No invite token provided.');
        setLoading(false);
        return;
      }

      try {
        const inviteRef = doc(db, 'invites', token);
        const inviteSnap = await getDoc(inviteRef);

        if (inviteSnap.exists()) {
          setInviteData(inviteSnap.data());
        } else {
          setError('Invalid or expired invite link.');
        }
      } catch (err) {
        setError('Error verifying invite: ' + err.message);
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, inviteData.email, password);
      
      // 2. Save their role into the users collection
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: inviteData.email,
        role: inviteData.role,
        status: 'Active',
        createdAt: new Date().toISOString()
      });

      // 3. Delete the invite token so it can't be reused
      await deleteDoc(doc(db, 'invites', token));

      // 4. Log them in and redirect
      onLogin(userCredential.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg-primary)', color: '#fff' }}>
        Verifying invite...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg-primary)' }}>
      <div className="card" style={{ width: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/accelera-logo.png" alt="Accelera Consulting" style={{ width: '100%', maxWidth: '280px', marginBottom: '35px', filter: 'brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.2))' }} />
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '10px', textAlign: 'center', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase' }}>TCI Intelligence</h2>
        
        {error ? (
          <div style={{ color: 'var(--color-danger)', marginBottom: '15px', textAlign: 'center', padding: '15px', background: 'rgba(255,51,102,0.1)', borderRadius: '8px' }}>
            {error}
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '10px', textAlign: 'center' }}>
              You have been invited to join as <strong style={{ color: 'var(--color-accent-primary)' }}>{inviteData.role}</strong>
            </p>
            <p style={{ color: '#fff', marginBottom: '30px', fontWeight: 'bold' }}>{inviteData.email}</p>
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              <input 
                type="password" 
                placeholder="Choose a secure password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--color-bg-tertiary)', background: 'var(--color-bg-primary)', color: 'white' }}
                required
              />
              <button type="submit" className="btn" style={{ marginTop: '10px' }}>Accept Invite & Register</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AcceptInvite;
