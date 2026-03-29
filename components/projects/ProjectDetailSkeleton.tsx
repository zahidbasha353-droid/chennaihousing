import React from "react";

export default function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="bg-gray-100 h-64 md:h-[400px] w-full animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4 animate-pulse" />
              <div className="flex gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded-full w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-full w-32 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-100 my-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded-lg w-40 mb-6 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-4 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-xl w-full mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 bg-primary/20 rounded-xl w-full animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-xl w-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
