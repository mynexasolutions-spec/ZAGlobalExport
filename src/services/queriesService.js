/**
 * queriesService.js
 *
 * Strategy:
 *  - getQueries() returns cached data INSTANTLY
 *  - refreshQueriesFromSupabase() fetches fresh data in background
 *  - All writes go to Supabase only, errors are thrown
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_CACHE_KEY = 'za_queries_cache_v2';

function readCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return [];
}

function writeCache(list) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(list));
  } catch (_) { /* ignore */ }
}

// ---------------------------------------------------------------------------
// getQueries — returns INSTANTLY from cache, never hangs
// ---------------------------------------------------------------------------
export function getQueries() {
  return readCache();
}

// ---------------------------------------------------------------------------
// refreshQueriesFromSupabase — background refresh, returns Promise<query[]>
// ---------------------------------------------------------------------------
export async function refreshQueriesFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return getQueries();

  try {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data) {
      writeCache(data);
      return data;
    }
  } catch (err) {
    console.warn('[queriesService] Supabase refresh failed:', err.message);
  }

  return getQueries();
}

// ---------------------------------------------------------------------------
// submitQuery — inserts into Supabase, throws on error
// ---------------------------------------------------------------------------
export async function submitQuery(queryData) {
  const payload = {
    name: queryData.name || queryData.contactPerson || 'Anonymous Buyer',
    email: queryData.email || '',
    phone: queryData.phone || '',
    company: queryData.company || '',
    subject: queryData.subject || `Product Inquiry: ${queryData.product || 'General'}`,
    message: queryData.message || queryData.requirements || '',
    status: 'unread',
    admin_notes: '',
  };

  if (!isSupabaseConfigured || !supabase) {
    // Local-only fallback when DB is genuinely unavailable
    const local = {
      id: `local-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _isLocal: true,
    };
    writeCache([local, ...readCache()]);
    console.warn('[queriesService] Supabase not configured – query saved locally only.');
    return local;
  }

  const { data, error } = await supabase
    .from('queries')
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(`Failed to save inquiry: ${error.message}`);

  writeCache([data, ...readCache().filter((q) => q.id !== data.id)]);
  return data;
}

// ---------------------------------------------------------------------------
// updateQueryStatus — updates in Supabase, throws on error
// ---------------------------------------------------------------------------
export async function updateQueryStatus(id, status, adminNotes) {
  if (!id) throw new Error('Query ID is required.');
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured.');

  const payload = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) payload.admin_notes = adminNotes;

  const { error } = await supabase.from('queries').update(payload).eq('id', id);
  if (error) throw new Error(`Failed to update query status: ${error.message}`);

  const cached = readCache();
  writeCache(
    cached.map((q) =>
      q.id === id
        ? { ...q, status, admin_notes: adminNotes !== undefined ? adminNotes : q.admin_notes, updated_at: payload.updated_at }
        : q
    )
  );
  return true;
}

// ---------------------------------------------------------------------------
// deleteQuery — deletes from Supabase, throws on error
// ---------------------------------------------------------------------------
export async function deleteQuery(id) {
  if (!id) throw new Error('Query ID is required.');
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase not configured.');

  const { error } = await supabase.from('queries').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete query: ${error.message}`);

  writeCache(readCache().filter((q) => q.id !== id));
  return true;
}
