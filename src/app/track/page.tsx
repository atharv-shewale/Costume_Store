"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  QrCode,
  Printer,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Phone,
  RefreshCw,
} from "lucide-react";
import QRCode from "qrcode";

interface TrackedBooking {
  id: string;
  costumeId: string;
  costumeName: string;
  costumeImage?: string;
  category: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  customerAddress: string;
  startDate: string;
  endDate: string;
  days: number;
  dailyRate: number;
  rentalTotal: number;
  securityDeposit: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: "confirmed" | "picked-up" | "returned" | "overdue" | "cancelled";
  createdAt: string;
  depositRefunded?: number;
  depositDeduction?: number;
  inspectionNotes?: string;
  returnedAt?: string;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TrackedBooking[] | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<TrackedBooking | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const initialId = searchParams.get("id");

  useEffect(() => {
    if (initialId) {
      setQuery(initialId);
      performSearch(initialId);
    }
  }, [initialId]);

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.bookings) && data.bookings.length > 0) {
        setResults(data.bookings);
        setSelectedBooking(data.bookings[0]);
      } else {
        setResults([]);
        setSelectedBooking(null);
        setError(data.error || "No booking found matching your search.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to lookup booking.");
    } finally {
      setLoading(false);
    }
  }

  // Generate QR Code for selected booking
  useEffect(() => {
    if (selectedBooking) {
      QRCode.toDataURL(
        JSON.stringify({
          bookingId: selectedBooking.id,
          costume: selectedBooking.costumeName,
          customer: selectedBooking.customerName,
          dates: `${selectedBooking.startDate} to ${selectedBooking.endDate}`,
          deposit: `Rs. ${selectedBooking.securityDeposit}`,
          status: selectedBooking.status,
        }),
        { width: 220, margin: 1 }
      )
        .then((url) => setQrCodeUrl(url))
        .catch(() => setQrCodeUrl(null));
    }
  }, [selectedBooking]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  // Helper for status step progress
  const getStepProgress = (status: TrackedBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return 1;
      case "picked-up":
        return 2;
      case "returned":
        return 4;
      case "overdue":
        return 2;
      case "cancelled":
        return 0;
      default:
        return 1;
    }
  };

  return (
    <div className="pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9b2335] bg-red-50 border border-red-100 px-3.5 py-1 rounded-full mb-3">
              <Sparkles size={13} className="text-[#9b2335]" />
              Live Rental Tracker
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black text-gray-950 tracking-tight mb-3">
              Track Your Costume Rental
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your Booking ID (e.g. <span className="font-mono font-bold text-[#9b2335]">BK-5386</span>) or
              registered 10-digit mobile number to view real-time pickup, return, and deposit refund status.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Booking ID (BK-XXXX) or Phone"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9b2335] focus:border-transparent shadow-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#9b2335] hover:bg-[#7d1c2a] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-red-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Track</span>
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-lg mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Booking Not Found</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Multiple Bookings Selector */}
          {results && results.length > 1 && (
            <div className="mb-6 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap pl-2">Found {results.length} bookings:</span>
              {results.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedBooking?.id === b.id
                      ? "bg-[#9b2335] text-white shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  #{b.id} • {b.costumeName.slice(0, 18)}...
                </button>
              ))}
            </div>
          )}

          {/* Active Booking Card */}
          {selectedBooking && (
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden transition-all">
              {/* Card Header & Status Ribbon */}
              <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#7d1c2a] p-6 sm:p-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 bg-amber-950/60 border border-amber-400/40 px-3 py-1 rounded-full">
                      Booking Pass #{selectedBooking.id}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-heading mt-2">
                      {selectedBooking.costumeName}
                    </h2>
                    <p className="text-xs text-stone-300 mt-1 flex items-center gap-2">
                      <span>Booked on {selectedBooking.createdAt}</span>
                      <span>•</span>
                      <span>Customer: {selectedBooking.customerName}</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right">
                    {selectedBooking.status === "confirmed" && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-sm">
                        <Clock size={14} /> Confirmed / Ready For Pickup
                      </span>
                    )}
                    {selectedBooking.status === "picked-up" && (
                      <span className="inline-flex items-center gap-1.5 bg-blue-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-sm">
                        <Package size={14} /> Costume Picked Up (In Use)
                      </span>
                    )}
                    {selectedBooking.status === "returned" && (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-sm">
                        <CheckCircle2 size={14} /> Returned & Deposit Settled
                      </span>
                    )}
                    {selectedBooking.status === "overdue" && (
                      <span className="inline-flex items-center gap-1.5 bg-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl uppercase tracking-wider animate-pulse shadow-sm">
                        <AlertCircle size={14} /> Return Overdue
                      </span>
                    )}
                  </div>
                </div>

                {/* Live Progress Stepper */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { step: 1, label: "Booking Confirmed", icon: CheckCircle2 },
                      { step: 2, label: "Picked Up / In Use", icon: Package },
                      { step: 3, label: "Costume Returned", icon: RefreshCw },
                      { step: 4, label: "Deposit Refunded", icon: ShieldCheck },
                    ].map((st) => {
                      const currentProgress = getStepProgress(selectedBooking.status);
                      const isComplete = currentProgress >= st.step;
                      const isCurrent = currentProgress === st.step;
                      const Icon = st.icon;

                      return (
                        <div key={st.step} className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                              isComplete
                                ? "bg-amber-400 text-stone-950 ring-4 ring-amber-400/20 shadow-md"
                                : "bg-stone-700/60 text-stone-400 border border-stone-600"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <span
                            className={`text-[11px] font-semibold tracking-tight ${
                              isComplete || isCurrent ? "text-amber-200" : "text-stone-400"
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left 2 Cols: Dates, Pricing & Store Pickup */}
                <div className="md:col-span-2 space-y-6">
                  {/* Rental Timeline */}
                  <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/70">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#9b2335]" />
                      Rental Schedule
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                        <p className="text-[10px] font-bold uppercase text-stone-400">Pickup Date</p>
                        <p className="text-base font-black text-stone-900 mt-0.5">{selectedBooking.startDate}</p>
                        <span className="text-[11px] text-stone-500">From 11:00 AM onwards</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                        <p className="text-[10px] font-bold uppercase text-stone-400">Return Deadline</p>
                        <p className="text-base font-black text-[#9b2335] mt-0.5">{selectedBooking.endDate}</p>
                        <span className="text-[11px] text-stone-500">Before 9:00 PM</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-200/60">
                      <span>Total Duration: <strong>{selectedBooking.days} Day(s)</strong></span>
                      <span>Delivery Mode: <strong className="capitalize">{selectedBooking.deliveryType.replace("-", " ")}</strong></span>
                    </div>
                  </div>

                  {/* Financial & Deposit Summary */}
                  <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/70">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-amber-700" />
                      Financial & Security Deposit Summary
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-stone-700">
                        <span>Costume Rental Fee ({selectedBooking.days} days @ ₹{selectedBooking.dailyRate}/day):</span>
                        <span className="font-bold">₹{selectedBooking.rentalTotal}</span>
                      </div>
                      <div className="flex justify-between text-stone-700">
                        <span>Refundable Security Deposit (Paid):</span>
                        <span className="font-bold">₹{selectedBooking.securityDeposit}</span>
                      </div>
                      <div className="flex justify-between text-stone-950 font-black text-sm pt-2 border-t border-amber-200">
                        <span>Total Paid at Booking:</span>
                        <span className="text-[#9b2335]">₹{selectedBooking.totalAmount}</span>
                      </div>
                    </div>

                    {/* Deposit Settlement Info */}
                    {selectedBooking.status === "returned" ? (
                      <div className="mt-4 pt-3 border-t border-amber-200 bg-white p-3.5 rounded-xl border">
                        <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          Security Deposit Refund Settled
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div>
                            <span className="text-stone-500">Refund Amount:</span>
                            <p className="font-bold text-emerald-600 text-sm">₹{selectedBooking.depositRefunded || selectedBooking.securityDeposit}</p>
                          </div>
                          <div>
                            <span className="text-stone-500">Deductions:</span>
                            <p className="font-bold text-stone-700 text-sm">₹{selectedBooking.depositDeduction || 0}</p>
                          </div>
                        </div>
                        {selectedBooking.inspectionNotes && (
                          <p className="text-[11px] text-stone-500 mt-2 bg-stone-50 p-2 rounded-lg italic">
                            Inspection remarks: &quot;{selectedBooking.inspectionNotes}&quot;
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-stone-500 mt-3 flex items-center gap-1">
                        <span>* Security deposit of ₹{selectedBooking.securityDeposit} is 100% refunded when the costume is returned in good condition.</span>
                      </p>
                    )}
                  </div>

                  {/* Store Address & Pickup Location */}
                  <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/70 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#9b2335] shrink-0 mt-0.5" />
                    <div className="text-xs text-stone-700 space-y-1">
                      <p className="font-bold text-stone-900 text-sm">Moti Atya Costume Corner Storefront</p>
                      <p>SHOP A1, Ostwal Kiran Apartment, Mira Bhayandar Rd, opp. BHARAT/Old petrol Pump, Mira Road East, Mumbai, Maharashtra 401105</p>
                      <div className="pt-2 flex flex-wrap gap-2">
                        <a
                          href="https://maps.google.com/?q=SHOP+A1+Ostwal+Kiran+Apartment+Mira+Bhayandar+Rd+Mira+Road+East+Mumbai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9b2335] hover:underline"
                        >
                          <span>Get Directions on Google Maps</span>
                          <ArrowRight size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Digital Pass & Quick Actions */}
                <div className="space-y-6 flex flex-col justify-between">
                  {/* Digital QR Pass */}
                  <div className="bg-stone-900 text-white rounded-2xl p-5 text-center shadow-lg border border-stone-800">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                      Counter Pickup Pass
                    </span>
                    <div className="my-3 p-3 bg-white rounded-xl inline-block shadow-inner">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt={`QR Pass for ${selectedBooking.id}`}
                          className="w-36 h-36 mx-auto"
                        />
                      ) : (
                        <div className="w-36 h-36 flex items-center justify-center text-stone-400">
                          <QrCode size={36} />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Show this QR code or Booking ID <strong className="text-white">#{selectedBooking.id}</strong> at the store counter.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5">
                    <button
                      onClick={() => window.print()}
                      className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-stone-300"
                    >
                      <Printer size={14} />
                      <span>Print Rental Slip</span>
                    </button>

                    <a
                      href={`https://wa.me/919930192705?text=Hello%20Moti%20Atya%2C%20I%20am%20inquiring%20about%20my%20booking%20%23${selectedBooking.id}%20for%20${encodeURIComponent(selectedBooking.costumeName)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Support</span>
                    </a>

                    <Link
                      href="/catalogue"
                      className="w-full bg-transparent hover:bg-stone-100 text-stone-600 py-2 px-4 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <span>Rent Another Costume</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Help Section */}
          <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-heading font-bold text-gray-900 text-sm mb-1">Store Timings</h4>
              <p className="text-xs text-gray-600">Monday – Sunday: 10:00 AM – 9:30 PM</p>
              <p className="text-[11px] text-gray-400 mt-1">Open on all festival days & Sundays</p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 text-sm mb-1">Security Deposit Policy</h4>
              <p className="text-xs text-gray-600">Deposits are refunded instantly to your GPay/UPI or in Cash upon costume inspection.</p>
            </div>
            <div>
              <h4 className="font-heading font-bold text-gray-900 text-sm mb-1">Need Urgent Help?</h4>
              <p className="text-xs text-gray-600">Call store directly: <strong>+91 99301 92705</strong></p>
              <p className="text-[11px] text-gray-400 mt-1">Mira Road East, Mumbai</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-[#9b2335] animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-700">Loading Order Tracking...</p>
          </div>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
