import fs from "fs";
import path from "path";
import os from "os";
import { products, Product } from "@/data/products";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

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
  // Security & Lifecycle fields
  idProofUrl?: string;
  idProofType?: string;
  agreementAccepted?: boolean;
  depositRefunded?: number;
  depositDeduction?: number;
  inspectionNotes?: string;
  returnedAt?: string;
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
  type: "booking-confirmation" | "return-reminder" | "overdue-alert" | "deposit-refund" | "custom";
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
  upiId: string;
  smsGateway: "simulator" | "fast2sms" | "twilio";
  fast2SmsApiKey: string;
  twilioSid: string;
  twilioAuthToken: string;
  twilioFromPhone: string;
  autoRemindersEnabled: boolean;
  reminderHoursBefore: number;
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
  storeName: "Costume Store Fancy dress Rental Shop",
  storePhone: "+91 99301 92705",
  storeAddress: "SHOP A1, Ostwal Kiran Apartment, Mira Bhayandar Rd, opp. BHARAT/Old petrol Pump, Mira Road East, Mumbai, Maharashtra 401105",
  defaultSecurityDeposit: 500,
  razorpayKeyId: "rzp_test_MotiAtyaCostumes",
  razorpayKeySecret: "mock_secret_key_12345",
  razorpayTestMode: true,
  upiId: "9930192705@okbizaxis",
  smsGateway: "simulator",
  fast2SmsApiKey: "",
  twilioSid: "",
  twilioAuthToken: "",
  twilioFromPhone: "",
  autoRemindersEnabled: true,
  reminderHoursBefore: 24,
};

function readLocalBookings(): Booking[] {
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(BOOKINGS_FILE, "utf8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  try {
    if (fs.existsSync(BUNDLED_BOOKINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(BUNDLED_BOOKINGS_FILE, "utf8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return memoryBookings || [];
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUPABASE ROW MAPPERS
───────────────────────────────────────────────────────────────────────────── */

function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    costumeId: row.costume_id,
    costumeName: row.costume_name,
    costumeImage: row.costume_image || "",
    category: row.category || "general",
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || "",
    customerAddress: row.customer_address || "",
    deliveryType: row.delivery_type || "store-pickup",
    startDate: typeof row.start_date === "string" ? row.start_date.split("T")[0] : row.start_date,
    endDate: typeof row.end_date === "string" ? row.end_date.split("T")[0] : row.end_date,
    days: Number(row.days) || 1,
    dailyRate: Number(row.daily_rate) || 0,
    rentalTotal: Number(row.rental_total) || 0,
    securityDeposit: Number(row.security_deposit) || 500,
    totalAmount: Number(row.total_amount) || 0,
    paymentMethod: row.payment_method || "razorpay",
    paymentStatus: row.payment_status || "paid",
    paymentId: row.payment_id || "",
    status: row.status || "confirmed",
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "",
    notes: row.notes || "",
    reminderSent: Boolean(row.reminder_sent),
    reminderSentAt: row.reminder_sent_at || undefined,
    idProofUrl: row.id_proof_url || undefined,
    idProofType: row.id_proof_type || undefined,
    agreementAccepted: row.agreement_accepted ?? true,
    depositRefunded: row.deposit_refunded !== undefined && row.deposit_refunded !== null ? Number(row.deposit_refunded) : undefined,
    depositDeduction: row.deposit_deduction !== undefined && row.deposit_deduction !== null ? Number(row.deposit_deduction) : undefined,
    inspectionNotes: row.inspection_notes || undefined,
    returnedAt: row.returned_at || undefined,
  };
}

function bookingToRow(b: Booking): any {
  return {
    id: b.id,
    costume_id: b.costumeId,
    costume_name: b.costumeName,
    costume_image: b.costumeImage,
    category: b.category,
    customer_name: b.customerName,
    customer_phone: b.customerPhone,
    customer_email: b.customerEmail || "",
    customer_address: b.customerAddress || "",
    delivery_type: b.deliveryType || "store-pickup",
    start_date: b.startDate,
    end_date: b.endDate,
    days: b.days,
    daily_rate: b.dailyRate,
    rental_total: b.rentalTotal,
    security_deposit: b.securityDeposit,
    total_amount: b.totalAmount,
    payment_method: b.paymentMethod,
    payment_status: b.paymentStatus,
    payment_id: b.paymentId,
    status: b.status,
    notes: b.notes || "",
    reminder_sent: b.reminderSent || false,
    reminder_sent_at: b.reminderSentAt || null,
    id_proof_url: b.idProofUrl || null,
    id_proof_type: b.idProofType || null,
    agreement_accepted: b.agreementAccepted ?? true,
    deposit_refunded: b.depositRefunded || 0,
    deposit_deduction: b.depositDeduction || 0,
    inspection_notes: b.inspectionNotes || "",
    returned_at: b.returnedAt || null,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOKINGS API (WITH SUPABASE + LOCAL HYBRID SYNC)
───────────────────────────────────────────────────────────────────────────── */

export async function getBookings(): Promise<Booking[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        if (data.length === 0) {
          const local = readLocalBookings();
          if (local.length > 0) {
            for (const b of local) {
              await supabase.from("bookings").upsert(bookingToRow(b));
            }
            memoryBookings = local;
            return local;
          }
        }
        const mapped = data.map(rowToBooking);
        memoryBookings = mapped;
        safeWriteJson(BOOKINGS_FILE, mapped);
        if (!IS_SERVERLESS) safeWriteJson(BUNDLED_BOOKINGS_FILE, mapped);
        return mapped;
      } else if (error) {
        console.warn("Supabase bookings fetch error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase connect error:", err);
    }
  }

  // Fallback to local disk file
  const local = readLocalBookings();
  memoryBookings = local;
  return local;
}

export function getBookingsSync(): Booking[] {
  return readLocalBookings();
}

export async function saveBooking(booking: Booking): Promise<Booking> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const row = bookingToRow(booking);
      const { error } = await supabase.from("bookings").upsert(row);
      if (error) console.warn("Supabase bookings upsert warning:", error.message);
    } catch (err) {
      console.warn("Supabase upsert error:", err);
    }
  }

  // Always update local disk and memory cache
  const bookings = readLocalBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    bookings[idx] = booking;
  } else {
    bookings.unshift(booking);
  }
  memoryBookings = bookings;
  safeWriteJson(BOOKINGS_FILE, bookings);
  if (!IS_SERVERLESS) safeWriteJson(BUNDLED_BOOKINGS_FILE, bookings);

  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  paymentStatus?: Booking["paymentStatus"]
): Promise<Booking | null> {
  const bookings = await getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;

  booking.status = status;
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }

  return await saveBooking(booking);
}

