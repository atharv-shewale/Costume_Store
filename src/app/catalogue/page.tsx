"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, Product, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import BookingModal from "@/components/BookingModal";
import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";

const categories: { id: "all" | Category; label: string }[] = [
  { id: "all", label: "All Costumes" },
  { id: "garba-navratri", label: "Garba & Navratri" },
  { id: "kids-mythological", label: "Kids & Historic" },
  { id: "traditional-indian", label: "Traditional & Folk" },
  { id: "halloween", label: "Halloween & Spooky" },
  { id: "mythological", label: "Mythological (Adults)" },
  { id: "festival", label: "Festivals & Events" },
];

function CatalogueContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get("category") as Category) || "all";

  const [selectedCategory, setSelectedCategory] = useState<"all" | Category>(
    initialCategory
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          const pA = typeof a.price === "number" ? a.price : 9999;
          const pB = typeof b.price === "number" ? b.price : 9999;
          return pA - pB;
        }
        if (sortBy === "price-desc") {
          const pA = typeof a.price === "number" ? a.price : -1;
          const pB = typeof b.price === "number" ? b.price : -1;
          return pB - pA;
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        // Default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20 bg-[#fdf8f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9b2335] bg-red-50 px-3.5 py-1 rounded-full mb-3">
            <Sparkles size={13} />
            Full Rental Catalog
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Explore All Indian Costumes
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Real photos from our Mumbai store inventory. Sanitized and ready for trials, pickup, or delivery.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-amber-100 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by costume name, character, tag (e.g. Shiva, Garba, Ram, Kali)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#fdfaf5] border border-amber-200/80 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/30 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <label htmlFor="sort" className="text-xs font-bold text-gray-600 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#fdfaf5] border border-amber-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/30"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? "bg-[#9b2335] text-white shadow-sm"
                      : "bg-[#fdfaf5] text-gray-600 hover:bg-amber-100/60 border border-amber-200/50"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count & Current Filter info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6 px-1">
          <span>
            Showing <strong className="text-gray-900 font-bold">{filteredProducts.length}</strong> costumes
            {selectedCategory !== "all" && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
          </span>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-[#9b2335] hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setSelectedProduct(p)}
                onBook={(p) => setBookingProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-amber-100 p-8">
            <span className="text-5xl block mb-3">🔍</span>
            <h3 className="font-heading text-xl font-bold text-gray-800">
              No costumes found matching your criteria
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              Try adjusting your search terms or category filter. You can also message us directly on WhatsApp for custom requests!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
              <a
                href="https://wa.me/919930192705?text=Hi!%20I%20am%20looking%20for%20a%20costume%20not%20found%20in%20catalogue."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBook={(p) => setBookingProduct(p)}
      />

      {/* Online Checkout & Booking Modal */}
      <BookingModal
        product={bookingProduct}
        onClose={() => setBookingProduct(null)}
      />
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-gray-500">Loading costume catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
