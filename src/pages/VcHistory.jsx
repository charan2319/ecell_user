import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../CartContext';
import { Clock, ArrowUpRight, ArrowDownLeft, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config';
import coinImg from '../assets/coin.png';

function VcHistory() {
  const { user, refreshUser } = useContext(AppContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/points-history/${user.id}`);
      setHistory(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshUser();
      fetchHistory(); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [user, refreshUser, fetchHistory]);

  if (!user) return <div className="section-container" style={{padding: '4rem 0'}}>Please login to view history.</div>;

  return (
    <div className="section-container" style={{ padding: '2rem 1rem', minHeight: '70vh' }}>
      <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> Back to Profile
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ background: '#000', padding: '12px', borderRadius: '12px' }}>
          <Clock size={32} color="#fff" />
        </div>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}><img src={coinImg} alt="VC" className="coin-icon" /> History</h1>
      </div>

      <p style={{ color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>Track all your point earnings and deductions here.</p>

      {loading ? (
        <p>Loading history...</p>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <p style={{ opacity: 0.5 }}>No transactions found yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item, idx) => {
            const isAdded = item.type === 'added';
            return (
              <div key={idx} style={{ 
                background: '#fff', 
                padding: '1.5rem', 
                borderRadius: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '15px', 
                    background: isAdded ? '#F0FDF4' : '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isAdded ? <ArrowUpRight color="#10B981" /> : <ArrowDownLeft color="#EF4444" />}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{item.reason}</h3>
                    <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 850, 
                    color: isAdded ? '#10B981' : '#EF4444' 
                  }}>
                    {isAdded ? '+' : '-'}{item.amount} <img src={coinImg} alt="VC" className="coin-icon" />
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>Ref: #{item.id}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VcHistory;
