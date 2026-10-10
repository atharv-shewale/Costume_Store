"use client";

import { Search, MessageSquareCheck, Shirt, RotateCcw } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Browse & Choose",
    desc: "Explore our collection of 500+ costumes across Garba, Ram Leela, Fancy Dress & cultural themes.",
    icon: Search,
    color: "bg-red-50 text-[#9b2335] border-red-200",
  },
  {
    step: "02",
    title: "Check Dates on WhatsApp",
    desc: "Click WhatsApp on your favorite outfit with your event date and size. We confirm availability instantly.",
    icon: MessageSquareCheck,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    step: "03",
    title: "Collect / Try On",
    desc: "Visit our Mumbai store for size trials and collect your dry-cleaned costume along with matching props.",
    icon: Shirt,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    step: "04",
    title: "Celebrate & Return",
    desc: "Shine on stage or festival night! Return the costume after your event and get your security deposit refunded.",
    icon: RotateCcw,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
            Easy 4-Step Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            How Renting Works with Moti Atya
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            No complicated paperwork. Seamless booking, honest rental rates, and flexible pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#fdfaf5] rounded-3xl p-6 border border-amber-100/80 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${item.color}`}>
                    <Icon size={22} />
                  </div>
                  <span className="font-heading text-2xl font-black text-amber-300">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-amber-200 z-10" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
