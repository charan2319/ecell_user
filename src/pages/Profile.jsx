import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, LogOut, User, Wallet, ChevronRight } from 'lucide-react';

function Profile() {
   const { user, logout, refreshUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (user) {
      refreshUser();
    }
    window.scrollTo(0, 0);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="profile-page-v3" style={{ minHeight: '100vh', background: '#fff', color: '#000' }}>
      {/* ── 1. CLEAN TOP BAR ── */}
      <div className="section-container" style={{ padding: '2rem 2rem 0' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontWeight: 600, padding: '0', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#000'}
          onMouseLeave={e => e.currentTarget.style.color = '#666'}
        >
          <ArrowLeft size={20} /> Back to Shop
        </button>
      </div>

      {/* ── 2. IDENTITY SECTION ── */}
      <div className="section-container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '24px', background: '#FFC700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={48} color="#000" />
          </div>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 0.5rem 0', letterSpacing: '-1px' }}>{user.name}</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', margin: 0, fontWeight: 500 }}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN DASHBOARD GRID ── */}
      <div className="section-container" style={{ padding: '0 2rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          
          {/* BALANCE CARD - CLEAN PREMIUM LOOK */}
          <div style={{ background: '#fff', borderRadius: '32px', padding: '3rem', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '280px', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', border: '1px solid #eee' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', marginBottom: '1.5rem' }}>
                <Wallet size={24} />
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Available Balance</span>
              </div>
              <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
                {user.points} <span style={{ fontSize: '1.5rem', color: '#FFC700', fontWeight: 600 }}>VC'S</span>
              </div>
            </div>
            <div style={{ fontSize: '1rem', color: '#999', fontWeight: 500 }}>
              Founder's Mart Royal Rewards Program
            </div>
          </div>

          {/* ACTIONS COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div 
              onClick={() => navigate('/orders')}
              style={{ background: '#F8F9FA', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#FFC700'; e.currentTarget.style.transform = 'translateX(10px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F8F9FA'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: '#FFC700', padding: '15px', borderRadius: '16px' }}>
                  <Package size={28} color="#000" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 850 }}>Order History</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', fontWeight: 500 }}>View and track your previous orders</p>
                </div>
              </div>
              <ChevronRight size={24} color="#000" />
            </div>

            <div 
              onClick={() => navigate('/vc-history')}
              style={{ background: '#F8F9FA', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#FFC700'; e.currentTarget.style.transform = 'translateX(10px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F8F9FA'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ background: '#FFC700', padding: '15px', borderRadius: '16px' }}>
                  <Clock size={28} color="#000" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 850 }}>VC's History</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', fontWeight: 500 }}>Points earned and points spent history</p>
                </div>
              </div>
              <ChevronRight size={24} color="#000" />
            </div>

            {/* LOGOUT BUTTON - INTEGRATED */}
            <div 
              onClick={() => setShowLogoutConfirm(true)}
              style={{ background: '#FFF5F5', borderRadius: '24px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', marginTop: 'auto' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFF5F5'}
            >
              <LogOut size={20} color="#EF4444" />
              <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1rem' }}>Logout Profile</span>
            </div>

          </div>
        </div>
      </div>
      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setShowLogoutConfirm(false)}>
          <div style={{ background: '#fff', borderRadius: '40px', padding: '4rem 3rem 3.5rem', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '80px', height: '80px', borderRadius: '28px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
              <LogOut size={36} color="#EF4444" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Leaving so soon?</h2>
            <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6, marginBottom: '3rem', fontWeight: 500 }}>Are you sure you want to log out of your profile? You'll need to sign back in to access your EC-VC balance.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => { logout(); navigate('/'); }} 
                style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', background: '#000', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Yes, log me out
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', background: 'none', color: '#666', border: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
