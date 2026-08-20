const steps = [
  { icon: 'fa-solid fa-headset', title: '1. Understand', description: 'We review your product, quantity, packaging and destination requirements.' },
  { icon: 'fa-solid fa-magnifying-glass', title: '2. Source', description: 'Suitable products and suppliers are identified from our sourcing network.' },
  { icon: 'fa-solid fa-certificate', title: '3. Verify', description: 'Specifications, quality requirements and commercial conditions are reviewed.' },
  { icon: 'fa-solid fa-file-invoice-dollar', title: '4. Quote', description: 'We provide a competitive quotation based on the agreed requirements.' },
  { icon: 'fa-solid fa-check-to-slot', title: '5. Confirm', description: 'Once commercial terms are agreed, the order and shipment requirements are confirmed.' },
  { icon: 'fa-solid fa-ship', title: '6. Export', description: 'Packing, documentation and shipment activities are coordinated.' },
  { icon: 'fa-solid fa-truck', title: '7. Deliver', description: 'The shipment moves to the agreed destination through selected logistics arrangements.' },
];

function Process() {
  return (
    <section className="process section-padding bg-light">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">HOW WE WORK</span>
          <h2>Simple. Professional. Customer Focused.</h2>
          <p>Clear communication, reliable coordination and professional export support from requirement to shipment.</p>
        </div>
        <div className="process-steps">
          {steps.map((step, index) => (
            <div key={index} style={{ display: 'contents' }}>
              <div className="step">
                <div className="step-icon"><i className={step.icon}></i></div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="step-arrow"><i className="fa-solid fa-chevron-right"></i></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
