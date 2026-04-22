import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Truck, ArrowLeft } from 'lucide-react';
import { AppContext } from '../CartContext';
import '../index.css';

import { API_BASE } from '../config';
import coinImg from '../assets/coin.png';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, userLocation } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (!product) return <div className="pd-error">Product not found.</div>;

  const gallery = [
    { url: product.image_url },
    ...(product.extra_images || []).map(img => ({ url: img.image_url }))
  ].filter(img => img.url);

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="pd-page">
      <button className="pd-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={22} />
      </button>
      <div className="pd-grid">
        {/* ── LEFT: Image Gallery with Grey Background ── */}
        <div className="pd-gallery">
          {/* Large main image on the LEFT now */}
          <div className="pd-main-img-box">
            <img src={gallery[selectedImg]?.url} alt={product.name} className="pd-main-img" />
          </div>

          {/* Thumbnails on the RIGHT now */}
          {gallery.length > 0 && (
            <div className="pd-thumbs-col">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className={`pd-thumb ${selectedImg === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImg(idx)}
                >
                  <img src={img.url} alt={`view ${idx}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product Info with White Background ── */}
        <div className="pd-info">
          {/* Brand Name (Only show if brand exists to avoid mock feel) */}
          {product.brand && <h2 className="pd-brand">{product.brand}</h2>}

          {/* Product Name */}
          <h1 className="pd-name">{product.name?.replace(/\bHp\b/g, 'HP')}</h1>

          {/* Price Row */}
          <div className="pd-price-row">
            {product.original_price && (
              <span className="pd-price-original">
                <img src={coinImg} alt="VC" className="coin-icon" />
                <span className="pd-price-num">{Number(product.original_price).toLocaleString('en-IN')}</span>
              </span>
            )}
            <span className="pd-price">
              <img src={coinImg} alt="VC" className="coin-icon" />
              <span className="pd-price-num">{Number(product.price_vc).toLocaleString('en-IN')}</span>
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <div className="pd-description-container">
              <h3 className="pd-section-title">About this item</h3>
              <ul className={`pd-description-list ${isExpanded ? 'expanded' : ''}`}>
                {product.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                  <li key={idx}>{line.trim().replace(/\bHp\b/g, 'HP')}</li>
                ))}
              </ul>
              {product.description.split('\n').filter(line => line.trim()).length > 4 && (
                <button 
                  className="pd-description-toggle" 
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          )}



          <div style={{ flexGrow: 1 }}></div>

          {/* Delivery Details */}
          <div className="pd-delivery-section">
            <div className="pd-delivery-title">Delivery Details</div>
            <div className="pd-delivery-tags">
              <span className="pd-delivery-tag">
                <MapPin size={18} /> {userLocation ? userLocation.full : 'Set delivery location in header'}
              </span>
              {product.delivery_time && (
                <span className="pd-delivery-tag">
                  <Truck size={18} /> Delivery In {product.delivery_time}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pd-btn-row">
            <button className="pd-btn-cart" onClick={() => addToCart(product)}>
              Add To Cart
            </button>
            <button className="pd-btn-buy" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
