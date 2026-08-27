import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomeProducts, refreshProductsFromSupabase } from '../services/productsService';

function Products() {
  // Instant render — only products marked visible on homepage, sorted by displayOrder
  const [productsList, setProductsList] = useState(() => getHomeProducts());

  useEffect(() => {
    let mounted = true;
    refreshProductsFromSupabase()
      .then((fresh) => {
        if (!mounted) return;
        const visible = fresh
          .filter((p) => p.showOnHome !== false)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        setProductsList(visible);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return (
    <section className="products section-padding bg-light">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">OUR PRODUCTS</span>
          <h2>Quality Products. Reliable Sourcing.</h2>
          <p>Our export portfolio focuses on essential food commodities and agricultural products sourced directly from certified Indian mills and growers.</p>
        </div>
        <div className="products-grid">
          {productsList.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-img">
                <img src={product.cardImage || product.mainImage} alt={product.title} loading="lazy" />
                <span className="product-card-badge">Export Sourced</span>
              </div>
              <div className="product-content">
                <span className="section-subtitle">{product.subtitle}</span>
                <h3>{product.title}</h3>
                <p>{product.summary}</p>
                <div className="product-card-footer">
                  <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm">
                    <i className="fa-solid fa-arrow-right"></i> View Product
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link to="/products" className="btn btn-secondary">
            <i className="fa-solid fa-table-cells"></i> View All Product Categories
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Products;
