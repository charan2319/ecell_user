import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
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
import { Search, MapPin, X } from 'lucide-react';
import { AppContext } from './CartContext';
import { CustomCartIcon, CustomProfileIcon } from './components/Icons';
import axios from 'axios';
import './index.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
function App() {
  const { cart, searchTerm, setSearchTerm, user, products } = useContext(AppContext);
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const suggestionRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Initialize location from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      try {
        setUserLocation(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved location');
      }
    }
  }, []);

  const reverseGeocode = async (lat, lon) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
        headers: {
          'User-Agent': "FounderMartEcommerceApp/1.0"
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      
      // Extract a clean address
      const address = data.address;
      const cleanName = address.suburb || address.neighbourhood || address.road || address.city || "Current Location";
      const pincode = address.postcode || "";
      
      return { name: cleanName, pincode, full: data.display_name, lat, lon };
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Reverse geocoding failed', err);
      return { name: "Current Location", pincode: "", lat: lat, lon: lon };
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const locationData = await reverseGeocode(latitude, longitude);
      setUserLocation(locationData);
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      setDetecting(false);
      setShowLocationDropdown(false);
    }, (error) => {
      console.error('Geolocation error:', error);
      let errorMsg = "Unable to retrieve your location.";
      if (error.code === 1) errorMsg = "Permission denied. Please allow location access in your browser settings.";
      else if (error.code === 2) errorMsg = "Location unavailable. Please try again or check your GPS.";
      else if (error.code === 3) errorMsg = "Location request timed out. Please try again.";
      
      alert(errorMsg);
      setDetecting(false);
    }, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  };


  // Close suggestions, location dropdown, and mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target) && !event.target.closest('.mobile-search-trigger')) {
        setMobileSearchOpen(false);
        setSearchTerm('');
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
                      {userLocation ? `Delivering to ${userLocation.name} ${userLocation.pincode}` : 'Set Location'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>
                        {userLocation ? userLocation.name : 'Choose Location'}
                      </span>
                      <span style={{ fontSize: '10px', opacity: 0.6, transition: 'transform 0.2s', transform: showLocationDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </div>
                  </div>
                </div>

                {showLocationDropdown && (
                  <div className="location-selector-dropdown">
                    <div className="dropdown-header">Set your delivery location</div>
                    <div className="location-list">
                      <div 
                        className="location-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetectLocation();
                        }}
                      >
                        <MapPin size={16} />
                        <div className="location-info">
                          <div className="location-name" style={{ color: '#FFC700', fontWeight: '800' }}>
                            {detecting ? 'Detecting...' : 'Use My Current Location'}
                          </div>
                          <div className="location-pin">Fast & accurate via browser</div>
                        </div>
                      </div>
                      {userLocation && (
                        <div className="location-item active" style={{ marginTop: '0.5rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                          <MapPin size={16} />
                          <div className="location-info">
                            <div className="location-name">{userLocation.name}</div>
                            <div className="location-pin">{userLocation.pincode}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="nav-search-container desktop-search" ref={suggestionRef}>
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

            {/* Mobile: Search icon trigger + Cart + Profile (RIGHT side) */}
            <div className="nav-links">
              <button 
                className="mobile-search-trigger" 
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Search"
              >
                <Search size={22} />
              </button>
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

          {/* Mobile Search Overlay */}
          {mobileSearchOpen && (
            <div className="mobile-search-overlay" ref={mobileSearchRef}>
              <div className="mobile-search-bar">
                <Search size={18} className="mobile-search-bar-icon" />
                <input 
                  type="text" 
                  className="mobile-search-input" 
                  placeholder="Search for products..." 
                  value={searchTerm}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  autoFocus
                />
                <button 
                  className="mobile-search-close"
                  onClick={() => { setMobileSearchOpen(false); setSearchTerm(''); setShowSuggestions(false); }}
                >
                  <X size={18} />
                </button>
              </div>
              {showSuggestions && searchTerm.length > 0 && (
                <div className="search-suggestions mobile-suggestions">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map(p => (
                      <div 
                        key={p.id} 
                        className="suggestion-item"
                        onClick={() => { handleSuggestionClick(p.id); setMobileSearchOpen(false); }}
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
                     <div className="suggestion-view-all" onClick={() => { navigate('/'); setShowSuggestions(false); setMobileSearchOpen(false); }}>
                       View all results for "{searchTerm}"
                     </div>
                  )}
                </div>
              )}
            </div>
          )}

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