// Record return with inspection notes & deposit refund
export async function recordBookingReturn(
  id: string,
  options: {
    depositRefunded: number;
    depositDeduction: number;
    inspectionNotes: string;
    paymentStatus?: Booking["paymentStatus"];
  }
): Promise<Booking | null> {
  const bookings = await getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;

  booking.status = "returned";
  booking.depositRefunded = options.depositRefunded;
  booking.depositDeduction = options.depositDeduction;
  booking.inspectionNotes = options.inspectionNotes;
  booking.returnedAt = new Date().toISOString();
  if (options.paymentStatus) {
    booking.paymentStatus = options.paymentStatus;
  }

  return await saveBooking(booking);
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATE AVAILABILITY & DOUBLE-BOOKING PREVENTION ENGINE
───────────────────────────────────────────────────────────────────────────── */

export async function checkDateAvailability(
  costumeId: string,
  startDate: string,
  endDate: string,
  excludeBookingId?: string
): Promise<{ isAvailable: boolean; conflict?: Booking }> {
  const bookings = await getBookings();
  const reqStart = new Date(startDate).getTime();
  const reqEnd = new Date(endDate).getTime();

  for (const b of bookings) {
    if (b.costumeId !== costumeId) continue;
    if (b.status === "cancelled" || b.status === "returned") continue;
    if (excludeBookingId && b.id === excludeBookingId) continue;

    const bStart = new Date(b.startDate).getTime();
    const bEnd = new Date(b.endDate).getTime();

    // Standard interval overlap check: (StartA <= EndB) && (EndA >= StartB)
    if (reqStart <= bEnd && reqEnd >= bStart) {
      return { isAvailable: false, conflict: b };
    }
  }

  return { isAvailable: true };
}

export async function getCostumeReservedDateRanges(costumeId: string): Promise<
  { startDate: string; endDate: string; bookingId: string; status: string }[]
> {
  const bookings = await getBookings();
  return bookings
    .filter(
      (b) =>
        b.costumeId === costumeId &&
        b.status !== "cancelled" &&
        b.status !== "returned"
    )
    .map((b) => ({
      startDate: b.startDate,
      endDate: b.endDate,
      bookingId: b.id,
      status: b.status,
    }));
}

/* ─────────────────────────────────────────────────────────────────────────────
   INVENTORY OVERRIDES (LIVE PRICES & AVAILABILITY)
───────────────────────────────────────────────────────────────────────────── */

export async function getInventoryOverrides(): Promise<Record<string, InventoryOverride>> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("inventory_overrides").select("*");
      if (!error && Array.isArray(data)) {
        const map: Record<string, InventoryOverride> = {};
        data.forEach((row: any) => {
          map[row.costume_id] = {
            id: row.costume_id,
            price: row.price !== null ? Number(row.price) : undefined,
            securityDeposit: row.security_deposit !== null ? Number(row.security_deposit) : undefined,
            isAvailable: row.is_available ?? true,
            isFeatured: row.is_featured ?? false,
            updatedAt: row.updated_at,
          };
        });
        memoryInventory = map;
        safeWriteJson(INVENTORY_FILE, map);
        return map;
      }
    } catch {}
  }

  try {
    if (fs.existsSync(INVENTORY_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(INVENTORY_FILE, "utf8"));
      if (parsed && typeof parsed === "object") {
        memoryInventory = parsed;
        return memoryInventory!;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(BUNDLED_INVENTORY_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(BUNDLED_INVENTORY_FILE, "utf8"));
      if (parsed && typeof parsed === "object") {
        memoryInventory = parsed;
        return memoryInventory!;
      }
    }
  } catch {}

  return memoryInventory || {};
}

