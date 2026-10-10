"use client";

import { X, MessageCircle, Phone, CheckCircle2, ShieldCheck, Sparkles, Clock } from "lucide-react";
import { Product } from "@/data/products";
import { categoryLabels } from "./ProductCard";
import Link from "next/link";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBook?: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onBook }: ProductModalProps) {
  if (!product) return null;

  const whatsappText = encodeURIComponent(
    `Hello Moti Atya! I want to check availability for renting "${product.name}" (ID: ${product.id}) priced at ${
      typeof product.price === "number" ? `₹${product.price}/day` : product.price
    }. Dates needed: `
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-amber-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md transition-transform hover:scale-110"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Costume Image */}
        <div className="md:w-1/2 bg-amber-50 relative min-h-[300px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-md text-[#9b2335] text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {categoryLabels[product.category] || product.category}
            </span>
          </div>
        </div>

        {/* Costume Details */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 bg-amber-100/60 px-2.5 py-0.5 rounded-full">
              ID: {product.id}
            </span>
            {product.featured && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                <Sparkles size={12} /> Popular Choice
              </span>
            )}
          </div>

          <h2 className="font-heading text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h2>

          {/* Pricing Highlight */}
          <div className="my-4 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-amber-800 font-medium block">Rental Fee</span>
              <span className="text-3xl font-black text-[#9b2335]">
                {typeof product.price === "number" ? `₹${product.price}` : product.price}
              </span>
              {typeof product.price === "number" && (
                <span className="text-xs text-gray-600 font-medium"> / day</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[11px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-md block">
                Refundable Deposit
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block">Standard security terms</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Highlights checklist */}
          <div className="space-y-2 mb-6 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>100% Sanitized, clean, ready to wear</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <span>Matching props & jewellery sets included (where applicable)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
              <span>Available for 24-hr, 48-hr, or weekly festival rentals</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-emerald-600 flex-shrink-0" />
              <span>Same-day trials and local pickup available</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto space-y-2.5 pt-4 border-t border-amber-100">
            {onBook && (
              <button
                onClick={() => {
                  onClose();
                  onBook(product);
                }}
                className="flex items-center justify-center gap-2 w-full bg-[#9b2335] hover:bg-[#801b2a] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] text-sm shadow-red-200"
              >
                <span>⚡ Rent Online (Instant Booking & UPI)</span>
              </button>
            )}

            <a
              href={`https://wa.me/919999999999?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all hover:scale-[1.02] text-sm"
            >
              <MessageCircle size={18} />
              Enquire & Book on WhatsApp
            </a>

            <div className="flex items-center gap-2">
              <a
                href="tel:+919999999999"
                className="flex-1 flex items-center justify-center gap-1.5 border border-amber-300 text-amber-900 hover:bg-amber-50 font-medium py-2.5 px-3 rounded-xl text-xs transition-colors"
              >
                <Phone size={14} /> Call Store
              </a>
              <Link
                href={`/costume/${product.id}`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center bg-gray-900 hover:bg-black text-white font-medium py-2.5 px-3 rounded-xl text-xs transition-colors"
              >
                View Full Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
