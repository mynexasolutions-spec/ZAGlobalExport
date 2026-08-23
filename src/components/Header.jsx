import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const productLinks = [
  { to: '/products#rice', label: 'Rice' },
  { to: '/products#pulses-legumes', label: 'Pulses & Legumes' },
  { to: '/products#fresh-produce', label: 'Bananas & Fresh Produce' },
  { to: '/products#spices', label: 'Spices' },
  { to: '/products#edible-oils', label: 'Edible Oils' },
  { to: '/products#other-food-products', label: 'Other Food Products' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((isOpen) => {
      if (isOpen) {
        setIsProductsOpen(false);
      }
      return !isOpen;
    });
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };

  const handleProductsClick = (event) => {
    if (!isMenuOpen) {
      closeMenu();
      return;
    }

    event.preventDefault();
    setIsProductsOpen((isOpen) => !isOpen);
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/ZA-logo.png" alt="ZA GLOBAL EXPORTS" />
          <span className="logo-tagline">From India&rsquo;s farms to the global food market</span>
        </Link>
        
        <div className="menu-toggle" onClick={toggleMenu}>
          <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </div>

        <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
            <li className={`nav-dropdown ${isProductsOpen ? 'open' : ''}`}>
              <NavLink to="/products" onClick={handleProductsClick}>
                Products <i className="fa-solid fa-chevron-down nav-icon"></i>
              </NavLink>
              <ul className="dropdown-menu">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={closeMenu}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
            <li><NavLink to="/quality-food-safety" onClick={closeMenu}>Quality &amp; Food Safety</NavLink></li>
            <li><NavLink to="/markets" onClick={closeMenu}>Markets</NavLink></li>
            <li><NavLink to="/export-logistics" onClick={closeMenu}>Export &amp; Logistics</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu}>About Us</NavLink></li>
            <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
            <li className="mobile-only">
              <Link to="/contact" className="btn btn-primary" onClick={closeMenu} style={{ display: 'inline-block', marginTop: '10px' }}>
                Request a Quote
              </Link>
            </li>
          </ul>
        </nav>
        
        <Link to="/contact" className="btn btn-primary desktop-only" onClick={closeMenu}>Request a Quote</Link>
      </div>
    </header>
  );
}

export default Header;
