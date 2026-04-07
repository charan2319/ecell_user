import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../CartContext';
import { API_BASE } from '../config';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your magic link...');
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please request a new magic link.');
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/auth/verify-magic-link?token=${token}`);
        if (res.data.token && res.data.user) {
          // Log in the user
          login(res.data.user);
          localStorage.setItem('token', res.data.token);
          setStatus('success');
          setMessage('Login successful! Redirecting to home...');
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verifyToken();
  }, [searchParams, login, navigate]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
      <div style={{ 
        background: '#fff', 
        padding: '3rem', 
        borderRadius: '24px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)', 
        textAlign: 'center',
        maxWidth: '450px',
        width: '90%'
      }}>
        {status === 'verifying' && (
          <div className="verifying-icon" style={{ marginBottom: '1.5rem' }}>
            <div style={{ width: '50px', height: '50px', border: '4px solid #FFC700', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        
        {status === 'success' && (
          <div style={{ color: '#10B981', fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
        )}

        {status === 'error' && (
          <div style={{ color: '#EF4444', fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
        )}

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          {status === 'verifying' ? 'Please Wait' : status === 'success' ? 'Authenticated!' : 'Verification Failed'}
        </h2>
        
        <p style={{ color: '#666', lineHeight: 1.6 }}>{message}</p>
        
        {status === 'error' && (
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              marginTop: '2rem', 
              background: '#000', 
              color: '#FFC700', 
              border: 'none', 
              padding: '0.8rem 2rem', 
              borderRadius: '12px', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
          >
            Back to Login
          </button>
        )}
      </div>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default VerifyEmail;
