import React, { useContext, useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import VcHistory from './pages/VcHistory';
import ProductDetail from './pages/ProductDetail';
import ShopAll from './pages/ShopAll';
import { Search, MapPin } from 'lucide-react';
import { AppContext } from './CartContext';
import { CustomCartIcon, CustomProfileIcon } from './components/Icons';
import './index.css';

function App() {
  const { cart, searchTerm, setSearchTerm, user, products } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 6); // Limit to 6 suggestions

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div className="app">
        <header>
          {/* Main Black Navbar - FULLY RESPONSIVE */}
          <div className="navbar-main">
            <div className="nav-brand-section">
              <Link to="/" className="nav-brand-stylized" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '850', color: '#FFC700', marginBottom: '2px' }}>Founder's</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '850', color: '#fff' }}>mart</span>
                    <span style={{ fontSize: '0.4rem', color: '#fff', border: '1px solid #FFC700', borderRadius: '12px', padding: '1px 6px', fontWeight: '700', letterSpacing: '0.3px', opacity: 0.9 }}>BY E-CELL</span>
                  </div>
                </div>
              </Link>

              <div className="nav-location-stylized">
                <MapPin size={20} strokeWidth={2} />
                <div className="nav-location-text">
                  <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>Delivering to Bengaluru 562130</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Alliance University</span>
                </div>
              </div>
            </div>

            <div className="nav-search-container" ref={suggestionRef}>
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="nav-search" 
                placeholder="Search for products" 
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              
              {showSuggestions && searchTerm.length > 0 && (
                <div className="search-suggestions">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map(p => (
                      <div 
                        key={p.id} 
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(p.id)}
                      >
                        <img src={p.image_url} alt="" className="suggestion-img" />
                        <div className="suggestion-info">
                          <div className="suggestion-name">{p.name}</div>
                          <div className="suggestion-price">{p.price_vc} Vc's</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="suggestion-no-results">No products found</div>
                  )}
                  {filteredSuggestions.length > 0 && (
                     <div className="suggestion-view-all" onClick={() => { navigate('/'); setShowSuggestions(false); }}>
                       View all results for "{searchTerm}"
                     </div>
                  )}
                </div>
              )}
            </div>

            <div className="nav-links">
              <Link to="/cart" className="nav-link-item">
                <CustomCartIcon size={28} />
                {cart.length > 0 && (
                  <span className="cart-badge">
                    {cart.reduce((a,c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
              <Link to={user ? "/profile" : "/login"} className="nav-link-item">
                <CustomProfileIcon size={28} />
              </Link>
            </div>
          </div>

          {/* Top Yellow Navbar - NOW BELOW BLACK BAR WITH FUNCTIONAL LINKS */}
          <div className="navbar-top" style={{ padding: '0.6rem 0', background: '#FFC700', color: '#000', display:'flex', gap: '3.5rem', justifyContent: 'center', fontWeight:'700', fontSize: '0.85rem' }}>
            <Link to="/shop-all" style={{ textDecoration: 'none', color: '#000' }}>Shop All</Link>
            <a href="/#about" style={{ textDecoration: 'none', color: '#000' }}>About Us</a>
            <a href="/#support" style={{ textDecoration: 'none', color: '#000' }}>Customer Support</a>
          </div>
        </header>

        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/vc-history" element={<VcHistory />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/shop-all" element={<ShopAll />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
