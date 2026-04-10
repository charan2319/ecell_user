import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { UserPlus, Calendar, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppContext } from '../CartContext';
import { useNavigate } from 'react-router-dom';

import { API_BASE } from '../config';

// Auto-rotating product card
function ProductCard({ product, onNavigate, onAddToCart }) {
  const allImages = [
    product.image_url,
    ...(product.extra_images || []).map(img => img.image_url)
  ].filter(Boolean);
  const [imgIdx, setImgIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (allImages.length > 1) {
      timerRef.current = setInterval(() => {
        setImgIdx(prev => (prev + 1) % allImages.length);
      }, 4000);
    }
    return () => clearInterval(timerRef.current);
  }, [allImages.length]);

  return (
    <div className="product-card" onClick={() => onNavigate(product.id)} style={{ cursor: 'pointer' }}>
      <div className="product-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
        {allImages.length > 0 ? (
          <img
            src={allImages[imgIdx]}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 0.5s ease' }}
          />
        ) : <div style={{ color: '#999' }}>No Image</div>}
        {allImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
            {allImages.map((_, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === imgIdx ? '#FFC700' : 'rgba(0,0,0,0.25)', display: 'block', transition: 'background 0.3s' }} />
            ))}
          </div>
        )}
      </div>
      <div className="product-title" title={product.name}>{product.name}</div>
      <div className="product-price">{product.price_vc} Vc's</div>
      <button className="add-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>Add To Cart</button>
    </div>
  );
}

