"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  {
    id: "garba-navratri",
    name: "Garba & Navratri Costumes",
    tagline: "Authentic Gujarati flare, Kutchi mirror work & patchwork",
    image: encodeURI("/images/WhatsApp Image 2026-10-06 at 8.10.47 AM.jpeg"),
    priceRange: "From ₹350 - ₹1000/day",
    count: "45+ Styles",
    color: "from-rose-500/90 to-pink-600/90",
  },
  {
    id: "kids-mythological",
    name: "Kids Mythological & Historic",
    tagline: "Bal Krishna, Shiva, Ramayan, Shivaji Maharaj, Peshwa & Saints",
    image: encodeURI("/images/WhatsApp Image 2026-10-09 at 9.40.34 PM (1).jpeg"),
    priceRange: "From ₹300 - ₹500/day",
    count: "48+ Costumes",
    color: "from-purple-600/90 to-indigo-700/90",
  },
  {
    id: "traditional-indian",
    name: "Traditional & Regional Folk",
    tagline: "Kashmiri Pheran, Kerala Kasavu, Assamese Bihu, Nauvari, Bhangra",
    image: encodeURI("/images/WhatsApp Image 2026-10-09 at 9.46.40 PM.jpeg"),
    priceRange: "From ₹350 - ₹750/day",
    count: "27+ Themes",
    color: "from-emerald-600/90 to-teal-700/90",
  },
  {
    id: "halloween",
    name: "Halloween & Spooky Fancy Dress",
    tagline: "Witches, Dracula, Devils, Phantoms, Rainbow Clown & Bats",
    image: encodeURI("/images/WhatsApp Image 2026-10-09 at 9.46.35 PM (1).jpeg"),
    priceRange: "From ₹300 - ₹700/day",
    count: "20+ Outfits",
    color: "from-orange-600/90 to-purple-800/90",
  },
  {
    id: "mythological",
    name: "Mythological Characters (Adults)",
    tagline: "Maa Kali, Shri Krishna, and Ravan with props & weapons",
    image: encodeURI("/images/WhatsApp Image 2026-10-06 at 8.13.04 AM.jpeg"),
    priceRange: "From ₹400 - ₹500/day",
    count: "Adult Sets",
    color: "from-amber-600/90 to-orange-700/90",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9b2335] bg-red-50 px-3.5 py-1 rounded-full mb-3">
            <Sparkles size={13} />
            Explore Our Collection
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Costumes Designed for Every Special Occasion
          </h2>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Each costume in our collection is curated with traditional authenticity, premium fabrics, vibrant embroidery, and matching accessories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogue?category=${cat.id}`}
              className="group relative h-[380px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-end p-6 border border-amber-100"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

              {/* Category Count Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                  {cat.count}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-2">
                <span className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">
                  {cat.priceRange}
                </span>
                <h3 className="font-heading text-xl font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2">
                  {cat.tagline}
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Costumes</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#9b2335] hover:text-[#7d1c2a] border-b-2 border-[#9b2335] pb-0.5 hover:border-[#7d1c2a] transition-colors"
          >
            <span>View All Costumes in Complete Catalogue (50+ available)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
