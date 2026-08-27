-- ==============================================================================
-- ZA GLOBAL EXPORTS - Supabase Database Setup
-- Run this entire script in: Supabase Dashboard → SQL Editor → New Query
-- ==============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. CREATE TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    short_title TEXT,
    subtitle TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    card_image TEXT NOT NULL,
    main_image TEXT NOT NULL,
    origin TEXT,
    moisture TEXT,
    purity TEXT,
    packaging_options JSONB DEFAULT '[]'::jsonb,
    key_features JSONB DEFAULT '[]'::jsonb,
    groups JSONB DEFAULT '[]'::jsonb,
    display_order INTEGER DEFAULT 0,
    show_on_home BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    src TEXT NOT NULL,
    type TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'contacted', 'resolved')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_queries_status ON public.queries(status);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON public.queries(created_at DESC);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY
--    Using permissive anon policies so the admin panel (anon key) can write.
--    In production, switch to authenticated-only policies.
-- ==============================================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Drop old policies if re-running
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users full access products" ON public.products;
DROP POLICY IF EXISTS "Anon full access products" ON public.products;
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
DROP POLICY IF EXISTS "Authenticated users full access product images" ON public.product_images;
DROP POLICY IF EXISTS "Anon full access product images" ON public.product_images;
DROP POLICY IF EXISTS "Public can insert queries" ON public.queries;
DROP POLICY IF EXISTS "Authenticated users full access queries" ON public.queries;
DROP POLICY IF EXISTS "Anon full access queries" ON public.queries;

-- PRODUCTS: allow anon (browser) full read/write
CREATE POLICY "Anon full access products"
    ON public.products FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access products"
    ON public.products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- PRODUCT_IMAGES: allow anon (browser) full read/write
CREATE POLICY "Anon full access product images"
    ON public.product_images FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- QUERIES: allow anon to insert (public form) and full access for authenticated
CREATE POLICY "Anon full access queries"
    ON public.queries FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access queries"
    ON public.queries FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 4. HOMEPAGE SETTINGS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.homepage_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_badge TEXT DEFAULT 'ZA GLOBAL EXPORTS',
    hero_title TEXT DEFAULT 'From Indian farms to the global market',
    hero_description TEXT DEFAULT 'Reliable food supply for professional buyers. We connect Indian food products with distributors, catering companies, foodservice operators, wholesalers and institutional customers across global markets.',
    hero_bg_image TEXT DEFAULT '/banner-image.png',
    hero_primary_btn_text TEXT DEFAULT 'View Products',
    hero_primary_btn_link TEXT DEFAULT '/products',
    hero_secondary_btn_text TEXT DEFAULT 'Request a Quote',
    hero_secondary_btn_link TEXT DEFAULT '/contact',

    promise_subtitle TEXT DEFAULT 'OUR PROMISE',
    promise_title TEXT DEFAULT 'Clear Communication. Reliable Coordination. Professional Service.',
    promise_description TEXT DEFAULT 'We help professional food buyers source from India with practical information, coordinated export steps and service that respects commercial timelines.',
    promise_cards JSONB DEFAULT '[
      {"icon": "fa-comments", "title": "Clear Communication", "description": "Straightforward updates on product availability, specifications, timelines and documentation from enquiry to shipment."},
      {"icon": "fa-ship", "title": "Reliable Coordination", "description": "Structured follow-through across sourcing, packing, inspection readiness and export movement for food buyers."},
      {"icon": "fa-handshake", "title": "Professional Service", "description": "Buyer-focused support for distributors, wholesalers, caterers and foodservice teams sourcing Indian products."}
    ]'::jsonb,

    reach_subtitle TEXT DEFAULT 'GLOBAL REACH',
    reach_title TEXT DEFAULT 'From India To<br /><span class="text-primary">The Global Food Market</span>',
    reach_description TEXT DEFAULT 'ZA GLOBAL EXPORTS connects reliable Indian food sources with professional buyers across Saudi Arabia, the United Arab Emirates, Qatar, Kuwait, Oman, Bahrain and other international markets.',
    reach_image TEXT DEFAULT '/global-reach.webp',
    reach_badge_icon TEXT DEFAULT 'fa-solid fa-earth-asia',
    reach_badge_text TEXT DEFAULT 'Global Supply',
    reach_points JSONB DEFAULT '[
      "India-based food sourcing network",
      "Focusing international buyers and their requirements",
      "Export documentation and logistics support"
    ]'::jsonb,

    partners_subtitle TEXT DEFAULT 'OUR PARTNERS',
    partners_title TEXT DEFAULT 'Trusted by Global Leaders',
    partners_list JSONB DEFAULT '[
      {"name": "MAERSK", "icon": "fa-brands fa-dhl", "color": "#d40511", "logo_url": null},
      {"name": "msc", "icon": "fa-brands fa-fedex", "color": "#4d148c", "logo_url": null},
      {"name": "CMA CGM", "icon": "fa-brands fa-ups", "color": "#ffb500", "logo_url": null},
      {"name": "APL", "icon": "fa-brands fa-amazon", "color": "#ff9900", "logo_url": null},
      {"name": "EVERGREEN", "icon": "fa-brands fa-ebay", "color": "#e53238", "logo_url": null},
      {"name": "Hapag-Lloyd", "icon": "fa-brands fa-fedex", "color": "#ff6600", "logo_url": null}
    ]'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.homepage_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon full access homepage_settings" ON public.homepage_settings;
DROP POLICY IF EXISTS "Authenticated users full access homepage_settings" ON public.homepage_settings;

CREATE POLICY "Anon full access homepage_settings"
    ON public.homepage_settings FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users full access homepage_settings"
    ON public.homepage_settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

INSERT INTO public.homepage_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

