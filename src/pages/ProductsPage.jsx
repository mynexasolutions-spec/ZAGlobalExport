import { Link } from 'react-router-dom';
import { products } from '../data/products';

function ProductsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="breadcrumb-current">Products</span>
          </nav>
          <h1>Our Products</h1>
          <p>Quality Indian food commodities and agricultural products sourced for global professional buyers.</p>
        </div>
      </section>

      {/* Product Categories Selection Grid */}
      <section className="products section-padding bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">PRODUCT CATEGORIES</span>
            <h2>Select a Product Category</h2>
            <p>Explore our export portfolio. Click on any category to view detailed specifications, available varieties, packaging options, and sourcing standards.</p>
          </div>
          <div className="products-grid product-selection-grid">
            {products.map((product) => (
              <article className="product-card" id={product.id} key={product.id}>
                <div className="product-img">
                  <img src={product.cardImage || product.mainImage} alt={product.title} loading="lazy" />
                  <span className="product-card-badge">Export Sourced</span>
                </div>
                <div className="product-content">
                  <span className="section-subtitle">{product.subtitle}</span>
                  <h3>{product.title}</h3>
                  <p>{product.summary}</p>
                  <div className="product-card-footer">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-primary btn-sm product-action"
                      aria-label={`View details for ${product.title}`}
                    >
                      <i className="fa-solid fa-eye"></i> View Product
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Process Overview */}
      <section className="section-padding products-trust-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">EXPORT EXCELLENCE</span>
            <h2>How We Fulfill Buyer Requirements</h2>
            <p>Direct sourcing, lab testing, custom packing, and seamless multi-country containerized shipping.</p>
          </div>
          <div className="card-grid-3">
            <div className="info-card">
              <div className="icon-box gold-accent" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                <i className="fa-solid fa-seedling"></i>
              </div>
              <h3>Direct Farm &amp; Mill Sourcing</h3>
              <p>We source directly from accredited mills, modern processing facilities, and certified farmers across India to ensure genuine origin and optimal pricing.</p>
            </div>
            <div className="info-card">
              <div className="icon-box gold-accent" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                <i className="fa-solid fa-flask-vial"></i>
              </div>
              <h3>Rigorous Quality Checks</h3>
              <p>Every shipment is verified for sortex purity, grain elongation, moisture limits, and international phytosanitary compliance before container dispatch.</p>
            </div>
            <div className="info-card">
              <div className="icon-box gold-accent" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                <i className="fa-solid fa-boxes-packing"></i>
              </div>
              <h3>Custom Packing &amp; Private Label</h3>
              <p>From consumer pouches (1kg–5kg) to industrial bulk bags (25kg–50kg) and flexitanks, we deliver tailored packaging branded to your market requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="simple-cta">
        <div className="container">
          <h2>Looking for a specific food product from India?</h2>
          <p>
            Share your product, quantity, packaging and destination requirements with our export team.
          </p>
          <Link to="/contact" className="btn btn-white">
            Send Your Requirement
          </Link>
        </div>
      </section>
    </>
  );
}

export default ProductsPage;
