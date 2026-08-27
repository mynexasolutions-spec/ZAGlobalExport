/**
 * productsService.js
 *
 * Strategy:
 *  - getProducts() returns cached/static data INSTANTLY (no await needed for UI)
 *  - A background Supabase refresh runs in parallel; call refreshProductsInBackground()
 *    to kick it off and get a Promise that resolves with fresh data when done.
 *
 * All writes (create/update/delete) go to Supabase only — errors are thrown.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { products as staticSeedProducts } from '../data/products';

const LOCAL_CACHE_KEY = 'za_products_cache_v2';

// ---------------------------------------------------------------------------
// Internal cache helpers
// ---------------------------------------------------------------------------
function readCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) { /* ignore */ }
  return null;
}

function writeCache(list) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(list));
  } catch (_) { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Map Supabase row → app shape
// ---------------------------------------------------------------------------
function mapRow(p, images = []) {
  const myImages = images
    .filter((img) => img.product_id === p.id)
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map((img) => ({ id: img.id, name: img.name, src: img.src, type: img.type || '' }));

  return {
    id: p.id,
    title: p.title,
    shortTitle: p.short_title || p.title,
    subtitle: p.subtitle,
    summary: p.summary,
    description: p.description,
    cardImage: p.card_image,
    mainImage: p.main_image,
    origin: p.origin || 'India',
    moisture: p.moisture || 'Standard Export Grade',
    purity: p.purity || 'Sortex Cleaned',
    packagingOptions: Array.isArray(p.packaging_options) ? p.packaging_options : [],
    keyFeatures: Array.isArray(p.key_features) ? p.key_features : [],
    groups: Array.isArray(p.groups) ? p.groups : [],
    categoryImages: myImages,
    displayOrder: p.display_order || 0,
    showOnHome: p.show_on_home !== false, // default true
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

// ---------------------------------------------------------------------------
// getProducts — returns INSTANTLY from cache/static, never hangs
// ---------------------------------------------------------------------------
export function getProducts() {
  return readCache() || staticSeedProducts;
}

// ---------------------------------------------------------------------------
// getHomeProducts — only products marked visible on homepage, sorted by order
// ---------------------------------------------------------------------------
export function getHomeProducts() {
  const all = getProducts();
  return all
    .filter((p) => p.showOnHome !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// ---------------------------------------------------------------------------
// refreshProductsFromSupabase — fetch fresh data from DB, update cache
// Returns a Promise<product[]> — call this in the background
// ---------------------------------------------------------------------------
export async function refreshProductsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getProducts();

  try {
    const { data: rows, error: pErr } = await supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (pErr) throw pErr;

    if (rows && rows.length > 0) {
      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .order('display_order', { ascending: true });

      const mapped = rows.map((r) => mapRow(r, images || []));
      writeCache(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('[productsService] Supabase refresh failed:', err.message);
  }

  return getProducts();
}

// ---------------------------------------------------------------------------
// getProductById — sync from cache, async refresh if needed
// ---------------------------------------------------------------------------
export function getProductById(id) {
  if (!id) return null;
  const all = getProducts();
  return all.find((p) => p.id.toLowerCase() === id.toLowerCase()) || null;
}

// ---------------------------------------------------------------------------
// createProduct — writes to Supabase, throws on error
// ---------------------------------------------------------------------------
export async function createProduct(productData, varieties = []) {
  const slug =
    (productData.id || productData.title || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `product-${Date.now()}`;

  const row = {
    id: slug,
    title: productData.title,
    short_title: productData.shortTitle || productData.title,
    subtitle: productData.subtitle || 'EXPORT COMMODITY',
    summary: productData.summary || '',
    description: productData.description || '',
    card_image: productData.cardImage || productData.mainImage,
    main_image: productData.mainImage,
    origin: productData.origin || 'India',
    moisture: productData.moisture || 'Standard Export Grade',
    purity: productData.purity || 'Sortex Cleaned',
    packaging_options: productData.packagingOptions || [],
    key_features: productData.keyFeatures || [],
    groups: productData.groups || [],
    display_order: productData.displayOrder || 0,
    show_on_home: productData.showOnHome !== false, // default true
  };

  if (row.main_image && (row.main_image.startsWith('blob:') || row.main_image.startsWith('data:'))) {
    throw new Error('Main image must be uploaded to Cloudinary first.');
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Cannot save product without database connection.');
  }

  const { data: inserted, error: insertErr } = await supabase
    .from('products')
    .insert([row])
    .select()
    .single();

  if (insertErr) throw new Error(`Failed to save product: ${insertErr.message}`);

  if (varieties && varieties.length > 0) {
    const validVarieties = varieties.filter(
      (v) => v.src && !v.src.startsWith('blob:') && !v.src.startsWith('data:')
    );
    if (validVarieties.length > 0) {
      const imageRows = validVarieties.map((v, i) => ({
        product_id: slug,
        name: v.name,
        src: v.src,
        type: v.type || '',
        display_order: i + 1,
      }));
      const { error: varErr } = await supabase.from('product_images').insert(imageRows);
      if (varErr) throw new Error(`Product saved but variety images failed: ${varErr.message}`);
    }
  }

  // Refresh cache in background
  refreshProductsFromSupabase().catch(() => {});
  return mapRow(inserted, varieties.map((v, i) => ({ ...v, product_id: slug, display_order: i + 1 })));
}

// ---------------------------------------------------------------------------
// updateProduct — writes to Supabase, throws on error
// ---------------------------------------------------------------------------
export async function updateProduct(id, productData, varieties = []) {
  if (!id) throw new Error('Product ID is required for update.');
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured.');

  if (
    productData.mainImage &&
    (productData.mainImage.startsWith('blob:') || productData.mainImage.startsWith('data:'))
  ) {
    throw new Error('Main image must be uploaded to Cloudinary first.');
  }

  const row = {
    title: productData.title,
    short_title: productData.shortTitle || productData.title,
    subtitle: productData.subtitle || 'EXPORT COMMODITY',
    summary: productData.summary || '',
    description: productData.description || '',
    card_image: productData.cardImage || productData.mainImage,
    main_image: productData.mainImage,
    origin: productData.origin || 'India',
    moisture: productData.moisture || 'Standard Export Grade',
    purity: productData.purity || 'Sortex Cleaned',
    packaging_options: productData.packagingOptions || [],
    key_features: productData.keyFeatures || [],
    groups: productData.groups || [],
    display_order: productData.displayOrder || 0,
    show_on_home: productData.showOnHome !== false,
    updated_at: new Date().toISOString(),
  };

  const { data: updated, error: updateErr } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) throw new Error(`Failed to update product: ${updateErr.message}`);

  await supabase.from('product_images').delete().eq('product_id', id);

  if (varieties && varieties.length > 0) {
    const validVarieties = varieties.filter(
      (v) => v.src && !v.src.startsWith('blob:') && !v.src.startsWith('data:')
    );
    if (validVarieties.length > 0) {
      const imageRows = validVarieties.map((v, i) => ({
        product_id: id,
        name: v.name,
        src: v.src,
        type: v.type || '',
        display_order: i + 1,
      }));
      const { error: varErr } = await supabase.from('product_images').insert(imageRows);
      if (varErr) throw new Error(`Product updated but variety images failed: ${varErr.message}`);
    }
  }

  refreshProductsFromSupabase().catch(() => {});
  return mapRow(updated, varieties.map((v, i) => ({ ...v, product_id: id, display_order: i + 1 })));
}

// ---------------------------------------------------------------------------
// deleteProduct — deletes from Supabase
// ---------------------------------------------------------------------------
export async function deleteProduct(id) {
  if (!id) throw new Error('Product ID is required for deletion.');
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured.');

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete product: ${error.message}`);

  const cached = readCache();
  if (cached) writeCache(cached.filter((p) => p.id !== id));

  return true;
}

// ---------------------------------------------------------------------------
// updateProductVisibility — quick toggle show_on_home without full edit
// ---------------------------------------------------------------------------
export async function updateProductVisibility(id, showOnHome) {
  if (!id) throw new Error('Product ID is required.');
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured.');

  const { error } = await supabase
    .from('products')
    .update({ show_on_home: showOnHome, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Failed to update visibility: ${error.message}`);

  // Update cache instantly
  const cached = readCache();
  if (cached) {
    writeCache(cached.map((p) => p.id === id ? { ...p, showOnHome } : p));
  }
  return true;
}

// ---------------------------------------------------------------------------
// updateProductOrder — quick update display_order without full edit
// ---------------------------------------------------------------------------
export async function updateProductOrder(id, displayOrder) {
  if (!id) throw new Error('Product ID is required.');
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured.');

  const order = parseInt(displayOrder, 10);
  if (isNaN(order)) throw new Error('Display order must be a number.');

  const { error } = await supabase
    .from('products')
    .update({ display_order: order, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`Failed to update order: ${error.message}`);

  const cached = readCache();
  if (cached) {
    writeCache(cached.map((p) => p.id === id ? { ...p, displayOrder: order } : p));
  }
  return true;
}

