"use client";

import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  CreditCard,
  QrCode,
  AlertCircle,
  Sparkles,
  MapPin,
  Phone,
  User,
  Mail,
  FileText,
  Upload,
  Printer,
  FileCheck,
} from "lucide-react";
import QRCode from "qrcode";
import { Product } from "@/data/products";

interface BookingModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess?: (bookingId: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingModal({ product, onClose, onSuccess }: BookingModalProps) {
  const [startDate, setStartDate] = useState("2026-10-10");
  const [endDate, setEndDate] = useState("2026-10-11");
  const [minDate, setMinDate] = useState("2026-10-10");
  const [days, setDays] = useState(1);

  // Reserved dates & conflict checking
  const [reservedRanges, setReservedRanges] = useState<
    { startDate: string; endDate: string; bookingId: string }[]
  >([]);
  const [dateConflictError, setDateConflictError] = useState<string | null>(null);

  // Customer info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryType, setDeliveryType] = useState<"store-pickup" | "home-delivery">("store-pickup");
  const [address, setAddress] = useState("");
  const [idProofType, setIdProofType] = useState("Aadhaar Card");
  const [idProofNumber, setIdProofNumber] = useState("");
  const [idProofImage, setIdProofImage] = useState<string | null>(null);
  const [agreementChecked, setAgreementChecked] = useState(true);
  const [notes, setNotes] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "gpay-upi" | "cash">("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  // Initialize client dates on mount
  useEffect(() => {
    const dToday = new Date().toISOString().split("T")[0];
    const dTomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    setMinDate(dToday);
    setStartDate(dToday);
    setEndDate(dTomorrow);
  }, []);

  // Fetch reserved dates for this costume to prevent overlap
  useEffect(() => {
    if (product?.id) {
      fetch(`/api/bookings/availability?costumeId=${product.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.reservedRanges)) {
            setReservedRanges(d.reservedRanges);
          }
        })
        .catch(() => {});
    }
  }, [product?.id]);

  // Real-time conflict validation
  useEffect(() => {
    if (!startDate || !endDate || !reservedRanges.length) {
      setDateConflictError(null);
      return;
    }

    const reqStart = new Date(startDate).getTime();
    const reqEnd = new Date(endDate).getTime();

    const conflict = reservedRanges.find((r) => {
      const bStart = new Date(r.startDate).getTime();
      const bEnd = new Date(r.endDate).getTime();
      return reqStart <= bEnd && reqEnd >= bStart;
    });

    if (conflict) {
      setDateConflictError(
        `This costume is already reserved from ${conflict.startDate} to ${conflict.endDate} (Booking #${conflict.bookingId}). Please select different dates.`
      );
    } else {
      setDateConflictError(null);
    }
  }, [startDate, endDate, reservedRanges]);

  const handleCloseAndReload = () => {
    onClose();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // Generate QR code upon confirmation
  useEffect(() => {
    if (confirmedBooking?.id) {
      QRCode.toDataURL(
        JSON.stringify({
          id: confirmedBooking.id,
          costume: confirmedBooking.costumeName,
          customer: confirmedBooking.customerName,
          phone: confirmedBooking.customerPhone,
          dates: `${confirmedBooking.startDate} to ${confirmedBooking.endDate}`,
          deposit: `Rs. ${confirmedBooking.securityDeposit}`,
        }),
        { width: 200, margin: 1 }
      )
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [confirmedBooking]);

  // Calculate days & prices
  const dailyRate = typeof product?.price === "number" ? product.price : 550;
  const securityDeposit = 500; // Refundable security deposit
  const rentalTotal = dailyRate * Math.max(1, days);
  const totalAmount = rentalTotal + securityDeposit;

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDays(Math.max(1, diffDays));
    }
  }, [startDate, endDate]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!product) return null;

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("ID file size must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (dateConflictError) {
      setError(dateConflictError);
      return;
    }

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number for SMS notifications");
      return;
    }
    if (deliveryType === "home-delivery" && !address.trim()) {
      setError("Please provide your delivery address in Mumbai");
      return;
    }
    if (!agreementChecked) {
      setError("Please accept the rental terms and security deposit refund policy");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Payment Intent / Order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          costumeName: product?.name,
          customerName: name,
          customerPhone: cleanPhone,
        }),
      });
      const orderData = await orderRes.json();

      // Step 2: Handle Payment Gateway
      if (paymentMethod === "razorpay" && window.Razorpay && !orderData.testMode) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: "INR",
          name: "Moti Atya Costume Corner",
          description: `Rental for ${product?.name}`,
          order_id: orderData.orderId,
          prefill: {
            name,
            contact: cleanPhone,
            email,
          },
          theme: {
            color: "#9b2335",
          },
          handler: async function (response: any) {
            await finalizeBooking(response.razorpay_payment_id || `pay_${Date.now()}`);
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // Step 3: For Test Mode / Google Pay UPI / Cash, complete directly
      const mockPayId =
        paymentMethod === "gpay-upi"
          ? `gpay_upi_${Date.now()}`
          : paymentMethod === "cash"
          ? `cash_pickup_${Date.now()}`
          : `rzp_test_${Date.now()}`;

      await finalizeBooking(mockPayId);
    } catch (err: any) {
      setError(err.message || "Failed to process booking. Please try again.");
      setLoading(false);
    }
  }

  async function finalizeBooking(paymentId: string) {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costumeId: product?.id,
          costumeName: product?.name,
          costumeImage: product?.image,
          category: product?.category,
          customerName: name,
          customerPhone: phone.replace(/[^0-9]/g, ""),
          customerEmail: email,
          customerAddress: deliveryType === "home-delivery" ? address : "In-store pickup",
          deliveryType,
          startDate,
          endDate,
          days,
          dailyRate,
          rentalTotal,
          securityDeposit,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
          paymentId,
          notes,
          idProofType,
          idProofUrl: idProofImage || idProofNumber || undefined,
          agreementAccepted: agreementChecked,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.booking);
        if (onSuccess) onSuccess(data.booking.id);
      } else {
        setError(data.error || "Failed to save booking");
      }
    } catch (err: any) {
      setError(err.message || "Network error finalizing booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-amber-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-[#9b2335] to-[#b91c1c] text-white p-5 flex items-center justify-between rounded-t-3xl shadow-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Sparkles size={13} /> Easy Online Costume Rental
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-heading">
              {confirmedBooking ? "Booking Confirmed! 🎉" : `Book: ${product.name}`}
            </h2>
          </div>
          <button
            onClick={confirmedBooking ? handleCloseAndReload : onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-transform hover:scale-110 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success View with QR Pass */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900 font-heading">
                Rental Reserved Successfully!
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Booking ID: <strong className="text-[#9b2335] text-base">{confirmedBooking.id}</strong>
              </p>
              <div className="mt-3 inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-medium">
                📱 Instant SMS Confirmation sent to <strong>{confirmedBooking.customerPhone}</strong>
              </div>
            </div>

            {/* QR Code Pass Card */}
            {qrCodeDataUrl && (
              <div className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 justify-center shadow-xs">
                <img
                  src={qrCodeDataUrl}
                  alt="Booking QR Pass"
                  className="w-36 h-36 rounded-xl border border-gray-200 shadow-sm"
                />
                <div className="text-left space-y-1 sm:max-w-xs">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    <QrCode size={12} /> Counter Pickup Pass
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm">Scan at Shop Counter</h4>
                  <p className="text-xs text-gray-600">
                    Show this QR pass or mention <strong>#{confirmedBooking.id}</strong> at Moti Atya store to collect your costume instantly.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#9b2335] hover:underline cursor-pointer"
                  >
                    <Printer size={13} /> Print Booking Pass
                  </button>
                </div>
              </div>
            )}

            {/* Receipt Summary Card */}
            <div className="bg-[#fdf8f0] border border-amber-200 rounded-2xl p-5 text-left text-sm space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-amber-200/60">
                <img
                  src={confirmedBooking.costumeImage}
                  alt={confirmedBooking.costumeName}
                  className="w-14 h-16 object-cover rounded-xl border border-amber-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{confirmedBooking.costumeName}</h4>
                  <p className="text-xs text-gray-600">
                    Rental Dates: <strong>{confirmedBooking.startDate}</strong> to <strong>{confirmedBooking.endDate}</strong> ({confirmedBooking.days} {confirmedBooking.days > 1 ? "Days" : "Day"})
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Rental Fee ({confirmedBooking.days} day × ₹{confirmedBooking.dailyRate}):</span>
                  <span>₹{confirmedBooking.rentalTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Refundable Security Deposit:</span>
                  <span>₹{confirmedBooking.securityDeposit}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-amber-200">
                  <span>Total Amount ({confirmedBooking.paymentStatus.toUpperCase()}):</span>
                  <span className="text-[#9b2335]">₹{confirmedBooking.totalAmount}</span>
                </div>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-100 text-xs text-gray-700 flex items-start gap-2">
                <Clock size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Automated Return Reminder:</strong> You will receive an SMS reminder 24 hours before your return date (<strong>{confirmedBooking.endDate}</strong>) to return the costume and collect your ₹{confirmedBooking.securityDeposit} deposit refund.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`/track?id=${confirmedBooking.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#9b2335] hover:bg-[#7d1c2a] text-white py-3.5 px-5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles size={18} />
                <span>Track Order Status</span>
              </a>

              <a
                href={`https://wa.me/919930192705?text=${encodeURIComponent(
                  `Namaste! I just reserved booking #${confirmedBooking.id} for "${confirmedBooking.costumeName}". My name is ${confirmedBooking.customerName}. Pickup Date: ${confirmedBooking.startDate}. Please confirm pickup timings!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 px-5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Confirmation</span>
              </a>
            </div>

            <button
              onClick={handleCloseAndReload}
              className="w-full bg-slate-900 hover:bg-black text-white py-3 px-5 rounded-2xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <CheckCircle2 size={16} />
              <span>Done & Close</span>
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBookingSubmit} className="p-6 sm:p-7 space-y-6">
            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Costume Snapshot */}
            <div className="flex items-center gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-20 object-cover rounded-xl border border-amber-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm leading-snug">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">ID: {product.id} • Category: {product.category}</p>
                <p className="text-xs font-black text-[#9b2335] mt-1">₹{dailyRate}/day</p>
              </div>
            </div>

            {/* Date Conflict Notice if any */}
            {dateConflictError && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Dates Unavailable</strong>
                  <span>{dateConflictError}</span>
                </div>
              </div>
            )}

            {/* Date Pickers with Real-time Lock Check */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-700" />
                  Rental Start Date
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full text-sm p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#9b2335] bg-gray-50 ${
                    dateConflictError ? "border-amber-400 bg-amber-50/30" : "border-gray-300"
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-700" />
                  Return Due Date
                </label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full text-sm p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#9b2335] bg-gray-50 ${
                    dateConflictError ? "border-amber-400 bg-amber-50/30" : "border-gray-300"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Dynamic Price Breakdown Box */}
            <div className="bg-[#fdf8f0] border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Rental Duration:</span>
                <span className="font-bold text-gray-900">{days} {days > 1 ? "Days" : "Day"}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Rental Fee (₹{dailyRate} × {days} days):</span>
                <span>₹{rentalTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Refundable Security Deposit:
                </span>
                <span className="text-emerald-700 font-semibold">+₹{securityDeposit}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-amber-200">
                <span>Total Payable at Checkout:</span>
                <span className="text-lg text-[#9b2335]">₹{totalAmount}</span>
              </div>
              <p className="text-[11px] text-gray-500 italic">
                *The ₹{securityDeposit} deposit is 100% refunded immediately upon returning the costume in good condition.
              </p>
            </div>

            {/* Customer Information */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Customer Details (For SMS & Rental Agreement)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g. Pooja Mehta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b2335]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile Number (For SMS reminders) *
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="10-digit Mobile"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b2335]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b2335]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Govt ID Type</label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b2335] bg-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Student ID">Student ID</option>
                  </select>
                </div>
              </div>

              {/* ID Proof Number & Photo Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText size={14} className="text-[#9b2335]" />
                    {idProofType} Verification (Quick Verification)
                  </label>
                  <span className="text-[10px] text-slate-500">Security Requirement</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder={`Enter ${idProofType} number`}
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#9b2335]"
                  />

                  <div className="relative">
                    <label className="flex items-center justify-center gap-2 w-full text-xs p-2.5 rounded-xl border border-dashed border-slate-400 hover:border-[#9b2335] bg-white cursor-pointer text-slate-600 transition-all">
                      <Upload size={14} />
                      <span>{idProofImage ? "✓ ID Photo Attached" : "Upload ID Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIdUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Collection Preference */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Collection Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("store-pickup")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryType === "store-pickup"
                        ? "border-[#9b2335] bg-red-50 text-[#9b2335] shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <MapPin size={15} />
                    Store Pickup (Mira Rd)
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("home-delivery")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      deliveryType === "home-delivery"
                        ? "border-[#9b2335] bg-red-50 text-[#9b2335] shadow-sm"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>🛵</span>
                    Home Delivery (Mumbai)
                  </button>
                </div>

                {deliveryType === "home-delivery" && (
                  <div className="mt-2.5">
                    <textarea
                      placeholder="Enter flat/house no, building, area in Mumbai..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b2335]"
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Select Payment Mode
              </h4>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-[#9b2335] bg-red-50/70 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard size={18} className={paymentMethod === "razorpay" ? "text-[#9b2335]" : "text-gray-500"} />
                  <p className="text-xs font-bold text-gray-900 mt-1">Razorpay</p>
                  <p className="text-[10px] text-gray-500">Cards / UPI</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("gpay-upi")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === "gpay-upi"
                      ? "border-[#9b2335] bg-red-50/70 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <QrCode size={18} className={paymentMethod === "gpay-upi" ? "text-[#9b2335]" : "text-gray-500"} />
                  <p className="text-xs font-bold text-gray-900 mt-1">Google Pay</p>
                  <p className="text-[10px] text-gray-500">Direct UPI</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    paymentMethod === "cash"
                      ? "border-[#9b2335] bg-red-50/70 shadow-sm"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span>💵</span>
                  <p className="text-xs font-bold text-gray-900 mt-1">Pay at Store</p>
                  <p className="text-[10px] text-gray-500">Upon pickup</p>
                </button>
              </div>

              {/* UPI QR Display for Google Pay */}
              {paymentMethod === "gpay-upi" && (
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-2">
                  <div className="w-28 h-28 bg-white mx-auto rounded-xl p-2 shadow-sm border border-amber-100 flex items-center justify-center">
                    <div className="text-center">
                      <QrCode size={64} className="mx-auto text-gray-800" />
                      <span className="text-[9px] font-bold text-amber-800 uppercase">Scan with GPay</span>
                    </div>
                  </div>
                  <p className="text-xs font-mono font-bold text-gray-800">UPI ID: motiatya@okhdfcbank</p>
                  <p className="text-[11px] text-gray-600">
                    Pay <strong>₹{totalAmount}</strong> via Google Pay or PhonePe.
                  </p>
                </div>
              )}
            </div>

            {/* Digital Rental Agreement Checkbox */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
              <input
                type="checkbox"
                id="rentalAgreement"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#9b2335] focus:ring-[#9b2335] border-gray-300 cursor-pointer"
              />
              <label htmlFor="rentalAgreement" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
                <span className="font-bold text-gray-900">Rental Agreement: </span>
                I confirm that I will return the costume on or before <strong>{endDate}</strong> in good condition. The ₹{securityDeposit} security deposit will be 100% refunded upon return inspection.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || Boolean(dateConflictError)}
                className="w-full bg-gradient-to-r from-[#9b2335] to-[#b91c1c] hover:from-[#7d1c2a] hover:to-[#991b1b] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-900/20 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Processing Payment & Booking...</span>
                ) : dateConflictError ? (
                  <span>Select Available Dates to Proceed</span>
                ) : (
                  <>
                    <span>Confirm & Reserve for ₹{totalAmount}</span>
                    <Sparkles size={18} />
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-2">
                🔒 Safe checkout. Instant SMS notification & digital QR pass generated upon confirmation.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
