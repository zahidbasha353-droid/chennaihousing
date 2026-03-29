"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, ArrowRight } from "lucide-react";
import { Project } from "@/lib/types";
import { formatPrice } from "@/lib/i18n";
import { useStore } from "@/store/useStore";

interface PropertyCardProps {
  project: Project;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: "New Launch", color: "bg-emerald-500" },
  hot: { label: "🔥 Hot", color: "bg-orange-500" },
  ongoing: { label: "Ongoing", color: "bg-blue-500" },
  sold_out: { label: "Sold Out", color: "bg-gray-500" },
  active: { label: "Active", color: "bg-emerald-500" },
};

const FALLBACK_IMAGE = "/no-image.png";

export default function PropertyCard({ project }: PropertyCardProps) {
  const { favorites, toggleFavorite } = useStore();
  const isFav = favorites.includes(project.id);
  const status = statusConfig[project.status] || statusConfig.new;

  // Build image URL with multiple fallbacks
  const imageUrl =
    (project.images && project.images.length > 0 && project.images[0]) ||
    project.image ||
    FALLBACK_IMAGE;

  const [imgSrc, setImgSrc] = useState(imageUrl);

  return (
    <Link
      href={`/projects/${project.slug || project.id}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={project.title || "Project"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Status Badge */}
        <span className={`absolute top-3 left-3 ${status.color} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}>
          {status.label}
        </span>

        {/* DTCP Badge */}
        {project.dtcp_approved && (
          <span className="absolute top-3 right-12 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            DTCP ✓
          </span>
        )}

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(project.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isFav
              ? "bg-primary text-white"
              : "bg-white/90 text-gray-600 hover:text-primary"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
        </button>

        {/* Price on image */}
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-lg drop-shadow-lg">
            {project.price_min ? formatPrice(project.price_min) : "₹--"} - {project.price_max ? formatPrice(project.price_max) : "₹--"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {project.title || "Untitled Project"}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="line-clamp-1">{project.location || "Location N/A"}</span>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
          <span>{project.sqft_min || 0} - {project.sqft_max || 0} sq.ft</span>
          <span className="text-gray-300">|</span>
          <span>{project.price_per_sqft ? formatPrice(project.price_per_sqft) : "₹--"}/sq.ft</span>
          <span className="text-gray-300">|</span>
          <span>{(project.facing || []).slice(0, 2).join(", ") || "N/A"}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-medium rounded-xl group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-200">
            View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const { settings } = useStore.getState();
              window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in your plot: ${project.title}. Please share more details.`)}`, "_blank");
            }}
            className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors cursor-pointer"
            role="button"
            aria-label="WhatsApp"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
