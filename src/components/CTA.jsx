import { useState } from 'react';
import { submitQuery } from '../services/queriesService';

function CTA() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.target);
    const company = formData.get('company') || '';
    const contactPerson = formData.get('contactPerson') || '';
    const country = formData.get('country') || '';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const product = formData.get('product') || '';
    const specification = formData.get('specification') || '';
    const quantity = formData.get('quantity') || '';
    const packaging = formData.get('packaging') || '';
    const destinationCountry = formData.get('destinationCountry') || '';
    const destinationPort = formData.get('destinationPort') || '';
    const deliveryDate = formData.get('deliveryDate') || '';
    const requirements = formData.get('requirements') || '';

    const messageDetails = `Product: ${product}\nSpecification: ${specification}\nQuantity: ${quantity}\nPackaging: ${packaging}\nDestination: ${destinationCountry}, Port: ${destinationPort}\nRequired Date: ${deliveryDate}\nAdditional Notes: ${requirements}`;

    try {
      // Save to Supabase queries table
      await submitQuery({
        name: contactPerson,
        email,
        phone,
        company: `${company} (${country})`,
        subject: `Quote Request: ${product || 'Commodity Sourcing'}`,
        message: messageDetails,
      });

      setSubmittedSuccess(true);
    } catch (err) {
      console.warn('Error saving inquiry:', err);
    } finally {
      setSubmitting(false);
    }

    // Open WhatsApp with pre-filled message
    const text = `Hello ZA GLOBAL EXPORTS, I would like to discuss a food product requirement.%0A%0A*Company:* ${company}%0A*Contact Person:* ${contactPerson}%0A*Country:* ${country}%0A*Phone / WhatsApp:* ${phone}%0A*Email:* ${email}%0A*Product Required:* ${product}%0A*Specification:* ${specification}%0A*Quantity:* ${quantity}%0A*Packaging:* ${packaging}%0A*Destination Country:* ${destinationCountry}%0A*Destination Port:* ${destinationPort}%0A*Required Delivery Date:* ${deliveryDate}%0A*Additional Requirements:* ${requirements}`;
    window.open(`https://wa.me/919945636964?text=${text}`, '_blank');
  };

  return (
    <section className="cta section-padding">
      <div className="container">
        <div className="cta-wrapper">
          <div className="cta-info">
            <h2>Let's Discuss Your Requirement</h2>
            <p>Looking for reliable food products from India? Send your requirements and our team will review suitable sourcing and commercial options.</p>
            
            <div className="cta-contact-details">
              <div className="contact-item">
                <i className="fa-solid fa-phone"></i>
                <a href="tel:+919945636964">+91 9945636964</a>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:info@zaglobalimpex.com">info@zaglobalimpex.com</a>
              </div>
            </div>
          </div>
          
          <div className="cta-form-container">
            <h3>Request a quote</h3>
            {submittedSuccess && (
              <div className="admin-toast success" style={{ position: 'static', marginBottom: '16px' }}>
                <i className="fa-solid fa-circle-check"></i>
                <span>Your requirement has been sent and recorded with our export team.</span>
              </div>
            )}
            <form className="cta-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <input type="text" name="company" placeholder="Company Name" required />
                </div>
                <div className="form-group">
                  <input type="text" name="contactPerson" placeholder="Contact Person" required />
                </div>
                <div className="form-group">
                  <input type="text" name="country" placeholder="Country" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Email Address" required />
                </div>
                <div className="form-group">
                  <input type="tel" name="phone" placeholder="Phone / WhatsApp" required />
                </div>
                <div className="form-group">
                  <input type="text" name="product" placeholder="Product Required" required />
                </div>
                <div className="form-group">
                  <input type="text" name="specification" placeholder="Product Specification" />
                </div>
                <div className="form-group">
                  <input type="text" name="quantity" placeholder="Required Quantity" required />
                </div>
                <div className="form-group">
                  <input type="text" name="packaging" placeholder="Packaging Requirement" />
                </div>
                <div className="form-group">
                  <input type="text" name="destinationCountry" placeholder="Destination Country" required />
                </div>
                <div className="form-group">
                  <input type="text" name="destinationPort" placeholder="Destination Port" />
                </div>
                <div className="form-group">
                  <input type="text" name="deliveryDate" placeholder="Required Delivery Date" />
                </div>
              </div>
              <div className="form-group">
                <textarea name="requirements" placeholder="Additional Requirements" rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Processing Requirement...
                  </>
                ) : (
                  <>
                    <i className="fa-brands fa-whatsapp"></i> Send Requirement
                  </>
                )}
              </button>
            </form>
            <p className="business-markets">Business enquiries: India | Saudi Arabia | UAE | Qatar | Kuwait | Oman | Bahrain | Europe | Africa | Other Countries</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
