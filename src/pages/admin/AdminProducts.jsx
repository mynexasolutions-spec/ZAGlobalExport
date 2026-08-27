import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, refreshProductsFromSupabase, createProduct, updateProduct, deleteProduct, updateProductVisibility, updateProductOrder } from '../../services/productsService';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

const DEFAULT_FORM_STATE = {
  id: '',
  title: '',
  shortTitle: '',
  subtitle: 'PREMIUM GRAINS',
  summary: '',
  description: '',
  cardImage: '',
  mainImage: '',
  origin: 'India',
  moisture: 'Max 12-13%',
  purity: 'Sortex Cleaned',
  packagingOptions: ['1 kg, 5 kg Retail Pouches', '25 kg, 50 kg PP Bags'],
  keyFeatures: ['100% Sortex Cleaned & Graded', 'Standardized International Export Packaging'],
  groups: [
    {
      heading: 'Suitable For',
      items: ['Catering Companies', 'Foodservice Operators', 'Wholesalers & Distributors'],
    },
  ],
  showOnHome: true,
  displayOrder: 0,
};

function AdminProducts() {
  // Load instantly from cache/static — no spinner on first render
  const [productsList, setProductsList] = useState(() => getProducts());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [varieties, setVarieties] = useState([]);
  const [newVariety, setNewVariety] = useState({ name: '', src: '', type: '' });
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingVariety, setUploadingVariety] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Background refresh from Supabase on mount — UI is already populated from cache
  useEffect(() => {
    setRefreshing(true);
    refreshProductsFromSupabase()
      .then((fresh) => {
        setProductsList(fresh);
      })
      .catch(() => {}) // silently ignore — cache is already shown
      .finally(() => setRefreshing(false));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    refreshProductsFromSupabase()
      .then((fresh) => setProductsList(fresh))
      .catch(() => {})
      .finally(() => setLoading(false));
  };



  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(DEFAULT_FORM_STATE);
    setVarieties([]);
    setNewVariety({ name: '', src: '', type: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      title: product.title || '',
      shortTitle: product.shortTitle || product.title || '',
      subtitle: product.subtitle || '',
      summary: product.summary || '',
      description: product.description || '',
      cardImage: product.cardImage || product.mainImage || '',
      mainImage: product.mainImage || product.cardImage || '',
      origin: product.origin || 'India',
      moisture: product.moisture || '',
      purity: product.purity || '',
      packagingOptions: Array.isArray(product.packagingOptions) ? [...product.packagingOptions] : [],
      keyFeatures: Array.isArray(product.keyFeatures) ? [...product.keyFeatures] : [],
      groups: Array.isArray(product.groups) && product.groups.length > 0 ? [...product.groups] : [
        {
          heading: 'Suitable For',
          items: ['Catering Companies', 'Foodservice Operators', 'Wholesalers & Distributors'],
        },
      ],
      showOnHome: product.showOnHome !== false,
      displayOrder: product.displayOrder !== undefined ? product.displayOrder : 0,
    });
    setVarieties(Array.isArray(product.categoryImages) ? [...product.categoryImages] : []);
    setNewVariety({ name: '', src: '', type: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Upload main image to Cloudinary — NO local fallback (must be on CDN before saving)
  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMain(true);
    try {
      const result = await uploadImageToCloudinary(file, 'za_products');
      setFormData((prev) => ({
        ...prev,
        mainImage: result.url,
        cardImage: prev.cardImage || result.url,
      }));
      showNotification('✓ Main image uploaded to Cloudinary successfully');
    } catch (err) {
      // Show the full Cloudinary error — no silent fallback
      showNotification(
        `Cloudinary upload failed: ${err.message}`,
        'error'
      );
    } finally {
      setUploadingMain(false);
      // Clear the file input so the same file can be retried
      e.target.value = '';
    }
  };

  // Upload variety image to Cloudinary — NO local fallback
  const handleVarietyImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVariety(true);
    try {
      const result = await uploadImageToCloudinary(file, 'za_varieties');
      setNewVariety((prev) => ({ ...prev, src: result.url }));
      showNotification('✓ Variety image uploaded to Cloudinary successfully');
    } catch (err) {
      showNotification(
        `Cloudinary upload failed: ${err.message}`,
        'error'
      );
    } finally {
      setUploadingVariety(false);
      e.target.value = '';
    }
  };

  const handleAddVariety = () => {
    if (!newVariety.name.trim() || !newVariety.src.trim()) {
      showNotification('Please enter a variety name and provide an image', 'error');
      return;
    }
    setVarieties((prev) => [...prev, { ...newVariety }]);
    setNewVariety({ name: '', src: '', type: '' });
  };

  const handleRemoveVariety = (index) => {
    setVarieties((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddPackaging = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        packagingOptions: [...prev.packagingOptions, e.target.value.trim()],
      }));
      e.target.value = '';
    }
  };

  const handleRemovePackaging = (index) => {
    setFormData((prev) => ({
      ...prev,
      packagingOptions: prev.packagingOptions.filter((_, i) => i !== index),
    }));
  };

  const handleAddFeature = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, e.target.value.trim()],
      }));
      e.target.value = '';
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mainImage.trim()) {
      showNotification('Title and Main Image are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData, varieties);
        showNotification(`Product "${formData.title}" updated successfully!`);
      } else {
        await createProduct(formData, varieties);
        showNotification(`Product "${formData.title}" created successfully!`);
      }
      setIsModalOpen(false);
      await loadAllProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      showNotification(err.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      showNotification('Product removed from catalog');
      setDeleteConfirmId(null);
      await loadAllProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showNotification('Failed to delete product', 'error');
    }
  };

  // Filter products by search query
  const filteredProducts = productsList.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.summary?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-products-page">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast ${notification.type}`}>
          <i
            className={`fa-solid ${
              notification.type === 'error'
                ? 'fa-circle-xmark'
                : notification.type === 'info'
                ? 'fa-circle-info'
                : 'fa-circle-check'
            }`}
          ></i>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Action Header */}
      <div className="admin-page-header">
        <div className="header-text">
          <h2>Product Management</h2>
          <p>Create, update, and manage food commodities displayed on the public website.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="fa-solid fa-plus"></i> Add New Product
        </button>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search products by title, category, or origin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        <div className="product-count-badge">
          {refreshing
            ? <><i className="fa-solid fa-circle-notch fa-spin" style={{marginRight:'6px',fontSize:'0.75rem'}}></i>Syncing...</>
            : <>{filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}</>}
        </div>
      </div>

      {/* Products Table — renders immediately from cache, no blocking spinner */}
      {loading ? (
        <div className="admin-table-loading">
          <i className="fa-solid fa-circle-notch fa-spin"></i> Reloading...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-state info-card">
          <i className="fa-solid fa-boxes-stacked"></i>
          <h3>No Products Found</h3>
          <p>
            {searchQuery
              ? `No products match "${searchQuery}". Try a different keyword.`
              : 'Your product catalog is empty. Click "+ Add New Product" to create one.'}
          </p>
          {searchQuery && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="admin-products-table-wrapper info-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product &amp; Category</th>
                <th>Origin &amp; Specs</th>
                <th>Varieties</th>
                <th style={{textAlign:'center'}}>Homepage</th>
                <th style={{textAlign:'center'}}>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-table-item">
                      <div className="product-table-thumb">
                        <img src={product.mainImage || product.cardImage} alt={product.title} />
                      </div>
                      <div className="product-table-meta">
                        <span className="product-table-subtitle">{product.subtitle}</span>
                        <strong className="product-table-title">{product.title}</strong>
                        <span className="product-table-id">ID: <code>{product.id}</code></span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="product-specs-cell">
                      <span><i className="fa-solid fa-location-dot"></i> {product.origin || 'India'}</span>
                      <span className="text-muted"><i className="fa-solid fa-star"></i> {product.purity || 'Sortex Clean'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="varieties-pill">
                      <i className="fa-solid fa-layer-group"></i>{' '}
                      {product.categoryImages?.length || 0} Varieties
                    </span>
                  </td>

                  {/* Homepage Visibility Toggle */}
                  <td style={{textAlign:'center'}}>
                    <button
                      type="button"
                      className={`home-visibility-btn ${product.showOnHome !== false ? 'visible' : 'hidden'}`}
                      title={product.showOnHome !== false ? 'Visible on Homepage — click to hide' : 'Hidden from Homepage — click to show'}
                      onClick={async () => {
                        const next = product.showOnHome === false ? true : false;
                        try {
                          await updateProductVisibility(product.id, next);
                          setProductsList((prev) =>
                            prev.map((p) => p.id === product.id ? { ...p, showOnHome: next } : p)
                          );
                          showNotification(next ? `"${product.title}" is now visible on homepage` : `"${product.title}" hidden from homepage`, next ? 'success' : 'info');
                        } catch (err) {
                          showNotification(`Failed: ${err.message}`, 'error');
                        }
                      }}
                    >
                      {product.showOnHome !== false
                        ? <><i className="fa-solid fa-eye"></i> <span>Visible</span></>
                        : <><i className="fa-solid fa-eye-slash"></i> <span>Hidden</span></>}
                    </button>
                  </td>

                  {/* Display Order */}
                  <td style={{textAlign:'center'}}>
                    <input
                      type="number"
                      className="order-input"
                      defaultValue={product.displayOrder || 0}
                      min={0}
                      max={99}
                      title="Homepage display order (lower = appears first)"
                      onBlur={async (e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val !== product.displayOrder) {
                          try {
                            await updateProductOrder(product.id, val);
                            setProductsList((prev) =>
                              prev.map((p) => p.id === product.id ? { ...p, displayOrder: val } : p)
                            );
                            showNotification(`Order updated to ${val}`);
                          } catch (err) {
                            showNotification(`Failed: ${err.message}`, 'error');
                          }
                        }
                      }}
                    />
                  </td>

                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="btn-action edit"
                        onClick={() => handleOpenEdit(product)}
                        title="Edit Product"
                      >
                        <i className="fa-solid fa-pen-to-square"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="btn-action delete"
                        onClick={() => setDeleteConfirmId(product.id)}
                        title="Delete Product"
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div className="admin-modal-card large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-group">
                <i className="fa-solid fa-boxes-stacked gold-accent"></i>
                <h3>{editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Export Product'}</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="admin-modal-body">
              {/* Basic Information */}
              <div className="form-section">
                <h4 className="form-section-title">1. Basic Information</h4>
                <div className="form-grid-2">
                  <div className="admin-form-group">
                    <label>Product Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indian Rice Varieties"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Category Subtitle *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PREMIUM GRAINS"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="admin-form-group">
                    <label>Short Title (for navigation/badges)</label>
                    <input
                      type="text"
                      placeholder="e.g. Rice"
                      value={formData.shortTitle}
                      onChange={(e) => setFormData({ ...formData, shortTitle: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL Slug / ID {!editingProduct && '(Leave blank to auto-generate)'}</label>
                    <input
                      type="text"
                      disabled={Boolean(editingProduct)}
                      placeholder="e.g. rice, spices, edible-oils"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Short Summary (displayed on product cards) *</label>
                  <textarea
                    required
                    rows="2"
                    placeholder="Brief export summary for buyers..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="admin-input"
                  ></textarea>
                </div>

                <div className="admin-form-group">
                  <label>Full Description (displayed on detail page) *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Comprehensive sourcing, grading, and processing details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-input"
                  ></textarea>
                </div>
              </div>

              {/* Media & Cloudinary Image Uploads */}
              <div className="form-section">
                <h4 className="form-section-title">2. Product Images (Cloudinary Upload)</h4>
                <div className="form-grid-2">
                  {/* Main Display Image */}
                  <div className="admin-form-group">
                    <label>Main Product Image *</label>
                    <div className="image-upload-box">
                      {formData.mainImage ? (
                        <div className="image-preview-wrapper">
                          <img src={formData.mainImage} alt="Main preview" />
                          <button
                            type="button"
                            className="btn-remove-img"
                            onClick={() => setFormData({ ...formData, mainImage: '' })}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ) : (
                        <label className="image-dropzone">
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          <span>{uploadingMain ? 'Uploading to Cloudinary...' : 'Upload Image (Cloudinary)'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleMainImageUpload}
                            disabled={uploadingMain}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                      <input
                        type="text"
                        placeholder="Or enter Image URL"
                        value={formData.mainImage}
                        onChange={(e) => setFormData({ ...formData, mainImage: e.target.value, cardImage: formData.cardImage || e.target.value })}
                        className="admin-input text-xs"
                      />
                    </div>
                  </div>

                  {/* Card Thumbnail Image */}
                  <div className="admin-form-group">
                    <label>Card Thumbnail Image (defaults to Main Image)</label>
                    <div className="image-upload-box">
                      {formData.cardImage ? (
                        <div className="image-preview-wrapper">
                          <img src={formData.cardImage} alt="Card preview" />
                          <button
                            type="button"
                            className="btn-remove-img"
                            onClick={() => setFormData({ ...formData, cardImage: '' })}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ) : (
                        <label className="image-dropzone">
                          <i className="fa-solid fa-image"></i>
                          <span>Select Card Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              try {
                                const res = await uploadImageToCloudinary(f, 'za_cards');
                                setFormData((prev) => ({ ...prev, cardImage: res.url }));
                                showNotification('✓ Card thumbnail uploaded to Cloudinary');
                              } catch (err) {
                                showNotification(`Card image upload failed: ${err.message}`, 'error');
                              }
                              e.target.value = '';
                            }}
                            style={{ display: 'none' }}
                          />
                        </label>
                      )}
                      <input
                        type="text"
                        placeholder="Or enter Card Image URL"
                        value={formData.cardImage}
                        onChange={(e) => setFormData({ ...formData, cardImage: e.target.value })}
                        className="admin-input text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Varieties & Category Gallery */}
              <div className="form-section">
                <h4 className="form-section-title">3. Varieties &amp; Gallery Showcase ({varieties.length})</h4>
                
                {/* List of existing varieties */}
                <div className="varieties-admin-grid">
                  {varieties.map((v, idx) => (
                    <div className="variety-admin-chip" key={idx}>
                      <img src={v.src} alt={v.name} />
                      <div className="variety-chip-info">
                        <strong>{v.name}</strong>
                        {v.type && <span>{v.type}</span>}
                      </div>
                      <button
                        type="button"
                        className="variety-delete-btn"
                        onClick={() => handleRemoveVariety(idx)}
                        title="Remove Variety"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new variety input strip */}
                <div className="add-variety-box">
                  <h5>Add a Variety / Gallery Item</h5>
                  <div className="form-grid-3">
                    <input
                      type="text"
                      placeholder="Variety Name (e.g. Toor Dal)"
                      value={newVariety.name}
                      onChange={(e) => setNewVariety({ ...newVariety, name: e.target.value })}
                      className="admin-input"
                    />
                    <input
                      type="text"
                      placeholder="Grade / Type (e.g. Sortex Clean)"
                      value={newVariety.type}
                      onChange={(e) => setNewVariety({ ...newVariety, type: e.target.value })}
                      className="admin-input"
                    />
                    <div className="variety-upload-inline">
                      <label className="btn btn-secondary btn-sm">
                        <i className="fa-solid fa-cloud-arrow-up"></i> {uploadingVariety ? 'Uploading...' : 'Choose Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleVarietyImageUpload}
                          disabled={uploadingVariety}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleAddVariety}
                        disabled={!newVariety.name || !newVariety.src}
                      >
                        <i className="fa-solid fa-plus"></i> Add
                      </button>
                    </div>
                  </div>
                  {newVariety.src && (
                    <div className="variety-src-preview">
                      <span>Image: <code>{newVariety.src.substring(0, 40)}...</code></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sourcing Specifications */}
              <div className="form-section">
                <h4 className="form-section-title">4. Sourcing &amp; Quality Specifications</h4>
                <div className="form-grid-3">
                  <div className="admin-form-group">
                    <label>Origin</label>
                    <input
                      type="text"
                      placeholder="e.g. India (Punjab, Haryana)"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Moisture Standard</label>
                    <input
                      type="text"
                      placeholder="e.g. Max 12-13%"
                      value={formData.moisture}
                      onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Purity / Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. 99% Sortex Cleaned"
                      value={formData.purity}
                      onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Packaging tags */}
                <div className="admin-form-group" style={{ marginTop: '12px' }}>
                  <label>Packaging Options (Type and press Enter to add)</label>
                  <div className="admin-tags-input-box">
                    {formData.packagingOptions.map((pack, idx) => (
                      <span className="admin-tag-chip" key={idx}>
                        <i className="fa-solid fa-box"></i> {pack}
                        <button type="button" onClick={() => handleRemovePackaging(idx)}>&times;</button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add packaging option..."
                      onKeyDown={handleAddPackaging}
                      className="admin-tag-input"
                    />
                  </div>
                </div>

                {/* Key features */}
                <div className="admin-form-group" style={{ marginTop: '12px' }}>
                  <label>Key Features &amp; Sourcing Strengths (Type and press Enter)</label>
                  <div className="admin-tags-input-box">
                    {formData.keyFeatures.map((feat, idx) => (
                      <span className="admin-tag-chip" key={idx}>
                        <i className="fa-solid fa-check"></i> {feat}
                        <button type="button" onClick={() => handleRemoveFeature(idx)}>&times;</button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add sourcing feature..."
                      onKeyDown={handleAddFeature}
                      className="admin-tag-input"
                    />
                  </div>
                </div>
              </div>

              {/* Homepage & Display Ordering */}
              <div className="form-section">
                <h4 className="form-section-title">4. Homepage &amp; Display Settings</h4>
                <div className="form-grid-2" style={{ alignItems: 'center' }}>
                  <div className="admin-form-group">
                    <label>Display on Homepage</label>
                    <label className="toggle-switch-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '6px' }}>
                      <input
                        type="checkbox"
                        checked={formData.showOnHome}
                        onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                        {formData.showOnHome ? '✓ Visible in "Our Products" on Homepage' : '✕ Hidden from Homepage'}
                      </span>
                    </label>
                  </div>

                  <div className="admin-form-group">
                    <label>Display Order (Lower number = shown first)</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) || 0 })}
                      className="admin-input"
                      style={{ maxWidth: '160px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-floppy-disk"></i>{' '}
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal-card small" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-content">
              <i className="fa-solid fa-triangle-exclamation warning-icon"></i>
              <h3>Delete Product?</h3>
              <p>
                Are you sure you want to delete this product? It will be permanently removed from the public website catalog.
              </p>
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
                  onClick={() => handleDeleteProduct(deleteConfirmId)}
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

export default AdminProducts;
