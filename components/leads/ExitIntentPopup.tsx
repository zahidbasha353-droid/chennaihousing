"use client";

import { useState, useEffect } from "react";
import { LeadForm } from "./LeadForm";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
      }
    };

    // Also show after 30 seconds
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <LeadForm
      source="exit_intent"
      onClose={() => {
        setShow(false);
        setDismissed(true);
      }}
    />
  );
}
