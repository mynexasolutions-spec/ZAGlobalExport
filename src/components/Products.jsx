import { Link } from 'react-router-dom';

const products = [
  {
    image: '/images/rice.jpeg',
    title: 'Rice',
    description: 'Indian rice varieties suitable for retail, wholesale, catering, foodservice and institutional applications.',
    action: 'View Rice Products',
    to: '/products#rice',
  },
  {
    image: '/images/grains.jpeg',
    title: 'Pulses & Legumes',
    description: 'Quality pulses and legumes sourced according to customer specifications and market requirements.',
    action: 'View Pulses',
    to: '/products#pulses-legumes',
  },
  {
    image: '/images/bananas-fresh-produce.jpeg',
    title: 'Bananas & Fresh Produce',
    description: 'Fresh agricultural products sourced through suitable supply partners for export markets.',
    action: 'View Fresh Produce',
    to: '/products#fresh-produce',
  },
  {
    image: '/images/spices.webp',
    title: 'Spices',
    description: 'Premium organic Indian spices sourced for authentic taste, aroma and consistent quality.',
    action: 'View Spices',
    to: '/products#spices',
  },
  {
    image: '/images/Edible Oils/palm oil.png',
    title: 'Edible Oils',
    description: 'Premium refined edible oils, including palm and sunflower oil, supplied to international food safety standards.',
    action: 'View Edible Oils',
    to: '/products#edible-oils',
  },
  {
    image: '/images/other-products.webp',
    title: 'Other Food Products',
    description: 'Grains, flour, oilseeds and other food commodities can be explored based on buyer requirements.',
    action: 'View All Products',
    to: '/products#other-food-products',
  },
];

function Products() {
  return (
    <section className="products section-padding bg-light">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">OUR PRODUCTS</span>
          <h2>Quality Products. Reliable Sourcing.</h2>
          <p>Our initial portfolio focuses on essential food commodities and agricultural products sourced from India.</p>
        </div>
        <div className="products-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <div className="product-img">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-content">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <Link to={product.to} className="btn btn-primary btn-sm">
                    <i className="fa-solid fa-arrow-right"></i> {product.action}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