export async function updateInventoryPrice(
  costumeId: string,
  price: number,
  securityDeposit?: number,
  isAvailable?: boolean,
  isFeatured?: boolean
): Promise<InventoryOverride> {
  const overrides = await getInventoryOverrides();
  const updatedItem: InventoryOverride = {
    id: costumeId,
    price,
    securityDeposit: securityDeposit !== undefined ? securityDeposit : overrides[costumeId]?.securityDeposit,
    isAvailable: isAvailable !== undefined ? isAvailable : overrides[costumeId]?.isAvailable,
    isFeatured: isFeatured !== undefined ? isFeatured : overrides[costumeId]?.isFeatured,
    updatedAt: new Date().toISOString(),
  };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("inventory_overrides").upsert({
        costume_id: costumeId,
        price,
        security_deposit: updatedItem.securityDeposit,
        is_available: updatedItem.isAvailable,
        is_featured: updatedItem.isFeatured,
        updated_at: updatedItem.updatedAt,
      });
    } catch {}
  }

  overrides[costumeId] = updatedItem;
  memoryInventory = overrides;
  safeWriteJson(INVENTORY_FILE, overrides);
  if (!IS_SERVERLESS) safeWriteJson(BUNDLED_INVENTORY_FILE, overrides);

  return updatedItem;
}

export async function getLiveProducts(): Promise<
  (Product & { isAvailable?: boolean; liveDeposit?: number })[]
> {
  const overrides = await getInventoryOverrides();
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

export async function getSmsLogs(): Promise<SmsLog[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("sms_logs")
        .select("*")
        .order("timestamp", { ascending: false });

      if (!error && Array.isArray(data)) {
        const mapped: SmsLog[] = data.map((r: any) => ({
          id: r.id,
          bookingId: r.booking_id,
          customerName: r.customer_name,
          phone: r.phone,
          type: r.type,
          message: r.message,
          status: r.status,
          gateway: r.gateway,
          timestamp: r.timestamp ? new Date(r.timestamp).toISOString().replace("T", " ").substring(0, 19) : "",
        }));
        memorySmsLogs = mapped;
        safeWriteJson(SMS_LOGS_FILE, mapped);
        return mapped;
      }
    } catch {}
  }

  try {
    if (fs.existsSync(SMS_LOGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SMS_LOGS_FILE, "utf8"));
      if (Array.isArray(parsed)) {
        memorySmsLogs = parsed;
        return memorySmsLogs!;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(BUNDLED_SMS_LOGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(BUNDLED_SMS_LOGS_FILE, "utf8"));
      if (Array.isArray(parsed)) {
        memorySmsLogs = parsed;
        return memorySmsLogs!;
      }
    }
  } catch {}

  return memorySmsLogs || [];
}

