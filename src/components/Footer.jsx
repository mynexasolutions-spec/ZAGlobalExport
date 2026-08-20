import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col about-col">
            <Link to="/" className="logo footer-logo">
              <img src="/ZA-logo.png" alt="ZA GLOBAL EXPORTS" />
            </Link>
            <p>From India's Farms to the Global Food Market. Quality Food Products | Reliable Supply | Global Partnerships.</p>
            <div className="social-links">
              {/* Placeholder social links until official ZA GLOBAL EXPORTS URLs are provided. */}
              <a href="#" aria-label="LinkedIn placeholder"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" aria-label="Instagram placeholder"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="Facebook placeholder"><i className="fa-brands fa-facebook-f"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/quality-food-safety">Quality &amp; Food Safety</Link></li>
              <li><Link to="/markets">Markets</Link></li>
              <li><Link to="/export-logistics">Export &amp; Logistics</Link></li>
              <li><Link to="/contact">Request a Quote</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><Link to="/products#rice">Rice</Link></li>
              <li><Link to="/products#pulses-legumes">Pulses &amp; Legumes</Link></li>
              <li><Link to="/products#fresh-produce">Bananas &amp; Fresh Produce</Link></li>
              <li><Link to="/products#other-food-products">Other Food Products</Link></li>
            </ul>
          </div>
          <div className="footer-col contact-col">
            <h4>Contact Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <a href="tel:+919945636964">
                  <i className="fa-solid fa-phone"></i> +91 9945636964
                </a>
              </li>
              <li>
                <a href="mailto:sales@zaglobalexports.com">
                  <i className="fa-solid fa-envelope"></i> sales@zaglobalexports.com
                </a>
              </li>
              <li>
                <a href="mailto:exports@zaglobalexports.com">
                  <i className="fa-solid fa-envelope"></i> exports@zaglobalexports.com
                </a>
              </li>

            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ZA GLOBAL EXPORTS. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
