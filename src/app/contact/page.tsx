"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";

export default function ContactPage() {
  const { language, settings } = useStore();
  const tr = t(language);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary to-primary-dark py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{tr.contact.title}</h1>
          <p className="text-lg text-white/70">{tr.contact.subtitle}</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{tr.contact.sendMessage}</h2>
            {success ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder={tr.form.name} required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <input type="tel" placeholder={tr.form.phone} required value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <input type="email" placeholder={tr.form.email} value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <textarea placeholder={tr.form.message} rows={5} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : tr.contact.sendMessage}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{tr.contact.office}</h3>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: settings.address },
                  { icon: Phone, text: settings.phone },
                  { icon: Mail, text: settings.email },
                  { icon: Clock, text: "Mon - Sat: 9:00 AM - 7:00 PM" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                     <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                     <p className="text-gray-600 text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-md h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15543.0!2d80.1006!3d13.1067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526f482e37cd3b%3A0x2e0c45e0c95e1e0e!2sAvadi%2C%20Chennai!5e0!3m2!1sen!2sin!4v1"
                className="w-full h-full" allowFullScreen loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
