import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="section-padding text-center">
      <div className="container">
        <div className="not-found-card info-card" style={{ maxWidth: '600px', margin: '40px auto' }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '3rem', color: 'var(--accent-color)', marginBottom: '20px' }}></i>
          <h1 style={{ fontSize: '2rem' }}>Page Not Found</h1>
          <p style={{ margin: '15px 0 25px' }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="fa-solid fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
