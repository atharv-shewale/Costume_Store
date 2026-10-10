"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const occasions = [
  {
    title: "Navratri & Dandiya Nights",
    description: "Multi-layered patchwork chaniya cholis, spinning ghagras, mirror-work Kutchi jackets, and matching turbans for men and women.",
    emoji: "💃",
    badge: "Most Popular",
    link: "/catalogue?category=garba-navratri",
  },
  {
    title: "School Annual Days & Competitions",
    description: "Freedom fighters (Shivaji Maharaj, Rani Laxmibai, Subhash Chandra Bose), historical kings, national leaders, and theme dance costumes.",
    emoji: "🎭",
    badge: "Bulk Available",
    link: "/catalogue?category=traditional-indian",
  },
  {
    title: "Ram Leela & Dussehra Drama",
    description: "Complete sets for Lord Ram, Sita, Lakshman, Hanuman with gada, Ravana with 10 heads, and Rishi Munis.",
    emoji: "🏹",
    badge: "Full Character Sets",
    link: "/catalogue?category=mythological",
  },
  {
    title: "Janmashtami & Kids Fancy Dress",
    description: "Bal Krishna dhoti-kurta sets with peacock feather mukut, bansuri flute, Radha lehengas, and little Ganesha costumes.",
    emoji: "🪈",
    badge: "All Kids Sizes",
    link: "/catalogue?category=kids-mythological",
  },
  {
    title: "Ganesh Utsav & Puja Celebrations",
    description: "Traditional Maharashtrian Nauvari sarees, Kurta-pajamas with Shela, Dhol-tasha attire, and spiritual deity sets.",
    emoji: "🕉️",
    badge: "Festive Special",
    link: "/catalogue?category=traditional-indian",
  },
  {
    title: "Folk Dance & Regional Festivals",
    description: "Kashmiri Pheran, Kerala Kasavu, Assamese Bihu, Rajasthani Ghoomar, Nauvari, Bhangra & Naga tribal attire.",
    emoji: "🪘",
    badge: "Authentic Folk",
    link: "/catalogue?category=traditional-indian",
  },
  {
    title: "Halloween & Spooky Fancy Dress",
    description: "Cute & spooky witches with hats, Count Dracula capes, devil horns & tridents, white ghosts, grim reapers, clowns and bats.",
    emoji: "🎃",
    badge: "Trending Now",
    link: "/catalogue?category=halloween",
  },
];

export default function OccasionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
            Tailored For Every Event
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Whatever Your Stage, We Have the Costume
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            From kindergarten fancy dress competitions to grand 9-day Navratri festivals and community Ram Leela plays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="group bg-[#fdfaf5] hover:bg-amber-50/70 rounded-3xl p-6 border border-amber-200/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-[11px] font-bold text-[#9b2335] bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2 group-hover:text-[#9b2335] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-100/70 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-[#9b2335]">
                <span>Browse Costumes</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
