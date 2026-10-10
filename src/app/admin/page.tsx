"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Save,
  Check,
  X,
  CreditCard,
  QrCode,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Package,
  Users,
  Bell,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Home,
  Lock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { products, Product } from "@/data/products";
import AdminSecurityGate from "@/components/AdminSecurityGate";

interface Booking {
  id: string;
  costumeId: string;
  costumeName: string;
  costumeImage: string;
  category: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  deliveryType: "store-pickup" | "home-delivery";
  startDate: string;
  endDate: string;
  days: number;
  dailyRate: number;
  rentalTotal: number;
  securityDeposit: number;
  totalAmount: number;
  paymentMethod: "razorpay" | "gpay-upi" | "cash";
  paymentStatus: "paid" | "pending" | "refunded";
  paymentId?: string;
  status: "confirmed" | "picked-up" | "returned" | "overdue" | "cancelled";
  createdAt: string;
  notes?: string;
  reminderSent?: boolean;
  reminderSentAt?: string;
}

interface SmsLog {
  id: string;
  bookingId: string;
  customerName: string;
  phone: string;
  type: "booking-confirmation" | "return-reminder" | "overdue-alert" | "custom";
  message: string;
  status: "delivered" | "sent" | "failed";
  gateway: string;
  timestamp: string;
}

interface AdminSettings {
  storeName: string;
  storePhone: string;
  storeAddress: string;
  defaultSecurityDeposit: number;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayTestMode: boolean;
  upiId: string;
  smsGateway: string;
  fast2SmsApiKey: string;
  twilioSid: string;
  twilioAuthToken: string;
  twilioFromPhone: string;
  autoRemindersEnabled: boolean;
  reminderHoursBefore: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "inventory" | "reminders" | "customers" | "settings"
  >("overview");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [liveProducts, setLiveProducts] = useState<(Product & { liveDeposit?: number; isAvailable?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Live Auto-Refresh State
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");
  const prevBookingsCountRef = useRef<number | null>(null);

  // Search & Filters
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [inventorySearch, setInventorySearch] = useState("");
  const [inventoryCatFilter, setInventoryCatFilter] = useState("all");

  // Editing state for inventory price overrides
  const [editingCostumeId, setEditingCostumeId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDeposit, setEditDeposit] = useState<number>(500);
  const [savingInventory, setSavingInventory] = useState(false);

  // In-tab Security Passcode change states
  const [showPassModal, setShowPassModal] = useState(false);
  const [secOtpSent, setSecOtpSent] = useState(false);
  const [secOtp, setSecOtp] = useState("");
  const [secNewPass, setSecNewPass] = useState("");
  const [secConfirmPass, setSecConfirmPass] = useState("");
  const [secOtpPreview, setSecOtpPreview] = useState<string | null>(null);
  const [secLoading, setSecLoading] = useState(false);
  const [secError, setSecError] = useState("");
  const [secSuccess, setSecSuccess] = useState("");

  // Feedback toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch all data with optional silent auto-syncing
  const fetchData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setRefreshing(true);

      const ts = Date.now();
      const [resBookings, resReminders, resSettings, resInventory] = await Promise.all([
        fetch(`/api/bookings?_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
        fetch(`/api/reminders/send?_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
        fetch(`/api/settings?_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
        fetch(`/api/inventory?_t=${ts}`, { cache: "no-store", headers: { "Cache-Control": "no-cache" } }),
      ]);

      const [dataBookings, dataReminders, dataSettings, dataInventory] = await Promise.all([
        resBookings.json(),
        resReminders.json(),
        resSettings.json(),
        resInventory.json(),
      ]);

      if (dataBookings.success && Array.isArray(dataBookings.bookings)) {
        if (
          prevBookingsCountRef.current !== null &&
          dataBookings.bookings.length > prevBookingsCountRef.current
        ) {
          const newOrdersCount = dataBookings.bookings.length - prevBookingsCountRef.current;
          const newest = dataBookings.bookings[0];
          showToast(
            `🔔 ${newOrdersCount} New Order Received: #${newest.id} - ${newest.customerName} (${newest.costumeName})`
          );
        }
        prevBookingsCountRef.current = dataBookings.bookings.length;
        setBookings(dataBookings.bookings);
      }

      if (dataReminders.success) setSmsLogs(dataReminders.logs || []);
      if (dataSettings.success) setSettings(dataSettings.settings);
      if (dataInventory.success) setLiveProducts(dataInventory.products || []);

      const now = new Date();
      setLastSyncedTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Error loading admin data:", err);
      if (!isSilent) showToast("Error connecting to database");
    } finally {
      setLoading(false);
      if (!isSilent) setRefreshing(false);
    }
  }, []);

  const [currentDateStr, setCurrentDateStr] = useState("2026-10-10");

