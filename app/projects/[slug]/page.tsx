"use client";

import { useState, use, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MapPin, Phone, Heart, Share2, ChevronLeft, ChevronRight as ChevronRightIcon,
  Shield, CheckCircle, Calculator, Download, Navigation,
  School, Building2, TrainFront, Landmark as LandmarkIcon, AlertCircle, RefreshCcw
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatPrice } from "@/lib/i18n";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import { LeadForm } from "@/components/leads/LeadForm";
import PropertyCard from "@/components/ui/PropertyCard";
import { getProjectBySlugWithTimeout } from "@/lib/api";
import { Project } from "@/lib/types";
import ProjectDetailSkeleton from "@/components/projects/ProjectDetailSkeleton";
import Image from "next/image";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { projects, favorites, toggleFavorite, settings } = useStore();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [emiAmount, setEmiAmount] = useState(2000000);
  const [emiTenure, setEmiTenure] = useState(20);
  const emiRate = 8.5;

  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("DEBUG: Loading slug ->", slug);
    
    try {
      const data = await getProjectBySlugWithTimeout(slug);
      console.log("DEBUG: Data received ->", data);
      
      if (!data) {
        setError("Project not found");
      } else {
        setProject(data);
      }
    } catch (err: any) {
      console.error("DEBUG: Fetch Error ->", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-10 bg-white rounded-3xl shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {error === "Project not found" ? "Project Not Found" : "Connection Error"}
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {error === "Project not found" 
              ? "The project you are looking for doesn't exist or has been moved."
              : "We're having trouble connecting to the database. Please check your internet or try again."}
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => loadProject()}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <RefreshCcw className="w-5 h-5" /> Retry Loading
            </button>
            <Link href="/projects" className="px-6 py-3.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all">
              Browse All Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(project.id);

  // EMI calculation
  const monthlyRate = emiRate / 12 / 100;
  const months = emiTenure * 12;
  const emi = Math.round((emiAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));

  const similarProjects = projects.filter((p: Project) => p.id !== project.id && p.city === project.city).slice(0, 3);

  const nearbyIcons: Record<string, typeof School> = {
    school: School,
    hospital: Building2,
    transport: TrainFront,
    landmark: LandmarkIcon,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-primary">Projects</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{project.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
              <div className="relative aspect-[16/9] bg-gray-100">
                <Image
                  src={(project.images && project.images[currentImage]) || project.image || "/no-image.png"}
                  alt={`${project.title} - Image ${currentImage + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
                  className="object-cover"
                  onError={(e) => { e.currentTarget.setAttribute('src', '/no-image.png'); }}
                />

                {/* Navigation */}
                {project.images && project.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((prev) => prev === 0 ? (project.images?.length || 1) - 1 : prev - 1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImage((prev) => prev === (project.images?.length || 1) - 1 ? 0 : prev + 1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                  {currentImage + 1} / {project.images?.length || 1}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(project.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isFav ? "bg-primary text-white" : "bg-white/80 hover:bg-white text-gray-700"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-700">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {project.images && project.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 ${
                        i === currentImage ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image 
                        src={img} 
                        alt="" 
                        fill
                        sizes="80px"
                        className="object-cover" 
                        onError={(e) => { e.currentTarget.setAttribute('src', '/no-image.png'); }} 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" /> {project.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatPrice(project.price_min)} - {formatPrice(project.price_max)}</p>
                  <p className="text-sm text-gray-500">{formatPrice(project.price_per_sqft)} per sq.ft</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Area</p>
                  <p className="font-semibold">{project.sqft_min} - {project.sqft_max} sq.ft</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Facing</p>
                  <p className="font-semibold">{project.facing.join(", ")}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold capitalize">{project.status.replace("_", " ")}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">RERA</p>
                  <p className="font-semibold text-xs">{project.rera_number}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" /> Highlights
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🏗️ Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {project.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Table */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Pricing</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 rounded-l-lg">Plot Size</th>
                      <th className="text-left p-3">Rate/Sq.ft</th>
                      <th className="text-left p-3 rounded-r-lg">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[project.sqft_min, Math.round((project.sqft_min + project.sqft_max) / 2), project.sqft_max].map((sqft) => (
                      <tr key={sqft} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium">{sqft} sq.ft</td>
                        <td className="p-3">{formatPrice(project.price_per_sqft)}</td>
                        <td className="p-3 font-semibold text-primary">{formatPrice(sqft * project.price_per_sqft)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EMI Calculator */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" /> EMI Calculator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Loan Amount: <strong>{formatPrice(emiAmount)}</strong></label>
                    <input
                      type="range" min={500000} max={10000000} step={100000}
                      value={emiAmount}
                      onChange={(e) => setEmiAmount(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Tenure: <strong>{emiTenure} years</strong></label>
                    <input
                      type="range" min={5} max={30} step={1}
                      value={emiTenure}
                      onChange={(e) => setEmiTenure(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Interest Rate: <strong>{emiRate}%</strong></label>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
                    <p className="text-sm text-gray-500 mb-1">Monthly EMI</p>
                    <p className="text-4xl font-bold text-primary">{formatPrice(emi)}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Total payable: {formatPrice(emi * months)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Video */}
            {project.youtube_url && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">🎥 Project Video</h2>
                  <YouTubeEmbed url={project.youtube_url} />
                </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" /> Location
              </h2>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${project.map_lng}!3d${project.map_lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Nearby Places */}
              {project.nearby_places.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Nearby Places</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {project.nearby_places.map((place) => {
                      const Icon = nearbyIcons[place.type] || MapPin;
                      return (
                        <div key={place.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Icon className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{place.name}</p>
                            <p className="text-xs text-gray-500">{place.distance}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Lead Form */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Interested?</h3>
                <p className="text-sm text-gray-500 mb-4">Get best price & offers</p>
                <LeadForm
                  projectId={project.id}
                  projectTitle={project.title}
                  source="project_detail"
                  inline
                />
              </div>

              {/* Download Brochure */}
              {project.brochure_url && (
                <button
                  onClick={() => setShowLeadForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-5 h-5" /> Download Brochure
                </button>
              )}

              {/* Contact */}
              <div className="bg-primary/5 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-600 mb-3">Need Help?</p>
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors mb-3"
                >
                  <Phone className="w-5 h-5" /> Call {settings.phone}
                </a>
                <a
                  href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${project.title}. Please share more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Projects */}
        {similarProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProjects.map((p) => (
                <PropertyCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-2 z-40 md:hidden">
        <a
          href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-primary text-white font-semibold rounded-xl"
        >
          <Phone className="w-4 h-4" /> Call
        </a>
        <a
          href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${project.title}. Please share more details.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-green-500 text-white font-semibold rounded-xl"
        >
          WhatsApp
        </a>
      </div>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <LeadForm
          projectId={project.id}
          projectTitle={project.title}
          source="brochure_download"
          onClose={() => setShowLeadForm(false)}
        />
      )}
    </div>
  );
}
