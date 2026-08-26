import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, getProductById } from '../data/products';

function ProductDetailPage() {
  const { productId } = useParams();
  const product = getProductById(productId);

  // Active preview image (defaults to mainImage or first category image)
  const [activeImage, setActiveImage] = useState('');
  const [activeImageLabel, setActiveImageLabel] = useState('');

  useEffect(() => {
    if (product) {
      const initialImg = product.mainImage || (product.categoryImages && product.categoryImages[0]?.src) || product.cardImage;
      setActiveImage(initialImg);
      setActiveImageLabel(product.title);
      window.scrollTo(0, 0);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="product-not-found section-padding text-center">
        <div className="container">
          <div className="not-found-card info-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '20px' }}></i>
            <h2>Product Not Found</h2>
            <p style={{ margin: '15px 0 25px' }}>
              The product category you are looking for does not exist or has been moved.
            </p>
            <Link to="/products" className="btn btn-primary">
              <i className="fa-solid fa-arrow-left"></i> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Other products for "Explore More" section
  const otherProducts = products.filter((p) => p.id !== product.id);

  // All gallery items (main + varieties)
  const galleryItems = [
    { name: `${product.shortTitle || product.title} (Main)`, src: product.mainImage, type: 'Overview' },
    ...(product.categoryImages || []),
  ].filter((item, index, self) => item.src && self.findIndex((t) => t.src === item.src) === index);

  return (
    <div className="product-detail-page">
      {/* Page Hero Header */}
      <section className="page-header product-page-header">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
            <Link to="/products">Products</Link>
            <span className="breadcrumb-sep"><i className="fa-solid fa-chevron-right"></i></span>
            <span className="breadcrumb-current">{product.title}</span>
          </nav>
          <span className="page-header-subtitle">{product.subtitle}</span>
          <h1>{product.title}</h1>
          <p>{product.summary}</p>
        </div>
      </section>

      {/* Main Product Showcase Section */}
      <section className="section-padding product-main-section">
        <div className="container">
          <div className="product-detail-layout">
            {/* Left Column: Image Viewer & Gallery */}
            <div className="product-visuals-col">
              <div className="main-image-viewport">
                <div className="image-aspect-box">
                  <img
                    src={activeImage || product.mainImage}
                    alt={activeImageLabel || product.title}
                    className="main-display-img"
                  />
                </div>
                <div className="image-caption-bar">
                  <span className="image-badge">
                    <i className="fa-solid fa-certificate"></i> Export Grade
                  </span>
                  <span className="image-caption-text">{activeImageLabel || product.title}</span>
                </div>
              </div>

              {/* Thumbnails Gallery Strip Below Main Image */}
              {galleryItems.length > 1 && (
                <div className="gallery-thumbnails-wrapper">
                  <div className="gallery-thumbnails-header">
                    <h4>
                      <i className="fa-solid fa-images"></i> Product Varieties &amp; Gallery
                    </h4>
                    <span className="thumbnail-count">{galleryItems.length} Images</span>
                  </div>
                  <div className="gallery-thumbnails-grid">
                    {galleryItems.map((item, idx) => {
                      const isSelected = activeImage === item.src;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`gallery-thumb-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setActiveImage(item.src);
                            setActiveImageLabel(item.name);
                          }}
                          aria-label={`View ${item.name}`}
                          title={`Click to view ${item.name}`}
                        >
                          <div className="thumb-img-wrapper">
                            <img src={item.src} alt={item.name} loading="lazy" />
                          </div>
                          <span className="thumb-label">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sourcing Highlights Card */}
              <div className="visuals-trust-card">
                <h4><i className="fa-solid fa-shield-halved"></i> Export Quality Assurance</h4>
                <ul>
                  <li><i className="fa-solid fa-circle-check"></i> Cleaned, sorted, and graded to customer requirements</li>
                  <li><i className="fa-solid fa-circle-check"></i> Standardized international export packaging</li>
                  <li><i className="fa-solid fa-circle-check"></i> Full phytosanitary &amp; inspection compliance</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Sourcing Details, Specs & Actions */}
            <div className="product-info-col">
              <div className="product-header-info">
                <span className="section-subtitle">{product.subtitle}</span>
                <h2>{product.title}</h2>
                <div className="rating-compliance-pills">
                  <span className="pill"><i className="fa-solid fa-globe"></i> Global Sourcing</span>
                  <span className="pill"><i className="fa-solid fa-box-open"></i> Bulk &amp; Retail Packaging</span>
                  <span className="pill"><i className="fa-solid fa-award"></i> Quality Verified</span>
                </div>
              </div>

              <div className="product-description-block">
                <h3>Product Overview</h3>
                <p>{product.description}</p>
              </div>

              {/* Quick Specification Grid */}
              <div className="specs-summary-grid">
                <div className="spec-card">
                  <span className="spec-label"><i className="fa-solid fa-location-dot"></i> Origin</span>
                  <span className="spec-value">{product.origin || 'India'}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-label"><i className="fa-solid fa-droplet"></i> Moisture</span>
                  <span className="spec-value">{product.moisture || 'Standard Export Grade'}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-label"><i className="fa-solid fa-star"></i> Purity</span>
                  <span className="spec-value">{product.purity || 'Sortex Cleaned'}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-label"><i className="fa-solid fa-truck-ramp-box"></i> Supply Ability</span>
                  <span className="spec-value">FCL &amp; Multi-Container</span>
                </div>
              </div>

              {/* Key Features List */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="key-features-block">
                  <h3>Key Highlights &amp; Sourcing Strengths</h3>
                  <ul className="check-list">
                    {product.keyFeatures.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fa-solid fa-check"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Packaging Options */}
              {product.packagingOptions && product.packagingOptions.length > 0 && (
                <div className="packaging-options-block">
                  <h3>Available Packaging Formats</h3>
                  <div className="packaging-tags">
                    {product.packagingOptions.map((pack, idx) => (
                      <span className="packaging-tag" key={idx}>
                        <i className="fa-solid fa-box"></i> {pack}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Groups (Suitable For, Specifications, Requirements) */}
              {product.groups && product.groups.map((group, idx) => (
                <div className="product-group-block" key={idx}>
                  <h3>{group.heading}</h3>
                  <ul className={group.heading === 'Suitable For' ? 'check-list two-column' : 'check-list'}>
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <i className="fa-solid fa-check"></i>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Primary Action Buttons */}
              <div className="product-cta-actions">
                <Link
                  to={`/contact?subject=Product Inquiry: ${encodeURIComponent(product.title)}`}
                  className="btn btn-primary btn-lg"
                >
                  <i className="fa-solid fa-envelope"></i> Request a Quote / Inquiry
                </Link>
                <a
                  href="https://wa.me/919945636964"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-direct"
                >
                  <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Varieties Showcase Grid (if multiple varieties exist) */}
      {product.categoryImages && product.categoryImages.length > 0 && (
        <section className="section-padding bg-light varieties-showcase-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-subtitle">AVAILABLE VARIETIES</span>
              <h2>Explore Our {product.shortTitle || product.title} Range</h2>
              <p>We supply diverse varieties tailored to commercial kitchen, retail, and wholesale specifications.</p>
            </div>

            <div className="varieties-card-grid">
              {product.categoryImages.map((variety, idx) => (
                <div className="variety-card" key={idx}>
                  <div className="variety-card-img">
                    <img src={variety.src} alt={variety.name} loading="lazy" />
                    {variety.type && <span className="variety-type-tag">{variety.type}</span>}
                  </div>
                  <div className="variety-card-content">
                    <h4>{variety.name}</h4>
                    <p>Sourced from certified processing facilities with custom grading and packaging options.</p>
                    <button
                      type="button"
                      className="btn-link-preview"
                      onClick={() => {
                        setActiveImage(variety.src);
                        setActiveImageLabel(variety.name);
                        window.scrollTo({ top: 250, behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-magnifying-glass-plus"></i> Preview Above
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust & Certification Strip */}
      <section className="product-cert-strip">
        <div className="container">
          <div className="cert-strip-content">
            <div className="cert-text">
              <h3>Certified Quality &amp; International Standards</h3>
              <p>All export consignments meet stringent food safety and statutory export regulations.</p>
            </div>
            <div className="cert-badges-row">
              <div className="cert-badge-item">
                <img src="/fssai.png" alt="FSSAI Certified" />
                <span>FSSAI Certified</span>
              </div>
              <div className="cert-badge-item">
                <img src="/apeda.png" alt="APEDA Registered" />
                <span>APEDA Registered</span>
              </div>
              <div className="cert-badge-item">
                <img src="/ISO22000.png" alt="ISO 22000" />
                <span>ISO 22000</span>
              </div>
              <div className="cert-badge-item">
                <img src="/HACCP.png" alt="HACCP Certified" />
                <span>HACCP Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Products Section */}
      <section className="section-padding other-products-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">EXPLORE MORE CATEGORIES</span>
            <h2>Other Food Products from ZA GLOBAL EXPORTS</h2>
            <p>Browse our complementary export portfolio of agricultural and food commodities.</p>
          </div>

          <div className="products-grid other-products-grid">
            {otherProducts.slice(0, 3).map((item) => (
              <article className="product-card" key={item.id}>
                <div className="product-img">
                  <img src={item.cardImage || item.mainImage} alt={item.title} />
                </div>
                <div className="product-content">
                  <span className="section-subtitle">{item.subtitle}</span>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <Link to={`/products/${item.id}`} className="btn btn-primary btn-sm product-action">
                    View Product <i className="fa-solid fa-arrow-right"></i>
                  </Link>
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

      {/* Simple CTA Section */}
      <section className="simple-cta">
        <div className="container">
          <h2>Ready to Discuss Sourcing for {product.title}?</h2>
          <p>
            Share your quantity, grade, packaging and destination requirements with our export specialists.
          </p>
          <Link to={`/contact?subject=Product Inquiry: ${encodeURIComponent(product.title)}`} className="btn btn-white">
            Send Your Requirement
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ProductDetailPage;
