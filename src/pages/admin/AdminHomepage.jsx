import { useState, useEffect } from 'react';
import { getHomepageSettings, refreshHomepageSettings, updateHomepageSettings } from '../../services/homepageService';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

function AdminHomepage() {
  const [activeTab, setActiveTab] = useState('hero'); // hero, promise, reach, partners
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Settings Form State
  const [settings, setSettings] = useState(() => getHomepageSettings());

  // File Upload State
  const [uploadingHeroBg, setUploadingHeroBg] = useState(false);
  const [uploadingReachImg, setUploadingReachImg] = useState(false);
  const [uploadingPartnerLogo, setUploadingPartnerLogo] = useState(false);

  // Sub-items Form State (for adding new items)
  const [newPromise, setNewPromise] = useState({ icon: 'fa-handshake', title: '', description: '' });
  const [newReachPoint, setNewReachPoint] = useState('');
  const [newPartner, setNewPartner] = useState({ name: '', icon: '', color: '#17251d', logo_url: '' });

  useEffect(() => {
    refreshHomepageSettings()
      .then((fresh) => {
        setSettings(fresh);
      })
      .catch((err) => {
        showNotification(err.message || 'Failed to sync settings from database', 'error');
      });
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      await updateHomepageSettings(settings);
      showNotification('✓ Homepage settings updated successfully!');
    } catch (err) {
      console.error(err);
      showNotification(err.message || 'Failed to update homepage settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Hero BG Image Upload
  const handleHeroBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHeroBg(true);
    try {
      const result = await uploadImageToCloudinary(file, 'za_homepage');
      setSettings((prev) => ({
        ...prev,
        hero_bg_image: result.url,
      }));
      showNotification('✓ Hero background image uploaded to Cloudinary');
    } catch (err) {
      showNotification(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploadingHeroBg(false);
      e.target.value = '';
    }
  };

  // Global Reach Image Upload
  const handleReachImgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReachImg(true);
    try {
      const result = await uploadImageToCloudinary(file, 'za_homepage');
      setSettings((prev) => ({
        ...prev,
        reach_image: result.url,
      }));
      showNotification('✓ Global Reach image uploaded to Cloudinary');
    } catch (err) {
      showNotification(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploadingReachImg(false);
      e.target.value = '';
    }
  };

  // Partner Logo Upload
  const handlePartnerLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPartnerLogo(true);
    try {
      const result = await uploadImageToCloudinary(file, 'za_partners');
      setNewPartner((prev) => ({
        ...prev,
        logo_url: result.url,
      }));
      showNotification('✓ Partner logo image uploaded to Cloudinary');
    } catch (err) {
      showNotification(`Upload failed: ${err.message}`, 'error');
    } finally {
      setUploadingPartnerLogo(false);
      e.target.value = '';
    }
  };

  // Promise Card management
  const handleAddPromise = () => {
    if (!newPromise.title.trim() || !newPromise.description.trim()) {
      showNotification('Promise title and description are required', 'error');
      return;
    }
    const updatedCards = [...(settings.promise_cards || []), { ...newPromise }];
    setSettings((prev) => ({ ...prev, promise_cards: updatedCards }));
    setNewPromise({ icon: 'fa-handshake', title: '', description: '' });
    showNotification('Promise card added. Remember to save changes.');
  };

  const handleRemovePromise = (idx) => {
    const updatedCards = settings.promise_cards.filter((_, i) => i !== idx);
    setSettings((prev) => ({ ...prev, promise_cards: updatedCards }));
    showNotification('Promise card removed. Remember to save changes.');
  };

  // Reach Points management
  const handleAddReachPoint = () => {
    if (!newReachPoint.trim()) return;
    const updatedPoints = [...(settings.reach_points || []), newReachPoint.trim()];
    setSettings((prev) => ({ ...prev, reach_points: updatedPoints }));
    setNewReachPoint('');
    showNotification('Global reach point added. Remember to save changes.');
  };

  const handleRemoveReachPoint = (idx) => {
    const updatedPoints = settings.reach_points.filter((_, i) => i !== idx);
    setSettings((prev) => ({ ...prev, reach_points: updatedPoints }));
    showNotification('Global reach point removed. Remember to save changes.');
  };

  // Partners management
  const handleAddPartner = () => {
    if (!newPartner.name.trim()) {
      showNotification('Partner name is required', 'error');
      return;
    }
    if (!newPartner.logo_url && !newPartner.icon) {
      showNotification('Please upload a logo image or enter a FontAwesome icon', 'error');
      return;
    }
    const updatedPartners = [...(settings.partners_list || []), { ...newPartner }];
    setSettings((prev) => ({ ...prev, partners_list: updatedPartners }));
    setNewPartner({ name: '', icon: '', color: '#17251d', logo_url: '' });
    showNotification('Partner added. Remember to save changes.');
  };

  const handleRemovePartner = (idx) => {
    const updatedPartners = settings.partners_list.filter((_, i) => i !== idx);
    setSettings((prev) => ({ ...prev, partners_list: updatedPartners }));
    showNotification('Partner removed. Remember to save changes.');
  };

  if (!settings) {
    return (
      <div className="admin-page-loading">
        <i className="fa-solid fa-circle-notch fa-spin"></i> Loading Homepage Settings...
      </div>
    );
  }

  return (
    <div className="admin-homepage-page">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast ${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-page-header">
        <div className="header-text">
          <h2>Homepage Section Management</h2>
          <p>Update texts, background images, links, promises, reach details, and partner logos displayed on the front page.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving...</>
          ) : (
            <><i className="fa-solid fa-cloud-arrow-up"></i> Save Settings</>
          )}
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="admin-tabs info-card admin-homepage-tabs">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`btn btn-sm ${activeTab === 'hero' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="fa-solid fa-image"></i> Hero Section
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('promise')}
          className={`btn btn-sm ${activeTab === 'promise' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="fa-solid fa-handshake"></i> Our Promise
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reach')}
          className={`btn btn-sm ${activeTab === 'reach' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="fa-solid fa-earth-asia"></i> Global Reach
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`btn btn-sm ${activeTab === 'partners' ? 'btn-primary' : 'btn-outline'}`}
        >
          <i className="fa-solid fa-circle-nodes"></i> Our Partners
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="admin-homepage-form info-card">
        
        {/* HERO SECTION TAB */}
        {activeTab === 'hero' && (
          <div className="tab-pane">
            <div className="form-section">
              <h4 className="form-section-title">Hero Section Settings</h4>
              
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Hero Badge Text</label>
                  <input
                    type="text"
                    value={settings.hero_badge || ''}
                    onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })}
                    className="admin-input"
                    placeholder="e.g. ZA GLOBAL EXPORTS"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Hero Background Image</label>
                  <div className="image-upload-box">
                    <input
                      type="text"
                      value={settings.hero_bg_image || ''}
                      onChange={(e) => setSettings({ ...settings, hero_bg_image: e.target.value })}
                      className="admin-input text-xs"
                      placeholder="Image URL or upload a file"
                    />
                    <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> {uploadingHeroBg ? 'Uploading...' : 'Choose File (Cloudinary)'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroBgUpload}
                        disabled={uploadingHeroBg}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '16px' }}>
                <label>Hero Main Title</label>
                <input
                  type="text"
                  value={settings.hero_title || ''}
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  className="admin-input"
                  placeholder="Title text"
                />
              </div>

              <div className="admin-form-group" style={{ marginTop: '16px' }}>
                <label>Hero Subtext / Description</label>
                <textarea
                  rows="4"
                  value={settings.hero_description || ''}
                  onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                  className="admin-input"
                  placeholder="Hero description paragraph"
                />
              </div>

              <div className="form-section-subtitle" style={{ marginTop: '24px', fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>Action Buttons</div>

              <div className="form-grid-2" style={{ marginTop: '16px' }}>
                {/* Primary Button */}
                <div className="card-sub-form" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', marginBottom: '12px' }}>Primary Button (Green)</strong>
                  <div className="admin-form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={settings.hero_primary_btn_text || ''}
                      onChange={(e) => setSettings({ ...settings, hero_primary_btn_text: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginTop: '10px' }}>
                    <label>Link Route</label>
                    <input
                      type="text"
                      value={settings.hero_primary_btn_link || ''}
                      onChange={(e) => setSettings({ ...settings, hero_primary_btn_link: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="card-sub-form" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <strong style={{ display: 'block', marginBottom: '12px' }}>Secondary Button (Outline)</strong>
                  <div className="admin-form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={settings.hero_secondary_btn_text || ''}
                      onChange={(e) => setSettings({ ...settings, hero_secondary_btn_text: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginTop: '10px' }}>
                    <label>Link Route</label>
                    <input
                      type="text"
                      value={settings.hero_secondary_btn_link || ''}
                      onChange={(e) => setSettings({ ...settings, hero_secondary_btn_link: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* OUR PROMISE TAB */}
        {activeTab === 'promise' && (
          <div className="tab-pane">
            <div className="form-section">
              <h4 className="form-section-title">"Our Promise" Intro Settings</h4>
              
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Section Subtitle Badge</label>
                  <input
                    type="text"
                    value={settings.promise_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, promise_subtitle: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Section Main Title</label>
                  <input
                    type="text"
                    value={settings.promise_title || ''}
                    onChange={(e) => setSettings({ ...settings, promise_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '16px' }}>
                <label>Section Intro Description</label>
                <textarea
                  rows="3"
                  value={settings.promise_description || ''}
                  onChange={(e) => setSettings({ ...settings, promise_description: e.target.value })}
                  className="admin-input"
                />
              </div>

              <h4 className="form-section-title" style={{ marginTop: '36px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>Manage Promises ({settings.promise_cards?.length || 0})</h4>

              {/* Promise Cards Grid */}
              <div className="promises-admin-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                {(settings.promise_cards || []).map((card, idx) => (
                  <div className="promise-admin-row" key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fcfdfa' }}>
                    <div className="promise-admin-icon" style={{ fontSize: '1.50rem', color: 'var(--primary-color)', background: '#eef3ef', padding: '12px', borderRadius: '50%', minWidth: '50px', height: '50px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                      <i className={`fa-solid ${card.icon || 'fa-comments'}`}></i>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div className="form-grid-2" style={{ marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const list = [...settings.promise_cards];
                            list[idx].title = e.target.value;
                            setSettings({ ...settings, promise_cards: list });
                          }}
                          className="admin-input font-bold"
                          placeholder="Promise Title"
                          style={{ padding: '6px 10px', fontSize: '0.95rem' }}
                        />
                        <input
                          type="text"
                          value={card.icon}
                          onChange={(e) => {
                            const list = [...settings.promise_cards];
                            list[idx].icon = e.target.value;
                            setSettings({ ...settings, promise_cards: list });
                          }}
                          className="admin-input"
                          placeholder="FontAwesome Icon Class"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        />
                      </div>
                      <textarea
                        rows="2"
                        value={card.description}
                        onChange={(e) => {
                          const list = [...settings.promise_cards];
                          list[idx].description = e.target.value;
                          setSettings({ ...settings, promise_cards: list });
                        }}
                        className="admin-input text-sm"
                        placeholder="Description"
                        style={{ padding: '8px 10px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePromise(idx)}
                      className="btn-action delete btn-sm"
                      style={{ padding: '8px 12px', height: 'fit-content' }}
                    >
                      <i className="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Promise card box */}
              <div className="add-promise-box card-sub-form" style={{ padding: '20px', border: '1px dashed var(--accent-color)', borderRadius: '8px', background: '#faf9f5' }}>
                <h5 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--secondary-color)', marginBottom: '16px' }}>Add a New Promise Card</h5>
                <div className="form-grid-2">
                  <div className="admin-form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newPromise.title}
                      onChange={(e) => setNewPromise({ ...newPromise, title: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. On-Time Shipping"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Icon Class (FontAwesome)</label>
                    <select
                      value={newPromise.icon}
                      onChange={(e) => setNewPromise({ ...newPromise, icon: e.target.value })}
                      className="admin-input"
                    >
                      <option value="fa-comments">💬 Clear Communication (fa-comments)</option>
                      <option value="fa-ship">🚢 Reliable Sourcing/Shipment (fa-ship)</option>
                      <option value="fa-handshake">🤝 Professional Service (fa-handshake)</option>
                      <option value="fa-certificate">🏆 Premium Quality (fa-certificate)</option>
                      <option value="fa-truck-fast">🚚 Fast Logistics (fa-truck-fast)</option>
                      <option value="fa-boxes-stacked">📦 Bulk Sourcing (fa-boxes-stacked)</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginTop: '12px' }}>
                  <label>Description</label>
                  <textarea
                    rows="2"
                    value={newPromise.description}
                    onChange={(e) => setNewPromise({ ...newPromise, description: e.target.value })}
                    className="admin-input"
                    placeholder="Short description of this promise..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddPromise}
                  className="btn btn-outline"
                  style={{ marginTop: '14px' }}
                >
                  <i className="fa-solid fa-plus"></i> Add Promise Card
                </button>
              </div>

            </div>
          </div>
        )}

        {/* GLOBAL REACH TAB */}
        {activeTab === 'reach' && (
          <div className="tab-pane">
            <div className="form-section">
              <h4 className="form-section-title">Global Reach Intro Settings</h4>
              
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Section Subtitle</label>
                  <input
                    type="text"
                    value={settings.reach_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, reach_subtitle: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Section Title (HTML tags supported e.g. &lt;br /&gt; or &lt;span class="text-primary"&gt;)</label>
                  <input
                    type="text"
                    value={settings.reach_title || ''}
                    onChange={(e) => setSettings({ ...settings, reach_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group" style={{ marginTop: '16px' }}>
                <label>Intro Description</label>
                <textarea
                  rows="3"
                  value={settings.reach_description || ''}
                  onChange={(e) => setSettings({ ...settings, reach_description: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="form-section-subtitle" style={{ marginTop: '30px', fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>Visual Settings</div>

              <div className="form-grid-2" style={{ marginTop: '16px' }}>
                <div className="admin-form-group">
                  <label>Section Image Preview &amp; Upload</label>
                  <div className="image-upload-box">
                    <img
                      src={settings.reach_image || '/global-reach.webp'}
                      alt="Reach"
                      style={{ maxHeight: '120px', borderRadius: '6px', marginBottom: '10px', display: 'block', border: '1px solid var(--border-color)' }}
                    />
                    <input
                      type="text"
                      value={settings.reach_image || ''}
                      onChange={(e) => setSettings({ ...settings, reach_image: e.target.value })}
                      className="admin-input text-xs"
                      placeholder="Image URL"
                    />
                    <label className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                      <i className="fa-solid fa-cloud-arrow-up"></i> {uploadingReachImg ? 'Uploading...' : 'Upload Image (Cloudinary)'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReachImgUpload}
                        disabled={uploadingReachImg}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div className="card-sub-form" style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', background: '#fbfcfb' }}>
                  <strong style={{ display: 'block', marginBottom: '12px' }}>Reach Image Badge Overlap</strong>
                  <div className="admin-form-group">
                    <label>Badge Icon (FontAwesome)</label>
                    <input
                      type="text"
                      value={settings.reach_badge_icon || ''}
                      onChange={(e) => setSettings({ ...settings, reach_badge_icon: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. fa-solid fa-earth-asia"
                    />
                  </div>
                  <div className="admin-form-group" style={{ marginTop: '10px' }}>
                    <label>Badge Text</label>
                    <input
                      type="text"
                      value={settings.reach_badge_text || ''}
                      onChange={(e) => setSettings({ ...settings, reach_badge_text: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. Global Supply"
                    />
                  </div>
                </div>
              </div>

              <h4 className="form-section-title" style={{ marginTop: '36px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>Global Reach Feature Points</h4>

              {/* List of points */}
              <div className="points-admin-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                {(settings.reach_points || []).map((point, idx) => (
                  <div className="point-admin-row" key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <i className="fa-solid fa-circle-check text-primary" style={{ fontSize: '1.2rem' }}></i>
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const list = [...settings.reach_points];
                        list[idx] = e.target.value;
                        setSettings({ ...settings, reach_points: list });
                      }}
                      className="admin-input"
                      placeholder="Reach point text"
                      style={{ flexGrow: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveReachPoint(idx)}
                      className="btn-action delete btn-sm"
                      style={{ padding: '8px 12px' }}
                    >
                      &times; Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Add reach point */}
              <div className="add-point-strip" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newReachPoint}
                  onChange={(e) => setNewReachPoint(e.target.value)}
                  placeholder="Enter a new feature point..."
                  className="admin-input"
                  style={{ flexGrow: 1 }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddReachPoint())}
                />
                <button
                  type="button"
                  onClick={handleAddReachPoint}
                  className="btn btn-outline"
                >
                  <i className="fa-solid fa-plus"></i> Add Point
                </button>
              </div>

            </div>
          </div>
        )}

        {/* OUR PARTNERS TAB */}
        {activeTab === 'partners' && (
          <div className="tab-pane">
            <div className="form-section">
              <h4 className="form-section-title">"Our Partners" Header Settings</h4>
              
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label>Section Subtitle</label>
                  <input
                    type="text"
                    value={settings.partners_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, partners_subtitle: e.target.value })}
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Section Title</label>
                  <input
                    type="text"
                    value={settings.partners_title || ''}
                    onChange={(e) => setSettings({ ...settings, partners_title: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <h4 className="form-section-title" style={{ marginTop: '36px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>Manage Partners &amp; Logistics Logos ({settings.partners_list?.length || 0})</h4>

              {/* Partners Grid */}
              <div className="partners-admin-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', margin: '20px 0' }}>
                {(settings.partners_list || []).map((partner, idx) => (
                  <div className="partner-admin-card" key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', position: 'relative', background: '#fafbfc' }}>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(idx)}
                      className="partner-delete-btn"
                      style={{ position: 'absolute', top: '8px', right: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }}
                      title="Remove Partner"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                    
                    <div className="partner-logo-preview" style={{ height: '50px', display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                      {partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} style={{ maxHeight: '40px', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <i className={partner.icon} style={{ color: partner.color, fontSize: '1.8rem' }}></i>
                          <span style={{ fontSize: '0.8rem', color: '#666' }}>(Icon fallback)</span>
                        </div>
                      )}
                    </div>

                    <div className="admin-form-group">
                      <label>Partner Name</label>
                      <input
                        type="text"
                        value={partner.name}
                        onChange={(e) => {
                          const list = [...settings.partners_list];
                          list[idx].name = e.target.value;
                          setSettings({ ...settings, partners_list: list });
                        }}
                        className="admin-input text-sm"
                        style={{ padding: '4px 8px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add partner card */}
              <div className="add-partner-box card-sub-form" style={{ padding: '20px', border: '1px dashed var(--accent-color)', borderRadius: '8px', background: '#fdfdfb' }}>
                <h5 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--secondary-color)', marginBottom: '16px' }}>Add a New Partner &amp; Logo</h5>
                
                <div className="form-grid-2">
                  <div className="admin-form-group">
                    <label>Partner Name *</label>
                    <input
                      type="text"
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. MAERSK, DHL"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Partner Logo Image Upload (Recommended)</label>
                    <div className="image-upload-box">
                      {newPartner.logo_url ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={newPartner.logo_url} alt="New Partner Logo" style={{ maxHeight: '35px', objectFit: 'contain' }} />
                          <button type="button" onClick={() => setNewPartner({ ...newPartner, logo_url: '' })} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>Remove</button>
                        </div>
                      ) : (
                        <label className="btn btn-secondary btn-sm">
                          <i className="fa-solid fa-cloud-arrow-up"></i> {uploadingPartnerLogo ? 'Uploading...' : 'Choose Logo File'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePartnerLogoUpload}
                            disabled={uploadingPartnerLogo}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-grid-3" style={{ marginTop: '16px' }}>
                  <div className="admin-form-group">
                    <label>Or manually enter Logo URL</label>
                    <input
                      type="text"
                      value={newPartner.logo_url}
                      onChange={(e) => setNewPartner({ ...newPartner, logo_url: e.target.value })}
                      className="admin-input text-xs"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Or Icon Class (FontAwesome fallback)</label>
                    <input
                      type="text"
                      value={newPartner.icon}
                      onChange={(e) => setNewPartner({ ...newPartner, icon: e.target.value })}
                      className="admin-input"
                      placeholder="e.g. fa-brands fa-fedex"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Fallback Icon Color</label>
                    <input
                      type="color"
                      value={newPartner.color}
                      onChange={(e) => setNewPartner({ ...newPartner, color: e.target.value })}
                      className="admin-input"
                      style={{ height: '42px', padding: '2px' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPartner}
                  className="btn btn-outline"
                  style={{ marginTop: '20px' }}
                >
                  <i className="fa-solid fa-plus"></i> Add Partner Logo
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginTop: '30px' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ minWidth: '150px' }}
          >
            {saving ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Saving Settings...</>
            ) : (
              <><i className="fa-solid fa-floppy-disk"></i> Save All Changes</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AdminHomepage;
