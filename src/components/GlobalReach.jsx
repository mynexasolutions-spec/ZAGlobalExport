function GlobalReach({ settings }) {
  const subtitle = settings?.reach_subtitle || 'GLOBAL REACH';
  const title = settings?.reach_title || 'From India To<br /><span className="text-primary">The Global Food Market</span>';
  const description = settings?.reach_description || 'ZA GLOBAL EXPORTS connects reliable Indian food sources with professional buyers across Saudi Arabia, the United Arab Emirates, Qatar, Kuwait, Oman, Bahrain and other international markets.';
  const image = settings?.reach_image || '/global-reach.webp';
  const badgeIcon = settings?.reach_badge_icon || 'fa-solid fa-earth-asia';
  const badgeText = settings?.reach_badge_text || 'Global Supply';
  const points = settings?.reach_points || [
    'India-based food sourcing network',
    'Focusing international buyers and their requirements',
    'Export documentation and logistics support'
  ];

  return (
    <section className="global-reach section-padding">
      <div className="container">
        <div className="reach-grid">
          <div className="reach-image">
            <img src={image} alt="International food export logistics" />
            <div className="reach-badge">
              <i className={badgeIcon}></i>
              <span>{badgeText}</span>
            </div>
          </div>
          <div className="reach-content">
            <span className="section-subtitle">{subtitle}</span>
            <h2 dangerouslySetInnerHTML={{ __html: title }}></h2>
            <p>{description}</p>
            <ul className="reach-features">
              {points.map((point, index) => (
                <li key={index}>
                  <i className="fa-solid fa-check-circle text-primary"></i> {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlobalReach;
