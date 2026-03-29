"use client";

import { useState } from "react";
import { X, Phone, User, Mail, MessageSquare, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";

interface LeadFormProps {
  projectId?: string;
  projectTitle?: string;
  source?: string;
  onClose?: () => void;
  inline?: boolean;
}

export function LeadForm({ projectId, projectTitle, source = "website", onClose, inline = false }: LeadFormProps) {
  const { addLead } = useStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));

    addLead({
      id: Date.now().toString(),
      ...form,
      project_id: projectId || "",
      source,
      status: "new",
      created_at: new Date().toISOString(),
    });

    const { settings } = useStore.getState();
    const waText = `Hi Admin, I submitted an enquiry on your website. My name is ${form.name} (${form.phone}). I am interested in ${projectTitle || 'your plots'}.`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(waText)}`, "_blank");

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: "", phone: "", email: "", message: "" });
      onClose?.();
    }, 2000);
  };

  const content = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Thank You!</h3>
          <p className="text-sm text-gray-500">Our executive will contact you shortly.</p>
        </div>
      ) : (
        <>
          {projectTitle && (
            <p className="text-sm text-gray-500 mb-2">Enquiry for: <strong className="text-gray-900">{projectTitle}</strong></p>
          )}

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="Phone Number *"
              required
              pattern="[0-9]{10}"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              placeholder="Message (Optional)"
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Submit Enquiry"
            )}
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            By submitting, you agree to our Terms & Privacy Policy
          </p>
        </>
      )}
    </form>
  );

  if (inline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Get Best Price</h2>
        <p className="text-sm text-gray-500 mb-4">Fill the form and our team will reach out</p>
        {content}
      </div>
    </div>
  );
}
