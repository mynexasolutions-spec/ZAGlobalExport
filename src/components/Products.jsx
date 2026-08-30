import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHomeProducts, refreshProductsFromSupabase } from '../services/productsService';

function Products() {
  const navigate = useNavigate();
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
    <section 
      className="products section-padding bg-light"
      style={{
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.70), rgba(255, 255, 255, 0.70)), url('/product-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            <i className="fa-solid fa-table-cells"></i> View All Product Categories
          </button>
        </div>
      </div>
    </section>
  );
}

export default Products;
