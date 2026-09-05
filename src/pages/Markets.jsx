const markets = [
  {
    country: 'Saudi Arabia',
    buyers: 'Catering & Hospitality | Restaurant Chains | Foodservice | Distributors | Wholesalers | Retailers | Institutional Buyers',
    image: '/images/markets/ci1.jpg',
  },
  {
    country: 'United Arab Emirates',
    buyers: 'Catering & Hospitality | Restaurant Chains | Foodservice | Distributors | Wholesalers | Retailers | Institutional Buyers',
    image: '/images/markets/ci2.jpg',
  },
  {
    country: 'Qatar',
    buyers: 'Catering & Hospitality | Restaurant Chains | Foodservice | Distributors | Wholesalers | Retailers | Institutional Buyers',
    image: '/images/markets/ci3.jpg',
  },
  {
    country: 'Kuwait',
    buyers: 'Foodservice | Catering | Distribution | Wholesale',
    image: '/images/markets/ci4.jpg',
  },
  {
    country: 'Oman',
    buyers: 'Food Distribution | Catering | Wholesale | Foodservice',
    image: '/images/markets/ci5.jpg',
  },
  {
    country: 'Bahrain',
    buyers: 'Foodservice | Distribution | Wholesale | Hospitality',
    image: '/images/markets/ci6.jpg',
  },
  {
    country: 'Europe',
    buyers: 'Import Distribution | Retail | Foodservice | Wholesale | Institutional Buyers',
    image: '/images/markets/ci7.jpg',
  },
  {
    country: 'Africa',
    buyers: 'Wholesale | Distribution | Retail | Foodservice | Institutional Supply',
    image: '/images/markets/ci8.jpg',
  },
  {
    country: 'America',
    buyers: 'Import Distribution | Retail | Foodservice | Wholesale',
    image: '/images/markets/ci9.jpg',
  },
];

function Markets() {
  return (
    <>
      <section className="page-header-market">
        <div className="container">
          <h1>Export Markets</h1>
          <p>Connecting Reliable Indian Supply With Growing Global Food Demand.</p>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">OUR TARGET MARKETS</span>
            <h2>Global Food Supply Focus</h2>
            <p>We support professional buyers across the Middle East and key global markets with sourcing, documentation and export coordination.</p>
          </div>

          <div className="card-grid-3">
            {markets.map((market) => (
              <div className="info-card market-card" key={market.country}>
                <div className="market-card-image">
                  <img src={market.image} alt={market.country} loading="lazy" />
                  <div className="market-card-overlay" />
                </div>
                <div className="market-card-body">
                  <h3>
                    <i className="fa-solid fa-location-dot gold-accent"></i>
                    {market.country}
                  </h3>
                  <p>{market.buyers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="about-card markets-approach">
            <h3>Our Approach</h3>
            <p>We focus on understanding destination-market requirements, including product specifications, packaging, documentation, shipment requirements and customer expectations.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Markets;