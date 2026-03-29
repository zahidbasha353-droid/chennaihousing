"use client";

import { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function BookVisitPage() {
  const { projects } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", project: "", date: "", time: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSuccess(true);
    setLoading(false);
  };

  const availableProjects = projects.filter((p) => p.status !== "sold_out");
  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary to-primary-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Book a Free Site Visit</h1>
          <p className="text-white/70">Visit our projects and experience the plots firsthand</p>
        </div>
      </div>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {success ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit Booked!</h2>
                <p className="text-gray-500 mb-6">Our team will confirm your visit shortly.</p>
                <p className="text-sm text-gray-400">We&apos;ll send confirmation via WhatsApp & Email</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Full Name *" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" placeholder="Phone *" required value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" placeholder="Email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white">
                    <option value="">Select Project *</option>
                    {availableProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" required value={form.date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none bg-white">
                      <option value="">Preferred Time *</option>
                      {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <textarea placeholder="Any special requirements?" rows={3} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Book Free Site Visit"}
                </button>

                <p className="text-xs text-gray-400 text-center">Free pickup and drop • No obligation</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
