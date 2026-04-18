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
          <h1 className="pd-name">{product.name}</h1>

          {/* Price Row */}
          <div className="pd-price-row">
            {product.original_price && (
              <span className="pd-price-original">
                <img src={coinImg} alt="VC" className="coin-icon" />
                <span className="pd-price-num">{product.original_price}</span>
              </span>
            )}
            <span className="pd-price">
              <img src={coinImg} alt="VC" className="coin-icon" />
              <span className="pd-price-num">{product.price_vc}</span>
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="pd-description">{product.description}</p>
          )}

          {/* Amazon-Style Specifications Table */}
          {(() => {
            // Check if product has specs, or mock it if it's the HP Victus to show how it looks
            const specs = product.specifications || (
              product.name?.toLowerCase().includes('victus') 
              ? [
                  { label: "Brand", value: "HP" },
                  { label: "Manufacturer", value: "HP Inc." },
                  { label: "Series", value: "Victus 15" },
                  { label: "Form Factor", value: "Laptop" },
                  { label: "Item Height", value: "24 Millimeters" },
                  { label: "Item Width", value: "25.5 Centimeters" },
                  { label: "Standing screen display size", value: "39.6 Centimetres" },
                  { label: "Screen Resolution", value: "1920 x 1080 pixels" },
                  { label: "Processor Brand", value: "Intel" },
                  { label: "Processor Type", value: "Core i5" },
                  { label: "RAM Size", value: "8 GB" },
                  { label: "Memory Technology", value: "DDR4" },
                  { label: "Hard Drive Size", value: "512 GB" },
                  { label: "Hard Disk Description", value: "SSD" },
                  { label: "Audio Details", value: "Headphones, Speakers" },
                  { label: "Graphics Coprocessor", value: "NVIDIA GeForce RTX 3050" },
                  { label: "Operating System", value: "Windows 11 Home" }
                ] 
              : null
            );

            if (!specs) return null;

            return (
              <div className="pd-specs-section">
                <h3 className="pd-specs-title">Technical Details</h3>
                <div className="pd-specs-table">
                  {specs.map((spec, idx) => (
                    <div className="pd-spec-row" key={idx}>
                      <div className="pd-spec-label">{spec.label}</div>
                      <div className="pd-spec-value">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

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
