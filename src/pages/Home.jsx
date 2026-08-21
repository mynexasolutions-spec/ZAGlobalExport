import Hero from '../components/Hero';
import GlobalReach from '../components/GlobalReach';
import Products from '../components/Products';
import Partners from '../components/Partners';
import WhyChooseUs from '../components/WhyChooseUs';
import Process from '../components/Process';
import CTA from '../components/CTA';
import FoodserviceCapabilities from '../components/FoodserviceCapabilities';
import WhySourceIndia from '../components/WhySourceIndia';

const promiseCards = [
  {
    icon: 'fa-comments',
    title: 'Clear Communication',
    description: 'Straightforward updates on product availability, specifications, timelines and documentation from enquiry to shipment.',
  },
  {
    icon: 'fa-ship',
    title: 'Reliable Coordination',
    description: 'Structured follow-through across sourcing, packing, inspection readiness and export movement for food buyers.',
  },
  {
    icon: 'fa-handshake',
    title: 'Professional Service',
    description: 'Buyer-focused support for distributors, wholesalers, caterers and foodservice teams sourcing Indian products.',
  },
];

function Home() {
  return (
    <>
      <Hero />
      <section className="promise-section">
        <div className="container promise-container">
          <div className="promise-intro">
            <span className="section-subtitle">OUR PROMISE</span>
            <h2>Clear Communication. Reliable Coordination. Professional Service.</h2>
            <p>We help professional food buyers source from India with practical information, coordinated export steps and service that respects commercial timelines.</p>
          </div>
          <div className="promise-grid">
            {promiseCards.map((card) => (
              <article className="promise-card" key={card.title}>
                <div className="promise-icon">
                  <i className={`fa-solid ${card.icon}`}></i>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <GlobalReach />
      <Products />
      <Partners />
      <WhyChooseUs />
      <FoodserviceCapabilities />
      <WhySourceIndia />
      <Process />
      <CTA />
    </>
  );
}

export default Home;
