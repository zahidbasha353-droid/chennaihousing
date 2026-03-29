"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Shield, FileCheck, Landmark, Scale, Star, ChevronRight, Phone, MapPin, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t, formatPrice } from "@/lib/i18n";
import { TESTIMONIALS } from "@/lib/data";
import PropertyCard from "@/components/ui/PropertyCard";
import { CallbackWidget } from "@/components/leads/CallbackWidget";

export default function HomeClient() {
  const { projects, language, settings } = useStore();
  const tr = t(language);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.hero_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop"}
            alt="Premium residential plots"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = "/no-image.png"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              DTCP Approved | RERA Registered
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {settings.hero_heading || tr.hero.heading}
            </h2>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              {settings.hero_subheading || tr.hero.subheading}
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={tr.hero.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/projects?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Link
                href={`/projects${searchQuery ? `?q=${searchQuery}` : ""}`}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-200 text-center whitespace-nowrap"
              >
                {tr.hero.search}
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-white/90">
              <div>
                <p className="text-2xl font-bold">50+</p>
                <p className="text-sm text-white/60">Projects</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold">2000+</p>
                <p className="text-sm text-white/60">Plots Sold</p>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <p className="text-2xl font-bold">8+</p>
                <p className="text-sm text-white/60">Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: tr.trust.dtcp, color: "text-green-600", bg: "bg-green-50" },
              { icon: FileCheck, label: tr.trust.rera, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Landmark, label: tr.trust.loan, color: "text-purple-600", bg: "bg-purple-50" },
              { icon: Scale, label: tr.trust.legal, color: "text-orange-600", bg: "bg-orange-50" },
            ].map(({ icon: Icon, label, color, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-3 p-4 ${bg} rounded-xl hover:shadow-md transition-all duration-200`}
              >
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="font-medium text-sm text-gray-800">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
              ⭐ Featured
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {tr.featured.title}
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {tr.featured.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredProjects.slice(0, 6).map((project, i) => (
              <div key={project.id} className="animate-slideUp" style={{ animationDelay: `${i * 100}ms` }}>
                <PropertyCard project={project} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-200"
            >
              {tr.featured.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose Chennai Housing?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We make buying your dream plot simple, safe, and affordable
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "100% Legal", desc: "Every plot comes with verified legal documents and clear titles", icon: "📋", color: "from-blue-500 to-blue-600" },
              { title: "Best Prices", desc: "Directly from developers, no brokerage charges", icon: "💰", color: "from-green-500 to-green-600" },
              { title: "Easy EMI", desc: "Bank loan approved projects with flexible EMI options", icon: "🏦", color: "from-purple-500 to-purple-600" },
              { title: "Free Site Visit", desc: "Complimentary transportation for site visits", icon: "🚗", color: "from-orange-500 to-orange-600" },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
              ❤️ Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {tr.testimonials.title}
            </h2>
            <p className="text-gray-500">{tr.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
                  &ldquo;{item.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary to-primary-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {tr.cta.title}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {tr.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book-visit"
              className="px-8 py-4 bg-white text-primary font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              {tr.cta.button}
            </Link>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" /> {tr.cta.call}
            </a>
          </div>
        </div>
      </section>

      <CallbackWidget />
    </div>
  );
}
