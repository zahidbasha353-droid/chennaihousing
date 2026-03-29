"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, MapPin, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { t, formatPrice } from "@/lib/i18n";
import PropertyCard from "@/components/ui/PropertyCard";
import SkeletonCard from "@/components/ui/SkeletonCard";

import { Suspense } from "react";

const LOCATION_CHIPS = [
  "Chennai", "Avadi", "Tambaram", "Porur", "Medavakkam",
  "Sholinganallur", "Perambur", "Ambattur", "Velachery", "OMR",
];

function ProjectsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { projects, language, favorites } = useStore();
  const tr = t(language);

  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sqftRange, setSqftRange] = useState<[number, number]>([0, 3000]);
  const [selectedFacing, setSelectedFacing] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [dtcpOnly, setDtcpOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync URL ?q= param when searchQuery changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q && q !== searchQuery) {
      setSearchQuery(q);
    }
    // Only run on mount / URL change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Text search — match title, location, city, description
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q) ||
          (p.city || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Location chips
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((p) =>
        selectedLocations.some(
          (loc) =>
            (p.location || "").toLowerCase().includes(loc.toLowerCase()) ||
            (p.city || "").toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Price range
    filtered = filtered.filter((p) => {
      const pMin = p.price_min || 0;
      const pMax = p.price_max || Infinity;
      return pMin <= priceRange[1] && pMax >= priceRange[0];
    });

    // Sqft range
    filtered = filtered.filter((p) => {
      const sMin = p.sqft_min || 0;
      const sMax = p.sqft_max || Infinity;
      return sMin <= sqftRange[1] && sMax >= sqftRange[0];
    });

    // Facing
    if (selectedFacing.length > 0) {
      filtered = filtered.filter(
        (p) => p.facing && p.facing.some((f) => selectedFacing.includes(f))
      );
    }

    // DTCP only
    if (dtcpOnly) filtered = filtered.filter((p) => p.dtcp_approved);

    // Featured only
    if (featuredOnly) filtered = filtered.filter((p) => p.featured);

    // Favorites only
    if (favoritesOnly) filtered = filtered.filter((p) => favorites.includes(p.id));

    // Sort
    switch (sortBy) {
      case "priceLow":
        filtered.sort((a, b) => (a.price_min || 0) - (b.price_min || 0)); break;
      case "priceHigh":
        filtered.sort((a, b) => (b.price_min || 0) - (a.price_min || 0)); break;
      case "areaLow":
        filtered.sort((a, b) => (a.sqft_min || 0) - (b.sqft_min || 0)); break;
      case "areaHigh":
        filtered.sort((a, b) => (b.sqft_min || 0) - (a.sqft_min || 0)); break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [projects, searchQuery, selectedLocations, priceRange, sqftRange, selectedFacing, dtcpOnly, featuredOnly, favoritesOnly, sortBy, favorites]);

  const facingOptions = ["East", "West", "North", "South"];

  const activeFilterCount = [
    selectedLocations.length > 0,
    priceRange[0] > 0 || priceRange[1] < 10000000,
    sqftRange[0] > 0 || sqftRange[1] < 3000,
    selectedFacing.length > 0,
    dtcpOnly,
    featuredOnly,
    favoritesOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 10000000]);
    setSqftRange([0, 3000]);
    setSelectedFacing([]);
    setSelectedLocations([]);
    setDtcpOnly(false);
    setFeaturedOnly(false);
    setFavoritesOnly(false);
    setSortBy("latest");
    router.replace("/projects");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/projects${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery.trim())}` : ""}`);
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{tr.filters.title}</h3>
        <button onClick={clearFilters} className="text-xs text-primary hover:underline">{tr.filters.clear}</button>
      </div>

      {/* Location Chips */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">📍 Location</label>
        <div className="flex flex-wrap gap-2">
          {LOCATION_CHIPS.map((loc) => (
            <button
              key={loc}
              onClick={() =>
                setSelectedLocations((prev) =>
                  prev.includes(loc) ? prev.filter((x) => x !== loc) : [...prev, loc]
                )
              }
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedLocations.includes(loc)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{tr.filters.price}</label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={10000000}
            step={100000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Sqft Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{tr.filters.sqft}</label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={3000}
            step={100}
            value={sqftRange[1]}
            onChange={(e) => setSqftRange([sqftRange[0], Number(e.target.value)])}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{sqftRange[0]} sq.ft</span>
            <span>{sqftRange[1]} sq.ft</span>
          </div>
        </div>
      </div>

      {/* Facing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{tr.filters.facing}</label>
        <div className="grid grid-cols-2 gap-2">
          {facingOptions.map((f) => (
            <button
              key={f}
              onClick={() =>
                setSelectedFacing((prev) =>
                  prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
                )
              }
              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                selectedFacing.includes(f)
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Filters */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        {/* DTCP Only */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{tr.filters.dtcp}</label>
          <button
            onClick={() => setDtcpOnly(!dtcpOnly)}
            className={`w-11 h-6 rounded-full transition-all ${dtcpOnly ? "bg-primary" : "bg-gray-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${dtcpOnly ? "translate-x-5.5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* Featured Only */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">⭐ Featured Only</label>
          <button
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className={`w-11 h-6 rounded-full transition-all ${featuredOnly ? "bg-primary" : "bg-gray-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${featuredOnly ? "translate-x-5.5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* Favorites Only */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">❤️ My Favorites</label>
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`w-11 h-6 rounded-full transition-all ${favoritesOnly ? "bg-primary" : "bg-gray-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${favoritesOnly ? "translate-x-5.5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{tr.nav.projects}</h1>
          <p className="text-white/70 mb-6">Browse DTCP approved plots in Avadi &amp; Chennai</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    router.replace("/projects");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-white text-primary font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active Search / Filter Summary */}
        {(searchQuery || activeFilterCount > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                🔍 &quot;{searchQuery}&quot;
                <button onClick={() => { setSearchQuery(""); router.replace("/projects"); }} className="hover:text-primary-dark">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {selectedLocations.map((loc) => (
              <span key={loc} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                <MapPin className="w-3 h-3" /> {loc}
                <button onClick={() => setSelectedLocations((p) => p.filter((x) => x !== loc))}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-primary underline">
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {isLoading ? (
              <span className="w-24 h-5 bg-gray-200 rounded animate-pulse inline-block" />
            ) : (
              <>Showing <strong className="text-gray-900">{filteredProjects.length}</strong> projects</>
            )}
          </p>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="latest">{tr.filters.sortOptions.latest}</option>
                <option value="priceLow">{tr.filters.sortOptions.priceLow}</option>
                <option value="priceHigh">{tr.filters.sortOptions.priceHigh}</option>
                <option value="areaLow">{tr.filters.sortOptions.areaLow}</option>
                <option value="areaHigh">{tr.filters.sortOptions.areaHigh}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:border-primary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <FilterSidebar />
            </div>
          </aside>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white p-6 shadow-2xl overflow-y-auto animate-slideInRight">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-1 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          {/* Project Grid */}
          <div className="flex-1 min-h-[600px]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                <p className="text-6xl mb-4">🏡</p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search.`
                    : "Try adjusting your filters"}
                </p>
                <button onClick={clearFilters} className="text-primary font-medium hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
                {filteredProjects.map((project) => (
                  <PropertyCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-20 text-center">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
