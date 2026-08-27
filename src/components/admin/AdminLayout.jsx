import { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/products')) return 'Product Management';
    if (path.includes('/admin/queries'))  return 'Buyer Queries & Inquiries';
    if (path.includes('/admin/homepage')) return 'Homepage Management';
    return 'Dashboard Overview';
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      {isSidebarOpen && <div className="admin-sidebar-backdrop" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link to="/admin" onClick={closeSidebar} className="admin-brand-link">
            <img src="/ZA-logo.png" alt="ZA GLOBAL EXPORTS" className="admin-brand-logo" />
            <div className="admin-brand-text">
              <span className="brand-name">ZA GLOBAL</span>
              <span className="brand-badge">ADMIN</span>
            </div>
          </Link>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="nav-section-label">MAIN MENU</div>
          <ul className="admin-nav-list">
            <li>
              <NavLink
                to="/admin"
                end
                onClick={closeSidebar}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <i className="fa-solid fa-chart-pie nav-item-icon"></i>
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                onClick={closeSidebar}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <i className="fa-solid fa-boxes-stacked nav-item-icon"></i>
                <span>Products</span>
                <span className="nav-item-badge">Catalog</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/queries"
                onClick={closeSidebar}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <i className="fa-solid fa-envelope-open-text nav-item-icon"></i>
                <span>Queries</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/homepage"
                onClick={closeSidebar}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <i className="fa-solid fa-house nav-item-icon"></i>
                <span>Homepage</span>
              </NavLink>
            </li>
          </ul>

          <div className="nav-section-label" style={{ marginTop: '8px' }}>WEBSITE</div>
          <ul className="admin-nav-list">
            <li>
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-nav-item external"
              >
                <i className="fa-solid fa-globe nav-item-icon"></i>
                <span>View Public Website</span>
                <i className="fa-solid fa-arrow-up-right-from-square external-icon"></i>
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-nav-item external"
              >
                <i className="fa-solid fa-store nav-item-icon"></i>
                <span>Product Catalog Page</span>
                <i className="fa-solid fa-arrow-up-right-from-square external-icon"></i>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">Admin User</span>
              <span className="admin-user-email">{user?.email || 'admin@gmail.com'}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="btn-admin-logout"
            title="Sign Out"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="admin-main-wrapper">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="admin-page-title">{getPageTitle()}</h1>
          </div>

          <div className="topbar-right">
            <Link to="/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm topbar-btn">
              <i className="fa-solid fa-eye"></i> View Site
            </Link>
            <div className="admin-topbar-user">
              <span className="status-dot"></span>
              <span className="topbar-email">{user?.email || 'admin@gmail.com'}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
