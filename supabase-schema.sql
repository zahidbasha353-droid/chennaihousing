-- Drop existing tables to recreate exactly as needed
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- 1. SETTINGS
CREATE TABLE settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_title TEXT,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  hero_heading TEXT,
  hero_subheading TEXT,
  hero_image TEXT,
  -- other fields to keep UI happy
  logo_url TEXT,
  favicon_url TEXT,
  whatsapp TEXT,
  address TEXT,
  primary_color TEXT,
  facebook_pixel TEXT,
  google_analytics TEXT,
  meta_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ensure_single_row CHECK (id = 1)
);

-- Insert default single row
INSERT INTO settings (id, site_title, tagline, phone, email, hero_heading, hero_subheading, hero_image, whatsapp, address, primary_color) 
VALUES (1, 'Chennai Housing', 'Your Dream Plot Awaits', '+91 7550177369', 'zahidbasha353@gmail.com', 'Find Your Dream Plot in Chennai', 'DTCP Approved Plots Starting from ₹9 Lakh*', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=800&fit=crop', '917550177369', 'Chennai', '#E53935')
ON CONFLICT (id) DO NOTHING;

-- 2. PROJECTS
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price BIGINT NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'new',
  
  -- UI supportive fields
  slug TEXT,
  city TEXT DEFAULT 'Chennai',
  price_min BIGINT,
  price_max BIGINT,
  price_per_sqft INTEGER,
  sqft_min INTEGER,
  sqft_max INTEGER,
  facing TEXT[] DEFAULT '{}',
  dtcp_approved BOOLEAN DEFAULT true,
  rera_number TEXT,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  youtube_url TEXT,
  brochure_url TEXT,
  map_lat DECIMAL(10, 7),
  map_lng DECIMAL(10, 7),
  nearby_places JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEADS
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  email TEXT,
  source TEXT DEFAULT 'website',
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public write settings" ON settings FOR ALL USING (true); -- For MVP/demo purposes

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public write projects" ON projects FOR ALL USING (true);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Public write leads" ON leads FOR ALL USING (true);

-- ============================================
-- SUPABASE STORAGE POLICIES
-- Run this AFTER creating a bucket called "images" (set Public = ON)
-- ============================================

-- Allow anyone to upload images
CREATE POLICY "Public Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

-- Allow anyone to read/view images
CREATE POLICY "Public Read" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Allow anyone to update images
CREATE POLICY "Public Update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

-- Allow anyone to delete images
CREATE POLICY "Public Delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');
