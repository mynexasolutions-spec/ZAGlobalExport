import { Link } from 'react-router-dom';

const products = [];

function Products() {
  return (
    <section className="products section-padding bg-light">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">OUR PRODUCTS</span>
          <h2>Quality Products. Reliable Sourcing.</h2>
          <p>Our initial portfolio focuses on essential food commodities and agricultural products sourced from India.</p>
        </div>
        <div className="products-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="product-img">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-content">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <Link to={product.to} className="btn btn-primary btn-sm">
                    <i className="fa-solid fa-arrow-right"></i> {product.action}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
