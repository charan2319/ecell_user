import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../CartContext';
import { ChevronLeft, Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { API_BASE } from '../config';
import coinImg from '../assets/coin.png';

function OrderHistory() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const parseLocation = (locStr) => {
    try {
      const parsed = JSON.parse(locStr);
      return parsed.full || `${parsed.name} ${parsed.pincode}`.trim();
    } catch {
      return locStr || 'Not Specified';
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders/user/${user.id}`);
      // Sort orders by latest first
      const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sortedOrders);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [user]);

  const fetchOrderDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/orders/${id}`);
      setSelectedOrder(res.data);
    } catch {
      alert('Failed to load order details');
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders(); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [user, fetchOrders]);

  if (!user) return <div className="section-container" style={{padding: '4rem 0'}}>Please login to view order history.</div>;

  return (
    <div className="section-container" style={{ padding: '2rem 1rem', minHeight: '70vh' }}>
      <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', marginBottom: '2rem' }}>
        <ChevronLeft size={20} /> Back to Profile
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
          <Package size={32} color="#000" />
        </div>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>My Order History</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '4rem' }}>
          <Package size={64} color="#ccc" style={{ marginBottom: '1.5rem' }} />
          <h3>No orders yet.</h3>
          <p style={{ color: '#666' }}>When you purchase items, they will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '5rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#fff', padding: '2rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Order #{order.id}</span>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700,
                    background: order.status === 'Delivered' ? '#F0FDF4' : '#FFF7ED',
                    color: order.status === 'Delivered' ? '#10B981' : '#F97316'
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={16} /> {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div>•</div>
                  <div>Total Spent: <strong><img src={coinImg} alt="VC" className="coin-icon" /> {Number(order.total_vc).toLocaleString('en-IN')}</strong></div>
                </div>
                {order.delivery_location && (
                  <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                    Delivering to: {parseLocation(order.delivery_location)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button 
                  onClick={() => fetchOrderDetails(order.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem' }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', borderRadius: '32px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Order Details #{selectedOrder.id}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {selectedOrder.delivery_location && (
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.75rem' }}>Delivery Address</span>
                <span style={{ color: '#1E293B' }}>{parseLocation(selectedOrder.delivery_location)}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', padding: '1.25rem', background: '#f9fafb', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <img src={item.image_url} alt="" style={{ width: '70px', height: '70px', borderRadius: '15px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 850, fontSize: '1.25rem', marginBottom: '4px', color: '#000' }}>{item.name}</div>
                    <div style={{ color: '#666', fontSize: '1rem', fontWeight: 500 }}>{item.price_vc} <img src={coinImg} alt="VC" className="coin-icon" /> × {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>{item.price_vc * item.quantity} <img src={coinImg} alt="VC" className="coin-icon" /></div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#666', fontWeight: 700 }}>Total Order Value</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{selectedOrder.total_vc} <img src={coinImg} alt="VC" className="coin-icon" /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
