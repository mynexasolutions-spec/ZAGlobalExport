const features = [
  {
    icon: 'fa-solid fa-network-wired',
    title: 'Reliable Sourcing',
    description: 'We develop relationships with reliable producers, processors and suppliers to support consistent product availability.',
  },
  {
    icon: 'fa-solid fa-certificate',
    title: 'Quality Focus',
    description: 'Product specifications, quality requirements, packaging and documentation are considered throughout the sourcing and export process.',
  },
  {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Competitive Sourcing',
    description: 'Our sourcing approach focuses on commercially competitive solutions without compromising agreed product requirements.',
  },
  {
    icon: 'fa-solid fa-truck-fast',
    title: 'Customer Focused',
    description: "We work around each buyer's specifications, packaging, quantity and destination requirements.",
  },
  {
    icon: 'fa-solid fa-file-export',
    title: 'Export Support',
    description: 'We coordinate required export documentation, shipment arrangements and logistics activities through appropriate partners.',
  },
  {
    icon: 'fa-solid fa-handshake',
    title: 'Long-Term Partnerships',
    description: 'We aim to establish dependable long-term relationships with customers and suppliers.',
  },
];

function WhyChooseUs() {
  return (
    <section className="why-us section-padding">
      <div className="container">
        <div className="why-us-grid">
          <div className="why-us-content">
            <span className="section-subtitle text-left">WHY CHOOSE US</span>
            <h2>Your Reliable Sourcing Partner from India</h2>
            <p className="why-us-desc">We support professional food buyers with structured sourcing, clear communication and dependable export coordination.</p>
            <div className="features-list">
              {features.map((feature, index) => (
                <div className="feature-box" key={index}>
                  <div className="icon-box"><i className={feature.icon}></i></div>
                  <div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-us-image">
            <img src="/why-choose-us.webp" alt="Food export coordination" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
