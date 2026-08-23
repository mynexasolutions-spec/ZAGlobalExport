const markets = [
  {
    country: 'Saudi Arabia',
    buyers: 'Catering | Foodservice | Distribution | Wholesale | Institutional Buyers',
  },
  {
    country: 'United Arab Emirates',
    buyers: 'Distribution | Foodservice | Hospitality | Wholesale | Retail',
  },
  {
    country: 'Qatar',
    buyers: 'Catering | Hospitality | Food Distribution | Institutional Supply',
  },
  {
    country: 'Kuwait',
    buyers: 'Foodservice | Catering | Distribution | Wholesale',
  },
  {
    country: 'Oman',
    buyers: 'Food Distribution | Catering | Wholesale | Foodservice',
  },
  {
    country: 'Bahrain',
    buyers: 'Foodservice | Distribution | Wholesale | Hospitality',
  },
  {
    country: 'Europe',
    buyers: 'Import Distribution | Retail | Foodservice | Wholesale | Institutional Buyers',
  },
  {
    country: 'Africa',
    buyers: 'Wholesale | Distribution | Retail | Foodservice | Institutional Supply',
  },
  {
    country: 'America',
    buyers: 'Import Distribution | Retail | Foodservice | Wholesale',
  },
];

function Markets() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Export Markets</h1>
          <p>Connecting reliable Indian supply with growing global food demand.</p>
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
                <i className="fa-solid fa-location-dot gold-accent"></i>
                <h3>{market.country}</h3>
                <p>{market.buyers}</p>
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
