import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '../CartContext';
import ProductCardSimple from '../components/ProductCardSimple';

export default function ShopAll() {
  const { products, loading, addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div className="shopall-loading">Loading Products...</div>;

  return (
    <div className="shopall-page">
      {/* Top Header Bar */}
      <div className="shopall-header">
        <button className="shopall-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <h1 className="shopall-title">Shop All</h1>
      </div>

      {/* Products Grid */}
      <div className="shopall-container">
        <div className="shopall-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCardSimple 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))
          ) : (
            <div className="shopall-empty">No products available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
}
