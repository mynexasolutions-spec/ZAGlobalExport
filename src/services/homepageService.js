import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_CACHE_KEY = 'za_homepage_settings_v1';

export const DEFAULT_HOMEPAGE_SETTINGS = {
  hero_badge: 'ZA GLOBAL EXPORTS',
  hero_title: 'From Indian Farms to Global Market ( word Case)',
  hero_description: 'Reliable food supply for professional buyers. We connect Indian food products with distributors, catering companies, foodservice operators, wholesalers and institutional customers across global markets.',
  hero_bg_image: '/banner-image.png',
  hero_bg_images: [
  '/images/bg-ship3.jpg',
  '/images/bg-ship1.jpg',
  '/images/bg-ship2.jpg',
  '/images/bg-ship6.jpg',
  '/images/bg-ship4.jpg',
  '/images/bg-ship5.jpg',
  // add as many as you want
],
  hero_primary_btn_text: 'View Products',
  hero_primary_btn_link: '/products',
  hero_secondary_btn_text: 'Request a Quote',
  hero_secondary_btn_link: '/contact',

  promise_subtitle: 'OUR PROMISE',
  promise_title: 'Clear Communication. Reliable Coordination. Professional Service.',
  promise_description: 'We help professional food buyers source from India with practical information, coordinated export steps and service that respects commercial timelines.',
  promise_cards: [
    {
      icon: 'fa-comments',
      title: 'Clear Communication',
      description: 'Straightforward updates on product availability, specifications, timelines and documentation from enquiry to shipment.',
    },
    {
      icon: 'fa-ship',
      title: 'Reliable Coordination',
      description: 'Structured follow-through across sourcing, packing, inspection readiness and export movement for food buyers.',
    },
    {
      icon: 'fa-handshake',
      title: 'Professional Service',
      description: 'Buyer-focused support for distributors, wholesalers, caterers and foodservice teams sourcing Indian products.',
    },
  ],

  reach_subtitle: 'GLOBAL REACH',
  reach_title: 'From India To<br /><span class="text-primary">The Global Food Market</span>',
  reach_description: 'ZA GLOBAL EXPORTS connects reliable Indian food sources with professional buyers across Saudi Arabia, the United Arab Emirates, Qatar, Kuwait, Oman, Bahrain and other international markets.',
  reach_image: '/global-reach.webp',
  reach_badge_icon: 'fa-solid fa-earth-asia',
  reach_badge_text: 'Global Supply',
  reach_points: [
    'India-based food sourcing network',
    'Focusing international buyers and their requirements',
    'Export documentation and logistics support',
  ],

  partners_subtitle: 'OUR PARTNERS',
  partners_title: 'Trusted by Global Leaders',
  partners_list: [
    { name: 'MAERSK', icon: 'fa-brands fa-dhl', color: '#d40511', logo_url: null },
    { name: 'msc', icon: 'fa-brands fa-fedex', color: '#4d148c', logo_url: null },
    { name: 'CMA CGM', icon: 'fa-brands fa-ups', color: '#ffb500', logo_url: null },
    { name: 'APL', icon: 'fa-brands fa-amazon', color: '#ff9900', logo_url: null },
    { name: 'EVERGREEN', icon: 'fa-brands fa-ebay', color: '#e53238', logo_url: null },
    { name: 'Hapag-Lloyd', icon: 'fa-brands fa-fedex', color: '#ff6600', logo_url: null },
  ],
};

function readCache() {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return null;
}

function writeCache(data) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch (_) { /* ignore */ }
}

/**
 * Returns homepage settings instantly from local storage cache or defaults.
 */
export function getHomepageSettings() {
  return readCache() || DEFAULT_HOMEPAGE_SETTINGS;
}

/**
 * Fetches settings from Supabase in the background and writes to local storage cache.
 * Resolves to the latest settings.
 */
