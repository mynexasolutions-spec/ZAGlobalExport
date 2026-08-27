import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner">
          <i className="fa-solid fa-circle-notch fa-spin"></i>
        </div>
        <p>Verifying admin session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
