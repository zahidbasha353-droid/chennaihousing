"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function AdminLoginPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      addToast("Please enter the admin PIN", "error");
      return;
    }

    setLoading(true);
    // Artificial delay for better UX
    setTimeout(() => {
      if (pin === "2633") {
        localStorage.setItem("admin_auth", "true");
        addToast("Authenticated successfully", "success");
        router.push("/admin");
      } else {
        addToast("Invalid PIN. Please try again.", "error");
        setPin("");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your security PIN to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-center">
              Enter Admin PIN
            </label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] font-bold py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••"
                maxLength={4}
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Enter Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
