import fs from "fs";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const INVENTORY_FILE = path.join(DATA_DIR, "inventory_overrides.json");
const SMS_LOGS_FILE = path.join(DATA_DIR, "sms_logs.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

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

// Seed realistic initial bookings
function getInitialBookings(): Booking[] {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = twoDaysAgo.toISOString().split("T")[0];

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const threeDaysAhead = new Date(now);
  threeDaysAhead.setDate(threeDaysAhead.getDate() + 3);
  const threeDaysAheadStr = threeDaysAhead.toISOString().split("T")[0];

  return [
    {
      id: "BK-1041",
      costumeId: "g-001",
      costumeName: "Vibrant Patchwork Chaniya Choli",
      costumeImage: "/images/WhatsApp%20Image%202026-10-06%20at%208.10.47%20AM%20(1).jpeg",
      category: "garba-navratri",
      customerName: "Pooja Mehta",
      customerPhone: "9820198765",
      customerEmail: "pooja.mehta@gmail.com",
      customerAddress: "Flat 402, Gokul Dham, Kandivali West, Mumbai",
      deliveryType: "store-pickup",
      startDate: yesterdayStr,
      endDate: todayStr,
      days: 1,
      dailyRate: 550,
      rentalTotal: 550,
      securityDeposit: 500,
      totalAmount: 1050,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      paymentId: "pay_Rzp912839123",
      status: "picked-up",
      createdAt: yesterdayStr,
      notes: "Garba event at Goregaon Sports Club",
      reminderSent: true,
      reminderSentAt: todayStr + " 09:30 AM",
    },
    {
      id: "BK-1042",
      costumeId: "k-004",
      costumeName: "Chhatrapati Shivaji Maharaj Costume in Royal Red (Kids)",
      costumeImage: "/images/WhatsApp%20Image%202026-10-09%20at%209.40.34%20PM%20(1).jpeg",
      category: "kids-mythological",
      customerName: "Sachin Kadam",
      customerPhone: "9833451290",
      customerEmail: "sachin.kadam@yahoo.com",
      customerAddress: "B-12, Sahakar Niwas, Borivali East, Mumbai",
      deliveryType: "home-delivery",
      startDate: todayStr,
      endDate: tomorrowStr,
      days: 1,
      dailyRate: 450,
      rentalTotal: 450,
      securityDeposit: 500,
      totalAmount: 950,
      paymentMethod: "gpay-upi",
      paymentStatus: "paid",
      paymentId: "upi_gpay_84920491",
      status: "confirmed",
      createdAt: todayStr,
      notes: "School annual day drama costume with talwar & pheta",
      reminderSent: false,
    },
    {
      id: "BK-1043",
      costumeId: "t-005",
      costumeName: "Royal Red Velvet Kashmiri Pheran (Girls)",
      costumeImage: "/images/WhatsApp%20Image%202026-10-09%20at%209.46.39%20PM.jpeg",
      category: "traditional-indian",
      customerName: "Dr. Ananya Roy",
      customerPhone: "9769213840",
      customerEmail: "ananya.roy@health.org",
      customerAddress: "Flat 101, Lake View, Powai, Mumbai",
      deliveryType: "store-pickup",
      startDate: twoDaysAgoStr,
      endDate: yesterdayStr,
      days: 1,
      dailyRate: 500,
      rentalTotal: 500,
      securityDeposit: 500,
      totalAmount: 1000,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      paymentId: "pay_Rzp182930491",
      status: "overdue",
      createdAt: twoDaysAgoStr,
      notes: "Cultural Day performance at school",
      reminderSent: true,
      reminderSentAt: yesterdayStr + " 10:00 AM",
    },
    {
      id: "BK-1044",
      costumeId: "h-001",
      costumeName: "Cute Witch Orange & Black Dress with Pointed Hat (Girls)",
      costumeImage: "/images/WhatsApp%20Image%202026-10-09%20at%209.46.35%20PM%20(1).jpeg",
      category: "halloween",
      customerName: "Neha Sharma",
      customerPhone: "9920876123",
      customerEmail: "neha.sharma@gmail.com",
      customerAddress: "Villa 14, Royal Palms, Goregaon East, Mumbai",
      deliveryType: "home-delivery",
      startDate: todayStr,
      endDate: threeDaysAheadStr,
      days: 3,
      dailyRate: 350,
      rentalTotal: 1050,
      securityDeposit: 500,
      totalAmount: 1550,
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      paymentId: "pay_Rzp827103940",
      status: "picked-up",
      createdAt: todayStr,
      notes: "Society Halloween party weekend booking",
      reminderSent: false,
    },
    {
      id: "BK-1045",
      costumeId: "g-014",
      costumeName: "Royal Navy Blue Patchwork Designer Lehenga Set",
      costumeImage: "/images/WhatsApp%20Image%202026-10-06%20at%208.10.44%20AM%20(2).jpeg",
      category: "garba-navratri",
      customerName: "Kinjal Shah",
      customerPhone: "9820543210",
      customerEmail: "kinjal.shah@outlook.com",
      customerAddress: "703, Silver Arch, Malad West, Mumbai",
      deliveryType: "store-pickup",
      startDate: twoDaysAgoStr,
      endDate: yesterdayStr,
      days: 1,
      dailyRate: 1000,
      rentalTotal: 1000,
      securityDeposit: 500,
      totalAmount: 1500,
      paymentMethod: "razorpay",
      paymentStatus: "refunded",
      paymentId: "pay_Rzp771928491",
      status: "returned",
      createdAt: twoDaysAgoStr,
      notes: "Deposit of ₹500 refunded upon clean return",
      reminderSent: true,
      reminderSentAt: yesterdayStr + " 08:30 AM",
    },
  ];
}

// Initial SMS Logs
function getInitialSmsLogs(): SmsLog[] {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  return [
    {
      id: "sms-001",
      bookingId: "BK-1041",
      customerName: "Pooja Mehta",
      phone: "9820198765",
      type: "booking-confirmation",
      message:
        "Namaste Pooja! Your booking BK-1041 for 'Vibrant Patchwork Chaniya Choli' is confirmed. Dates: " +
        yesterdayStr +
        " to " +
        todayStr +
        ". Store: Moti Atya Costume Corner, Mumbai.",
      status: "delivered",
      gateway: "simulator",
      timestamp: yesterdayStr + " 14:22:00",
    },
    {
      id: "sms-002",
      bookingId: "BK-1041",
      customerName: "Pooja Mehta",
      phone: "9820198765",
      type: "return-reminder",
      message:
        "Reminder: Your rented costume 'Vibrant Patchwork Chaniya Choli' (BK-1041) is due for return today (" +
        todayStr +
        "). Please return to Moti Atya store to collect your ₹500 security deposit!",
      status: "delivered",
      gateway: "simulator",
      timestamp: todayStr + " 09:30:00",
    },
    {
      id: "sms-003",
      bookingId: "BK-1043",
      customerName: "Dr. Ananya Roy",
      phone: "9769213840",
      type: "overdue-alert",
      message:
        "ALERT: Your rental BK-1043 ('Royal Red Velvet Kashmiri Pheran') was due on " +
        yesterdayStr +
        ". Please return it today to avoid late fees. Contact: +91 98201 23456.",
      status: "delivered",
      gateway: "simulator",
      timestamp: todayStr + " 10:15:00",
    },
  ];
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOKINGS API
───────────────────────────────────────────────────────────────────────────── */

export function getBookings(): Booking[] {
  ensureDataDir();
  if (!fs.existsSync(BOOKINGS_FILE)) {
    const initial = getInitialBookings();
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(BOOKINGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading bookings file:", err);
    return getInitialBookings();
  }
}

export function saveBooking(booking: Booking): Booking {
  ensureDataDir();
  const bookings = getBookings();
  // If exists, update; else prepend
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking);
  }
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
  return booking;
}

export function updateBookingStatus(
  id: string,
  status: Booking["status"],
  paymentStatus?: Booking["paymentStatus"]
): Booking | null {
  ensureDataDir();
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;

  booking.status = status;
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
  return booking;
}

/* ─────────────────────────────────────────────────────────────────────────────
   INVENTORY OVERRIDES (LIVE PRICES & AVAILABILITY)
───────────────────────────────────────────────────────────────────────────── */

export function getInventoryOverrides(): Record<string, InventoryOverride> {
  ensureDataDir();
  if (!fs.existsSync(INVENTORY_FILE)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(INVENTORY_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading inventory overrides:", err);
    return {};
  }
}

export function updateInventoryPrice(
  costumeId: string,
  price: number,
  securityDeposit?: number,
  isAvailable?: boolean,
  isFeatured?: boolean
): InventoryOverride {
  ensureDataDir();
  const overrides = getInventoryOverrides();
  overrides[costumeId] = {
    id: costumeId,
    price,
    securityDeposit: securityDeposit !== undefined ? securityDeposit : overrides[costumeId]?.securityDeposit,
    isAvailable: isAvailable !== undefined ? isAvailable : overrides[costumeId]?.isAvailable,
    isFeatured: isFeatured !== undefined ? isFeatured : overrides[costumeId]?.isFeatured,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(INVENTORY_FILE, JSON.stringify(overrides, null, 2), "utf8");
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
  ensureDataDir();
  if (!fs.existsSync(SMS_LOGS_FILE)) {
    const initial = getInitialSmsLogs();
    fs.writeFileSync(SMS_LOGS_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(SMS_LOGS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading sms logs:", err);
    return getInitialSmsLogs();
  }
}

export function logSms(log: Omit<SmsLog, "id" | "timestamp">): SmsLog {
  ensureDataDir();
  const logs = getSmsLogs();
  const newLog: SmsLog = {
    ...log,
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
  logs.unshift(newLog);
  fs.writeFileSync(SMS_LOGS_FILE, JSON.stringify(logs, null, 2), "utf8");
  return newLog;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN SETTINGS
───────────────────────────────────────────────────────────────────────────── */

export function getSettings(): AdminSettings {
  ensureDataDir();
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf8");
    return defaultSettings;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Error reading settings:", err);
    return defaultSettings;
  }
}

export function updateSettings(settings: Partial<AdminSettings>): AdminSettings {
  ensureDataDir();
  const current = getSettings();
  const updated = { ...current, ...settings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf8");
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
