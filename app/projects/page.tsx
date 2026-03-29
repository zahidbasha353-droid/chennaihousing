import { Suspense } from "react";
import ProjectsClient from "@/components/projects/ProjectsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Chennai Housing",
  description: "Browse our premium DTCP approved plots and properties in Chennai.",
};

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-20 text-center">Loading projects...</div>}>
      <ProjectsClient />
    </Suspense>
  );
}
