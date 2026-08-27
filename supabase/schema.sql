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
