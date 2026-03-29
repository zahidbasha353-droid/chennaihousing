export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  city: string;
  price: number;       // DB: price BIGINT NOT NULL
  image: string;       // DB: image TEXT (single cover image)
  price_min: number;
  price_max: number;
  price_per_sqft: number;
  sqft_min: number;
  sqft_max: number;
  facing: string[];
  dtcp_approved: boolean;
  rera_number: string;
  status: "new" | "ongoing" | "sold_out" | "hot" | "active";
  featured: boolean;
  description: string;
  highlights: string[];
  amenities: string[];
  images: string[];
  video_url: string;
  youtube_url: string;
  brochure_url: string;
  map_lat: number;
  map_lng: number;
  nearby_places: { name: string; distance: string; type: string }[];
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  project_id: string;
  source: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "converted";
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  project_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

export interface SiteSettings {
  logo_url: string;
  favicon_url: string;
  site_title: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hero_image: string;
  hero_heading: string;
  hero_subheading: string;
  primary_color: string;
  facebook_pixel: string;
  google_analytics: string;
  meta_title: string;
  meta_description: string;
}
