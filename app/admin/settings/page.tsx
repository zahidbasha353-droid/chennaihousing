"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Save, Loader2 } from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

const Field = ({ label, value, onChange, type = "text", rows }: { label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {rows ? (
      <textarea rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
    ) : (
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
    )}
  </div>
);

export default function AdminSettingsPage() {
  const { settings, updateSettings, addToast, fetchSettings } = useStore();
  const [tab, setTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [local, setLocal] = useState({
    site_title: "", tagline: "", phone: "", email: "", address: "",
    primary_color: "", hero_heading: "", hero_subheading: "", hero_image: "",
    meta_title: "", meta_description: "", facebook_pixel: "",
    google_analytics: "", whatsapp: "", logo_url: ""
  });

  // Sync state when settings are fetched or updated
  useEffect(() => {
    if (settings) {
      setLocal({
        site_title: settings.site_title || "",
        tagline: settings.tagline || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        primary_color: settings.primary_color || "",
        hero_heading: settings.hero_heading || "",
        hero_subheading: settings.hero_subheading || "",
        hero_image: settings.hero_image || "",
        meta_title: settings.meta_title || "",
        meta_description: settings.meta_description || "",
        facebook_pixel: settings.facebook_pixel || "",
        google_analytics: settings.google_analytics || "",
        whatsapp: settings.whatsapp || "",
        logo_url: settings.logo_url || "",
      });
    }
  }, [settings]);

  // Fetch on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(local);
      addToast("Settings saved successfully", "success");
    } catch (err) {
      addToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "hero", label: "Hero" },
    { id: "seo", label: "SEO" },
    { id: "ads", label: "Ads & Tracking" },
    { id: "whatsapp", label: "WhatsApp" },
  ];

  return (
    <form onSubmit={handleSave} className="pb-24 relative min-h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {tab === "general" && (
          <div className="space-y-4 max-w-xl">
            <ImageUploader
              label="Site Logo"
              currentUrl={local.logo_url}
              onUpload={(url) => setLocal(prev => ({ ...prev, logo_url: url }))}
              compact
            />
            <Field label="Logo URL (or paste manually)" value={local.logo_url} onChange={(v) => setLocal({ ...local, logo_url: v })} />
            <Field label="Site Title" value={local.site_title} onChange={(v) => setLocal({ ...local, site_title: v })} />
            <Field label="Tagline" value={local.tagline} onChange={(v) => setLocal({ ...local, tagline: v })} />
            <Field label="Phone" value={local.phone} onChange={(v) => setLocal({ ...local, phone: v })} />
            <Field label="Email" value={local.email} onChange={(v) => setLocal({ ...local, email: v })} />
            <Field label="Address" value={local.address} onChange={(v) => setLocal({ ...local, address: v })} rows={3} />
            <Field label="Primary Color" value={local.primary_color} onChange={(v) => setLocal({ ...local, primary_color: v })} type="color" />
          </div>
        )}

        {tab === "hero" && (
          <div className="space-y-4 max-w-xl">
            <Field label="Hero Heading" value={local.hero_heading} onChange={(v) => setLocal({ ...local, hero_heading: v })} />
            <Field label="Hero Subheading" value={local.hero_subheading} onChange={(v) => setLocal({ ...local, hero_subheading: v })} />
            <ImageUploader
              label="Hero Banner Image"
              currentUrl={local.hero_image}
              onUpload={(url) => setLocal(prev => ({ ...prev, hero_image: url }))}
            />
            <Field label="Hero Image URL (or paste manually)" value={local.hero_image} onChange={(v) => setLocal({ ...local, hero_image: v })} />
          </div>
        )}

        {tab === "seo" && (
          <div className="space-y-4 max-w-xl">
            <Field label="Meta Title" value={local.meta_title} onChange={(v) => setLocal({ ...local, meta_title: v })} />
            <Field label="Meta Description" value={local.meta_description} onChange={(v) => setLocal({ ...local, meta_description: v })} rows={3} />
          </div>
        )}

        {tab === "ads" && (
          <div className="space-y-4 max-w-xl">
            <Field label="Facebook Pixel ID" value={local.facebook_pixel} onChange={(v) => setLocal({ ...local, facebook_pixel: v })} />
            <Field label="Google Analytics ID" value={local.google_analytics} onChange={(v) => setLocal({ ...local, google_analytics: v })} />
          </div>
        )}

        {tab === "whatsapp" && (
          <div className="space-y-4 max-w-xl">
            <Field label="WhatsApp Number (with country code)" value={local.whatsapp} onChange={(v) => setLocal({ ...local, whatsapp: v })} />
          </div>
        )}
      </div>

      {/* Sticky Save Button at Bottom */}
      <div className="fixed bottom-0 md:bottom-6 right-0 md:right-6 left-0 md:left-72 p-4 md:p-0 bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-gray-200 md:border-none md:flex md:justify-end z-20">
        <button type="submit" disabled={saving}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-70 transition-all">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
        </button>
      </div>
    </form>
  );
}
