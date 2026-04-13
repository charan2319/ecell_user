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
  }, [user, navigate]);

  // Refresh user data once on mount
  useEffect(() => {
    if (user) {
      refreshUser();
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  return (
    <div className="profile-page-v3" style={{ minHeight: '100vh', background: '#fff', color: '#000' }}>
      {/* ── 1. CLEAN TOP BAR ── */}
      <div className="section-container profile-topbar">
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
      <div className="section-container profile-identity">
        <div className="profile-identity-inner">
          <div className="profile-avatar">
            <User size={48} color="#000" />
          </div>
          <div className="profile-user-info">
            <h1 className="profile-user-name">{user.name}</h1>
            <p className="profile-user-email">{user.email}</p>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN DASHBOARD GRID ── */}
      <div className="section-container profile-dashboard">
        <div className="profile-dashboard-grid">
          
          {/* BALANCE CARD */}
          <div className="profile-balance-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666', marginBottom: '1.5rem' }}>
                <Wallet size={24} />
                <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Available Balance</span>
              </div>
              <div className="profile-balance-amount">
                {user.points} <span className="profile-balance-unit">VC'S</span>
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
              className="profile-action-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="profile-action-icon">
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
              className="profile-action-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="profile-action-icon">
                  <Clock size={28} color="#000" />
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: 850 }}>VC's History</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.95rem', fontWeight: 500 }}>Points earned and points spent history</p>
                </div>
              </div>
              <ChevronRight size={24} color="#000" />
            </div>

            {/* LOGOUT BUTTON */}
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
        <div className="profile-logout-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="profile-logout-modal" onClick={e => e.stopPropagation()}>
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
