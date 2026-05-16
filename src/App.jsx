import React, { useContext, useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import VcHistory from './pages/VcHistory';
import ProductDetail from './pages/ProductDetail';
import ShopAll from './pages/ShopAll';
import VerifyEmail from './pages/VerifyEmail';
import HowToEarnVc from './pages/HowToEarnVc';
import { Search, MapPin, X, Plus, Trash2, CheckCircle2, Pencil } from 'lucide-react';
import { AppContext } from './CartContext';
import { CustomCartIcon, CustomProfileIcon } from './components/Icons';
import './index.css';
import foundersMartLogo from "./assets/Founder'smart.png";
const headerImg = foundersMartLogo;
import coinImg from './assets/coin.png';
import referralImg from './assets/Referal to a friend.png';
import attendanceImg from './assets/Attending an Event.png';
import winningImg from './assets/Winning an event.png';
function App() {
  const { 
    cart, searchTerm, setSearchTerm, user, products,
    userLocation, detecting, handleDetectLocation,
    savedAddresses, selectedAddressId, addAddress, removeAddress, editAddress, selectAddress, getSelectedAddress
  } = useContext(AppContext);

  // Compute what to display in navbar: saved address takes priority over GPS
  const selectedAddr = getSelectedAddress();
  const navLabel = detecting
    ? 'Scanning area...'
    : (selectedAddressId && selectedAddr)
      ? `${selectedAddr.type || 'Home'} · ${selectedAddr.pincode}`
      : userLocation
        ? `Delivering to ${userLocation.pincode}`
        : 'Select Location';
  const navName = (selectedAddressId && selectedAddr)
      ? selectedAddr.name
      : userLocation
        ? userLocation.name
        : 'Choose Location';
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null); // navbar edit mode
  const [addrForm, setAddrForm] = useState({ name:'', phone:'', house:'', area:'', city:'', state:'', pincode:'', type:'Home' });
  const suggestionRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const handleAddrChange = e => setAddrForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const startEditAddr = (e, addr) => {
    e.stopPropagation();
    setEditingAddrId(addr.id);
    setAddrForm({ name: addr.name, phone: addr.phone, house: addr.house, area: addr.area, city: addr.city, state: addr.state, pincode: addr.pincode, type: addr.type || 'Home' });
    setShowAddressForm(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const { name, phone, house, area, city, state, pincode } = addrForm;
    if (!name || !phone || !house || !area || !city || !state || !pincode) {
      alert('Please fill in all address fields.');
      return;
    }
    if (editingAddrId) {
      await editAddress(editingAddrId, addrForm);
      setEditingAddrId(null);
    } else {
      await addAddress(addrForm);
    }
    setAddrForm({ name:'', phone:'', house:'', area:'', city:'', state:'', pincode:'', type:'Home' });
    setShowAddressForm(false);
  };


  // Close suggestions, location dropdown, and mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Desktop search suggestions:
      // Only close if we're not in mobile search mode and the click is truly outside
      if (!mobileSearchOpen && suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      
      // 2. Location dropdown:
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      
      // 3. Mobile search overlay:
      // If mobile search is open, check if we're clicking outside the mobile ref AND not the trigger
      if (mobileSearchOpen && mobileSearchRef.current) {
        if (!mobileSearchRef.current.contains(event.target) && !event.target.closest('.mobile-search-trigger')) {
          setMobileSearchOpen(false);
          setSearchTerm('');
          setShowSuggestions(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileSearchOpen, setSearchTerm]);

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
              <Link to="/" className="nav-brand-image">
                <img src={headerImg} alt="Founder's Mart" className="nav-header-logo" />
              </Link>

              <div 
                className="nav-location-wrapper" 
                ref={locationDropdownRef}
                style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex' }}
              >
                <div 
                  className="nav-location-stylized" 
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  style={{ cursor: 'pointer', position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}
                >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} strokeWidth={2} />
                  <div className={`nav-location-text ${detecting ? 'locating' : ''}`}>
                    <span className="delivering-to-label">{navLabel}</span>
                    <div className="location-main-display">
                      <span className="location-name-text">{navName}</span>
                      <span className="dropdown-chevron" style={{ transition: 'transform 0.3s', transform: showLocationDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </div>
                  </div>
                </div>
              </div>
              {showLocationDropdown && (
                <>
                  <div className="location-overlay" onClick={(e) => { e.stopPropagation(); setShowLocationDropdown(false); setShowAddressForm(false); }}></div>
                  <div className="location-selector-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="dropdown-header">Choose Delivery Location</div>
                    <div className="location-list">

                      {/* GPS detect */}
                      <div className="location-item detect-btn" onClick={(e) => { e.stopPropagation(); handleDetectLocation(); }}>
                        <MapPin size={18} />
                        <div className="location-info">
                          <div className="location-name">{detecting ? 'Detecting...' : 'Use My Current Location'}</div>
                          <div className="location-pin">Fast & accurate via GPS</div>
                        </div>
                      </div>

                      {/* Saved addresses */}
                      {savedAddresses.length > 0 && (
                        <div className="addr-saved-list">
                          <div className="addr-list-label">SAVED ADDRESSES</div>
                          {savedAddresses.map(addr => (
                            editingAddrId === addr.id ? (
                              <form key={addr.id} className="addr-form" onSubmit={handleAddAddress}>
                                <div className="addr-form-title">Edit Address</div>
                                <div className="addr-form-row">
                                  <input name="name" placeholder="Full Name *" value={addrForm.name} onChange={handleAddrChange} required />
                                  <input name="phone" placeholder="Phone *" value={addrForm.phone} onChange={handleAddrChange} required />
                                </div>
                                <input name="house" placeholder="House / Flat / Block No. *" value={addrForm.house} onChange={handleAddrChange} required />
                                <input name="area" placeholder="Street / Area / Colony *" value={addrForm.area} onChange={handleAddrChange} required />
                                <div className="addr-form-row">
                                  <input name="city" placeholder="City *" value={addrForm.city} onChange={handleAddrChange} required />
                                  <input name="state" placeholder="State *" value={addrForm.state} onChange={handleAddrChange} required />
                                </div>
                                <div className="addr-form-row">
                                  <input name="pincode" placeholder="Pincode *" value={addrForm.pincode} onChange={handleAddrChange} required />
                                  <select name="type" value={addrForm.type} onChange={handleAddrChange}>
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>
                                <div className="addr-form-actions">
                                  <button type="button" className="addr-cancel-btn" onClick={() => { setEditingAddrId(null); setAddrForm({ name:'', phone:'', house:'', area:'', city:'', state:'', pincode:'', type:'Home' }); }}>Cancel</button>
                                  <button type="submit" className="addr-save-btn">Update</button>
                                </div>
                              </form>
                            ) : (
                              <div
                                key={addr.id}
                                className={`location-item addr-card ${selectedAddressId === addr.id ? 'active' : ''}`}
                                onClick={() => { selectAddress(addr.id); setShowLocationDropdown(false); }}
                              >
                                <div className="addr-type-badge">{addr.type || 'Home'}</div>
                                <div className="location-info" style={{flex:1}}>
                                  <div className="location-name">{addr.name} · {addr.phone}</div>
                                  <div className="location-pin">{addr.house}, {addr.area}, {addr.city} - {addr.pincode}</div>
                                </div>
                                {selectedAddressId === addr.id && <CheckCircle2 size={16} color="#FFC700" />}
                                <button className="addr-edit-btn" onClick={(e) => startEditAddr(e, addr)}>
                                  <Pencil size={13} />
                                </button>
                                <button className="addr-remove-btn" onClick={(e) => { e.stopPropagation(); removeAddress(addr.id); }}>
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )
                          ))}
                        </div>
                      )}

                      {/* GPS detected location — selectable */}
                      {userLocation && (
                        <div
                          className={`location-item saved-location ${!selectedAddressId ? 'active' : ''}`}
                          onClick={() => { selectAddress(null); setShowLocationDropdown(false); }}
                        >
                          <MapPin size={18} />
                          <div className="location-info">
                            <div className="location-name">{userLocation.name}</div>
                            <div className="location-pin">{userLocation.pincode} · GPS Location</div>
                          </div>
                          {!selectedAddressId && <CheckCircle2 size={16} color="#FFC700" />}
                        </div>
                      )}

                      {/* Add new address button / form */}
                      {!showAddressForm && !editingAddrId && (
                        <button className="addr-add-new-btn" onClick={() => setShowAddressForm(true)}>
                          <Plus size={15} /> Add New Address
                        </button>
                      )}
                      {showAddressForm && (
                        <form className="addr-form" onSubmit={handleAddAddress}>
                          <div className="addr-form-title">Add New Address</div>
                          <div className="addr-form-row">
                            <input name="name" placeholder="Full Name *" value={addrForm.name} onChange={handleAddrChange} required />
                            <input name="phone" placeholder="Phone *" value={addrForm.phone} onChange={handleAddrChange} required />
                          </div>
                          <input name="house" placeholder="House / Flat / Block No. *" value={addrForm.house} onChange={handleAddrChange} required />
                          <input name="area" placeholder="Street / Area / Colony *" value={addrForm.area} onChange={handleAddrChange} required />
                          <div className="addr-form-row">
                            <input name="city" placeholder="City *" value={addrForm.city} onChange={handleAddrChange} required />
                            <input name="state" placeholder="State *" value={addrForm.state} onChange={handleAddrChange} required />
                          </div>
                          <div className="addr-form-row">
                            <input name="pincode" placeholder="Pincode *" value={addrForm.pincode} onChange={handleAddrChange} required />
                            <select name="type" value={addrForm.type} onChange={handleAddrChange}>
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="addr-form-actions">
                            <button type="button" className="addr-cancel-btn" onClick={() => setShowAddressForm(false)}>Cancel</button>
                            <button type="submit" className="addr-save-btn">Save Address</button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </>
              )}
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="nav-search-container desktop-search" ref={suggestionRef}>
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                className="nav-search" 
                placeholder="Search products..." 
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
                          <div className="suggestion-price">{p.price_vc} <img src={coinImg} alt="VC" className="coin-icon" /></div>
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
                  placeholder="Search products..." 
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
                          <div className="suggestion-price">{p.price_vc} <img src={coinImg} alt="VC" className="coin-icon" /></div>
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
            <Link to="/how-to-earn-vc" style={{ textDecoration: 'none', color: '#000' }}>How To Earn VC</Link>
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
            <Route path="/how-to-earn-vc" element={<HowToEarnVc />} />
          </Routes>
        </main>

      </div>
  );
}

export default App;
