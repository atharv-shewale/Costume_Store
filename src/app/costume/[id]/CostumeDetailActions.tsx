"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Clock, CreditCard, Sparkles } from "lucide-react";
import { Product } from "@/data/products";
import BookingModal from "@/components/BookingModal";

interface Props {
  product: Product;
  whatsappText: string;
}

export default function CostumeDetailActions({ product, whatsappText }: Props) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <div className="space-y-3 pt-4 border-t border-amber-100">
        {/* Instant Online Booking Button */}
        <button
          onClick={() => setShowBooking(true)}
          className="w-full flex items-center justify-center gap-2.5 bg-[#9b2335] hover:bg-[#801b2a] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-red-200 transition-all hover:scale-[1.02] text-sm sm:text-base"
        >
          <CreditCard size={20} />
          <span>Rent Online Now (Instant Booking & UPI)</span>
        </button>

        {/* WhatsApp Booking */}
        <a
          href={`https://wa.me/919930192705?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all hover:scale-[1.02] text-sm"
        >
          <MessageCircle size={19} />
          <span>Enquire & Reserve on WhatsApp</span>
        </a>

        {/* Quick Phone & Store visit */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+919930192705"
            className="flex-1 flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold py-2.5 px-4 rounded-xl border border-amber-200 text-xs transition-colors"
          >
            <Phone size={14} />
            <span>Call Store (+91 99301 92705)</span>
          </a>
          <Link
            href="/#contact"
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            <Clock size={14} />
            <span>Visit Store & Try</span>
          </Link>
        </div>
      </div>

      {/* Online Booking Modal */}
      <BookingModal
        product={showBooking ? product : null}
        onClose={() => setShowBooking(false)}
      />
    </>
  );
}
