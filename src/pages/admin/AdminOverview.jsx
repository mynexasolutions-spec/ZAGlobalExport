import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isCloudinaryConfigured } from '../../lib/cloudinary';
import { products as localProducts } from '../../data/products';

function AdminOverview() {
  const [stats, setStats] = useState({
    totalProducts: localProducts.length,
    totalQueries: 0,
    unreadQueries: 0,
    contactedQueries: 0,
    resolvedQueries: 0,
  });
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          // Fetch products count
          const { count: productCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

          // Fetch queries
          const { data: queriesData } = await supabase
            .from('queries')
            .select('*')
            .order('created_at', { ascending: false });

          if (queriesData) {
            const unread = queriesData.filter((q) => q.status === 'unread').length;
            const contacted = queriesData.filter((q) => q.status === 'contacted').length;
            const resolved = queriesData.filter((q) => q.status === 'resolved').length;

            setStats({
              totalProducts: productCount || localProducts.length,
              totalQueries: queriesData.length,
              unreadQueries: unread,
              contactedQueries: contacted,
              resolvedQueries: resolved,
            });
            setRecentQueries(queriesData.slice(0, 5));
          }
        } else {
          // Local fallback stats from localStorage if stored
          const savedQueries = JSON.parse(localStorage.getItem('za_local_queries') || '[]');
          const unread = savedQueries.filter((q) => q.status === 'unread').length;
          setStats({
            totalProducts: localProducts.length,
            totalQueries: savedQueries.length,
            unreadQueries: unread,
            contactedQueries: savedQueries.filter((q) => q.status === 'contacted').length,
            resolvedQueries: savedQueries.filter((q) => q.status === 'resolved').length,
          });
          setRecentQueries(savedQueries.slice(0, 5));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="admin-overview-page">
      {/* Welcome Banner */}
      <div className="admin-welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back to ZA GLOBAL EXPORTS Admin</h2>
          <p>Manage your food commodity catalog, review buyer inquiries, and update export offerings.</p>
        </div>
        <div className="welcome-actions">
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-plus"></i> Add New Product
          </Link>
          <Link to="/admin/queries" className="btn btn-white btn-sm">
            <i className="fa-solid fa-inbox"></i> View Inquiries
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-card-icon product-icon">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Total Products</span>
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <span className="stat-hint">Active in export catalog</span>
          </div>
          <Link to="/admin/products" className="stat-card-arrow" title="Manage Products">
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon queries-icon">
            <i className="fa-solid fa-envelope-open-text"></i>
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Total Queries</span>
            <h3 className="stat-value">{stats.totalQueries}</h3>
            <span className="stat-hint">Customer submissions</span>
          </div>
          <Link to="/admin/queries" className="stat-card-arrow" title="View Queries">
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        <div className="admin-stat-card highlight">
          <div className="stat-card-icon unread-icon">
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className="stat-card-details">
            <span className="stat-label">New / Unread</span>
            <h3 className="stat-value">{stats.unreadQueries}</h3>
            <span className="stat-hint">Requires attention</span>
          </div>
          <Link to="/admin/queries?status=unread" className="stat-card-arrow" title="View Unread">
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-icon status-icon">
            <i className="fa-solid fa-server"></i>
          </div>
          <div className="stat-card-details">
            <span className="stat-label">Integrations</span>
            <div className="integration-status-tags">
              <span className={`status-pill ${isSupabaseConfigured ? 'online' : 'fallback'}`}>
                <i className="fa-solid fa-database"></i> Supabase {isSupabaseConfigured ? 'Connected' : 'Local'}
              </span>
              <span className={`status-pill ${isCloudinaryConfigured ? 'online' : 'fallback'}`}>
                <i className="fa-solid fa-cloud"></i> Cloudinary {isCloudinaryConfigured ? 'Ready' : 'Mock'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Queries & Quick Catalog */}
      <div className="admin-dashboard-two-col">
        {/* Left Column: Recent Queries */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <i className="fa-solid fa-inbox gold-accent"></i>
              <h3>Recent Buyer Inquiries</h3>
            </div>
            <Link to="/admin/queries" className="btn-link-action">
              View All <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="admin-card-body">
            {loading ? (
              <div className="admin-table-loading">
                <i className="fa-solid fa-circle-notch fa-spin"></i> Loading recent enquiries...
              </div>
            ) : recentQueries.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fa-solid fa-envelope-open"></i>
                <p>No customer enquiries yet. Submissions through the contact form will appear here in real time.</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Buyer</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQueries.map((query) => (
                      <tr key={query.id}>
                        <td>
                          <div className="buyer-cell">
                            <span className="buyer-name">{query.name}</span>
                            <span className="buyer-email">{query.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className="query-subject-truncate" title={query.subject}>
                            {query.subject}
                          </span>
                        </td>
                        <td>
                          <span className={`query-badge ${query.status || 'unread'}`}>
                            {query.status || 'unread'}
                          </span>
                        </td>
                        <td>
                          <span className="query-date">
                            {new Date(query.created_at || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td>
                          <Link to="/admin/queries" className="btn-table-action" title="View inquiry">
                            <i className="fa-solid fa-eye"></i>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Products Overview */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="card-title-group">
              <i className="fa-solid fa-wheat-awn gold-accent"></i>
              <h3>Export Categories</h3>
            </div>
            <Link to="/admin/products" className="btn-link-action">
              Manage <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="admin-card-body">
            <div className="admin-product-mini-list">
              {localProducts.map((p) => (
                <div className="product-mini-item" key={p.id}>
                  <div className="product-mini-img">
                    <img src={p.cardImage || p.mainImage} alt={p.title} />
                  </div>
                  <div className="product-mini-info">
                    <h4>{p.title}</h4>
                    <span className="product-mini-subtitle">{p.subtitle}</span>
                  </div>
                  <div className="product-mini-actions">
                    <Link to={`/products/${p.id}`} target="_blank" className="btn-mini-action" title="View Public Page">
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </Link>
                    <Link to="/admin/products" className="btn-mini-action edit" title="Edit in Admin">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
