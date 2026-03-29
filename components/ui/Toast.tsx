"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Toast() {
  const { toasts, removeToast } = useStore();

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 w-80">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: { id: string; message: string; type: "success" | "error" | "info" };
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bg: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-800",
    },
  };

  const c = config[toast.type];
  const Icon = c.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${c.bg} animate-slideInRight`}
      role="alert"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${c.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${c.textColor}`}>{toast.message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
