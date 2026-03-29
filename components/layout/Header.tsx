"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, Globe } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen, language, setLanguage, settings } = useStore();
  const tr = t(language);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: tr.nav.home },
    { href: "/projects", label: tr.nav.projects },
    { href: "/about", label: tr.nav.about },
    { href: "/contact", label: tr.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_title || "Logo"}
                  className="w-10 h-10 rounded-xl object-contain group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                  {settings.site_title?.substring(0, 2).toUpperCase() || "CH"}
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">{settings.site_title || "Chennai Housing"}</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5 tracking-wide max-w-[150px] truncate uppercase">{settings.tagline || "Premium Plots"}</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-primary border border-gray-200 rounded-full hover:border-primary transition-all"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5" />
                {language === "en" ? "தமிழ்" : "EN"}
              </button>

              {/* Call Button */}
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-white transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">Call Now</span>
              </a>

              {/* CTA Button */}
              <Link
                href="/book-visit"
                className="hidden md:inline-flex px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                {tr.nav.bookVisit}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 space-y-1 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book-visit"
              onClick={() => setMobileMenuOpen(false)}
              className="block mx-4 mt-3 px-5 py-3 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-xl text-center shadow-lg"
            >
              {tr.nav.bookVisit}
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
