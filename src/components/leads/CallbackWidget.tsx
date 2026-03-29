"use client";

import { useState } from "react";
import { Phone, User, Loader2, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export function CallbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    
    const { addLead, settings } = useStore.getState();
    addLead({
      id: Date.now().toString(),
      name: form.name,
      phone: form.phone,
      email: "",
      message: "Requested Callback",
      project_id: "",
      source: "callback_widget",
      status: "new",
      created_at: new Date().toISOString(),
    });

    const waText = `Hi Admin, I requested a callback from your website. My name is ${form.name} (${form.phone}). Please call me back.`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waText)}`, "_blank");

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      setSuccess(false);
      setIsOpen(false);
      setForm({ name: "", phone: "" });
    }, 2000);
  };

  return (
    <>
      {/* Trigger Button - shown on mobile bottom bar */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-200 md:hidden animate-pulse-glow"
      >
        <Phone className="w-5 h-5" />
        <span className="text-sm font-medium">Call Back</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-slideUp">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Get Instant Callback</h3>
              <p className="text-sm text-gray-500">Our executive will call you within 5 mins</p>
            </div>

            {success ? (
              <div className="text-center py-4">
                <p className="text-green-600 font-semibold">✓ We&apos;ll call you shortly!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    pattern="[0-9]{10}"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Callback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
