import React, { useContext, useState } from 'react';
import { AppContext } from '../CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wind, Truck } from 'lucide-react';
import { CustomCartIcon } from '../components/Icons';

function Cart() {
  const { cart, removeFromCart, clearCart, user, updateUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Track qty per item locally (starts from cart qty)
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    cart.forEach(item => { init[item.id] = item.qty || 1; });
    return init;
  });

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
    try {
      const response = await axios.post('http://localhost:5001/api/orders', {
        user_id: user.id,
        total_vc: total,
        items: itemsToCheckout.map(i => ({ ...i, quantity: getQty(i.id) })),
      });
      updateUser({ points: user.points - total });
      clearCart();
      alert(response.data.message || "Order placed successfully!");
      navigate('/profile');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error placing order";
      alert(msg);
    }
  };

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
                    onChange={e => setQuantities(prev => ({ ...prev, [item.id]: Number(e.target.value) }))}
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
                    <span className="cart-item-price">{item.price_vc * getQty(item.id)} Vc's</span>
                  </div>
                </div>

                {/* Remove X */}
                <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>

          {/* RIGHT — Price Summary */}
          <div className="cart-right-col">
            <div className="cart-price-panel">
              <h3 className="cart-price-panel-title">Price Details</h3>
              <div className="cart-price-row">
                <span className="cart-price-label">MRP</span>
                <span className="cart-price-value">{total} Vc's</span>
              </div>
              <div className="cart-price-row">
                <span className="cart-price-label">Discount</span>
                <span className="cart-discount-val">— Vc's</span>
              </div>
              <div className="cart-price-divider" />
              <div className="cart-price-row cart-total-row">
                <span className="cart-price-label">Total Amount</span>
                <span className="cart-price-value">{total} Vc's</span>
              </div>
            </div>

            <div className="cart-secure-note">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
              <span>Safe And Secure</span>
            </div>

            {/* Place Order */}
            <div className="cart-place-order-bar">
              <span className="cart-place-order-total">{total} Vc's</span>
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
