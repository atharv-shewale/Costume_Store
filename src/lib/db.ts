import fs from "fs";
import path from "path";
import os from "os";
import { products, Product } from "@/data/products";

export interface Booking {
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
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
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

export interface InventoryOverride {
  id: string; // costumeId
  price?: number;
  securityDeposit?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  updatedAt: string;
}

export interface SmsLog {
  id: string;
  bookingId: string;
  customerName: string;
  phone: string;
  type: "booking-confirmation" | "return-reminder" | "overdue-alert" | "custom";
  message: string;
  status: "delivered" | "sent" | "failed";
  gateway: "fast2sms" | "twilio" | "simulator";
  timestamp: string;
}

export interface AdminSettings {
  storeName: string;
  storePhone: string;
  storeAddress: string;
  defaultSecurityDeposit: number;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayTestMode: boolean;
  upiId: string; // for Google Pay / PhonePe
  smsGateway: "simulator" | "fast2sms" | "twilio";
  fast2SmsApiKey: string;
  twilioSid: string;
  twilioAuthToken: string;
  twilioFromPhone: string;
  autoRemindersEnabled: boolean;
  reminderHoursBefore: number; // e.g. 24 hours before return
}

const BUNDLED_DATA_DIR = path.join(process.cwd(), "data");
const IS_SERVERLESS =
  !!process.env.VERCEL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.cwd().startsWith("/var/task");
const DATA_DIR = IS_SERVERLESS ? path.join(os.tmpdir(), "moti_atya_data") : BUNDLED_DATA_DIR;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const BUNDLED_BOOKINGS_FILE = path.join(BUNDLED_DATA_DIR, "bookings.json");

const INVENTORY_FILE = path.join(DATA_DIR, "inventory_overrides.json");
const BUNDLED_INVENTORY_FILE = path.join(BUNDLED_DATA_DIR, "inventory_overrides.json");

const SMS_LOGS_FILE = path.join(DATA_DIR, "sms_logs.json");
const BUNDLED_SMS_LOGS_FILE = path.join(BUNDLED_DATA_DIR, "sms_logs.json");

const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const BUNDLED_SETTINGS_FILE = path.join(BUNDLED_DATA_DIR, "settings.json");

let memoryBookings: Booking[] | null = null;
let memoryInventory: Record<string, InventoryOverride> | null = null;
let memorySmsLogs: SmsLog[] | null = null;
let memorySettings: AdminSettings | null = null;

function safeWriteJson(filePath: string, data: any) {
  try {
    ensureDataDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn(`Filesystem write skipped (${filePath}):`, err);
  }
}

// Default initial settings
const defaultSettings: AdminSettings = {
  storeName: "Moti Atya Costume Corner",
  storePhone: "+91 98201 23456",
  storeAddress: "Shop No. 4, Ground Floor, Royal Market, Mira Bhayandar, Mumbai 401107",
  defaultSecurityDeposit: 500,
  razorpayKeyId: "rzp_test_MotiAtyaCostumes",
  razorpayKeySecret: "mock_secret_key_12345",
  razorpayTestMode: true,
  upiId: "motiatya@okhdfcbank",
  smsGateway: "simulator",
  fast2SmsApiKey: "",
  twilioSid: "",
  twilioAuthToken: "",
  twilioFromPhone: "",
  autoRemindersEnabled: true,
  reminderHoursBefore: 24,
};

// Clean initial bookings (fresh store)
function getInitialBookings(): Booking[] {
  return [];
}

// Clean initial SMS logs (fresh store)
function getInitialSmsLogs(): SmsLog[] {
  return [];
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOKINGS API
───────────────────────────────────────────────────────────────────────────── */

export function getBookings(): Booking[] {
  if (memoryBookings) return memoryBookings;
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      memoryBookings = JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf8"));
      return memoryBookings!;
    }
  } catch {}
  try {
    if (fs.existsSync(BUNDLED_BOOKINGS_FILE)) {
      memoryBookings = JSON.parse(fs.readFileSync(BUNDLED_BOOKINGS_FILE, "utf8"));
      safeWriteJson(BOOKINGS_FILE, memoryBookings);
      return memoryBookings!;
    }
  } catch {}
  memoryBookings = getInitialBookings();
  safeWriteJson(BOOKINGS_FILE, memoryBookings);
  return memoryBookings;
}

export function saveBooking(booking: Booking): Booking {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking);
  }
  memoryBookings = bookings;
  safeWriteJson(BOOKINGS_FILE, bookings);
  return booking;
}

export function updateBookingStatus(
  id: string,
  status: Booking["status"],
  paymentStatus?: Booking["paymentStatus"]
): Booking | null {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;

  booking.status = status;
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }
  memoryBookings = bookings;
  safeWriteJson(BOOKINGS_FILE, bookings);
  return booking;
}

/* ─────────────────────────────────────────────────────────────────────────────
   INVENTORY OVERRIDES (LIVE PRICES & AVAILABILITY)
───────────────────────────────────────────────────────────────────────────── */

