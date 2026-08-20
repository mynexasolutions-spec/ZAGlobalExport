import CTA from '../components/CTA';

function Contact() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>LET'S BUILD A LONG-TERM PARTNERSHIP</h1>
          <p>Send your food product requirement to our export team.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="about-card markets-approach">
            <h3>ZA GLOBAL EXPORTS</h3>
            <ul className="about-list">
              <li className="about-list-item">
                <strong>Location</strong>
                <span>India</span>
              </li>
              <li className="about-list-item">
                <strong>Website</strong>
                <span>www.zaglobalexports.com</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Main Contact Section - Using the CTA component which already has the form and details */}
      <CTA />
    </>
  );
}

export default Contact;
