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
      {/* Main Contact Section - Using the CTA component which already has the form and details */}
      <CTA />
    </>
  );
}

export default Contact;
