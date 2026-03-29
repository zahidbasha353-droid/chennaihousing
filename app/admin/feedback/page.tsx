"use client";

import { useState } from "react";
import { MessageSquare, Loader2, Save } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AdminFeedbackPage() {
  const { addToast } = useStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "Admin User", message: "" });
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: "Admin User", message: "Need to update the hero banner dimensions.", date: "2024-03-27" },
    { id: 2, name: "Admin User", message: "Please check the lead export functionality, sometimes it misses new leads.", date: "2024-03-25" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      addToast("Please enter a message", "error");
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    setFeedbacks([
      {
        id: Date.now(),
        name: form.name,
        message: form.message,
        date: new Date().toISOString().split("T")[0],
      },
      ...feedbacks,
    ]);

    addToast("Feedback submitted successfully", "success");
    setForm({ ...form, message: "" });
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feedback / Issues</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Submit Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message / Issue Details <span className="text-red-500">*</span></label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe the issue, feature request, or feedback here..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={saving || !form.message.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Feedback"}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Feedback</h2>
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 text-sm">No feedback submitted yet.</p>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-gray-900">{fb.name}</span>
                    <span className="text-xs text-gray-500">{fb.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{fb.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
