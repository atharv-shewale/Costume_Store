"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Eye, Sparkles, ImageOff } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onBook?: (product: Product) => void;
}

export const categoryLabels: Record<string, string> = {
  "garba-navratri": "Garba & Navratri",
  "mythological": "Mythological",
  "kids-mythological": "Kids Mythological",
  "traditional-indian": "Traditional Indian",
  "halloween": "Halloween & Spooky",
  "festival": "Festivals & Events",
};

export default function ProductCard({ product, onQuickView, onBook }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(product.image);
  const [imgFailed, setImgFailed] = useState(false);

  const whatsappText = encodeURIComponent(
    `Hello! I want to rent "${product.name}" (ID: ${product.id}) priced at ${
      typeof product.price === "number" ? `₹${product.price}/day` : product.price
    }. Is it available?`
  );

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-amber-100/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-amber-50">
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              if (!imgSrc.includes('%20') && imgSrc.includes(' ')) {
                setImgSrc(encodeURI(imgSrc));
              } else {
                setImgFailed(true);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-amber-100/60 text-amber-800 p-4 text-center">
            <ImageOff size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-semibold">{product.name}</p>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-white/90 backdrop-blur-md text-[#9b2335] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>

        {/* Featured Ribbon */}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
              <Sparkles size={11} />
              Popular
            </span>
          </div>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold py-2 px-3 rounded-xl shadow-lg transition-colors"
            >
              <Eye size={14} />
              Quick View
            </button>
          )}
          <Link
            href={`/costume/${product.id}`}
            className="flex-1 flex items-center justify-center bg-[#9b2335]/95 hover:bg-[#9b2335] text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-lg transition-colors text-center"
          >
            Details
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/costume/${product.id}`} className="block group-hover:text-[#9b2335] transition-colors">
          <h3 className="font-heading font-bold text-gray-900 text-base line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs line-clamp-2 mt-1 mb-3">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3 mt-auto">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-amber-50 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Daily Rent</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#9b2335]">
                {typeof product.price === "number" ? `₹${product.price}` : product.price}
              </span>
              {typeof product.price === "number" && (
                <span className="text-[11px] text-gray-500 font-medium">/day</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onBook ? (
              <button
                onClick={() => onBook(product)}
                className="flex items-center gap-1 bg-[#9b2335] hover:bg-[#801b2a] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all hover:scale-105 shadow-sm shadow-red-200"
              >
                <span>Rent Online</span>
              </button>
            ) : null}

            <a
              href={`https://wa.me/919999999999?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="flex items-center justify-center p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
