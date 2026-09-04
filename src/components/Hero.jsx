import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

function Hero({ settings }) {
  const badge = settings?.hero_badge || 'ZA GLOBAL EXPORTS';
  const title = settings?.hero_title || 'From Indian Farms to Global Market ( word Case)';
  const description = settings?.hero_description || 'Reliable food supply for professional buyers. We connect Indian food products with distributors, catering companies, foodservice operators, wholesalers and institutional customers across global markets.';
  const primaryText = settings?.hero_primary_btn_text || 'View Products';
  const primaryLink = settings?.hero_primary_btn_link || '/products';
  const secondaryText = settings?.hero_secondary_btn_text || 'Request a Quote';
  const secondaryLink = settings?.hero_secondary_btn_link || '/contact';

  // Accept either an array of images (hero_bg_images) or fall back to the
  // single hero_bg_image / default banner so existing settings keep working.
  const images =
    settings?.hero_bg_images && settings.hero_bg_images.length > 0
      ? settings.hero_bg_images
      : [settings?.hero_bg_image || '/banner-image.png'];

  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return undefined;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timerRef.current);
  }, [images.length]);

  const overlayGradient =
    'linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0) 100%)';

  return (
    <section className="hero">
      <div className="hero-bg-slider">
        {images.map((src, index) => (
          <div
            key={src + index}
            className={`hero-bg-slide${index === activeIndex ? ' is-active' : ''}`}
            style={{
              backgroundImage: `${overlayGradient}, url('${src}')`
            }}
          />
        ))}
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <span className="badge">{badge}</span>
          <h1 style={{ fontSize: '4rem' }}>{title}</h1>
          <p>{description}</p>
          <div className="hero-buttons">
            <Link to={primaryLink} className="btn btn-primary">{primaryText}</Link>
            <Link to={secondaryLink} className="btn btn-outline">{secondaryText}</Link>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="hero-bg-dots">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show background image ${index + 1}`}
              className={`hero-bg-dot${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}

      <style>{`
        .hero {
          position: relative;
          overflow: hidden;
        }

        .hero-bg-slider {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-bg-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
        }

        .hero-bg-slide.is-active {
          opacity: 1;
        }

        .hero-container {
          position: relative;
          z-index: 1;
        }

        .hero-bg-dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 2;
        }

        .hero-bg-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.25);
          cursor: pointer;
          padding: 0;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .hero-bg-dot.is-active {
          background: rgba(0, 0, 0, 0.75);
          transform: scale(1.2);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg-slide {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;