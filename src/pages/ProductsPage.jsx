import { Link } from 'react-router-dom';

const productsList = [
  {
    image: '/images/rice.jpeg',
    title: 'Rice',
    description: 'Indian rice varieties suitable for retail, wholesale, catering, foodservice and institutional applications.',
    action: 'Request Rice Specifications',
  },
  {
    image: '/images/basmati-rice.webp',
    title: 'Basmati Rice',
    description: 'Basmati rice supply can be explored based on required grade, grain characteristics, packing and quantity.',
    action: 'Request Specifications',
  },
  {
    image: '/images/non-basmati-rice.webp',
    title: 'Non-Basmati Rice',
    description: 'Non-basmati rice options can be sourced according to customer specifications and market requirements.',
    action: 'Send Requirement',
  },
  {
    image: '/images/sella-rice.webp',
    title: 'Sella Rice',
    description: 'Sella (parboiled) rice can be sourced according to required grade, grain characteristics, packing and quantity.',
    action: 'Request Specifications',
  },
  {
    image: '/images/grains.jpeg',
    title: 'Pulses & Legumes',
    description: 'Toor dal, moong dal, masoor dal, chana dal, chickpeas and other pulses can be sourced by grade and packing need.',
    action: 'Request Pulses Catalogue',
  },
  {
    image: '/images/bananas-fresh-produce.jpeg',
    title: 'Bananas & Fresh Produce',
    description: 'Fresh produce programs can be discussed based on variety, size, grade, maturity, packaging, volume and destination.',
    action: 'Enquire About Fresh Produce',
  },
  {
    image: '/images/spices.webp',
    title: 'Spices',
    description: 'Indian spices can be explored subject to product availability, specifications, packing and commercial requirements.',
    action: 'Discuss Requirements',
  },
  {
    image: '/images/palm-oil.webp',
    title: 'Palm Oil',
    description: 'Premium refined, bleached and deodorized (RBD) palm oil can be supplied to meet international food safety standards.',
    action: 'Request Specifications',
  },
  {
    image: '/images/sunflower-oil.webp',
    title: 'Sunflower Oil',
    description: 'Premium refined sunflower oil can be supplied to catering companies, retailers and wholesalers worldwide.',
    action: 'Request Specifications',
  },
  {
    image: '/images/other-products.webp',
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
    description: "ZA GLOBAL EXPORTS offers rice with authentic flavors and exceptional taste. Over time, people worldwide have developed a fondness for rice, enjoying it in various forms and flavors — some prefer basmati, while others opt for non-basmati varieties. India, known for its abundant production of organic rice, stands as one of the leading rice exporters globally, and the organic rice supplied by ZA GLOBAL EXPORTS is renowned for its genuine flavors and high quality. Our rice varieties have been widely appreciated in Middle Eastern countries for their taste and quality. ZA GLOBAL EXPORTS sources rice from highly modern mills and can supply according to customer specifications, including variety, grade, grain characteristics, packaging and quantity.",
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
    description: 'Nutritious. Essential. Reliably Sourced. ZA GLOBAL EXPORTS offers a rich source of protein to enhance your diet with a diverse range of pulses, supplying a variety of pulses to meet the growing demands of customers worldwide. Originating from India, a rapidly developing nation with an abundance of high-quality agricultural products, our pulses — a staple in Middle Eastern diets — are renowned for their rich protein content. We carefully select our farmers to ensure the best sources for our pulses, using the latest techniques to maintain their nutritional value, and each batch undergoes rigorous screening, including cleaning and grading, before reaching you.',
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
    description: 'ZA GLOBAL EXPORTS provides farm-fresh fruits for you to enjoy their original taste. Our team constantly researches better ways to store and deliver fresh fruits to ensure customer satisfaction, and we offer a wide variety of high-demand fruits at affordable prices. Fresh produce enquiries are handled around clear buyer requirements so sourcing and shipment planning can be discussed accurately.',
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
    id: 'spices',
    subtitle: 'SPICES',
    title: 'Spices',
    description: 'Immerse yourself in the enchanting fragrance of superb quality spices from ZA GLOBAL EXPORTS. Renowned for delivering top-notch organic Indian spices to Middle Eastern countries, we ensure that the taste and aroma these spices bring to your food provide an unparalleled experience. Our loyal customers return time and again for our exceptional range of spices, finding ultimate satisfaction in the delicious flavors they create. We uphold the highest quality standards in delivering organic Indian spices to our customers.',
    groups: [
      {
        heading: 'Categories',
        items: ['Turmeric', 'Chili Powder', 'Cumin', 'Coriander', 'Cardamom', 'Black Pepper', 'Star Anise', 'Cloves', 'Fennel', 'Mustard Seeds'],
      },
      {
        heading: 'Suitable For',
        items: ['Catering Companies', 'Foodservice Operators', 'Retailers', 'Food Manufacturers', 'Wholesalers'],
      },
    ],
  },
  {
    id: 'edible-oils',
    subtitle: 'EDIBLE OILS',
    title: 'Premium Refined Edible Oils for Global Markets',
    description: 'ZA GLOBAL EXPORTS is a leading refined edible oil exporter to GCC countries, supplying premium (Refined, Bleached, Deodorized) cooking oils to catering companies, retailers and other wholesalers worldwide. We ensure the highest quality sunflower oil, soybean oil, palm oil, corn oil and coconut oil, meeting international food safety standards.',
    groups: [
      {
        heading: 'Product Types',
        items: ['Sunflower Oil', 'Soybean Oil', 'Palm Oil', 'Corn Oil', 'Coconut Oil'],
      },
      {
        heading: 'Suitable For',
        items: ['Catering Companies', 'Retailers', 'Wholesalers', 'Food Manufacturers'],
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
        items: ['Grains', 'Flour', 'Oilseeds', 'Other pulses', 'Processed food products', 'Agricultural products', 'Other food commodities'],
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
                <Link to="/contact" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-envelope"></i> Contact Now
                </Link>
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
