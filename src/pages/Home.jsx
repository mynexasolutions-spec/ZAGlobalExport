import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import GlobalReach from '../components/GlobalReach';
import Products from '../components/Products';
import Partners from '../components/Partners';
import WhyChooseUs from '../components/WhyChooseUs';
import Process from '../components/Process';
import CTA from '../components/CTA';
import FoodserviceCapabilities from '../components/FoodserviceCapabilities';
import WhySourceIndia from '../components/WhySourceIndia';
import { getHomepageSettings, refreshHomepageSettings } from '../services/homepageService';

function Home() {
  const [settings, setSettings] = useState(() => getHomepageSettings());

  useEffect(() => {
    refreshHomepageSettings()
      .then((fresh) => setSettings(fresh))
      .catch(() => {});
  }, []);

  return (
    <>
      <Hero settings={settings} />
      <section className="promise-section">
        <div className="container promise-container">
          <div className="promise-intro">
            <span className="section-subtitle">{settings.promise_subtitle || 'OUR PROMISE'}</span>
            <h2>{settings.promise_title || 'Clear Communication. Reliable Coordination. Professional Service.'}</h2>
            <p>{settings.promise_description || 'We help professional food buyers source from India with practical information, coordinated export steps and service that respects commercial timelines.'}</p>
          </div>
          <div className="promise-grid">
            {(settings.promise_cards || []).map((card, idx) => (
              <article className="promise-card" key={card.title || idx}>
                <div className="promise-icon">
                  <i className={`fa-solid ${card.icon || 'fa-comments'}`}></i>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <GlobalReach settings={settings} />
      <Products />
      <Partners settings={settings} />
      <WhyChooseUs />
      <FoodserviceCapabilities />
      <WhySourceIndia />
      <Process />
      <CTA />
    </>
  );
}

export default Home;
