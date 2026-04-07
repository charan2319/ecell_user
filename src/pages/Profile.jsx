import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>My Profile</h1>
      
      <div style={{ background: '#F9FAFB', padding: '2rem', borderRadius: '16px', border: '1px solid #EDF2F7', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>{user.name}</h2>
            <p style={{ color: '#666', margin: 0 }}>{user.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{user.points} Vc's</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={() => navigate('/orders')} 
          style={{ padding: '1.2rem', background: 'var(--primary)', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
        >
          Order History
        </button>
        <button 
          onClick={() => navigate('/vc-history')} 
          style={{ padding: '1.2rem', background: '#F3F4F6', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}
        >
          Vc's History
        </button>
      </div>
      
      <button 
        onClick={() => { logout(); navigate('/'); }} 
        style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
      >
        Logout Account
      </button>
    </div>
  );
}

export default Profile;
