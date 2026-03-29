"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, Phone, Globe, Lock } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen, language, setLanguage, settings } = useStore();
  const tr = t(language);
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  // Secret Admin Access State
  const [clickCount, setClickCount] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (clickCount > 0 && clickCount < 10) {
      timeout = setTimeout(() => setClickCount(0), 5000);
    }
    if (clickCount >= 10) {
      setShowPinModal(true);
      setClickCount(0);
    }
    return () => clearTimeout(timeout);
  }, [clickCount]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "2633") {
      localStorage.setItem("admin_auth", "true");
      setShowPinModal(false);
      setPin("");
      setPinError("");
      router.push("/admin");
    } else {
      setPinError("Invalid PIN");
      setPin("");
    }
  };

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
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setClickCount(c => c + 1)}>
              <Link href="/" className="flex items-center gap-2" onClick={(e) => { if (clickCount > 0) e.preventDefault(); }}>
                {settings.logo_url && !imgError ? (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden group-hover:scale-105 transition-transform bg-gray-100 flex-shrink-0">
                    <Image
                      src={settings.logo_url}
                      alt={settings.site_title || "Logo"}
                      fill
                      sizes="40px"
                      className="object-contain"
                      onError={() => setImgError(true)}
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform flex-shrink-0">
                    {settings.site_title?.substring(0, 2).toUpperCase() || "CH"}
                  </div>
                )}
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">{settings.site_title || "Chennai Housing"}</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5 tracking-wide max-w-[150px] truncate uppercase">{settings.tagline || "Premium Plots"}</p>
              </div>
            </Link>
            </div>

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

      {/* Secret Admin Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gray-900 p-6 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Access</h3>
              <p className="text-gray-400 text-sm mt-1">Enter your security PIN to continue</p>
            </div>
            <form onSubmit={handleAdminAuth} className="p-6">
              <div className="mb-4">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • •"
                  className="w-full text-center text-2xl tracking-[0.5em] font-bold p-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  maxLength={4}
                  autoFocus
                />
                {pinError && <p className="text-red-500 text-sm text-center mt-2 font-medium">{pinError}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary text-white font-medium hover:bg-primary-dark rounded-xl transition-colors shadow-lg shadow-primary/25"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
