import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const markets = [
  { name: 'Saudi Arabia', locations: 'Middle East market', image: '/images/markets/ci1.jpg' },
  { name: 'United Arab Emirates', locations: 'Middle East market', image: '/images/markets/ci2.jpg' },
  { name: 'Qatar', locations: 'Middle East market', image: '/images/markets/ci3.jpg' },
  { name: 'Kuwait', locations: 'Middle East market', image: '/images/markets/ci4.jpg' },
  { name: 'Oman', locations: 'Middle East market', image: '/images/markets/ci5.jpg' },
  { name: 'Bahrain', locations: 'Middle East market', image: '/images/markets/ci6.jpg' },
  { name: 'Europe', locations: 'UK | Germany | France | More', image: '/images/markets/ci7.jpg' },
  { name: 'Africa', locations: 'Nigeria | South Africa | Kenya | More', image: '/images/markets/ci8.jpg' },
  { name: 'America', locations: 'USA | Canada | Brazil | More', image: '/images/markets/ci9.jpg' },
];

const buyerTypes = [
  ['fa-utensils', 'Catering', 'Hospitality'], ['fa-store', 'Restaurant', 'Chains'], ['fa-box-open', 'Foodservice', ''],
  ['fa-truck', 'Distributors', ''], ['fa-warehouse', 'Wholesalers', ''], ['fa-shop', 'Retailers', ''], ['fa-building', 'Institutional', 'Buyers'],
];

function Markets() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [slideOffset, setSlideOffset] = useState(0);
  const carouselTrackRef = useRef(null);

  useEffect(() => {
    const updateVisibleCards = () => setVisibleCards(window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3);
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  useEffect(() => {
    setActiveSlide((slide) => Math.min(slide, markets.length - visibleCards));
  }, [visibleCards]);

  useEffect(() => {
    const track = carouselTrackRef.current;
    const card = track?.firstElementChild;
    if (!track || !card) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
    setSlideOffset(activeSlide * (card.offsetWidth + gap));
  }, [activeSlide, visibleCards]);

  const lastSlide = markets.length - visibleCards;
  const goToPrevious = () => setActiveSlide((slide) => (slide === 0 ? lastSlide : slide - 1));
  const goToNext = () => setActiveSlide((slide) => (slide === lastSlide ? 0 : slide + 1));

  return (
    <main className="markets-page">
      <section className="markets-hero">
        <div className="markets-wrap markets-hero-content"><div className="markets-copy">
          <p className="markets-eyebrow">GLOBAL FOOD SUPPLY</p><h1>Export Markets</h1><h2>Connecting Reliable Indian Supply With Growing Global Food Demand.</h2>
          <p className="markets-intro">We connect international buyers with high-quality food products from trusted Indian farmers, ensuring reliability, consistency, and on-time delivery.</p>
          <div className="markets-benefits"><span><i className="fa-solid fa-leaf" />High Quality<br />Products</span><span><i className="fa-solid fa-truck-fast" />Reliable<br />Logistics</span><span><i className="fa-solid fa-handshake" />Long-Term<br />Partnerships</span></div>
        </div></div><div className="markets-table" aria-hidden="true" />
      </section>
      <section className="buyer-strip" aria-label="Buyer types we serve"><div className="markets-wrap buyer-strip-grid">
        {buyerTypes.map(([icon, title, subtitle]) => <div className="buyer-type" key={title}><i className={`fa-solid ${icon}`} /><span>{title}<small>{subtitle}</small></span></div>)}
      </div></section>
      <section className="global-reach-section"><div className="markets-wrap">
        <header className="global-reach-heading"><p className="markets-eyebrow">OUR TARGET MARKETS</p><h2>Global Food Supply Focus</h2><p>We support professional buyers across the Middle East and key global markets with sourcing, documentation and export coordination.</p></header>
        <div className="market-carousel" aria-label="Countries and regions we serve">
          <button className="market-carousel-button previous" type="button" onClick={goToPrevious} aria-label="Show previous markets"><i className="fa-solid fa-chevron-left" /></button>
          <div className="market-carousel-viewport">
            <div className="market-carousel-track" ref={carouselTrackRef} style={{ transform: `translateX(-${slideOffset}px)` }}>
              {markets.map((market) => <article className="reach-market-card" key={market.name}><img src={market.image} alt={`${market.name} market`} /><div className="reach-market-card-body"><h3>{market.name}</h3><p><i className="fa-solid fa-location-dot" />{market.locations}</p></div></article>)}
            </div>
          </div>
          <button className="market-carousel-button next" type="button" onClick={goToNext} aria-label="Show next markets"><i className="fa-solid fa-chevron-right" /></button>
        </div>
      </div></section>
      <section className="markets-cta"><div className="markets-wrap markets-cta-content"><div><i className="fa-solid fa-globe" /><span><strong>Let&apos;s Grow Your Business Together</strong><small>Partner with us for reliable sourcing, quality products and seamless supply solutions.</small></span></div><Link className="markets-cta-button" to="/contact">Contact Us Today <i className="fa-solid fa-arrow-right" /></Link></div></section>
      <section className="section-padding">
        <div className="markets-wrap">
          <div className="about-card markets-approach">
            <h3>Our Approach</h3>
            <p>We focus on understanding destination-market requirements, including product specifications, packaging, documentation, shipment requirements and customer expectations.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Markets;
