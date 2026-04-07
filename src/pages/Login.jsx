import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../CartContext';
import axios from 'axios';
import { API_BASE } from '../config';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/auth/google`, {
        idToken: credentialResponse.credential
      });
      
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Google Authentication failed. Please use your @alliance.edu.in email.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Please try again.");
  };

  return (
    <div className="auth-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
      <div className="auth-card" style={{ 
        background: '#fff', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.08)', 
        borderRadius: 32, 
        padding: '4rem', 
        textAlign: 'center',
        maxWidth: '480px',
        width: '90%'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: '#FFC700', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', transform: 'rotate(-10deg)' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#000' }}>A</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-1px', marginBottom: '0.5rem' }}>Student Login</h2>
          <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: 500 }}>Founder's Mart by E-Cell</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          {loading ? (
            <div style={{ padding: '1rem', color: '#6B7280', fontWeight: 700 }}>Authenticating...</div>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              ux_mode="popup"
              theme="filled_black"
              shape="pill"
              text="signin_with"
              width="300"
            />
          )}
        </div>

        {error && (
          <div style={{ 
            background: '#FEF2F2', 
            color: '#DC2626', 
            padding: '1rem', 
            borderRadius: '12px', 
            fontSize: '0.85rem', 
            fontWeight: 700,
            marginBottom: '1rem',
            border: '1px solid #FEE2E2'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem', borderTop: '1px solid #F3F4F6', paddingTop: '2rem' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 500 }}>
            By signing in, you agree to the E-Cell Alliance University terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
