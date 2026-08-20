function About() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>About Us</h1>
          <p>Connecting Indian food products to global markets.</p>
        </div>
      </section>

      {/* Company Info */}
      <section className="about-info section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">WHO WE ARE</span>
            <h2>ZA GLOBAL EXPORTS</h2>
            <p>ZA GLOBAL EXPORTS is an India-based food export company focused on sourcing and supplying quality agricultural and food products to professional buyers across international markets.</p>
          </div>

          <div className="about-grid">
            
            <div className="about-card">
              <h3>About ZA GLOBAL EXPORTS</h3>
              
              <ul className="about-list">
                <li className="about-list-item">
                  <strong>Business Focus</strong>
                  <span>Indian food and agricultural exports</span>
                </li>
                <li className="about-list-item">
                  <strong>Core Products</strong>
                  <span>Rice, pulses, fresh produce and other food products</span>
                </li>
                <li className="about-list-item">
                  <strong>Customers</strong>
                  <span>Distributors, catering companies, wholesalers, retailers and institutional buyers</span>
                </li>
                <li className="about-list-item">
                  <strong>Markets</strong>
                  <span>Middle East and global food markets</span>
                </li>
                <li className="about-list-item">
                  <strong>Approach</strong>
                  <span>Reliable sourcing, clear communication and professional export support</span>
                </li>
              </ul>
            </div>

            <div className="about-card">
              <h3>Vision & Mission</h3>
              
              <ul className="about-list">
                <li className="about-list-item">
                  <strong>Vision</strong>
                  <span>To become a trusted international food supply partner connecting India's quality agricultural and food products with customers across the Middle East and global markets.</span>
                </li>
                <li className="about-list-item">
                  <strong>Mission</strong>
                  <span>To source and supply quality food products responsibly, efficiently and competitively while building long-term relationships with customers, suppliers and business partners.</span>
                </li>
              </ul>
            </div>

            <div className="about-card">
              <h3>What We Stand For</h3>
              
              <ul className="about-list">
                <li className="about-list-item">
                  <strong>Integrity</strong>
                  <span>Honesty, transparency and professionalism in every discussion.</span>
                </li>
                <li className="about-list-item">
                  <strong>Quality</strong>
                  <span>Commitment to agreed product and service requirements.</span>
                </li>
                <li className="about-list-item">
                  <strong>Reliability</strong>
                  <span>Dependable coordination for professional food buyers.</span>
                </li>
              </ul>
            </div>

            <div className="about-card">
              <h3>Partnership Focus</h3>
              
              <ul className="about-list">
                <li className="about-list-item">
                  <strong>Customer Focus</strong>
                  <span>Solutions developed around buyer specifications, packaging, quantity and destination needs.</span>
                </li>
                <li className="about-list-item">
                  <strong>Improvement</strong>
                  <span>Continuous effort to improve sourcing, service and supply efficiency.</span>
                </li>
                <li className="about-list-item">
                  <strong>Long-Term Partnership</strong>
                  <span>Relationships built on trust, performance and mutual growth.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section className="section-padding bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">WHO WE SERVE</span>
            <h2>Built for Professional Food Buyers</h2>
            <p>We support buyers who need dependable food supply, consistent specifications and competitive commercial terms.</p>
          </div>
          <div className="card-grid-3">
            <div className="info-card">
              <h3>Distributors &amp; Wholesalers</h3>
              <p>Support for regular supply requirements, bulk quantities, product specifications, packaging options and long-term supply arrangements.</p>
            </div>
            <div className="info-card">
              <h3>Catering Companies</h3>
              <p>Food products suitable for central kitchens, large-scale catering operations, hospitality, institutional foodservice and restaurant groups.</p>
            </div>
            <div className="info-card">
              <h3>Food Manufacturers</h3>
              <p>Sourcing solutions for suitable raw materials and food ingredients based on specification, quantity, quality parameters and destination.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
