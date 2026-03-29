"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Edit2, Trash2, Eye, Star, Search, ArrowLeft, X,
  Upload, Loader2, Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/i18n";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ImageUploader from "@/components/ui/ImageUploader";

const EMPTY_FORM = {
  title: "",
  slug: "",
  location: "",
  city: "Chennai",
  price_min: "",
  price_max: "",
  price_per_sqft: "",
  sqft_min: "",
  sqft_max: "",
  facing: [] as string[],
  dtcp_approved: true,
  rera_number: "",
  status: "new" as const,
  featured: false,
  description: "",
  highlights: "",
  amenities: "",
  images: [] as string[],
  youtube_url: "",
  brochure_url: "",
  map_lat: "",
  map_lng: "",
};

export default function AdminProjectsPage() {
  const { projects, addProject, deleteProject, addToast } = useStore();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteProject(deleteId);
      addToast("Project deleted successfully", "success");
      setDeleteId(null);
    }
  };

  const statusColors: Record<string, string> = {
    new: "bg-green-100 text-green-700",
    hot: "bg-orange-100 text-orange-700",
    ongoing: "bg-blue-100 text-blue-700",
    sold_out: "bg-gray-100 text-gray-700",
  };

  if (showForm) {
    return <AddProjectForm onClose={() => setShowForm(false)} />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-600">Project</th>
                <th className="text-left p-4 font-medium text-gray-600">Location</th>
                <th className="text-left p-4 font-medium text-gray-600">Price Range</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Featured</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{project.title}</p>
                    <p className="text-xs text-gray-500">
                      {project.sqft_min}-{project.sqft_max} sq.ft
                    </p>
                  </td>
                  <td className="p-4 text-gray-600">{project.location}</td>
                  <td className="p-4 text-gray-600">
                    {formatPrice(project.price_min)} - {formatPrice(project.price_max)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        statusColors[project.status]
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 text-sm text-gray-500">
          Showing {filtered.length} of {projects.length} projects
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

const Input = ({
  label, name, value, onChange, type = "text", placeholder = "", required = false, error,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean; error?: string;
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name} name={name} type={type} placeholder={placeholder}
      value={value || ""} onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
        error ? "border-red-300 bg-red-50" : "border-gray-200"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

/* =====================================================
   ADD PROJECT FORM — Isolated component to keep parent stable
   ===================================================== */
function AddProjectForm({ onClose }: { onClose: () => void }) {
  const { addProject, addToast } = useStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Stable field change handler — no re-focus issues
  const setField = useCallback(
    <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const toggleFacing = useCallback((dir: string) => {
    setForm((prev) => ({
      ...prev,
      facing: prev.facing.includes(dir)
        ? prev.facing.filter((f) => f !== dir)
        : [...prev.facing, dir],
    }));
  }, []);

  const addImageUrl = useCallback((url: string) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImagePreviews((prev) => [...prev, url]);
  }, []);

  const removeImage = useCallback((idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.price_min) e.price_min = "Min price is required";
    if (!form.price_max) e.price_max = "Max price is required";
    if (!form.price_per_sqft) e.price_per_sqft = "Price/sqft is required";
    if (!form.sqft_min) e.sqft_min = "Min sqft is required";
    if (!form.sqft_max) e.sqft_max = "Max sqft is required";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast("Please fix the errors in the form", "error");
      return;
    }

    setSaving(true);
    
    const slug =
      form.slug.trim() ||
      form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    try {
      const imageList = form.images.length > 0
        ? form.images
        : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop"];

      await addProject({
        title: form.title,
        slug,
        location: form.location,
        city: form.city || "Chennai",
        price: Number(form.price_min) || 0,
        image: imageList[0] || "",
        price_min: Number(form.price_min) || 0,
        price_max: Number(form.price_max) || 0,
        price_per_sqft: Number(form.price_per_sqft) || 0,
        sqft_min: Number(form.sqft_min) || 0,
        sqft_max: Number(form.sqft_max) || 0,
        facing: form.facing.length > 0 ? form.facing : ["East"],
        dtcp_approved: form.dtcp_approved,
        rera_number: form.rera_number || "",
        status: form.status || "new",
        featured: form.featured,
        description: form.description || "",
        highlights: form.highlights ? form.highlights.split(",").map((s) => s.trim()).filter(Boolean) : [],
        amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean) : [],
        images: imageList,
        video_url: "",
        youtube_url: form.youtube_url || "",
        brochure_url: form.brochure_url || "",
        map_lat: Number(form.map_lat) || 13.1067,
        map_lng: Number(form.map_lng) || 80.1006,
        nearby_places: [],
      });
      addToast("Project added successfully! 🎉", "success");
      onClose();
    } catch (err: any) {
      addToast(err.message || "Failed to save project", "error");
    } finally {
      setSaving(false);
    }
  };

  const isDisabled =
    !form.title.trim() || !form.location.trim() || !form.price_min || !form.sqft_min;



  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Title" name="title" value={form.title}
                onChange={(v) => setField("title", v)} required error={errors.title}
                placeholder="e.g. Green Valley Premium Plots"
              />
              <Input
                label="URL Slug (auto-generated)" name="slug" value={form.slug}
                onChange={(v) => setField("slug", v)}
                placeholder="leave empty to auto-generate"
              />
              <Input
                label="Location" name="location" value={form.location}
                onChange={(v) => setField("location", v)} required error={errors.location}
                placeholder="e.g. Avadi, Near Pattabiram"
              />
              <Input
                label="City" name="city" value={form.city}
                onChange={(v) => setField("city", v)} placeholder="Chennai"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Area</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="Min Price (₹)" name="price_min" value={form.price_min}
                onChange={(v) => setField("price_min", v)} type="number" required error={errors.price_min}
                placeholder="e.g. 1500000"
              />
              <Input
                label="Max Price (₹)" name="price_max" value={form.price_max}
                onChange={(v) => setField("price_max", v)} type="number" required error={errors.price_max}
                placeholder="e.g. 4000000"
              />
              <Input
                label="Price per Sq.ft (₹)" name="price_per_sqft" value={form.price_per_sqft}
                onChange={(v) => setField("price_per_sqft", v)} type="number" required error={errors.price_per_sqft}
                placeholder="e.g. 2500"
              />
              <Input
                label="Min Area (sq.ft)" name="sqft_min" value={form.sqft_min}
                onChange={(v) => setField("sqft_min", v)} type="number" required error={errors.sqft_min}
                placeholder="e.g. 600"
              />
              <Input
                label="Max Area (sq.ft)" name="sqft_max" value={form.sqft_max}
                onChange={(v) => setField("sqft_max", v)} type="number" required error={errors.sqft_max}
                placeholder="e.g. 2400"
              />
              <Input
                label="RERA Number" name="rera_number" value={form.rera_number}
                onChange={(v) => setField("rera_number", v)}
                placeholder="TN/01/Layout/0000/2024"
              />
            </div>
          </div>

          {/* Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Facing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facing</label>
                <div className="flex flex-wrap gap-2">
                  {["East", "West", "North", "South"].map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => toggleFacing(dir)}
                      className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                        form.facing.includes(dir)
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value as typeof form.status)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="new">New Launch</option>
                  <option value="hot">Hot</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dtcp_approved}
                    onChange={(e) => setField("dtcp_approved", e.target.checked as boolean & typeof form.dtcp_approved)}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">DTCP Approved</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField("featured", e.target.checked as boolean & typeof form.featured)}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Featured Project</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Describe the project..."
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none ${
                    errors.description ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
              <Input
                label="Highlights (comma-separated)" name="highlights" value={form.highlights}
                onChange={(v) => setField("highlights", v)}
                placeholder="DTCP Approved, Clear Title, 24/7 Security"
              />
              <Input
                label="Amenities (comma-separated)" name="amenities" value={form.amenities}
                onChange={(v) => setField("amenities", v)}
                placeholder="Tar Road, Street Lights, Underground Drainage"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="space-y-4">
              {/* Drag & Drop Upload */}
              <ImageUploader
                label="Upload Project Image"
                onUpload={(url) => {
                  if (url) {
                    addImageUrl(url);
                  }
                }}
              />

              {/* OR paste URL */}
              <div className="flex gap-2">
                <input
                  id="img-url-input"
                  type="url"
                  placeholder="Or paste image URL..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("img-url-input") as HTMLInputElement;
                    if (input?.value?.trim()) {
                      addImageUrl(input.value.trim());
                      input.value = "";
                    }
                  }}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imagePreviews.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media & Location */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Media & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="YouTube URL" name="youtube_url" value={form.youtube_url}
                onChange={(v) => setField("youtube_url", v)}
                placeholder="https://youtube.com/embed/..."
              />
              <Input
                label="Brochure URL" name="brochure_url" value={form.brochure_url}
                onChange={(v) => setField("brochure_url", v)}
                placeholder="Link to brochure PDF"
              />
              <Input
                label="Map Latitude" name="map_lat" value={form.map_lat}
                onChange={(v) => setField("map_lat", v)} type="number"
                placeholder="13.1067"
              />
              <Input
                label="Map Longitude" name="map_lng" value={form.map_lng}
                onChange={(v) => setField("map_lng", v)} type="number"
                placeholder="80.1006"
              />
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-4 -mx-4 md:-mx-6 mt-6 border-t border-gray-200 flex items-center justify-between gap-3 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled || saving}
            className="px-8 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all hover:shadow-xl"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
