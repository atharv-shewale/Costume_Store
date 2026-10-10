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
      `Hello Moti Atya! New Rental Inquiry:\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Event Date:* ${formData.eventDate}\n*Costume Needed:* ${formData.costumeRequirement}\n*Note:* ${formData.message}`
    );
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Store Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#9b2335] bg-red-50 px-3.5 py-1 rounded-full mb-3 inline-block">
                Visit or Contact
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Get in Touch with Moti Atya
              </h2>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                Have a special character requirement or want to check costume sizes in person? Give us a call or visit our Mumbai store.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Store Address</h4>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                    Moti Atya Costume Corner, Main Market Road, Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-green-50/60 border border-green-100">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-800 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">WhatsApp & Phone</h4>
                  <p className="text-gray-600 text-xs mt-1">
                    +91 99999 99999 / +91 98888 88888
                  </p>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold text-green-700 hover:underline mt-1"
                  >
                    Click to Chat Directly &rarr;
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-800 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Working Hours</h4>
                  <p className="text-gray-600 text-xs mt-1">
                    Monday to Sunday: 10:00 AM – 8:30 PM
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Extended hours during Navratri & Ganesh Utsav!
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
