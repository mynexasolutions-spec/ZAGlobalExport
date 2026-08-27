import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">

        {/* Brand header strip */}
        <div className="admin-auth-brand-strip">
          <Link to="/" className="admin-auth-brand-link">
            <img src="/ZA-logo.png" alt="ZA GLOBAL EXPORTS" className="admin-auth-brand-logo" />
            <div className="admin-auth-brand-text">
              <span className="auth-brand-name">ZA GLOBAL EXPORTS</span>
              <span className="auth-brand-tagline">Admin Management Portal</span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="admin-auth-card">
          <div className="admin-auth-header">
            <div className="auth-header-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2>Sign in to Dashboard</h2>
            <p>Enter your admin credentials to access the management panel.</p>
          </div>

          {localError && (
            <div className="admin-auth-alert alert-danger" role="alert">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{localError}</span>
              <button
                type="button"
                className="alert-close-btn"
                onClick={() => setLocalError(null)}
                aria-label="Close error"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-auth-form">
            <div className="admin-login-form-group">
              <label htmlFor="admin-email">Email Address</label>
              <div className="admin-login-input-wrapper">
                <i className="fa-regular fa-envelope admin-login-input-icon"></i>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-login-input"
                />
              </div>
            </div>

            <div className="admin-login-form-group">
              <label htmlFor="admin-password">Password</label>
              <div className="admin-login-input-wrapper">
                <i className="fa-solid fa-lock admin-login-input-icon"></i>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-login-input"
                />
                <button
                  type="button"
                  className="admin-login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary admin-login-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i> Sign In
                </>
              )}
            </button>
          </form>

          <div className="admin-auth-back-row">
            <Link to="/" className="admin-auth-back-link">
              <i className="fa-solid fa-arrow-left"></i> Back to Public Website
            </Link>
          </div>
        </div>

        <div className="admin-auth-footer">
          <p>&copy; {new Date().getFullYear()} ZA GLOBAL EXPORTS &mdash; Secure Admin System</p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
