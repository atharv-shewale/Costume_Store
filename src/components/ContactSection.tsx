"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, MessageCircle, Send, Check } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventDate: "",
    costumeRequirement: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello! Rental Inquiry for Costume Store Fancy dress Rental Shop:\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Event Date:* ${formData.eventDate}\n*Costume Needed:* ${formData.costumeRequirement}\n*Note:* ${formData.message}`
    );
    window.open(`https://wa.me/919930192705?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Store Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9b2335] bg-red-50 px-3.5 py-1 rounded-full inline-block">
                  Visit or Contact
                </span>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1">
                  ⭐ 4.6 (159 Google Reviews)
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Costume Store Fancy dress Rental Shop
              </h2>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                Reliable costume rental shop featuring a wide variety of high-quality outfits at reasonable rates. In-store shopping & fast delivery available.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm">Store Address (Mira Road East)</h4>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    SHOP A1, Ostwal Kiran Apartment, Mira Bhayandar Rd, opp. BHARAT/Old petrol Pump, Mira Road East, Mumbai, Maharashtra 401105
                  </p>
                  <a
                    href="https://share.google/fSSm7ezLsgOaMeqPl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#9b2335] hover:underline pt-1"
                  >
                    <span>📍 Open in Google Maps & Get Directions &rarr;</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50/60 border border-green-100">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-800 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Call & WhatsApp Us</h4>
                  <p className="text-gray-800 text-xs mt-1 font-semibold">
                    <a href="tel:+919930192705" className="hover:text-green-700 underline mr-2">
                      099301 92705
                    </a>
                    <span>/</span>
                    <a href="tel:+919930192705" className="hover:text-green-700 underline ml-2">
                      +91 99301 92705
                    </a>
                  </p>
                  <a
                    href="https://wa.me/919930192705"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-green-700 hover:underline mt-1.5"
                  >
                    Click to Chat Directly on WhatsApp &rarr;
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-800 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Working Hours</h4>
                  <p className="text-gray-700 text-xs mt-1">
                    <strong>Mon – Sat:</strong> 10:00 AM – 9:00 PM
                  </p>
                  <p className="text-gray-700 text-xs mt-0.5">
                    <strong>Sunday:</strong> Opens 12:00 PM – 8:30 PM
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    In-Store Trial & Shopping · Prompt Delivery Available!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="lg:col-span-7 bg-[#fdfaf5] p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-md">
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              Send a Costume Inquiry
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-6">
              Fill out your requirement below to connect directly with our rental team on WhatsApp.
            </p>

            {submitted ? (
              <div className="p-6 bg-green-100 text-green-900 rounded-2xl flex items-center gap-3">
                <Check className="text-green-700 flex-shrink-0" size={24} />
                <div>
                  <p className="font-bold text-sm">Inquiry sent to WhatsApp!</p>
                  <p className="text-xs text-green-800 mt-1">
                    Our team will reply with availability and pictures shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Date of Your Event *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Costume / Character *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Garba Chaniya Choli, Ram-Sita"
                      value={formData.costumeRequirement}
                      onChange={(e) => setFormData({ ...formData, costumeRequirement: e.target.value })}
                      className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Any Special Notes (Size, child age, number of sets)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mention child's age or specific color preference..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#9b2335]/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#9b2335] to-[#801b2a] hover:from-[#7d1c2a] hover:to-[#6b1522] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