export function getSmsLogsSync(): SmsLog[] {
  try {
    if (fs.existsSync(SMS_LOGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SMS_LOGS_FILE, "utf8"));
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return memorySmsLogs || [];
}

export function logSms(log: Omit<SmsLog, "id" | "timestamp">): SmsLog {
  const logs = getSmsLogsSync();
  const newLog: SmsLog = {
    ...log,
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };

  const supabase = getSupabase();
  if (supabase) {
    Promise.resolve(
      supabase.from("sms_logs").insert({
        id: newLog.id,
        booking_id: newLog.bookingId,
        customer_name: newLog.customerName,
        phone: newLog.phone,
        type: newLog.type,
        message: newLog.message,
        status: newLog.status,
        gateway: newLog.gateway,
        timestamp: new Date().toISOString(),
      })
    ).catch(() => {});
  }

  logs.unshift(newLog);
  memorySmsLogs = logs;
  safeWriteJson(SMS_LOGS_FILE, logs);
  if (!IS_SERVERLESS) safeWriteJson(BUNDLED_SMS_LOGS_FILE, logs);

  return newLog;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN SETTINGS
───────────────────────────────────────────────────────────────────────────── */

export function getSettings(): AdminSettings {
  if (memorySettings) return memorySettings;
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
      if (parsed && typeof parsed === "object") {
        const merged: AdminSettings = { ...defaultSettings, ...parsed };
        memorySettings = merged;
        return merged;
      }
    }
  } catch {}

  try {
    if (fs.existsSync(BUNDLED_SETTINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(BUNDLED_SETTINGS_FILE, "utf8"));
      if (parsed && typeof parsed === "object") {
        const merged: AdminSettings = { ...defaultSettings, ...parsed };
        memorySettings = merged;
        return merged;
      }
    }
  } catch {}

  return defaultSettings;
}

export async function updateSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const current = await getSettings();
  const updated = { ...current, ...settings };

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("admin_settings").upsert({
        id: "default",
        store_name: updated.storeName,
        store_phone: updated.storePhone,
        store_address: updated.storeAddress,
        default_security_deposit: updated.defaultSecurityDeposit,
        razorpay_key_id: updated.razorpayKeyId,
        razorpay_key_secret: updated.razorpayKeySecret,
        razorpay_test_mode: updated.razorpayTestMode,
        upi_id: updated.upiId,
        sms_gateway: updated.smsGateway,
        fast2sms_api_key: updated.fast2SmsApiKey,
        twilio_sid: updated.twilioSid,
        twilio_auth_token: updated.twilioAuthToken,
        twilio_from_phone: updated.twilioFromPhone,
        auto_reminders_enabled: updated.autoRemindersEnabled,
        reminder_hours_before: updated.reminderHoursBefore,
        updated_at: new Date().toISOString(),
      });
    } catch {}
  }

  memorySettings = updated;
  safeWriteJson(SETTINGS_FILE, updated);
  if (!IS_SERVERLESS) safeWriteJson(BUNDLED_SETTINGS_FILE, updated);

  return updated;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANALYTICS & SUMMARY
───────────────────────────────────────────────────────────────────────────── */

export async function getAnalytics() {
  const bookings = await getBookings();
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.paymentStatus === "paid" || b.status === "returned" ? sum + b.rentalTotal : sum),
    0
  );
  const activeRentals = bookings.filter((b) => b.status === "picked-up").length;
  const overdueReturns = bookings.filter((b) => b.status === "overdue").length;
  const totalDepositsHeld = bookings
    .filter((b) => b.status === "picked-up" || b.status === "overdue" || b.status === "confirmed")
    .reduce((sum, b) => sum + b.securityDeposit, 0);

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
    isSupabase: isSupabaseConfigured(),
  };
}
