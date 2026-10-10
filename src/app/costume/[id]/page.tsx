import { notFound } from "next/navigation";
import Link from "next/link";
import { products, Product } from "@/data/products";
import { categoryLabels } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import CostumeDetailActions from "./CostumeDetailActions";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Clock,
  Shirt,
  HelpCircle,
  Truck,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

export default async function CostumeDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Related products from same category
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappText = encodeURIComponent(
    `Hello Moti Atya! I want to rent "${product.name}" (ID: ${product.id}) priced at ${
      typeof product.price === "number" ? `₹${product.price}/day` : product.price
    }. Please let me know if it is available for my dates:`
  );

  return (
    <div className="pt-24 pb-20 bg-[#fdf8f0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#9b2335] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Full Catalogue</span>
          </Link>
        </div>

        {/* Main Product Card Container */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-amber-100 grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16">
          
          {/* Left Column: Image */}
          <div className="lg:col-span-6 bg-amber-50/50 p-6 sm:p-10 flex items-center justify-center relative">
            <div className="w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-white border border-amber-100 relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/95 backdrop-blur-md text-[#9b2335] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {categoryLabels[product.category] || product.category}
                </span>
              </div>
              {product.featured && (
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles size={12} /> Popular
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Booking Actions */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
                  Item Code: {product.id}
                </span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  In Stock & Ready for Rental
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="my-6 p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50/30 rounded-2xl border border-amber-200/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-amber-900 font-medium block">Rental Price</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-[#9b2335]">
                      {typeof product.price === "number" ? `₹${product.price}` : product.price}
                    </span>
                    {typeof product.price === "number" && (
                      <span className="text-sm font-semibold text-gray-600"> / day</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-green-800 bg-green-100 px-2.5 py-1 rounded-md block">
                    Security Deposit Refundable
                  </span>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    No hidden damage fees
                  </span>
                </div>
              </div>

              <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-[#fdfaf5] border border-amber-200/70 text-amber-900 px-3 py-1 rounded-lg font-medium"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* What's Included */}
              <div className="border-t border-amber-100 pt-5 mb-6 space-y-2.5">
                <h3 className="font-heading font-bold text-gray-900 text-sm uppercase tracking-wider">
                  What’s Included in this Rental Set:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Primary Costume & Inner Linings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Matching Traditional Jewellery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Mukut / Crown / Turban / Headdress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>Authentic Props (Weapons / Garlands)</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100/80 space-y-2 text-xs text-gray-700 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
                  <span><strong>Cleanliness Guarantee:</strong> Professionally steam sanitized prior to handover.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-amber-700 flex-shrink-0" />
                  <span><strong>Store Pickup:</strong> Free trial & fitting at our Mumbai store, or express courier.</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <CostumeDetailActions product={product} whatsappText={whatsappText} />

          </div>

        </div>

        {/* Related Costumes */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
                  More From This Category
                </span>
                <h2 className="font-heading text-2xl font-black text-gray-900 mt-2">
                  Similar Costumes You Might Like
                </h2>
              </div>
              <Link
                href={`/catalogue?category=${product.category}`}
                className="text-xs font-bold text-[#9b2335] hover:underline"
              >
                View all in category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
