"use client";

import Link from "next/link";
import { Sparkles, MessageCircle, ShieldCheck, Star, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-[#fff7ed] via-[#fef3c7]/30 to-[#fdf8f0]">
      {/* Decorative background motifs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-red-200/40 via-amber-200/40 to-yellow-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 text-8xl opacity-10 select-none pointer-events-none">
        🪔
      </div>
      <div className="absolute bottom-10 left-10 text-8xl opacity-10 select-none pointer-events-none">
        ✨
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300/80 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-900 shadow-sm animate-fade-up">
              <Sparkles size={14} className="text-amber-600" />
              <span>Mira Road's Trusted Costume Rental Shop • ⭐ 4.6 Rating</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.15]">
              Dress Up for the Divine, Dance & Drama in{" "}
              <span className="text-gradient">Authentic Costumes</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Explore 500+ handcrafted costumes for <strong>Garba & Navratri</strong>, 
              <strong> Ram Leela & Janmashtami</strong>, <strong>School Annual Days</strong>, 
              mythological performances, fancy dress, and cultural celebrations. Freshly sanitized, 
              complete with matching jewelry & props.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#9b2335] to-[#b91c1c] hover:from-[#7d1c2a] hover:to-[#991b1b] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-red-900/20 hover:shadow-xl transition-all hover:scale-105 group"
              >
                <span>Browse All Costumes</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://wa.me/919930192705?text=Hi!%20I%20am%20looking%20for%20costumes%20for%20an%20upcoming%20event."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-full font-bold shadow-md shadow-green-900/10 hover:shadow-lg transition-all hover:scale-105"
              >
                <MessageCircle size={18} />
                <span>Instant WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Trust highlights bar */}
            <div className="pt-6 border-t border-amber-200/60 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xl font-black text-[#9b2335]">500+</p>
                <p className="text-xs text-gray-600 font-medium">Distinct Costumes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-600">₹200</p>
                <p className="text-xs text-gray-600 font-medium">Starting Daily Rent</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 font-black text-xl">
                  <span>4.6</span>
                  <Star size={16} className="fill-current" />
                </div>
                <p className="text-xs text-gray-600 font-medium">159 Google Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Back Card */}
              <div className="absolute -top-4 -right-4 w-72 h-80 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 transform rotate-6 opacity-80 shadow-2xl -z-10" />

              {/* Main Costume Showcase Card */}
              <div className="bg-white rounded-3xl p-4 shadow-2xl border border-amber-100 overflow-hidden relative">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-amber-100">
                  <img
                    src={encodeURI("/images/WhatsApp Image 2026-10-06 at 8.10.47 AM (1).jpeg")}
                    alt="Garba Patchwork Chaniya Choli"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                    Trending This Season ✨
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-amber-100 flex items-center justify-between">
                    <div>
                      <p className="font-heading font-bold text-gray-900 text-sm">
                        Patchwork Chaniya Choli
                      </p>
                      <p className="text-[11px] text-gray-500">Full flare mirror-work set</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-[#9b2335]">₹550/day</p>
                      <p className="text-[10px] text-green-700 font-semibold">Available</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: Quality */}
                <div className="absolute -bottom-3 -left-3 bg-white border border-amber-200 shadow-xl rounded-2xl p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Dry Cleaned & Sanitized</p>
                    <p className="text-[10px] text-gray-500">Hygienic wear guaranteed</p>
                  </div>
                </div>

                {/* Floating Badge 2: Quick Pickup */}
                <div className="absolute top-10 -right-3 bg-white border border-amber-200 shadow-xl rounded-2xl px-3 py-2 flex items-center gap-1.5">
                  <span className="text-sm">📍</span>
                  <span className="text-xs font-bold text-gray-800">Mira Road Pickup & Delivery</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
