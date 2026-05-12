import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../CartContext';
import axios from 'axios';
import { API_BASE } from '../config';
import ecellLogo from '../assets/ecell logo.jpeg';
import rocketImg from '../assets/rocoket login.png';

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
    const allowedDomains = ['alliance.edu.in', 'ced.alliance.edu.in', 'stu.alliance.edu.in'];
    if (!allowedDomains.includes(domain)) {
      setError('Please use your Alliance University email (@alliance.edu.in, @ced.alliance.edu.in or @stu.alliance.edu.in)');
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
        localStorage.setItem('userToken', res.data.token);
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
    <div className="premium-auth-container">
      <div className="premium-auth-card">
        {!showOtpField ? (
          <>
            <div className="premium-logo-vertical">
              <img src={rocketImg} alt="Rocket" className="login-rocket-icon" />
              <div className="login-ecell-text-group">
                <div className="login-ecell-main">E-CELL</div>
                <div className="login-ecell-sub">ALLIANCE UNIVERSITY</div>
              </div>
            </div>
            
            <h2 className="premium-auth-title">Welcome!</h2>
            <p className="premium-auth-subtitle" style={{ marginBottom: '1.5rem' }}>Student Exclusive Access</p>
            <div style={{ width: '32px', height: '3px', background: '#FFC700', margin: '0 auto 2.5rem', borderRadius: '2px' }}></div>

            <form onSubmit={handleSendOtp}>
              <div className="premium-input-group">
                <label className="premium-input-label">COLLEGE EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  className="premium-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@alliance.edu.in"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="premium-btn-primary"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <div className="fade-in">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
               <h2 className="premium-auth-title" style={{ fontSize: '2rem' }}>Verify OTP</h2>
               <p className="premium-auth-subtitle" style={{ marginBottom: 0 }}>Sent to your college inbox</p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div className="premium-otp-grid">
                {otpArray.map((data, index) => (
                  <input
                    key={index}
                    className="premium-otp-input"
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onKeyDown={e => handleOtpKeyDown(e, index)}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                 <button 
                   type="button"
                   className="premium-resend-btn"
                   onClick={(e) => { e.preventDefault(); handleSendOtp(); }}
                 >
                   Resend Security Code
                 </button>
              </div>

              <button 
                type="submit" 
                className="premium-btn-primary"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Unlock Account'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button 
                  type="button"
                  onClick={() => { setShowOtpField(false); setError(''); setOtpArray(['','','','']); }}
                  style={{ background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Use a different email
                </button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="premium-error-toast">
            {error}
          </div>
        )}

        <div className="premium-footer-text">
          By continuing, you agree to the Founder's Mart <br/> <span style={{textDecoration: 'underline'}}>terms of service</span> and <span style={{textDecoration: 'underline'}}>community guidelines</span>.
        </div>
      </div>
    </div>
  );
}

export default Login;
