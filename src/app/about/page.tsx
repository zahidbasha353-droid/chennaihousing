"use client";

import { useStore } from "@/store/useStore";
import { t } from "@/lib/i18n";

export default function AboutPage() {
  const { language } = useStore();
  const tr = t(language);

  const stats = [
    { value: "50+", label: tr.about.stats.projects },
    { value: "2000+", label: tr.about.stats.plots },
    { value: "1500+", label: tr.about.stats.customers },
    { value: "8+", label: tr.about.stats.years },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{tr.about.title}</h1>
          <p className="text-lg text-white/70">{tr.about.subtitle}</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">Our Story</span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Building Dreams Since 2015</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Chennai Housing was founded with a simple yet powerful vision: to make home ownership accessible to every middle-class family in Chennai.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our commitment to transparency, legal verification, and customer satisfaction has earned us the trust of over 1500 happy families.
            </p>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" alt="Company" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <div className="text-2xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{tr.about.mission}</h3>
            <p className="text-gray-600 leading-relaxed">{tr.about.missionText}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            <div className="text-2xl mb-4">🔭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{tr.about.vision}</h3>
            <p className="text-gray-600 leading-relaxed">{tr.about.visionText}</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white mb-2">{s.value}</p>
              <p className="text-white/70 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Karthikeyan R", role: "Founder & CEO", avatar: "KR" },
              { name: "Priya Venkat", role: "Sales Director", avatar: "PV" },
              { name: "Suresh Kumar", role: "Legal Head", avatar: "SK" },
              { name: "Deepa Lakshmi", role: "Marketing Manager", avatar: "DL" },
            ].map((m) => (
              <div key={m.name} className="text-center group">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                  {m.avatar}
                </div>
                <h4 className="font-semibold text-gray-900">{m.name}</h4>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
