const capabilities = [
  {
    icon: 'fa-solid fa-boxes-stacked',
    title: 'Bulk Food Supply',
    description: 'Products supplied according to agreed specifications and quantities.',
  },
  {
    icon: 'fa-solid fa-building-user',
    title: 'Institutional Supply',
    description: 'Solutions suitable for catering companies, foodservice operators and large-volume customers.',
  },
  {
    icon: 'fa-solid fa-calendar-days',
    title: 'Regular Supply Programs',
    description: 'Support for customers requiring recurring or scheduled supply programs.',
  },
  {
    icon: 'fa-solid fa-box-open',
    title: 'Customized Packaging',
    description: 'Packaging options based on product, market and customer requirements.',
  },
  {
    icon: 'fa-solid fa-file-signature',
    title: 'Contract Supply',
    description: 'Long-term supply arrangements can be developed for suitable products and customers.',
  },
  {
    icon: 'fa-solid fa-tags',
    title: 'Private Label Opportunities',
    description: 'Customized packing solutions can be explored subject to product availability, MOQ and commercial requirements.',
  },
];

function FoodserviceCapabilities() {
  return (
    <section className="section-padding bg-light">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">FOOD SUPPLY FOR CATERING &amp; FOODSERVICE</span>
          <h2>Built Around the Needs of Professional Food Buyers</h2>
          <p>Catering and foodservice businesses need consistent product quality, dependable availability, suitable packaging, accurate documentation and reliable delivery.</p>
        </div>
        <div className="card-grid-3">
          {capabilities.map((item) => (
            <div className="info-card" key={item.title}>
              <div className="icon-box"><i className={item.icon}></i></div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FoodserviceCapabilities;