  useEffect(() => {
    setCurrentDateStr(new Date().toISOString().split("T")[0]);

    // Check Admin Security & Device Token
    const verifyAuth = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_device_token") : null;
        const res = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceToken: token }),
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  // Real-time polling loop when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch immediately on authentication
    fetchData(false);

    // Keep continuously refreshing every 4.5 seconds for incoming orders
    const interval = setInterval(() => {
      if (autoRefreshEnabled) {
        fetchData(true);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAuthenticated, autoRefreshEnabled, fetchData]);

  const handleLogout = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_device_token") : null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_device_token");
      }
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceToken: token }),
      });
    } catch {}
    setIsAuthenticated(false);
    showToast("Logged out of Admin Console.");
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (
    id: string,
    newStatus: "confirmed" | "picked-up" | "returned" | "overdue" | "cancelled",
    newPaymentStatus?: "paid" | "pending" | "refunded"
  ) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Booking ${id} marked as "${newStatus}"`);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus, paymentStatus: newPaymentStatus || b.paymentStatus } : b))
        );
      }
    } catch (err) {
      showToast("Failed to update status");
    }
  };

  // Send Return Reminder SMS
  const handleSendReminderSms = async (booking: Booking, type: "return-reminder" | "overdue-alert" = "return-reminder") => {
    try {
      const res = await fetch("/api/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, type }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`SMS reminder dispatched to ${booking.customerName} (${booking.customerPhone})`);
        fetchData();
      } else {
        showToast("Error sending SMS: " + data.error);
      }
    } catch (err) {
      showToast("SMS dispatch failed");
    }
  };

  // Save Inventory Price/Deposit override
  const handleSaveInventoryPrice = async (costumeId: string) => {
    try {
      setSavingInventory(true);
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          costumeId,
          price: editPrice,
          securityDeposit: editDeposit,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Updated price for costume ${costumeId} live on website!`);
        setEditingCostumeId(null);
        fetchData();
      } else {
        showToast("Failed to update price");
      }
    } catch (err) {
      showToast("Inventory update failed");
    } finally {
      setSavingInventory(false);
    }
  };

  // Analytics Metrics
  const analytics = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.paymentStatus === "paid" ? b.rentalTotal : 0), 0);
    const depositsHeld = bookings.reduce(
      (sum, b) => (b.status === "picked-up" || b.status === "confirmed" ? sum + b.securityDeposit : sum),
      0
    );
    const activeRentals = bookings.filter((b) => b.status === "picked-up").length;
    const overdueRentals = bookings.filter((b) => b.status === "overdue").length;
    const completedRentals = bookings.filter((b) => b.status === "returned").length;

    // Category revenue breakdown
    const catRevenue: Record<string, number> = {};
    bookings.forEach((b) => {
      const cat = b.category || "General";
      catRevenue[cat] = (catRevenue[cat] || 0) + b.rentalTotal;
    });

    return {
      totalRevenue,
      depositsHeld,
      activeRentals,
      overdueRentals,
      completedRentals,
      totalBookings: bookings.length,
      catRevenue,
    };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingStatusFilter !== "all" && b.status !== bookingStatusFilter) return false;
      if (bookingSearch.trim()) {
        const q = bookingSearch.toLowerCase();
        const mId = b.id.toLowerCase().includes(q);
        const mName = b.customerName.toLowerCase().includes(q);
        const mPhone = b.customerPhone.includes(q);
        const mCostume = b.costumeName.toLowerCase().includes(q);
        if (!mId && !mName && !mPhone && !mCostume) return false;
      }
      return true;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  // Due / Overdue items for 1-Day & multi-day rentals
  const dueItems = useMemo(() => {
    const today = currentDateStr;
    const dueToday = bookings.filter((b) => b.endDate === today && (b.status === "picked-up" || b.status === "confirmed"));
    const overdue = bookings.filter((b) => b.endDate < today && (b.status === "picked-up" || b.status === "overdue"));
    const upcoming = bookings.filter((b) => b.endDate > today && b.status === "picked-up");
    return { dueToday, overdue, upcoming };
  }, [bookings, currentDateStr]);

  // Unique Customers Directory
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email: string; bookingsCount: number; totalSpent: number; lastRental: string }>();
    bookings.forEach((b) => {
      const existing = map.get(b.customerPhone);
      if (existing) {
        existing.bookingsCount += 1;
        existing.totalSpent += b.rentalTotal;
        if (b.startDate > existing.lastRental) existing.lastRental = b.startDate;
      } else {
        map.set(b.customerPhone, {
          name: b.customerName,
          phone: b.customerPhone,
          email: b.customerEmail || "N/A",
          bookingsCount: 1,
          totalSpent: b.rentalTotal,
          lastRental: b.startDate,
        });
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#1c080d] flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw size={36} className="animate-spin text-amber-400 mb-3" />
        <p className="text-amber-200/90 font-medium text-sm">Verifying Admin Device Security Credentials...</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <AdminSecurityGate
        onAuthenticated={() => {
          setIsAuthenticated(true);
          fetchData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col pt-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-in">
          <Sparkles className="text-amber-400" size={18} />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9b2335] to-amber-600 flex items-center justify-center text-white shadow-md font-black text-lg">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Moti Atya Costume Corner – Admin Console
                  </h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Live System
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time Booking Tracker • Instant Price Updater • Automated Return SMS Reminders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Live Auto-Refresh Status Badge */}
              <button
                type="button"
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                title="Click to toggle auto-refresh polling"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  autoRefreshEnabled
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
                    : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${autoRefreshEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                <span className="hidden sm:inline">{autoRefreshEnabled ? "Live Auto-Sync: 4.5s" : "Auto-Sync Paused"}</span>
                <span className="sm:hidden">{autoRefreshEnabled ? "Live 4.5s" : "Paused"}</span>
                {lastSyncedTime && <span className="text-[10px] text-emerald-700/70 font-medium">({lastSyncedTime})</span>}
              </button>

              <button
                type="button"
                onClick={() => fetchData(false)}
                disabled={refreshing}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer border border-slate-200"
                title="Manually trigger immediate sync"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin text-[#9b2335]" : ""} />
                <span>{refreshing ? "Syncing..." : "Sync Now"}</span>
              </button>

              <Link
                href="/catalogue"
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                <Home size={14} />
                <span>Storefront</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                title="Lock admin dashboard and clear remembered device"
              >
                <Lock size={14} />
                <span>Lock & Log Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto mt-4 pt-2 border-t border-slate-100 scrollbar-none">
            {[
              { id: "overview", label: "Analytics & Revenue", icon: TrendingUp },
              { id: "bookings", label: `All Bookings (${bookings.length})`, icon: Calendar },
              { id: "inventory", label: "Inventory & Live Pricing", icon: Package },
              { id: "reminders", label: `SMS & Return Reminders (${dueItems.dueToday.length + dueItems.overdue.length} Due)`, icon: Bell },
              { id: "customers", label: `Customer Directory (${customers.length})`, icon: Users },
              { id: "settings", label: "Payment & Gateway Setup", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loading ? (
          <div className="text-center py-24">
            <RefreshCw size={36} className="animate-spin text-amber-600 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Loading store records & live bookings...</p>
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW & ANALYTICS TAB */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Rental Revenue</span>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <DollarSign size={20} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">₹{analytics.totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp size={12} /> From {analytics.totalBookings} online & store orders
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deposits in Custody</span>
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <ShieldAlert size={20} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">₹{analytics.depositsHeld.toLocaleString()}</h3>
                    <p className="text-xs text-amber-600 font-semibold mt-1">
                      Refundable upon safe costume return
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Rentals Out</span>
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Clock size={20} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">{analytics.activeRentals} Costumes</h3>
                    <p className="text-xs text-blue-600 font-semibold mt-1">
                      Currently with customers for events
                    </p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overdue Returns</span>
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                        <AlertTriangle size={20} />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-red-600">{analytics.overdueRentals} Pending</h3>
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      Requires SMS or WhatsApp follow-up
                    </p>
                  </div>
                </div>

                {/* Return Reminders Callout Banner */}
                {(dueItems.dueToday.length > 0 || dueItems.overdue.length > 0) && (
                  <div className="bg-gradient-to-r from-red-500 via-amber-600 to-amber-700 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                        <Bell size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-lg">
                          Action Required: {dueItems.dueToday.length} Due Today & {dueItems.overdue.length} Overdue Return{dueItems.overdue.length === 1 ? "" : "s"}!
                        </h4>
                        <p className="text-amber-100 text-xs mt-0.5">
                          Customers have completed their 1-day or multi-day rental period. Send them an SMS reminder to bring back the costume and claim their ₹500 deposit.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("reminders")}
                      className="whitespace-nowrap bg-white text-slate-950 hover:bg-amber-100 font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
                    >
                      Open SMS Reminders Hub →
                    </button>
                  </div>
                )}

                {/* Two Column Layout: Category Breakdown & Recent Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Category Revenue */}
                  <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <h4 className="font-heading font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                      <span>Revenue by Category</span>
                      <span className="text-xs text-slate-400 font-normal">Based on bookings</span>
                    </h4>

                    <div className="space-y-4">
                      {Object.entries(analytics.catRevenue).map(([cat, amount]) => {
                        const pct = Math.round((amount / (analytics.totalRevenue || 1)) * 100);
                        return (
                          <div key={cat} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="capitalize text-slate-700">{cat.replace("-", " ")}</span>
                              <span className="text-slate-900">₹{amount.toLocaleString()} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#9b2335] to-amber-500 rounded-full"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Catalog Items</span>
                        <strong className="text-lg font-black text-slate-800">152 Costumes</strong>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase">Completed Returns</span>
                        <strong className="text-lg font-black text-emerald-600">{analytics.completedRentals} Sets</strong>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Feed */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-heading font-bold text-slate-900 text-base">
                        Recent Costume Bookings
                      </h4>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="text-xs font-bold text-[#9b2335] hover:underline"
                      >
                        View All ({bookings.length})
                      </button>
                    </div>

                    {bookings.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {bookings.slice(0, 5).map((b) => (
                          <div key={b.id} className="py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={b.costumeImage}
                                alt={b.costumeName}
                                className="w-12 h-14 object-cover object-top rounded-xl border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm">{b.costumeName}</span>
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                                    {b.id}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {b.customerName} ({b.customerPhone}) • {b.days} day{b.days > 1 ? "s" : ""} rental
                                </p>
                                <span className="text-[11px] text-slate-400">
                                  {b.startDate} to {b.endDate}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-black text-slate-900 text-sm block">₹{b.totalAmount}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1 ${
                                  b.status === "confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : b.status === "picked-up"
                                    ? "bg-amber-100 text-amber-800"
                                    : b.status === "returned"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-slate-400">
                        <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-bold text-slate-700">No Orders Yet</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Fresh store setup. New customer bookings will appear here in real-time.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ALL BOOKINGS MANAGER TAB */}
            {activeTab === "bookings" && (
              <div className="space-y-6 animate-fade-in">
                {/* Search & Filter Controls */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search bookings by ID, customer name, phone, or costume..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#9b2335]/30 focus:border-[#9b2335]"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <Filter size={16} className="text-slate-400 shrink-0 ml-1" />
                    {["all", "confirmed", "picked-up", "returned", "overdue"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setBookingStatusFilter(status)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl uppercase tracking-wider whitespace-nowrap transition-all ${
                          bookingStatusFilter === status
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                          <th className="py-4 px-4">Booking Info</th>
                          <th className="py-4 px-4">Customer Details</th>
                          <th className="py-4 px-4">Rental Period</th>
                          <th className="py-4 px-4">Pricing Breakdown</th>
                          <th className="py-4 px-4">Status & Actions</th>
                          <th className="py-4 px-4">Reminders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredBookings.length > 0 ? (
                          filteredBookings.map((b) => {
                            const isOneDay = b.days === 1;
                            const whatsappReminder = encodeURIComponent(
                              `Namaste ${b.customerName}! Gentle reminder from Moti Atya Costume Corner. Your rental for "${b.costumeName}" (Booking: ${b.id}) was for ${b.days} day(s) ending on ${b.endDate}. Please return it to our store to collect your security deposit refund of ₹${b.securityDeposit}. Thank you!`
                            );

                            return (
                              <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                                {/* Booking & Costume */}
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={b.costumeImage}
                                      alt={b.costumeName}
                                      className="w-12 h-14 object-cover object-top rounded-xl border border-slate-200"
                                    />
                                    <div>
                                      <span className="font-mono text-[11px] font-bold text-slate-500 block">
                                        {b.id}
                                      </span>
                                      <strong className="text-slate-900 font-bold block max-w-[160px] truncate">
                                        {b.costumeName}
                                      </strong>
                                      <span className="text-[10px] text-slate-400 uppercase">
                                        {b.deliveryType === "store-pickup" ? "🏪 Store Trial & Pickup" : "🚚 Home Delivery"}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Customer Details */}
                                <td className="py-4 px-4">
                                  <div className="space-y-0.5">
                                    <strong className="text-slate-900 font-bold block">{b.customerName}</strong>
                                    <span className="text-slate-600 font-mono block">{b.customerPhone}</span>
                                    {b.customerEmail && (
                                      <span className="text-slate-400 text-[11px] block">{b.customerEmail}</span>
                                    )}
                                    {b.customerAddress && (
                                      <span className="text-slate-400 text-[10px] block max-w-[150px] truncate" title={b.customerAddress}>
                                        {b.customerAddress}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Rental Period */}
                                <td className="py-4 px-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                                      <Calendar size={13} className="text-amber-600" />
                                      <span>{b.startDate} → {b.endDate}</span>
                                    </div>
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isOneDay ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                                    }`}>
                                      ⏱️ {b.days} Day{b.days > 1 ? "s" : ""} Duration
                                    </span>
                                  </div>
                                </td>

                                {/* Pricing Breakdown */}
                                <td className="py-4 px-4">
                                  <div className="space-y-0.5 font-mono">
                                    <div className="text-slate-600 text-[11px]">
                                      ₹{b.dailyRate} × {b.days}d = <strong>₹{b.rentalTotal}</strong>
                                    </div>
                                    <div className="text-slate-500 text-[10px]">
                                      + Deposit: ₹{b.securityDeposit}
                                    </div>
                                    <div className="text-slate-900 font-bold text-xs pt-1 border-t border-slate-100">
                                      Total: ₹{b.totalAmount}
                                    </div>
                                    <span className="inline-block text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                      {b.paymentMethod.toUpperCase()} • {b.paymentStatus}
                                    </span>
                                  </div>
                                </td>

                                {/* Status & Quick Transitions */}
                                <td className="py-4 px-4">
                                  <div className="space-y-2">
                                    <span
                                      className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                        b.status === "confirmed"
                                          ? "bg-blue-100 text-blue-800"
                                          : b.status === "picked-up"
                                          ? "bg-amber-100 text-amber-800"
                                          : b.status === "returned"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : b.status === "overdue"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {b.status}
                                    </span>

                                    {/* Action dropdown or quick buttons */}
                                    <div className="flex flex-wrap gap-1">
                                      {b.status === "confirmed" && (
                                        <button
                                          onClick={() => handleUpdateBookingStatus(b.id, "picked-up")}
                                          className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                                        >
                                          Mark Picked Up
                                        </button>
                                      )}
                                      {b.status === "picked-up" && (
                                        <>
                                          <button
                                            onClick={() => handleUpdateBookingStatus(b.id, "returned", "refunded")}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                                            title="Costume returned, refund deposit"
                                          >
                                            Mark Returned & Refund Deposit
                                          </button>
                                          <button
                                            onClick={() => handleUpdateBookingStatus(b.id, "overdue")}
                                            className="bg-red-100 text-red-800 hover:bg-red-200 text-[10px] font-bold px-2 py-1 rounded-lg"
                                          >
                                            Mark Overdue
                                          </button>
                                        </>
                                      )}
                                      {b.status === "overdue" && (
                                        <button
                                          onClick={() => handleUpdateBookingStatus(b.id, "returned", "refunded")}
                                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                                        >
                                          Resolved: Returned
                                        </button>
                                      )}
                                      {b.status === "returned" && (
                                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                          <Check size={12} /> Deposit Refunded
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Reminders Column */}
                                <td className="py-4 px-4">
                                  <div className="space-y-1.5">
                                    <button
                                      onClick={() => handleSendReminderSms(b, b.status === "overdue" ? "overdue-alert" : "return-reminder")}
                                      className="flex items-center gap-1 bg-slate-900 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all shadow-xs"
                                    >
                                      <Send size={11} />
                                      <span>Send Return SMS</span>
                                    </button>

                                    <a
                                      href={`https://wa.me/91${b.customerPhone}?text=${whatsappReminder}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                                    >
                                      <MessageSquare size={11} />
                                      <span>WhatsApp</span>
                                    </a>

                                    {b.reminderSent && (
                                      <span className="text-[9px] text-slate-400 block">
                                        Last sent: {b.reminderSentAt || "Yes"}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                              No bookings found matching filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. INVENTORY & LIVE PRICING TAB */}
            {activeTab === "inventory" && (
              <div className="space-y-6 animate-fade-in">
                {/* Header note */}
                <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-600" />
                      Live Costumes & Pricing Control
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Update daily rental rates (₹) and security deposits (₹) here. Changes immediately reflect across the customer catalogue, search filters, and checkout price calculators!
                    </p>
                  </div>
                  <span className="text-xs bg-white text-amber-900 font-bold px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs">
                    152 Costumes Managed
                  </span>
                </div>

                {/* Search & Category Filter */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                  <div className="relative flex-1">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search costume by name, code (e.g. garba-001) or tags..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#9b2335]/30 focus:border-[#9b2335]"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    {[
                      { id: "all", label: "All Categories" },
                      { id: "garba-navratri", label: "Garba" },
                      { id: "kids-mythological", label: "Kids" },
                      { id: "traditional-indian", label: "Traditional" },
                      { id: "halloween", label: "Halloween" },
                      { id: "mythological", label: "Mythological" },
                      { id: "festival", label: "Festivals" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setInventoryCatFilter(cat.id)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                          inventoryCatFilter === cat.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                          <th className="py-4 px-4">Item Code & Photo</th>
                          <th className="py-4 px-4">Costume Title</th>
                          <th className="py-4 px-4">Category</th>
                          <th className="py-4 px-4">Daily Rental Rate</th>
                          <th className="py-4 px-4">Security Deposit</th>
                          <th className="py-4 px-4">Availability</th>
                          <th className="py-4 px-4">Quick Price Edit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {liveProducts
                          .filter((p) => {
                            if (inventoryCatFilter !== "all" && p.category !== inventoryCatFilter) return false;
                            if (inventorySearch.trim()) {
                              const q = inventorySearch.toLowerCase();
                              const mName = p.name.toLowerCase().includes(q);
                              const mId = p.id.toLowerCase().includes(q);
                              const mTag = p.tags?.some((t) => t.toLowerCase().includes(q));
                              if (!mName && !mId && !mTag) return false;
                            }
                            return true;
                          })
                          .slice(0, 50)
                          .map((p) => {
                            const isEditing = editingCostumeId === p.id;
                            const currentPrice = typeof p.price === "number" ? p.price : 600;
                            const currentDeposit = p.liveDeposit || 500;

                            return (
                              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-12 h-14 object-cover object-top rounded-xl border border-slate-200"
                                    />
                                    <span className="font-mono text-xs font-bold text-slate-700">{p.id}</span>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <strong className="text-slate-900 font-bold block max-w-xs">{p.name}</strong>
                                  <span className="text-[10px] text-slate-400 block line-clamp-1">{p.description}</span>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                    {p.category.replace("-", " ")}
                                  </span>
                                </td>

                                <td className="py-3 px-4 font-mono">
                                  {isEditing ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400 text-xs">₹</span>
                                      <input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(Number(e.target.value))}
                                        className="w-20 px-2 py-1 rounded-lg border border-amber-300 font-bold text-slate-900 text-xs"
                                      />
                                    </div>
                                  ) : (
                                    <span className="font-black text-slate-900 text-sm">₹{currentPrice}/day</span>
                                  )}
                                </td>

                                <td className="py-3 px-4 font-mono">
                                  {isEditing ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400 text-xs">₹</span>
                                      <input
                                        type="number"
                                        value={editDeposit}
                                        onChange={(e) => setEditDeposit(Number(e.target.value))}
                                        className="w-20 px-2 py-1 rounded-lg border border-amber-300 font-bold text-slate-900 text-xs"
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-slate-600 font-bold">₹{currentDeposit}</span>
                                  )}
                                </td>

                                <td className="py-3 px-4">
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                    <CheckCircle2 size={11} /> In Stock
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleSaveInventoryPrice(p.id)}
                                        disabled={savingInventory}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs"
                                      >
                                        <Save size={12} />
                                        <span>Save</span>
                                      </button>
                                      <button
                                        onClick={() => setEditingCostumeId(null)}
                                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs px-2.5 py-1.5 rounded-xl"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setEditingCostumeId(p.id);
                                        setEditPrice(currentPrice);
                                        setEditDeposit(currentDeposit);
                                      }}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                                    >
                                      <Edit size={12} />
                                      <span>Edit Rate</span>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SMS & RETURN REMINDERS TAB */}
            {activeTab === "reminders" && (
              <div className="space-y-8 animate-fade-in">
                {/* Header overview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-2 inline-block">
                        Automated 1-Day & Multi-Day Rental Follow-Up
                      </span>
                      <h3 className="font-heading font-black text-2xl text-slate-900 tracking-tight">
                        Costume Return & SMS Reminders Hub
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                        When a customer rents a costume for 1 day, this system tracks their return deadline and allows you to dispatch instant SMS and WhatsApp reminders so they bring the dress back promptly and receive their security deposit refund.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shrink-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SMS Gateway Status</span>
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mt-1">
                        Active ({settings?.smsGateway?.toUpperCase() || "SIMULATOR"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Due Today & Overdue Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Due Today / 1-Day Rentals */}
                  <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-amber-600" />
                        <h4 className="font-heading font-bold text-slate-900 text-base">
                          Due for Return Today ({dueItems.dueToday.length})
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        1-Day Cycles
                      </span>
                    </div>

                    {dueItems.dueToday.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {dueItems.dueToday.map((b) => (
                          <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                            <div>
                              <strong className="text-slate-900 font-bold text-xs sm:text-sm block">
                                {b.customerName}
                              </strong>
                              <span className="text-xs text-slate-500 block font-mono">
                                📞 {b.customerPhone} • {b.costumeName}
                              </span>
                              <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                                Rented for {b.days} day(s) • Ends: {b.endDate}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSendReminderSms(b, "return-reminder")}
                                className="bg-[#9b2335] hover:bg-[#801b2a] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1"
                              >
                                <Send size={11} />
                                <span>Send SMS</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        No active rentals ending today. All customers are on schedule!
                      </div>
                    )}
                  </div>

                  {/* Overdue Returns */}
                  <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-red-600" />
                        <h4 className="font-heading font-bold text-slate-900 text-base">
                          Overdue Returns ({dueItems.overdue.length})
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                        Past Due Date
                      </span>
                    </div>

                    {dueItems.overdue.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                        {dueItems.overdue.map((b) => (
                          <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                            <div>
                              <strong className="text-slate-900 font-bold text-xs sm:text-sm block">
                                {b.customerName}
                              </strong>
                              <span className="text-xs text-slate-500 block font-mono">
                                📞 {b.customerPhone} • {b.costumeName}
                              </span>
                              <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                                Due date was: {b.endDate} (Overdue!)
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSendReminderSms(b, "overdue-alert")}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1"
                              >
                                <Send size={11} />
                                <span>Urgent SMS</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        Zero overdue costumes! Excellent return record.
                      </div>
                    )}
                  </div>
                </div>

                {/* SMS Logs Stream */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
                  <h4 className="font-heading font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                    <span>Recent SMS Transmission Log</span>
                    <span className="text-xs font-normal text-slate-400">{smsLogs.length} total messages dispatched</span>
                  </h4>

                  {smsLogs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {smsLogs.slice(0, 8).map((log) => (
                        <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{log.customerName}</span>
                              <span className="text-[11px] font-mono text-slate-500">({log.phone})</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                log.type === "return-reminder"
                                  ? "bg-amber-100 text-amber-800"
                                  : log.type === "overdue-alert"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {log.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl font-mono border border-slate-100">
                              {log.message}
                            </p>
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[10px] text-emerald-600 font-bold block uppercase">
                              Delivered via {log.gateway}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No SMS messages dispatched yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. CUSTOMER DIRECTORY TAB */}
            {activeTab === "customers" && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-black text-slate-900 text-base">Customer Directory</h3>
                    <p className="text-xs text-slate-500">List of verified customers who booked costumes</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl">
                    {customers.length} Unique Contacts
                  </span>
                </div>

                {customers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {customers.map((c) => (
                      <div key={c.phone} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <strong className="text-slate-900 font-bold text-sm block">{c.name}</strong>
                            <span className="text-xs font-mono text-slate-500">📞 {c.phone}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3 grid grid-cols-2 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Bookings</span>
                            <strong className="text-slate-900 font-black">{c.bookingsCount} orders</strong>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Spent</span>
                            <strong className="text-emerald-700 font-black">₹{c.totalSpent}</strong>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                          <span>Last rental: {c.lastRental}</span>
                          <a
                            href={`https://wa.me/91${c.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 font-bold hover:underline"
                          >
                            WhatsApp Chat →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-700">No Customer Records Yet</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Customers who reserve costumes will automatically appear in this directory with contact & booking history.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 6. SETTINGS & GATEWAYS TAB */}
            {activeTab === "settings" && settings && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                {/* Razorpay & Online Card Config */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">
                        Razorpay Payment Gateway Integration
                      </h4>
                      <p className="text-xs text-slate-500">
                        Accepts Credit Cards, Debit Cards, NetBanking, and Instant UPI inside checkout
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={settings.razorpayKeyId}
                        onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Razorpay Key Secret</label>
                      <input
                        type="password"
                        value={settings.razorpayKeySecret}
                        onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="rzpTest"
                      checked={settings.razorpayTestMode}
                      onChange={(e) => setSettings({ ...settings, razorpayTestMode: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="rzpTest" className="text-xs font-semibold text-slate-700">
                      Enable Razorpay Test Mode Simulator (Recommended for testing without deducting actual bank accounts)
                    </label>
                  </div>
                </div>

                {/* Google Pay / PhonePe UPI Direct Setup */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">
                        Google Pay / UPI VPA Direct QR Setup
                      </h4>
                      <p className="text-xs text-slate-500">
                        Receives 0% fee payments directly into your Indian bank account via Google Pay QR codes
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Store UPI VPA Address</label>
                      <input
                        type="text"
                        value={settings.upiId}
                        onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                        placeholder="e.g. motiatya@okhdfcbank"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Default Security Deposit (₹)</label>
                      <input
                        type="number"
                        value={settings.defaultSecurityDeposit}
                        onChange={(e) => setSettings({ ...settings, defaultSecurityDeposit: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Gateway & Automated Schedule Setup */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-slate-900 text-lg">
                        SMS Gateway & Return Reminder Settings
                      </h4>
                      <p className="text-xs text-slate-500">
                        Sends confirmation and return reminder SMS to customers
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Select SMS Gateway</label>
                      <select
                        value={settings.smsGateway}
                        onChange={(e) => setSettings({ ...settings, smsGateway: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                      >
                        <option value="simulator">Built-in Live Simulator (Logged to Console & Admin)</option>
                        <option value="fast2sms">Fast2SMS (Indian Gateway API)</option>
                        <option value="twilio">Twilio Cloud SMS</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Fast2SMS API Key (Optional)</label>
                      <input
                        type="password"
                        value={settings.fast2SmsApiKey}
                        onChange={(e) => setSettings({ ...settings, fast2SmsApiKey: e.target.value })}
                        placeholder="Enter Fast2SMS API key"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="autoRemind"
                      checked={settings.autoRemindersEnabled}
                      onChange={(e) => setSettings({ ...settings, autoRemindersEnabled: e.target.checked })}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="autoRemind" className="text-xs font-semibold text-slate-700">
                      Enable Automated SMS dispatch when a rental hits the 1-day or multi-day return date
                    </label>
                  </div>
                </div>

                {/* Admin Security & OTP Passcode Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#9b2335] flex items-center justify-center">
                        <KeyRound size={20} />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-slate-900 text-lg">
                          Admin Security Passcode & Access Control
                        </h4>
                        <p className="text-xs text-slate-500">
                          Protects this admin console behind private passcode and device authentication
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                      Mobile: +91 99301 92705
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-800">Authorized Admin Recovery Phone</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Security OTP codes for passcode changes are routed exclusively to <strong>+91 99301 92705</strong>.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPassModal(true);
                        setSecError("");
                        setSecSuccess("");
                        setSecOtpSent(false);
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-2 self-start sm:self-auto"
                    >
                      <KeyRound size={14} />
                      <span>Change Security Passcode</span>
                    </button>
                  </div>

                  {/* Inline Security Passcode Change Panel */}
                  {showPassModal && (
                    <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 animate-fade-in text-xs">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#9b2335]" />
                          <span>Verify with OTP to +91 99301 92705</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setShowPassModal(false)}
                          className="text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {secError && (
                        <div className="p-2.5 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs">
                          {secError}
                        </div>
                      )}
                      {secSuccess && (
                        <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs">
                          {secSuccess}
                        </div>
                      )}

                      {secOtpPreview && (
                        <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
                          <span>SMS OTP Preview: <strong>{secOtpPreview}</strong></span>
                          <button
                            type="button"
                            onClick={() => setSecOtp(secOtpPreview)}
                            className="underline text-amber-800 font-bold"
                          >
                            Use Code
                          </button>
                        </div>
                      )}

                      {!secOtpSent ? (
                        <button
                          type="button"
                          disabled={secLoading}
                          onClick={async () => {
                            setSecLoading(true);
                            setSecError("");
                            try {
                              const res = await fetch("/api/admin/auth/otp/send", { method: "POST" });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                setSecOtpSent(true);
                                if (data.otpPreview) setSecOtpPreview(data.otpPreview);
                                setSecSuccess("OTP sent to +91 99301 92705!");
                              } else {
                                setSecError(data.message || "Failed to send OTP.");
                              }
                            } catch {
                              setSecError("Network error.");
                            } finally {
                              setSecLoading(false);
                            }
                          }}
                          className="bg-[#9b2335] hover:bg-[#801b2a] text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                        >
                          {secLoading ? "Sending OTP..." : "Send OTP SMS to 99301 92705"}
                        </button>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">6-Digit OTP</label>
                            <input
                              type="text"
                              maxLength={6}
                              value={secOtp}
                              onChange={(e) => setSecOtp(e.target.value.replace(/[^0-9]/g, ""))}
                              placeholder="123456"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center tracking-widest text-sm"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">New Passcode</label>
                            <input
                              type="password"
                              value={secNewPass}
                              onChange={(e) => setSecNewPass(e.target.value)}
                              placeholder="New passcode"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Confirm Passcode</label>
                            <input
                              type="password"
                              value={secConfirmPass}
                              onChange={(e) => setSecConfirmPass(e.target.value)}
                              placeholder="Repeat passcode"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                            />
                          </div>

                          <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowPassModal(false)}
                              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={secLoading}
                              onClick={async () => {
                                if (!secOtp || secOtp.length !== 6) {
                                  setSecError("Please enter valid 6-digit OTP.");
                                  return;
                                }
                                if (!secNewPass || secNewPass.length < 4) {
                                  setSecError("Passcode must be at least 4 chars.");
                                  return;
                                }
                                if (secNewPass !== secConfirmPass) {
                                  setSecError("Passcodes do not match.");
                                  return;
                                }
                                setSecLoading(true);
                                setSecError("");
                                try {
                                  const res = await fetch("/api/admin/auth/otp/verify-reset", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ otp: secOtp, newPasscode: secNewPass }),
                                  });
                                  const data = await res.json();
                                  if (res.ok && data.success) {
                                    setSecSuccess("Admin security passcode changed successfully!");
                                    showToast("Admin Security Passcode Updated!");
                                    setTimeout(() => setShowPassModal(false), 1500);
                                  } else {
                                    setSecError(data.message || "Failed to update passcode.");
                                  }
                                } catch {
                                  setSecError("Network error.");
                                } finally {
                                  setSecLoading(false);
                                }
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl cursor-pointer"
                            >
                              {secLoading ? "Saving..." : "Verify & Save Passcode"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Save Settings Button */}
                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/settings", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(settings),
                        });
                        const data = await res.json();
                        if (data.success) {
                          showToast("Payment & Gateway configurations saved successfully!");
                        }
                      } catch (err) {
                        showToast("Failed to save settings");
                      }
                    }}
                    className="bg-[#9b2335] hover:bg-[#801b2a] text-white font-bold px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md transition-all hover:scale-105"
                  >
                    Save All Admin Settings
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
