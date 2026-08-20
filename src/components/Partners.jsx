const partners = [
  { icon: 'fa-brands fa-dhl', color: '#d40511', name: 'MAERSK' },
  { icon: 'fa-brands fa-fedex', color: '#4d148c', name: 'msc' },
  { icon: 'fa-brands fa-ups', color: '#ffb500', name: 'CMA CGM' },
  { icon: 'fa-brands fa-amazon', color: '#ff9900', name: 'APL' },
  { icon: 'fa-brands fa-ebay', color: '#e53238', name: 'EVERGREEN' },
  { icon: 'fa-brands fa-fedex', color: '#ff6600', name: 'Hapag-Lloyd' },
];

function Partners() {
  return (
    <section className="partners section-padding">
      <div className="container text-center">
        <span className="section-subtitle">OUR PARTNERS</span>
        <h2>Trusted by Global Leaders</h2>
        <div className="partners-logos">
          {partners.map((partner, index) => (
            <div className="partner" key={index}>
              <i className={partner.icon} style={{ color: partner.color }}></i> {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
