const stats = [
  { icon: 'fa-solid fa-bowl-rice', value: 'Rice', label: 'Core Product Pillar' },
  { icon: 'fa-solid fa-seedling', value: 'Pulses', label: 'Essential Food Category' },
  { icon: 'fa-solid fa-apple-whole', value: 'Produce', label: 'Fresh Supply Focus' },
  { icon: 'fa-solid fa-ship', value: 'Export', label: 'Documentation Support' },
];

function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-wrapper">
          {stats.map((stat, index) => (
            <div key={index} style={{ display: 'contents' }}>
              <div className="stat-item">
                <div className="stat-icon"><i className={stat.icon}></i></div>
                <div className="stat-text">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
              {index < stats.length - 1 && <div className="stat-divider"></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
