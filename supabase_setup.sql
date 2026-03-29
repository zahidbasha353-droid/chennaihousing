-- Copy and run this script in the Supabase SQL Editor.

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'new',
  
  -- Optionally preserve original expanded properties 
  slug TEXT,
  price_min NUMERIC,
  price_max NUMERIC,
  price_per_sqft NUMERIC,
  sqft_min INT,
  sqft_max INT,
  facing TEXT[],
  dtcp_approved BOOLEAN DEFAULT true,
  rera_number TEXT,
  featured BOOLEAN DEFAULT false,
  description TEXT,
  highlights TEXT[],
  amenities TEXT[],
  images TEXT[],
  video_url TEXT,
  youtube_url TEXT,
  brochure_url TEXT,
  map_lat NUMERIC,
  map_lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_id TEXT,
  
  -- Optional context properties used in the app
  email TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  
  site_title TEXT,
  tagline TEXT,
  phone TEXT,
  email TEXT,
  hero_heading TEXT,
  hero_subheading TEXT,
  hero_image TEXT,

  -- Matching extended properties existing in app schema
  logo_url TEXT,
  favicon_url TEXT,
  whatsapp TEXT,
  address TEXT,
  primary_color TEXT,
  facebook_pixel TEXT,
  google_analytics TEXT,
  meta_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Baseline Setting row so the frontend doesn't crash on initial hydration:
INSERT INTO settings (id, site_title, tagline, phone, email, hero_heading, hero_subheading)
VALUES (
  1, 
  'Chennai Housing', 
  'Your Dream Plot Awaits', 
  '+91 7550177369', 
  'zahidbasha353@gmail.com', 
  'Find Your Dream Plot in Chennai', 
  'DTCP Approved Plots Starting from ₹9 Lakh*'
) ON CONFLICT (id) DO NOTHING;