export function getInventoryOverrides(): Record<string, InventoryOverride> {
  if (memoryInventory) return memoryInventory;
  try {
    if (fs.existsSync(INVENTORY_FILE)) {
      memoryInventory = JSON.parse(fs.readFileSync(INVENTORY_FILE, "utf8"));
      return memoryInventory!;
    }
  } catch {}
  try {
    if (fs.existsSync(BUNDLED_INVENTORY_FILE)) {
      memoryInventory = JSON.parse(fs.readFileSync(BUNDLED_INVENTORY_FILE, "utf8"));
      safeWriteJson(INVENTORY_FILE, memoryInventory);
      return memoryInventory!;
    }
  } catch {}
  memoryInventory = {};
  return memoryInventory;
}

export function updateInventoryPrice(
  costumeId: string,
  price: number,
  securityDeposit?: number,
  isAvailable?: boolean,
  isFeatured?: boolean
): InventoryOverride {
  const overrides = getInventoryOverrides();
  overrides[costumeId] = {
    id: costumeId,
    price,
    securityDeposit: securityDeposit !== undefined ? securityDeposit : overrides[costumeId]?.securityDeposit,
    isAvailable: isAvailable !== undefined ? isAvailable : overrides[costumeId]?.isAvailable,
    isFeatured: isFeatured !== undefined ? isFeatured : overrides[costumeId]?.isFeatured,
    updatedAt: new Date().toISOString(),
  };
  memoryInventory = overrides;
  safeWriteJson(INVENTORY_FILE, overrides);
  return overrides[costumeId];
}

// Get product merged with live admin overrides
export function getLiveProducts(): (Product & { isAvailable?: boolean; liveDeposit?: number })[] {
  const overrides = getInventoryOverrides();
  return products.map((p) => {
    const ov = overrides[p.id];
    return {
      ...p,
      price: ov?.price !== undefined ? ov.price : p.price,
      featured: ov?.isFeatured !== undefined ? ov.isFeatured : p.featured,
      isAvailable: ov?.isAvailable !== undefined ? ov.isAvailable : true,
      liveDeposit: ov?.securityDeposit !== undefined ? ov.securityDeposit : 500,
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMS LOGS & REMINDERS
───────────────────────────────────────────────────────────────────────────── */

export function getSmsLogs(): SmsLog[] {
  if (memorySmsLogs) return memorySmsLogs;
  try {
    if (fs.existsSync(SMS_LOGS_FILE)) {
      memorySmsLogs = JSON.parse(fs.readFileSync(SMS_LOGS_FILE, "utf8"));
      return memorySmsLogs!;
    }
  } catch {}
  try {
    if (fs.existsSync(BUNDLED_SMS_LOGS_FILE)) {
      memorySmsLogs = JSON.parse(fs.readFileSync(BUNDLED_SMS_LOGS_FILE, "utf8"));
      safeWriteJson(SMS_LOGS_FILE, memorySmsLogs);
      return memorySmsLogs!;
    }
  } catch {}
  memorySmsLogs = getInitialSmsLogs();
  safeWriteJson(SMS_LOGS_FILE, memorySmsLogs);
  return memorySmsLogs;
}

export function logSms(log: Omit<SmsLog, "id" | "timestamp">): SmsLog {
  const logs = getSmsLogs();
  const newLog: SmsLog = {
    ...log,
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
  logs.unshift(newLog);
  memorySmsLogs = logs;
  safeWriteJson(SMS_LOGS_FILE, logs);
  return newLog;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN SETTINGS
───────────────────────────────────────────────────────────────────────────── */

export function getSettings(): AdminSettings {
  if (memorySettings) return memorySettings;
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      memorySettings = { ...defaultSettings, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8")) };
      return memorySettings!;
    }
  } catch {}
  try {
    if (fs.existsSync(BUNDLED_SETTINGS_FILE)) {
      memorySettings = { ...defaultSettings, ...JSON.parse(fs.readFileSync(BUNDLED_SETTINGS_FILE, "utf8")) };
      safeWriteJson(SETTINGS_FILE, memorySettings);
      return memorySettings!;
    }
  } catch {}
  memorySettings = defaultSettings;
  safeWriteJson(SETTINGS_FILE, memorySettings);
  return memorySettings;
}

export function updateSettings(settings: Partial<AdminSettings>): AdminSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  memorySettings = updated;
  safeWriteJson(SETTINGS_FILE, updated);
  return updated;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANALYTICS & SUMMARY
───────────────────────────────────────────────────────────────────────────── */

export function getAnalytics() {
  const bookings = getBookings();
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.paymentStatus === "paid" || b.status === "returned" ? sum + b.rentalTotal : sum),
    0
  );
  const activeRentals = bookings.filter((b) => b.status === "picked-up").length;
  const overdueReturns = bookings.filter((b) => b.status === "overdue").length;
  const totalDepositsHeld = bookings
    .filter((b) => b.status === "picked-up" || b.status === "overdue")
    .reduce((sum, b) => sum + b.securityDeposit, 0);

  // Group by category
  const categoryRevenue: Record<string, { count: number; revenue: number }> = {};
  bookings.forEach((b) => {
    if (!categoryRevenue[b.category]) {
      categoryRevenue[b.category] = { count: 0, revenue: 0 };
    }
    categoryRevenue[b.category].count++;
    categoryRevenue[b.category].revenue += b.rentalTotal;
  });

  return {
    totalBookings: bookings.length,
    totalRevenue,
    activeRentals,
    overdueReturns,
    totalDepositsHeld,
    categoryRevenue,
  };
}
