"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { products, Product, Category } from "@/data/products";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import BookingModal from "./BookingModal";

export default function FeaturedCostumes() {
  const [activeTab, setActiveTab] = useState<"all" | Category>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);

  const tabs: { id: "all" | Category; label: string }[] = [
    { id: "all", label: "All Popular" },
    { id: "garba-navratri", label: "Garba & Navratri" },
    { id: "kids-mythological", label: "Kids & Historic" },
    { id: "traditional-indian", label: "Traditional & Folk" },
    { id: "halloween", label: "Halloween" },
    { id: "mythological", label: "Mythological" },
  ];

  // Filter products
  const filtered = products
    .filter((p) => {
      if (activeTab === "all") return p.featured || true;
      return p.category === activeTab;
    })
    .slice(0, 8); // top 8 for home page

  return (
    <section className="py-20 bg-[#fdf8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3.5 py-1 rounded-full mb-3">
              <Sparkles size={13} className="text-amber-600" />
              Handpicked Highlights
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Featured Costumes on Rent
            </h2>
            <p className="text-gray-600 text-sm mt-2 max-w-xl">
              From head-turning Garba chaniya cholis to divine Ram-Sita and Mahadev attire, check out our most requested outfits.
            </p>
          </div>

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#9b2335] hover:text-[#7d1c2a] group self-start md:self-auto"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#9b2335] text-white shadow-md shadow-red-900/20"
                    : "bg-white text-gray-600 hover:bg-amber-100/60 border border-amber-200/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Costume Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onQuickView={(p) => setSelectedProduct(p)}
              onBook={(p) => setBookingProduct(p)}
            />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#9b2335] via-[#851829] to-[#60121d] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Looking for a Specific Costume or Character?
            </h3>
            <p className="text-amber-100 text-sm mt-2 leading-relaxed">
              We stock hundreds of custom school annual day costumes, historical figures, and rare mythological characters not listed online. Send us a reference photo on WhatsApp!
            </p>
          </div>

          <a
            href="https://wa.me/919930192705?text=Hi!%20I%20am%20looking%20for%20a%20costume%20not%20listed%20on%20the%20website.%20Can%20you%20help?"
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold px-7 py-3.5 rounded-full text-sm shadow-lg transition-transform hover:scale-105"
          >
            Send Photo on WhatsApp
          </a>

          {/* Decorative motif */}
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 select-none pointer-events-none">
            🎭
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBook={(p) => setBookingProduct(p)}
      />

      {/* Booking Modal */}
      <BookingModal
        product={bookingProduct}
        onClose={() => setBookingProduct(null)}
      />
    </section>
  );
}
