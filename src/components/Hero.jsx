import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">ZA GLOBAL EXPORTS</span>
          <h1>From India's Farms<br /><span className="text-primary">To The Middle East</span></h1>
          <p>Reliable food supply for professional buyers. We connect Indian food products with distributors, catering companies, foodservice operators, wholesalers and institutional customers across global markets.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">View Products</Link>
            <Link to="/contact" className="btn btn-outline">Request a Quote</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
