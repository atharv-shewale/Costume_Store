"use client";

import { Sparkles, ShieldCheck, Gem, Users2, Clock4, IndianRupee } from "lucide-react";

const perks = [
  {
    icon: ShieldCheck,
    title: "100% Sanitized & Steam Cleaned",
    desc: "Every costume undergoes rigorous dry cleaning and anti-bacterial steaming after every use. Zero odor, pristine cleanliness guaranteed.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Gem,
    title: "All Accessories & Props Included",
    desc: "No running around for accessories! Mukut (crowns), artificial jewellery, garlands, bows, trishul, or dandiya sticks come included.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: IndianRupee,
    title: "Honest & Pocket-Friendly Rates",
    desc: "Costumes starting at just ₹300 to ₹700 per day. No hidden charges. 100% refundable security deposit returned on timely return.",
    color: "bg-red-50 text-[#9b2335]",
  },
  {
    icon: Users2,
    title: "School & Group Event Discounts",
    desc: "Equipping a school annual day, dance troupe, or society Ram Leela tableau? Enjoy discounted bulk rental packages with size sorting.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Clock4,
    title: "Flexible Rental Durations",
    desc: "Rent for 24 hours, 48 hours, or the full 9 days of Navratri. Early collection options available so you can prepare without last-minute panic.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: Sparkles,
    title: "In-Store Fitting & Alterations",
    desc: "Visit our store to try on costumes beforehand. Our team helps adjust dhotis, lehengas, and turbans for that flawless look on stage.",
    color: "bg-orange-50 text-orange-700",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#fdf8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9b2335] bg-red-50 px-3.5 py-1 rounded-full mb-3 inline-block">
            The Moti Atya Difference
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Why Hundreds of Families & Schools Choose Us
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            We know how important your festival, performance, or child’s big school day is. Here is why you can count on us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${p.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                  {p.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
