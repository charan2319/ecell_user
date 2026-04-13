import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../CartContext';
import axios from 'axios';
import { API_BASE } from '../config';

function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [email, setEmail] = useState('');
  const [otpArray, setOtpArray] = useState(['', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtpArray([...otpArray.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otpArray[index] === '' && e.target.previousSibling) {
        e.target.previousSibling.focus();
      } else {
        const newOtp = [...otpArray];
        newOtp[index] = '';
        setOtpArray(newOtp);
      }
    }
  };


  const handleSendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!email) return setError('Please enter your email.');
    
    // Client-side domain check
    const domain = email.toLowerCase().split('@')[1];
    const allowedDomains = ['alliance.edu.in', 'ced.alliance.edu.in'];
    if (!allowedDomains.includes(domain)) {
      setError('Please use your Alliance University email (@alliance.edu.in or @ced.alliance.edu.in)');
      return;
    }
    setLoading(true);
    setError('');
    setOtpArray(['', '', '', '']);
    try {
      const res = await axios.post(`${API_BASE}/auth/send-otp`, { email });
      setOtpToken(res.data.otpToken);
      setShowOtpField(true);
      if (res.data.message && res.data.message.includes('Failed')) {
        setError(res.data.message); // Show the warning message safely
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otpArray.join('');
    if (otpValue.length < 4) return setError('Please enter the full 4-digit OTP.');
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { otp: otpValue, otpToken });
      if (res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        login(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB' }}>
      <div className="auth-card" style={{ 
        background: '#fff', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.08)', 
        borderRadius: 32, 
        padding: '3rem', 
        textAlign: 'left',
        maxWidth: '480px',
        width: '90%'
      }}>
        {!showOtpField ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ background: '#FFC700', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', transform: 'rotate(-10deg)' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#000' }}>A</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.5rem' }}>Welcome!</h2>
              <p style={{ color: '#6B7280', fontSize: '1rem', fontWeight: 500 }}>Student Login</p>
            </div>


            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>College Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex. you@alliance.edu.in"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#000'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.1s',
                }}
              >
                {loading ? 'Processing...' : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: '2rem' }}>
               <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#000', marginBottom: '0.2rem' }}>Verify With OTP</h2>
               <p style={{ color: '#9CA3AF', fontSize: '1rem', fontWeight: 500 }}>Sent to the email</p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {otpArray.map((data, index) => {
                  return (
                    <input
                      className="otp-input"
                      type="text"
                      name="otp"
                      maxLength="1"
                      key={index}
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onKeyDown={e => handleOtpKeyDown(e, index)}
                      onFocus={e => e.target.select()}
                      style={{
                        width: '3.5rem',
                        height: '4rem',
                        fontSize: '1.8rem',
                        textAlign: 'center',
                        fontWeight: 700,
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        outline: 'none',
                        color: '#000',
                        boxSizing: 'border-box'
                      }}
                      onFocusCapture={(e) => {
                         e.target.style.borderColor = '#000';
                         e.target.select();
                      }}
                      onBlurCapture={(e) => e.target.style.borderColor = '#D1D5DB'}
                    />
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <button 
                   type="button"
                   onClick={(e) => { e.preventDefault(); handleSendOtp(); }}
                   style={{
                     background: 'none',
                     border: 'none',
                     color: '#000',
                     fontSize: '0.95rem',
                     fontWeight: 600,
                     cursor: 'pointer',
                     padding: 0
                   }}
                 >
                   Resend OTP
                 </button>
                 
                 <button 
                   type="button"
                   onClick={() => { setShowOtpField(false); setError(''); setOtpArray(['','','','']); }}
                   style={{
                     background: 'none',
                     border: 'none',
                     color: '#6B7280',
                     fontSize: '0.85rem',
                     fontWeight: 500,
                     cursor: 'pointer',
                     textDecoration: 'underline'
                   }}
                 >
                   Change Email
                 </button>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.1s',
                }}
              >
                {loading ? 'Processing...' : 'Verify'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div style={{ 
            background: '#FEF2F2', 
            color: '#DC2626', 
            padding: '1rem', 
            borderRadius: '12px', 
            fontSize: '0.85rem', 
            fontWeight: 700,
            marginTop: '1.5rem',
            border: '1px solid #FEE2E2'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '2rem', borderTop: '1px solid #F3F4F6', paddingTop: '1.5rem' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 500 }}>
            By signing in, you agree to the E-Cell Alliance University terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