function Home() {
  const { addToCart, searchTerm, products, loading, setLoading, fetchProducts, user, updateUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [event, setEvent] = useState(null);
  const [brands, setBrands] = useState([]);
  const [aboutImage, setAboutImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All products');

  // Name Modal State
  const [showNameModal, setShowNameModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [updatingName, setUpdatingName] = useState(false);

  useEffect(() => {
    if (user && user.name === 'New Student') {
      setShowNameModal(true);
    } else {
      setShowNameModal(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setUpdatingName(true);
    try {
      const res = await axios.put(`${API_BASE}/auth/user/${user.id}/name`, { name: newName });
      updateUser(res.data);
      setShowNameModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update name. Please try again.');
    } finally {
      setUpdatingName(false);
    }
  };

  // Automatic slider transition every 5 seconds
  useEffect(() => {
    if (heroImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentHero(prev => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroImages]);

  const fetchData = async () => {
    try {
      const [hRes, eRes, bRes, aRes] = await Promise.all([
        axios.get(`${API_BASE}/hero`),
        axios.get(`${API_BASE}/events`),
        axios.get(`${API_BASE}/brands`),
        axios.get(`${API_BASE}/about-image`)
      ]);
      // fetchProducts(); // We can call this if we want to ensure fresh data on home mount, or trust CartContext
      setHeroImages(hRes.data);
      if (eRes.data.length > 0) setEvent(eRes.data[0]);
      setBrands(bRes.data);
      setAboutImage(aRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const nextHero = () => setCurrentHero((currentHero + 1) % heroImages.length);
  const prevHero = () => setCurrentHero((currentHero - 1 + heroImages.length) % heroImages.length);

  const categories = ['All products', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All products' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const mainProducts = filteredProducts.slice(0, 20); // Show up to 20 items in the main list
  const newProducts = products.filter(p => p.is_new_arrival === true || p.is_new_arrival === 'true');

  return (
    <div className="home-layout">
      {/* 1. Dynamic Hero Slider (Match Image 2) */}
      <section className="hero-slider-container">
        {heroImages.length > 0 ? (
          <>
            <div
              className="hero-slide"
              style={{ backgroundImage: `url(${heroImages[currentHero].image_url})` }}
            ></div>

            {heroImages.length > 1 && (
              <>
                <button onClick={prevHero} className="hero-nav-btn" style={{ left: '20px' }}>
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextHero} className="hero-nav-btn" style={{ right: '20px' }}>
                  <ChevronRight size={24} />
                </button>
                <div className="hero-indicators">
                  {heroImages.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentHero(idx)}
                      className="indicator"
                      style={{ background: currentHero === idx ? 'var(--primary)' : 'rgba(255,255,255,0.5)' }}
                    ></div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="hero-slider-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', boxShadow: 'none' }}>
            <h2 style={{ opacity: 0.5 }}>No hero images uploaded yet.</h2>
          </div>
        )}
      </section>

      {/* 2. Main Content Container (Fixes the "Full Left Side" issue) */}
      <div className="section-container" id="products">
        {/* Categories Header */}
        <h2 className="section-title">Categories</h2>
        <section className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Popular Products Row -> Now "Our Products" to include all */}
        <h2 className="section-title">Choose the popular products</h2>
        <div className="product-row">
          {loading && <p>Syncing items...</p>}
          {mainProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={(pid) => navigate(`/product/${pid}`)}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>

      {/* 3. Upcoming Event (Dynamic High-Fidelity Card) */}
      {event && (
        <div className="section-container">
          <div className="banner-upcoming-dynamic">
            {event.image_url && (
              <div className="event-image-box">
                <img src={event.image_url} alt={event.title || 'Upcoming Event'} />
              </div>
            )}
            {(event.title || event.subtitle) && (
              <div className="event-info-box">
                {event.title && <h2 className="event-title-dyn">{event.title}</h2>}
                {event.subtitle && <p className="event-subtitle-dyn">{event.subtitle}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. More Content in the Centered Container */}
      <div className="section-container">
        <h2 className="section-title">New arrivals</h2>
        <div className="product-row">
          {newProducts.length === 0 && <p style={{ opacity: 0.5 }}>New items coming soon...</p>}
          {newProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={(pid) => navigate(`/product/${pid}`)}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {/* Earn Vc's Section */}
        <section className="earn-box">
          <div className="earn-header">
            <h2 className="earn-title">How to earn Vc's</h2>
          </div>
          <div className="earn-grid">
            <div className="earn-item">
              <UserPlus className="earn-icon" size={64} color="#000" strokeWidth={2.5} />
              <h3 className="earn-item-text">Referal to a friend</h3>
            </div>
            <div className="earn-item">
              <Calendar className="earn-icon" size={64} color="#000" strokeWidth={2.5} />
              <h3 className="earn-item-text">Attending an event</h3>
            </div>
            <div className="earn-item">
              <Trophy className="earn-icon" size={64} color="#000" strokeWidth={2.5} />
              <h3 className="earn-item-text">Winning an event</h3>
            </div>
          </div>
        </section>
      </div>

      {/* 5. About Us (Stylized according to reference image) */}
      <section className="about-section-container" id="about">
        <div className="about-text-column">
          <div className="about-heading-wrapper">
            <div className="about-heading-box">
              <h2>About Us</h2>
            </div>
          </div>
          <p className="about-content-text">
            Ecell is the entrepreneurial Cell of Alliance University where it
            supports Entrepreneurship and student entrepreneurs. It also conducts
            events related to Entrepreneurship to provide knowledge and inspire students
          </p>
        </div>
        <div className="about-visual-box">
          {aboutImage && <img src={aboutImage.image_url} alt="About E-Cell" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />}
        </div>
      </section>

      {/* 6. Brands (Centered Container) */}
      <div className="section-container" style={{ marginBottom: '5rem' }} id="support">
        <h2 className="section-title" style={{ textAlign: 'center' }}>Trusted Brands</h2>
        <div className="brands-row">
          {brands.map(b => (
            <div key={b.id} className="brand-box">
              <img src={b.image_url} alt="" className="brand-image" />
            </div>
          ))}
          {brands.length === 0 && <p style={{ opacity: 0.5 }}>Syncing trusted partners...</p>}
        </div>
      </div>

      {/* 7. Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          {/* Left - CTA */}
          <div className="footer-cta">
            <h2 className="footer-cta-title">Do You Have A Startup Idea ?</h2>
            <p className="footer-cta-sub">Join E-Cell Community</p>
            <a href="/login" className="footer-join-btn">Join Now</a>
          </div>

          {/* Center - Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-heading">Quick Links</h4>
            <a href="/#about">About</a>
            <a href="/#services">Services</a>
            <a href="/#products">Shop</a>
            <a href="/#products">Explore Products</a>
          </div>

          {/* Right - Contact */}
          <div className="footer-contact-col">
            <h4 className="footer-col-heading">Contact Us</h4>
            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.44 2 2 0 0 1 3.57 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.82-.82a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>98292167xx</span>
            </div>
            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>Ecellatalliance@gmail.com</span>
            </div>
            <div className="footer-social-row">
              <a href="https://www.instagram.com/ecellatalliance?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="footer-social-icon-img" aria-label="Instagram">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" />
              </a>
              <a href="https://www.linkedin.com/company/e-cell-alliance-university/?originalSubdomain=in" target="_blank" rel="noreferrer" className="footer-social-icon-img" aria-label="LinkedIn">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/600px-LinkedIn_logo_initials.png" alt="LinkedIn" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-icon-img" aria-label="Facebook">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/600px-Facebook_Logo_%282019%29.png" alt="Facebook" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="footer-social-icon-img" aria-label="X (Twitter)">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/600px-X_logo_2023.svg.png" alt="X" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* RENAME MODAL */}
      {showNameModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '40px', padding: '3.5rem 3rem', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-1px' }}>Welcome!</h2>
            <p style={{ color: '#666', marginBottom: '2.5rem', fontWeight: 500, lineHeight: 1.5 }}>It looks like it's your first time here. Please enter your full name to continue.</p>
            <form onSubmit={handleUpdateName}>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex. John Doe"
                style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: '16px', border: '2px solid #E5E7EB', fontSize: '1.1rem', marginBottom: '1.5rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#000'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
              <button 
                type="submit" 
                disabled={updatingName}
                style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', background: '#000', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 800, cursor: updatingName ? 'not-allowed' : 'pointer', opacity: updatingName ? 0.7 : 1, transition: 'transform 0.1s' }}
                onMouseDown={(e) => !updatingName && (e.target.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => !updatingName && (e.target.style.transform = 'scale(1)')}
                onMouseLeave={(e) => !updatingName && (e.target.style.transform = 'scale(1)')}
              >
                {updatingName ? 'Saving...' : 'Save Name'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