export async function refreshHomepageSettings() {
  if (!isSupabaseConfigured || !supabase) return getHomepageSettings();

  try {
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      // Ensure JSON data types are parsed correctly
      const settings = {
        ...DEFAULT_HOMEPAGE_SETTINGS,
        ...data,
        promise_cards: Array.isArray(data.promise_cards) ? data.promise_cards : DEFAULT_HOMEPAGE_SETTINGS.promise_cards,
        reach_points: Array.isArray(data.reach_points) ? data.reach_points : DEFAULT_HOMEPAGE_SETTINGS.reach_points,
        partners_list: Array.isArray(data.partners_list) ? data.partners_list : DEFAULT_HOMEPAGE_SETTINGS.partners_list,
      };
      writeCache(settings);
      return settings;
    } else {
      // Try to initialize database row if empty
      try {
        const { data: inserted, error: insertErr } = await supabase
          .from('homepage_settings')
          .insert([{ id: 1 }])
          .select()
          .single();

        if (!insertErr && inserted) {
          const settings = {
            ...DEFAULT_HOMEPAGE_SETTINGS,
            ...inserted,
            promise_cards: Array.isArray(inserted.promise_cards) ? inserted.promise_cards : DEFAULT_HOMEPAGE_SETTINGS.promise_cards,
            reach_points: Array.isArray(inserted.reach_points) ? inserted.reach_points : DEFAULT_HOMEPAGE_SETTINGS.reach_points,
            partners_list: Array.isArray(inserted.partners_list) ? inserted.partners_list : DEFAULT_HOMEPAGE_SETTINGS.partners_list,
          };
          writeCache(settings);
          return settings;
        }
      } catch (e) {
        // Silently catch insertion error in case table exists but insert fails
      }
    }
  } catch (err) {
    console.warn('[homepageService] Supabase refresh failed:', err.message);
  }

  return getHomepageSettings();
}

/**
 * Updates homepage settings in Supabase and syncs cache.
 */
export async function updateHomepageSettings(settingsData) {
  if (!isSupabaseConfigured || !supabase) {
    // If not configured, save locally as mock
    const current = getHomepageSettings();
    const updated = {
      ...current,
      ...settingsData,
      updated_at: new Date().toISOString(),
    };
    writeCache(updated);
    console.warn('[homepageService] Supabase not configured – settings saved locally only.');
    return updated;
  }

  const payload = {
    hero_badge: settingsData.hero_badge,
    hero_title: settingsData.hero_title,
    hero_description: settingsData.hero_description,
    hero_bg_image: settingsData.hero_bg_image,
    hero_primary_btn_text: settingsData.hero_primary_btn_text,
    hero_primary_btn_link: settingsData.hero_primary_btn_link,
    hero_secondary_btn_text: settingsData.hero_secondary_btn_text,
    hero_secondary_btn_link: settingsData.hero_secondary_btn_link,

    promise_subtitle: settingsData.promise_subtitle,
    promise_title: settingsData.promise_title,
    promise_description: settingsData.promise_description,
    promise_cards: settingsData.promise_cards,

    reach_subtitle: settingsData.reach_subtitle,
    reach_title: settingsData.reach_title,
    reach_description: settingsData.reach_description,
    reach_image: settingsData.reach_image,
    reach_badge_icon: settingsData.reach_badge_icon,
    reach_badge_text: settingsData.reach_badge_text,
    reach_points: settingsData.reach_points,

    partners_subtitle: settingsData.partners_subtitle,
    partners_title: settingsData.partners_title,
    partners_list: settingsData.partners_list,

    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('homepage_settings')
    .update(payload)
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update homepage settings: ${error.message}`);
  }

  const settings = {
    ...DEFAULT_HOMEPAGE_SETTINGS,
    ...data,
    promise_cards: Array.isArray(data.promise_cards) ? data.promise_cards : DEFAULT_HOMEPAGE_SETTINGS.promise_cards,
    reach_points: Array.isArray(data.reach_points) ? data.reach_points : DEFAULT_HOMEPAGE_SETTINGS.reach_points,
    partners_list: Array.isArray(data.partners_list) ? data.partners_list : DEFAULT_HOMEPAGE_SETTINGS.partners_list,
  };
  writeCache(settings);
  return settings;
}
