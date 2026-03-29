"use client";

import { useEffect } from "react";
import Toast from "@/components/ui/Toast";
import { ExitIntentPopup } from "@/components/leads/ExitIntentPopup";
import { WhatsAppButton } from "@/components/leads/WhatsAppButton";
import { useStore } from "@/store/useStore";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const { fetchSettings, fetchProjects } = useStore();

  useEffect(() => {
    fetchSettings();
    fetchProjects();
  }, [fetchSettings, fetchProjects]);

  return (
    <>
      {children}
      <WhatsAppButton />
      <ExitIntentPopup />
      <Toast />
    </>
  );
}
