import { Link } from 'react-router-dom';

function Hero({ settings }) {
  const badge = settings?.hero_badge || 'ZA GLOBAL EXPORTS';
  const title = settings?.hero_title || 'From Indian farms to the global market';
  const description = settings?.hero_description || 'Reliable food supply for professional buyers. We connect Indian food products with distributors, catering companies, foodservice operators, wholesalers and institutional customers across global markets.';
  const bgImage = settings?.hero_bg_image || '/banner-image.png';
  const primaryText = settings?.hero_primary_btn_text || 'View Products';
  const primaryLink = settings?.hero_primary_btn_link || '/products';
  const secondaryText = settings?.hero_secondary_btn_text || 'Request a Quote';
  const secondaryLink = settings?.hero_secondary_btn_link || '/contact';

  const heroStyle = {
    backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0) 100%), url('${bgImage}')`
  };

  return (
    <section className="hero" style={heroStyle}>
      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">{badge}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="hero-buttons">
            <Link to={primaryLink} className="btn btn-primary">{primaryText}</Link>
            <Link to={secondaryLink} className="btn btn-outline">{secondaryText}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
