import { useState, useEffect } from 'react';
import { getQueries, refreshQueriesFromSupabase, updateQueryStatus, deleteQuery } from '../../services/queriesService';

function AdminQueries() {
  // Instant render from cache — no spinner on open
  const [queries, setQueries] = useState(() => getQueries());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Background refresh from Supabase
  useEffect(() => {
    setRefreshing(true);
    refreshQueriesFromSupabase()
      .then((fresh) => setQueries(fresh))
      .catch(() => {})
      .finally(() => setRefreshing(false));
  }, []);

  const loadQueries = () => {
    setLoading(true);
    refreshQueriesFromSupabase()
      .then((fresh) => setQueries(fresh))
      .catch(() => {})
      .finally(() => setLoading(false));
  };



  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateQueryStatus(id, newStatus);
      showNotification(`Query status updated to "${newStatus}"`);
      if (selectedQuery && selectedQuery.id === id) {
        setSelectedQuery((prev) => ({ ...prev, status: newStatus }));
      }
      await loadQueries();
    } catch (err) {
      console.error('Error updating status:', err);
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      await deleteQuery(id);
      showNotification('Query removed');
      setDeleteConfirmId(null);
      if (selectedQuery && selectedQuery.id === id) {
        setSelectedQuery(null);
      }
      await loadQueries();
    } catch (err) {
      console.error('Error deleting query:', err);
      showNotification('Failed to delete query', 'error');
    }
  };

  const handleOpenQueryModal = async (query) => {
    setSelectedQuery(query);
    // If it's unread, automatically mark as read
    if (query.status === 'unread') {
      handleStatusChange(query.id, 'read');
    }
  };

  // Filter queries by status and search
  const filteredQueries = queries.filter((q) => {
    const matchesStatus = filterStatus === 'all' || q.status === filterStatus;
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      (q.name && q.name.toLowerCase().includes(search)) ||
      (q.email && q.email.toLowerCase().includes(search)) ||
      (q.subject && q.subject.toLowerCase().includes(search)) ||
      (q.company && q.company.toLowerCase().includes(search)) ||
      (q.message && q.message.toLowerCase().includes(search));

    return matchesStatus && matchesSearch;
  });

  const unreadCount = queries.filter((q) => q.status === 'unread').length;
  const contactedCount = queries.filter((q) => q.status === 'contacted').length;
  const resolvedCount = queries.filter((q) => q.status === 'resolved').length;

  return (
    <div className="admin-queries-page">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast ${notification.type}`}>
          <i
            className={`fa-solid ${
              notification.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'
            }`}
          ></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div className="header-text">
          <h2>Buyer Queries &amp; Inquiries</h2>
          <p>Review and manage commercial quote requests submitted by international food buyers.</p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={loadQueries}>
          <i className="fa-solid fa-arrows-rotate"></i> Refresh
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="admin-queries-filters">
        <div className="query-filter-tabs">
          <button
            type="button"
            className={`tab-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Queries <span className="tab-count">{queries.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn unread ${filterStatus === 'unread' ? 'active' : ''}`}
            onClick={() => setFilterStatus('unread')}
          >
            Unread <span className="tab-count unread">{unreadCount}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${filterStatus === 'contacted' ? 'active' : ''}`}
            onClick={() => setFilterStatus('contacted')}
          >
            Contacted <span className="tab-count">{contactedCount}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${filterStatus === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('resolved')}
          >
            Resolved <span className="tab-count">{resolvedCount}</span>
          </button>
        </div>

        <div className="admin-search-box queries-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by buyer name, email, company, or commodity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
      </div>

      {/* Queries Table — renders immediately from cache */}
      {loading ? (
        <div className="admin-table-loading">
          <i className="fa-solid fa-circle-notch fa-spin"></i> Reloading...
        </div>
      ) : filteredQueries.length === 0 ? (
        <div className="admin-empty-state info-card">
          <i className="fa-solid fa-inbox"></i>
          <h3>No Queries Found</h3>
          <p>
            {searchQuery
              ? `No inquiries match "${searchQuery}".`
              : filterStatus !== 'all'
              ? `No queries with status "${filterStatus}".`
              : 'You have not received any inquiries yet. Submissions from the public contact and quote forms will appear here.'}
          </p>
        </div>
      ) : (
        <div className="admin-queries-table-wrapper info-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Buyer Information</th>
                <th>Subject / Requirement</th>
                <th>Status</th>
                <th>Date Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((query) => (
                <tr key={query.id} className={query.status === 'unread' ? 'unread-row' : ''}>
                  <td>
                    <div className="buyer-table-cell">
                      <div className="buyer-avatar">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div className="buyer-meta">
                        <strong className="buyer-name">{query.name || 'Anonymous'}</strong>
                        <span className="buyer-email">{query.email}</span>
                        {query.company && <span className="buyer-company"><i className="fa-solid fa-building"></i> {query.company}</span>}
                        {query.phone && <span className="buyer-phone"><i className="fa-solid fa-phone"></i> {query.phone}</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="query-subject-cell">
                      <strong className="query-subject-title">{query.subject}</strong>
                      <p className="query-snippet">{query.message || 'No additional notes provided.'}</p>
                    </div>
                  </td>
                  <td>
                    <select
                      value={query.status || 'unread'}
                      onChange={(e) => handleStatusChange(query.id, e.target.value)}
                      className={`status-select ${query.status || 'unread'}`}
                    >
                      <option value="unread">Unread / New</option>
                      <option value="read">Read</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <span className="query-full-date">
                      {new Date(query.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="btn-action view"
                        onClick={() => handleOpenQueryModal(query)}
                        title="View Full Details"
                      >
                        <i className="fa-solid fa-eye"></i> View
                      </button>
                      <button
                        type="button"
                        className="btn-action delete"
                        onClick={() => setDeleteConfirmId(query.id)}
                        title="Delete Inquiry"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedQuery(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-group">
                <i className="fa-solid fa-envelope-open-text gold-accent"></i>
                <h3>Inquiry Details</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedQuery(null)}>
                &times;
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Header summary */}
              <div className="query-modal-top">
                <div className="query-buyer-lead">
                  <h4>{selectedQuery.name}</h4>
                  {selectedQuery.company && <span>{selectedQuery.company}</span>}
                </div>
                <div className="query-status-control">
                  <label>Status:</label>
                  <select
                    value={selectedQuery.status || 'read'}
                    onChange={(e) => handleStatusChange(selectedQuery.id, e.target.value)}
                    className={`status-select ${selectedQuery.status || 'read'}`}
                  >
                    <option value="unread">Unread / New</option>
                    <option value="read">Read</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="query-contact-grid">
                <div className="query-info-box">
                  <span className="info-label"><i className="fa-solid fa-envelope"></i> Email</span>
                  <a href={`mailto:${selectedQuery.email}`} className="info-val link">
                    {selectedQuery.email || 'N/A'}
                  </a>
                </div>
                <div className="query-info-box">
                  <span className="info-label"><i className="fa-solid fa-phone"></i> Phone / WhatsApp</span>
                  <a href={`tel:${selectedQuery.phone}`} className="info-val link">
                    {selectedQuery.phone || 'N/A'}
                  </a>
                </div>
                <div className="query-info-box">
                  <span className="info-label"><i className="fa-solid fa-clock"></i> Date Submitted</span>
                  <span className="info-val">
                    {new Date(selectedQuery.created_at || Date.now()).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Inquiry Content */}
              <div className="query-content-block">
                <h5>Subject:</h5>
                <p className="query-subject-full">{selectedQuery.subject}</p>

                <h5>Buyer Message &amp; Specifications:</h5>
                <div className="query-message-box">
                  {selectedQuery.message ? (
                    selectedQuery.message.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  ) : (
                    <p className="text-muted">No additional message text provided.</p>
                  )}
                </div>
              </div>

              {/* Direct Reply Actions */}
              <div className="query-reply-actions">
                {selectedQuery.phone && (
                  <a
                    href={`https://wa.me/${selectedQuery.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      selectedQuery.name
                    )},%20thank%20you%20for%20reaching%20out%20to%20ZA%20GLOBAL%20EXPORTS.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp-direct"
                  >
                    <i className="fa-brands fa-whatsapp"></i> Reply on WhatsApp
                  </a>
                )}
                {selectedQuery.email && (
                  <a
                    href={`mailto:${selectedQuery.email}?subject=Regarding your ZA GLOBAL EXPORTS Inquiry: ${encodeURIComponent(
                      selectedQuery.subject
                    )}`}
                    className="btn btn-primary"
                  >
                    <i className="fa-solid fa-envelope"></i> Reply via Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal-card small" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-content">
              <i className="fa-solid fa-triangle-exclamation warning-icon"></i>
              <h3>Delete Inquiry?</h3>
              <p>Are you sure you want to delete this buyer inquiry? This cannot be undone.</p>
              <div className="delete-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteQuery(deleteConfirmId)}
                >
                  <i className="fa-solid fa-trash-can"></i> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminQueries;
