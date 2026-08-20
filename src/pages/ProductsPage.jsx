import { Link } from 'react-router-dom';

import grainsImg from '../../products/grains.webp';

const productsList = [
  {
    image: '/images/food-items.webp',
    title: 'Rice',
    description: 'Indian rice varieties suitable for retail, wholesale, catering, foodservice and institutional applications.',
    action: 'Request Rice Specifications',
  },
  {
    image: '/images/food-items2.webp',
    title: 'Basmati Rice',
    description: 'Basmati rice supply can be explored based on required grade, grain characteristics, packing and quantity.',
    action: 'Request Specifications',
  },
  {
    image: '/images/food-items.webp',
    title: 'Non-Basmati Rice',
    description: 'Non-basmati rice options can be sourced according to customer specifications and market requirements.',
    action: 'Send Requirement',
  },
  {
    image: grainsImg,
    title: 'Pulses & Legumes',
    description: 'Toor dal, moong dal, masoor dal, chana dal, chickpeas and other pulses can be sourced by grade and packing need.',
    action: 'Request Pulses Catalogue',
  },
  {
    image: '/images/hero-banner.webp',
    title: 'Bananas & Fresh Produce',
    description: 'Fresh produce programs can be discussed based on variety, size, grade, maturity, packaging, volume and destination.',
    action: 'Enquire About Fresh Produce',
  },
  {
    image: grainsImg,
    title: 'Grains',
    description: 'A broader grain portfolio can be developed around buyer requirements and market opportunities.',
    action: 'Send Requirement',
  },
  {
    image: '/images/food-items2.webp',
    title: 'Spices',
    description: 'Indian spices can be explored subject to product availability, specifications, packing and commercial requirements.',
    action: 'Discuss Requirements',
  },
  {
    image: '/images/food-items.webp',
    title: 'Other Food Products',
    description: 'Flour, oilseeds, processed food products and other food commodities can be reviewed based on your requirement.',
    action: 'Send Your Requirement',
  },
];

const detailSections = [
  {
    id: 'rice',
    subtitle: 'RICE',
    title: 'Rice',
    description: "India is one of the world's leading sources of rice, offering a wide range of varieties for different markets and applications. ZA GLOBAL EXPORTS can source and supply rice according to customer specifications, including variety, grade, grain characteristics, packaging and quantity.",
    groups: [
      {
        heading: 'Categories',
        items: ['Basmati Rice', 'Non-Basmati Rice', 'Parboiled Rice', 'Sella / Parboiled Basmati', 'Other varieties based on customer requirements'],
      },
      {
        heading: 'Suitable For',
        items: ['Catering Companies', 'Foodservice Operators', 'Restaurants', 'Wholesalers', 'Food Distributors', 'Retailers', 'Institutional Buyers'],
      },
    ],
  },
  {
    id: 'pulses-legumes',
    subtitle: 'PULSES & LEGUMES',
    title: 'Pulses & Legumes',
    description: 'Nutritious. Essential. Reliably Sourced. We source a range of Indian pulses and legumes suitable for wholesale, foodservice, catering and retail requirements.',
    groups: [
      {
        heading: 'Product Types',
        items: ['Toor Dal', 'Moong Dal', 'Masoor Dal', 'Chana Dal', 'Chickpeas', 'Other pulses and legumes'],
      },
    ],
  },
  {
    id: 'fresh-produce',
    subtitle: 'FRESH PRODUCE',
    title: 'Bananas & Fresh Produce',
    description: 'Fresh produce enquiries are handled around clear buyer requirements so sourcing and shipment planning can be discussed accurately.',
    groups: [
      {
        heading: 'Requirements To Share',
        items: ['Variety', 'Size and grade', 'Quality', 'Maturity', 'Packaging', 'Quantity', 'Shipment schedule', 'Destination requirements'],
      },
      {
        heading: 'BANANAS',
        items: ['We can explore banana supply programs based on customer specifications, required volume, packaging and destination.'],
      },
    ],
  },
  {
    id: 'other-food-products',
    subtitle: 'OTHER FOOD PRODUCTS',
    title: 'Other Food Products',
    description: 'Additional Indian food product enquiries can be reviewed case by case based on availability, buyer requirements and logistics feasibility.',
    groups: [
      {
        heading: 'Possible Enquiries',
        items: ['Grains', 'Spices', 'Flour', 'Oilseeds', 'Other pulses', 'Processed food products', 'Agricultural products', 'Other food commodities'],
      },
    ],
  },
];

function ProductsPage() {
  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>Our Products</h1>
          <p>Quality Indian food products sourced for professional buyers.</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="products section-padding bg-light">
        <div className="container">
          <div className="products-grid">
            {productsList.map((product, index) => (
              <div className="product-card" key={index}>
                <div className="product-img">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="product-content">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <Link to="/contact" className="btn btn-primary btn-sm">
                    <i className="fa-solid fa-envelope"></i> {product.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding product-details">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">PRODUCT DETAILS</span>
            <h2>Sourced According to Buyer Requirements</h2>
            <p>Share your product, packing, quantity, shipment and destination requirements so the right options can be discussed.</p>
          </div>
          <div className="product-detail-grid">
            {detailSections.map((section) => (
              <article className="info-card product-detail-card" id={section.id} key={section.id}>
                <span className="section-subtitle">{section.subtitle}</span>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <div className="detail-groups">
                  {section.groups.map((group) => (
                    <div className="detail-group" key={group.heading}>
                      <h4>{group.heading}</h4>
                      <ul className="check-list">
                        {group.items.map((item) => (
                          <li key={item}><i className="fa-solid fa-check"></i>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="simple-cta">
        <div className="container">
          <h2>Looking for a specific food product from India?</h2>
          <p>
            Share your product, quantity, packaging and destination requirements with our export team.
          </p>
          <Link to="/contact" className="btn btn-white">
            Send Your Requirement
          </Link>
        </div>
      </section>
    </>
  );
}

export default ProductsPage;
