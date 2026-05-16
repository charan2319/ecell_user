import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../CartContext';
import { ArrowLeft, ShoppingCart, Truck, MapPin, Plus, CheckCircle2, ChevronDown, ChevronUp, Trash2, Pencil } from 'lucide-react';
import axios from 'axios';
import { CustomCartIcon } from '../components/Icons';
import { API_BASE } from '../config';
import checkmarkImage from '../assets/checkmark.png';
import coinImg from '../assets/coin.png';

function Cart() {
  const { cart, removeFromCart, clearCart, user, updateUser, savedAddresses, selectedAddressId, selectAddress, addAddress, editAddress, getSelectedAddress, userLocation, updateCartItemQty } = useContext(AppContext);
  const navigate = useNavigate();
  const [showAddressPanel, setShowAddressPanel] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [addrForm, setAddrForm] = useState({ name:'', phone:'', house:'', area:'', city:'', state:'', pincode:'', type:'Home' });

  const handleAddrChange = e => setAddrForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const startEditAddr = (addr) => {
    setEditingAddrId(addr.id);
    setAddrForm({ name: addr.name, phone: addr.phone, house: addr.house, area: addr.area, city: addr.city, state: addr.state, pincode: addr.pincode, type: addr.type || 'Home' });
    setShowAddForm(false);
  };

  const handleSaveAddr = async (e) => {
    e.preventDefault();
    const { name, phone, house, area, city, state, pincode } = addrForm;
    if (!name || !phone || !house || !area || !city || !state || !pincode) { alert('Fill all fields'); return; }
    if (editingAddrId) {
      await editAddress(editingAddrId, addrForm);
      setEditingAddrId(null);
    } else {
      await addAddress(addrForm);
    }
    setAddrForm({ name:'', phone:'', house:'', area:'', city:'', state:'', pincode:'', type:'Home' });
    setShowAddForm(false);
    setShowAddressPanel(false);
  };
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Track qty per item locally (starts from cart qty)
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    cart.forEach(item => { init[item.id] = item.qty || 1; });
    return init;
  });

  const handleQtyChange = (id, newQty) => {
    setQuantities(prev => ({ ...prev, [id]: newQty }));
    // Sync back to CartContext so qty persists across navigation
    if (updateCartItemQty) updateCartItemQty(id, newQty);
  };

  const [selectedItemIds, setSelectedItemIds] = useState(() => cart.map(item => item.id));

  const toggleAll = () => {
    if (selectedItemIds.length === cart.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cart.map(item => item.id));
    }
  };

  const toggleItem = (id) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const getQty = (id) => quantities[id] || 1;

  const total = cart
    .filter(item => selectedItemIds.includes(item.id))
    .reduce((sum, item) => sum + (item.price_vc * getQty(item.id)), 0);

  const handleCheckout = async () => {
    const itemsToCheckout = cart.filter(item => selectedItemIds.includes(item.id));
    
    if (itemsToCheckout.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    if (!user) {
      alert("Please login first to place an order.");
      navigate('/login');
      return;
    }
    if (user.points < total) {
      alert("Insufficient Vc's balance!");
      return;
    }
    const selAddr = getSelectedAddress();
    if (!selAddr) {
      alert('Please select or add a delivery address before placing the order.');
      setShowAddressPanel(true);
      return;
    }
    try {
      const deliveryLocation = JSON.stringify(selAddr);
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_BASE}/orders`, {
        user_id: user.id,
        total_vc: total,
        items: itemsToCheckout.map(i => ({ ...i, quantity: getQty(i.id) })),
        delivery_location: deliveryLocation
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      updateUser({ points: user.points - total });
      clearCart();
      setOrderConfirmed(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error placing order";
      alert(msg);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="cart-page-wrapper" style={{ padding: '0 1rem' }}>
        <div className="order-confirmed-overlay">
          <div className="checkmark-wrapper">
            <img src={checkmarkImage} alt="Order Confirmed" className="checkmark-img" />
          </div>
          
          <h1 className="confirmation-title">Your Order Is Confirmed!</h1>
          <p className="confirmation-sub">We'll Send You Shipping Confirmation Email</p>
          
          <div className="confirmation-actions">
            <button className="btn-confirm-view" onClick={() => navigate('/orders')}>
              View My Orders
            </button>
            <button className="btn-confirm-shop" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      {/* Header */}
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="cart-header-title">Shopping Cart</span>
      </div>

      {cart.length === 0 ? (
        /* ── Empty State ── */
          <div className="cart-empty-state">
            <div className="cart-empty-icon-row">
              {/* Custom Curved Premium Wind Symbols - Scaled down to make cart more prominent */}
              <svg width="110" height="120" viewBox="0 -10 140 150" fill="none" stroke="#222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Top swirling line */}
                <path d="M20 40H55C66 40 75 31 75 20C75 9 66 0 55 0C44 0 35 9 35 20" />
                {/* Middle swirling line */}
                <path d="M10 65H95C106 65 115 56 115 45C115 34 106 25 95 25C84 25 75 34 75 45" />
                {/* Bottom swirling line */}
                <path d="M25 90H95C106 90 115 99 115 110C115 121 106 130 95 130C84 130 75 121 75 110" />
              </svg>
              <CustomCartIcon size={140} color="#111" />
            </div>
          <h2 className="cart-empty-title">Your cart is empty !</h2>
          <p className="cart-empty-sub">There is nothing in your bag</p>
          <button className="cart-shop-btn" onClick={() => navigate('/')}>
            Shop now
          </button>
        </div>
      ) : (
        /* ── Cart with Items: 2-column layout ── */
        <div className="cart-filled-layout">

          {/* LEFT — Items */}
          <div className="cart-left-col">
            {/* Count bar */}
            <div className="cart-count-bar">
              <input 
                type="checkbox" 
                checked={cart.length > 0 && selectedItemIds.length === cart.length} 
                onChange={toggleAll}
                style={{ width: 16, height: 16 }} 
              />
              <span>{selectedItemIds.length}/{cart.length} ITEMS SELECTED</span>
            </div>

            {/* Item cards */}
            {cart.map(item => (
              <div key={item.id} className="cart-item-card">
                {/* Checkbox */}
                <input 
                  type="checkbox" 
                  checked={selectedItemIds.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="cart-item-check" 
                />

                {/* Image */}
                <div className="cart-item-img-box">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} />
                    : <ShoppingCart size={32} color="#999" />}
                </div>

                {/* Info */}
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-stock">In Stock</div>

                  {/* Qty selector */}
                  <select
                    className="cart-qty-select"
                    value={getQty(item.id)}
                    onChange={e => handleQtyChange(item.id, Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>Qty: {n}</option>
                    ))}
                  </select>

                  {/* Delivery */}
                  <div className="cart-item-delivery">
                    <Truck size={13} /> Delivery In 7 Days
                  </div>

                  {/* Price */}
                  <div className="cart-item-price-row">
                    <span className="cart-item-price"><img src={coinImg} alt="VC" className="coin-icon" /> {Number(item.price_vc * getQty(item.id)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Remove X */}
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>

          {/* RIGHT — Delivery Address + Price Summary */}
          <div className="cart-right-col">

            {/* ── Delivery Address Panel ── */}
            <div className="cart-addr-panel">
              <div className="cart-addr-header" onClick={() => setShowAddressPanel(p => !p)}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <MapPin size={16} color="#FFC700" />
                  <span className="cart-addr-header-title">Deliver To</span>
                </div>
                {showAddressPanel ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
              </div>

              {(() => {
                const sel = getSelectedAddress();
                return sel ? (
                  <div className="cart-addr-selected">
                    <span className="cart-addr-type-tag">{sel.type}</span>
                    <span className="cart-addr-name">{sel.name}</span>
                    <span className="cart-addr-detail">{sel.house}, {sel.area}, {sel.city}, {sel.state} - {sel.pincode}</span>
                    <span className="cart-addr-phone">{sel.phone}</span>
                  </div>
                ) : (
                  <div className="cart-addr-empty" onClick={() => setShowAddressPanel(true)}>
                    <Plus size={14}/> Add delivery address
                  </div>
                );
              })()}

              {showAddressPanel && (
                <div className="cart-addr-dropdown">
                  {savedAddresses.map(addr => (
                    editingAddrId === addr.id ? (
                      <form key={addr.id} className="cart-addr-form" onSubmit={handleSaveAddr}>
                        <div style={{fontWeight:800, fontSize:'0.82rem', color:'#000', marginBottom:4}}>Edit Address</div>
                        <div className="addr-form-row"><input name="name" placeholder="Full Name *" value={addrForm.name} onChange={handleAddrChange}/><input name="phone" placeholder="Phone *" value={addrForm.phone} onChange={handleAddrChange}/></div>
                        <input name="house" placeholder="House / Flat No. *" value={addrForm.house} onChange={handleAddrChange}/>
                        <input name="area" placeholder="Street / Area *" value={addrForm.area} onChange={handleAddrChange}/>
                        <div className="addr-form-row"><input name="city" placeholder="City *" value={addrForm.city} onChange={handleAddrChange}/><input name="state" placeholder="State *" value={addrForm.state} onChange={handleAddrChange}/></div>
                        <div className="addr-form-row">
                          <input name="pincode" placeholder="Pincode *" value={addrForm.pincode} onChange={handleAddrChange}/>
                          <select name="type" value={addrForm.type} onChange={handleAddrChange}><option>Home</option><option>Work</option><option>Other</option></select>
                        </div>
                        <div className="addr-form-actions">
                          <button type="button" className="addr-cancel-btn" onClick={() => { setEditingAddrId(null); setAddrForm({ name:'', phone:'', house:'', area:'', city:'', state:'', pincode:'', type:'Home' }); }}>Cancel</button>
                          <button type="submit" className="addr-save-btn">Update</button>
                        </div>
                      </form>
                    ) : (
                      <div
                        key={addr.id}
                        className={`cart-addr-option ${selectedAddressId === addr.id ? 'selected' : ''}`}
                        onClick={() => { selectAddress(addr.id); setShowAddressPanel(false); }}
                      >
                        <div style={{display:'flex', alignItems:'center', gap:6, flex:1}}>
                          {selectedAddressId === addr.id && <CheckCircle2 size={14} color="#FFC700"/>}
                          <div>
                            <div className="cart-addr-opt-name"><span className="cart-addr-type-tag">{addr.type}</span> {addr.name} &middot; {addr.phone}</div>
                            <div className="cart-addr-opt-detail">{addr.house}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}</div>
                          </div>
                        </div>
                        <button className="addr-edit-btn" onClick={(e) => { e.stopPropagation(); startEditAddr(addr); }}>
                          <Pencil size={13}/>
                        </button>
                      </div>
                    )
                  ))}
                  {!showAddForm && !editingAddrId ? (
                    <button className="cart-addr-add-btn" onClick={() => setShowAddForm(true)}><Plus size={14}/> Add New Address</button>
                  ) : showAddForm ? (
                    <form className="cart-addr-form" onSubmit={handleSaveAddr}>
                      <div className="addr-form-row"><input name="name" placeholder="Full Name *" value={addrForm.name} onChange={handleAddrChange}/><input name="phone" placeholder="Phone *" value={addrForm.phone} onChange={handleAddrChange}/></div>
                      <input name="house" placeholder="House / Flat No. *" value={addrForm.house} onChange={handleAddrChange}/>
                      <input name="area" placeholder="Street / Area *" value={addrForm.area} onChange={handleAddrChange}/>
                      <div className="addr-form-row"><input name="city" placeholder="City *" value={addrForm.city} onChange={handleAddrChange}/><input name="state" placeholder="State *" value={addrForm.state} onChange={handleAddrChange}/></div>
                      <div className="addr-form-row">
                        <input name="pincode" placeholder="Pincode *" value={addrForm.pincode} onChange={handleAddrChange}/>
                        <select name="type" value={addrForm.type} onChange={handleAddrChange}><option>Home</option><option>Work</option><option>Other</option></select>
                      </div>
                      <div className="addr-form-actions">
                        <button type="button" className="addr-cancel-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
                        <button type="submit" className="addr-save-btn">Save</button>
                      </div>
                    </form>
                  ) : null}
                </div>
              )}
            </div>

            <div className="cart-price-panel">
              <h3 className="cart-price-panel-title">Price Details</h3>
              <div className="cart-price-row">
                <span className="cart-price-label">MRP</span>
                <span className="cart-price-value"><img src={coinImg} alt="VC" className="coin-icon" /> {Number(total).toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-price-row">
                <span className="cart-price-label">Discount</span>
                <span className="cart-discount-val">— <img src={coinImg} alt="VC" className="coin-icon" /></span>
              </div>
              <div className="cart-price-divider" />
              <div className="cart-price-row cart-total-row">
                <span className="cart-price-label">Total Amount</span>
                <span className="cart-price-value"><img src={coinImg} alt="VC" className="coin-icon" /> {Number(total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="cart-secure-note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
              <span>Safe And Secure</span>
            </div>

            {/* Place Order */}
            <div className="cart-place-order-bar">
              <span className="cart-place-order-total"><img src={coinImg} alt="VC" className="coin-icon" /> {Number(total).toLocaleString('en-IN')}</span>
              <button className="cart-place-order-btn" onClick={handleCheckout}>
                Place Order
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;
