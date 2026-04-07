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
import VerifyEmail from './pages/VerifyEmail';
import { Search, MapPin } from 'lucide-react';
import { AppContext } from './CartContext';
import { CustomCartIcon, CustomProfileIcon } from './components/Icons';
import axios from 'axios';
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

function App() {
  const { cart, searchTerm, setSearchTerm, user, products } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const suggestionRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/locations`);
        setLocations(res.data);
        const saved = localStorage.getItem('selectedLocation');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const exists = res.data.find(l => l.id === parsed.id);
            setSelectedLocation(exists || res.data[0]);
          } catch (e) { setSelectedLocation(res.data[0]); }
        } else {
          setSelectedLocation(res.data[0]);
        }
      } catch (err) { console.error('Failed to fetch locations'); }
    };
    fetchLocations();
  }, []);

  // Persist selected location
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    }
  }, [selectedLocation]);

  // Close suggestions and location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '950', 
                    color: '#FFC107', 
                    lineHeight: '0.9',
                    letterSpacing: '-0.5px'
                  }}>Founder's</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '-1px' }}>
                    <span style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '950', 
                      color: '#E5E7EB', 
                      lineHeight: '0.8',
                      letterSpacing: '-1px'
                    }}>mart</span>
                    <div style={{ 
                      fontSize: '0.45rem', 
                      color: '#fff', 
                      border: '1.5px solid #FFC107', 
                      borderRadius: '50px', 
                      padding: '2px 8px', 
                      fontWeight: '900', 
                      letterSpacing: '0.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '16px',
                      marginTop: '2px'
                    }}>BY E-CELL</div>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '1.5px', 
                    background: '#E5E7EB', 
                    marginTop: '4px',
                    opacity: 0.8
                  }}></div>
                  <div style={{ 
                    fontSize: '0.6rem', 
                    color: '#E5E7EB', 
                    fontWeight: '800', 
                    letterSpacing: '2px',
                    marginTop: '4px',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}>Alliance University</div>
                </div>
              </Link>

              <div 
                className="nav-location-stylized" 
                ref={locationDropdownRef}
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} strokeWidth={2} />
                  <div className="nav-location-text" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                      {selectedLocation ? `Delivering to ${selectedLocation.name} ${selectedLocation.pincode}` : 'Select Location'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                        {selectedLocation ? selectedLocation.name : 'Choose Zone'}
                      </span>
                      <span style={{ fontSize: '10px', opacity: 0.6, transition: 'transform 0.2s', transform: showLocationDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </div>
                  </div>
                </div>

                {showLocationDropdown && (
                  <div className="location-selector-dropdown">
                    <div className="dropdown-header">Choose your location</div>
                    <div className="location-list">
                      {locations.map(loc => (
                        <div 
                          key={loc.id} 
                          className={`location-item ${selectedLocation?.id === loc.id ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(loc);
                            setShowLocationDropdown(false);
                          }}
                        >
                          <MapPin size={16} />
                          <div className="location-info">
                            <div className="location-name">{loc.name}</div>
                            <div className="location-pin">{loc.pincode}</div>
                          </div>
                        </div>
                      ))}
                      {locations.length === 0 && <div className="no-locations">No locations available</div>}
                    </div>
                  </div>
                )}
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
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </main>
      </div>
  );
}

export default App;
