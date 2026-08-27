function Partners({ settings }) {
  const subtitle = settings?.partners_subtitle || 'OUR PARTNERS';
  const title = settings?.partners_title || 'Trusted by Global Leaders';
  const partnersList = settings?.partners_list || [
    { name: 'MAERSK', icon: 'fa-brands fa-dhl', color: '#d40511', logo_url: null },
    { name: 'msc', icon: 'fa-brands fa-fedex', color: '#4d148c', logo_url: null },
    { name: 'CMA CGM', icon: 'fa-brands fa-ups', color: '#ffb500', logo_url: null },
    { name: 'APL', icon: 'fa-brands fa-amazon', color: '#ff9900', logo_url: null },
    { name: 'EVERGREEN', icon: 'fa-brands fa-ebay', color: '#e53238', logo_url: null },
    { name: 'Hapag-Lloyd', icon: 'fa-brands fa-fedex', color: '#ff6600', logo_url: null },
  ];

  return (
    <section className="partners section-padding">
      <div className="container text-center">
        <span className="section-subtitle">{subtitle}</span>
        <h2>{title}</h2>
        <div className="partners-logos">
          {partnersList.map((partner, index) => (
            <div className="partner" key={index}>
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  style={{ maxHeight: '38px', maxWidth: '160px', objectFit: 'contain' }}
                />
              ) : (
                <>
                  {partner.icon && <i className={partner.icon} style={{ color: partner.color }}></i>}
                  <span>{partner.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
