import React from 'react';
import { useNavigate } from 'react-router-dom';
import coinImg from '../assets/coin.png';

export default function ProductCardSimple({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div className="product-card-simple" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pcs-image-wrapper">
        <img src={product.image_url} alt={product.name} />
      </div>
      <div className="pcs-info">
        <h3 className="pcs-name" title={product.name}>{product.name}</h3>
        <div className="pcs-price">{product.price_vc} <img src={coinImg} alt="VC" className="coin-icon" /></div>
      </div>
      <button 
        className="pcs-add-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart(product);
        }}
      >
        Add To Cart
      </button>
    </div>
  );
}
