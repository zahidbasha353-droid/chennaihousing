"use client";

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-gray-200" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-4 pt-2">
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-20" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-gray-200 rounded-xl flex-1" />
          <div className="h-10 w-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
