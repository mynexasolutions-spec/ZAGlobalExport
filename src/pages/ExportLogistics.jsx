const exportSteps = [
  {
    icon: 'fa-solid fa-clipboard-list',
    title: '1. Customer Requirement',
    description: 'You share your product specification, quantity, packaging and destination requirements.',
  },
  {
    icon: 'fa-solid fa-magnifying-glass',
    title: '2. Sourcing',
    description: 'We identify suitable supply options from our sourcing network.',
  },
  {
    icon: 'fa-solid fa-certificate',
    title: '3. Product & Quality Review',
    description: 'Product specifications and quality requirements are reviewed.',
  },
  {
    icon: 'fa-solid fa-file-invoice-dollar',
    title: '4. Commercial Offer',
    description: 'We provide pricing and commercial terms based on agreed requirements.',
  },
  {
    icon: 'fa-solid fa-check-to-slot',
    title: '5. Order Confirmation',
    description: 'Order details, specifications, packing and shipment arrangements are confirmed.',
  },
  {
    icon: 'fa-solid fa-boxes-packing',
    title: '6. Export Preparation',
    description: 'Product preparation, packing and required export documentation are coordinated.',
  },
  {
    icon: 'fa-solid fa-ship',
    title: '7. Shipment',
    description: 'Shipment and logistics arrangements are coordinated with relevant partners.',
  },
  {
    icon: 'fa-solid fa-truck',
    title: '8. Delivery',
    description: 'The shipment proceeds to the agreed destination in accordance with confirmed terms.',
  },
];

function ExportLogistics() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Export &amp; Logistics</h1>
          <p>From source to destination through clear procurement, documentation, logistics and delivery coordination.</p>
        </div>
      </section>

      <section className="process section-padding bg-light">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">OUR EXPORT PROCESS</span>
            <h2>Coordinated From Requirement to Delivery</h2>
            <p>Successful international supply requires coordination across sourcing, quality review, documentation, shipment and destination requirements.</p>
          </div>
          <div className="process-steps process-steps-grid">
            {exportSteps.map((step) => (
              <div className="step" key={step.title}>
                <div className="step-icon"><i className={step.icon}></i></div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ExportLogistics;
