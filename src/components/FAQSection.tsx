"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How does the rental duration work?",
    a: "Standard rental is for 24 to 48 hours. For instance, if your event is on Sunday evening, you can collect on Saturday afternoon and return by Monday morning. During Navratri or multi-day festivals, we offer convenient weekly and multi-day packages at discounted rates.",
  },
  {
    q: "Is there a security deposit required?",
    a: "Yes, a nominal refundable security deposit is taken at the time of pickup along with the rental fee. The deposit is refunded immediately when the costume and accessories are returned in good condition.",
  },
  {
    q: "Are accessories, crowns, and props included in the rental price?",
    a: "Yes! Mythological and character costumes include authentic accessories such as mukut (crown), matching ornaments, garlands, weapons (bow & arrow, trishul, mace/gada), and turbans. We make sure you don't have to scramble for extras.",
  },
  {
    q: "How do you ensure hygiene and cleanliness?",
    a: "Cleanliness is our highest priority. Every costume is dry-cleaned, steamed, and packed in fresh protective covers before handing over to the customer. All accessories and crowns are sanitized thoroughly.",
  },
  {
    q: "Can we visit the store to try on costumes for size fitting?",
    a: "Absolutely! We encourage you to visit our store in Mumbai for trials, especially for kids fancy dress and fitted chaniya cholis. Our staff will assist with minor pin adjustments and styling.",
  },
  {
    q: "Do you offer group discounts for schools, dance academies, and plays?",
    a: "Yes! We specialize in bulk costume requirements for school annual days, society Ram Leela skits, dance academy shows, and Janmashtami tableaux. Contact us on WhatsApp with your student count and character list for bulk pricing.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-[#fdf8f0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3.5 py-1 rounded-full mb-3">
            <HelpCircle size={14} className="text-amber-600" />
            Frequently Asked Questions
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Got Questions? We’ve Got Answers
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Everything you need to know about booking, trial, pricing, and returns.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-amber-200/60 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-heading font-bold text-gray-900 hover:text-[#9b2335] transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-amber-600 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-amber-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
