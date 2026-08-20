import Hero from '../components/Hero';
import GlobalReach from '../components/GlobalReach';
import Products from '../components/Products';
import Partners from '../components/Partners';
import WhyChooseUs from '../components/WhyChooseUs';
import Stats from '../components/Stats';
import Process from '../components/Process';
import CTA from '../components/CTA';
import FoodserviceCapabilities from '../components/FoodserviceCapabilities';
import WhySourceIndia from '../components/WhySourceIndia';

function Home() {
  return (
    <>
      <Hero />
      <section className="promise-section">
        <div className="container">
          <div className="promise-card">
            <span className="section-subtitle">OUR PROMISE</span>
            <h2>Clear Communication. Reliable Coordination. Professional Service.</h2>
          </div>
        </div>
      </section>
      <GlobalReach />
      <Products />
      <Partners />
      <WhyChooseUs />
      <Stats />
      <FoodserviceCapabilities />
      <WhySourceIndia />
      <Process />
      <CTA />
    </>
  );
}

export default Home;
