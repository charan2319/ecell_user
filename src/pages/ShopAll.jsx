import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppContext } from '../CartContext';
import ProductCardSimple from '../components/ProductCardSimple';

export default function ShopAll() {
  const { products, loading, addToCart } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryParam]);

  const displayProducts = categoryParam
    ? products.filter(p => p.category === categoryParam)
    : products;

  const pageTitle = categoryParam || 'Shop All';

  if (loading) return <div className="shopall-loading">Loading Products...</div>;

  return (
    <div className="shopall-page">
      {/* Top Header Bar */}
      <div className="shopall-header">
        <button className="shopall-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <h1 className="shopall-title">{pageTitle}</h1>
        {categoryParam && (
          <span className="shopall-count">{displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Products Grid */}
      <div className="shopall-container">
        <div className="shopall-grid">
          {displayProducts.length > 0 ? (
            displayProducts.map(product => (
              <ProductCardSimple 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))
          ) : (
            <div className="shopall-empty">
              {categoryParam
                ? `No products found in "${categoryParam}" category.`
                : 'No products available at the moment.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
