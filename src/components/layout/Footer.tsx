"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";

export default function Footer() {
  const { language, settings } = useStore();
  const tr = t(language);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_title || "Logo"}
                  className="w-10 h-10 rounded-xl object-contain bg-white p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                  {settings.site_title?.substring(0, 2).toUpperCase() || "CH"}
                </div>
              )}
              <span className="text-xl font-bold text-white">{settings.site_title || "Chennai Housing"}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {tr.footer.aboutText}
            </p>
            <div className="flex gap-3">
              {["facebook", "instagram", "youtube", "twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                  aria-label={social}
                >
                  <span className="text-xs font-bold uppercase">{social[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{tr.footer.quickLinks}</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: tr.nav.home },
                { href: "/projects", label: tr.nav.projects },
                { href: "/about", label: tr.nav.about },
                { href: "/contact", label: tr.nav.contact },
                { href: "/book-visit", label: tr.nav.bookVisit },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Areas */}
          <div>
            <h3 className="text-white font-semibold mb-4">Popular Areas</h3>
            <ul className="space-y-2.5">
              {["Avadi", "Ambattur", "Poonamallee", "Thirumullaivoyal", "Puzhal", "Thiruverkadu"].map(
                (area) => (
                  <li key={area}>
                    <Link
                      href={`/projects?location=${area.toLowerCase()}`}
                      className="text-sm text-gray-400 hover:text-primary transition-colors duration-200"
                    >
                      Plots in {area}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{tr.footer.contactInfo}</h3>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li>
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="flex gap-3 text-sm hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex gap-3 text-sm hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span>{settings.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">{tr.footer.copyright}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 w-10 h-10 bg-gray-800 hover:bg-primary text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
