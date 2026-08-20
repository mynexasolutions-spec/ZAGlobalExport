const qualityItems = [
  {
    title: 'Supplier Selection',
    description: 'We work to identify suitable and reliable suppliers based on product, quality, capacity and commercial requirements.',
  },
  {
    title: 'Product Specifications',
    description: 'Customer requirements are reviewed before confirming the supply.',
  },
  {
    title: 'Quality Verification',
    description: 'Appropriate quality checks and verification procedures are considered according to product and customer requirements.',
  },
  {
    title: 'Traceability',
    description: 'Where applicable, product and shipment information is maintained to support traceability.',
  },
  {
    title: 'Packaging Control',
    description: 'Packaging requirements are agreed based on product characteristics, destination market and customer needs.',
  },
  {
    title: 'Documentation',
    description: 'Required export and product documentation is coordinated according to applicable requirements.',
  },
];

function QualityFoodSafety() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Quality &amp; Food Safety</h1>
          <p>Quality is our commitment throughout sourcing, packaging, documentation and export coordination.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">OUR QUALITY APPROACH</span>
            <h2>Supporting Successful International Supply Relationships</h2>
            <p>We focus on understanding customer specifications, selecting appropriate suppliers, verifying requirements and coordinating export processes.</p>
          </div>
          <div className="card-grid-3">
            {qualityItems.map((item) => (
              <div className="info-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="about-note compliance-note">
            <p>Specific compliance details will be displayed only where applicable and supported by valid documentation.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default QualityFoodSafety;
