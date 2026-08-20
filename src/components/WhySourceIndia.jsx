const reasons = [
  {
    icon: 'fa-solid fa-wheat-awn',
    title: 'Diverse Product Base',
    description: 'From rice and pulses to spices, grains and fresh produce, India offers a broad range of food products.',
  },
  {
    icon: 'fa-solid fa-seedling',
    title: 'Strong Agricultural Sector',
    description: 'India has an extensive agricultural production base supporting a wide range of food commodities.',
  },
  {
    icon: 'fa-solid fa-hand-holding-dollar',
    title: 'Competitive Sourcing',
    description: 'A broad supplier ecosystem creates opportunities for competitive sourcing across product categories.',
  },
  {
    icon: 'fa-solid fa-ship',
    title: 'Export Experience',
    description: 'India has an established food export industry serving customers across international markets.',
  },
  {
    icon: 'fa-solid fa-sliders',
    title: 'Flexible Supply Options',
    description: 'Products can be sourced according to different specifications, volumes and packaging requirements, subject to availability.',
  },
];

function WhySourceIndia() {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">WHY SOURCE FROM INDIA?</span>
          <h2>India - A Diverse Food Sourcing Destination</h2>
          <p>India offers international buyers access to a large and diverse agricultural and food-processing ecosystem.</p>
        </div>
        <div className="card-grid-3">
          {reasons.map((item) => (
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

export default WhySourceIndia;
