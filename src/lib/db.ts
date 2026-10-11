import { products, Product } from "@/data/products";
import { getSupabase } from "@/lib/supabase";

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

// In-memory cache to speed up repeat reads within serverless lifecycle
let cachedSettings: AdminSettings | null = null;
let cachedInventory: Record<string, InventoryOverride> | null = null;

// Default store fallback values
export const defaultSettings: AdminSettings = {
  storeName: "Costume Store Fancy dress Rental Shop",
  storePhone: "+91 99301 92705",
  storeAddress:
    "SHOP A1, Ostwal Kiran Apartment, Mira Bhayandar Rd, opp. BHARAT/Old petrol Pump, Mira Road East, Mumbai, Maharashtra 401105",
  defaultSecurityDeposit: 500,
  razorpayKeyId:
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_MotiAtyaCostumes",
  razorpayKeySecret:
    process.env.RAZORPAY_KEY_SECRET ||
    "mock_secret_key_12345",
  razorpayTestMode: true,
  upiId: process.env.STORE_UPI_ID || "9930192705@okbizaxis",
  smsGateway: (process.env.SMS_GATEWAY as AdminSettings["smsGateway"]) || "simulator",
  fast2SmsApiKey: process.env.FAST2SMS_API_KEY || "",
  twilioSid: process.env.TWILIO_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioFromPhone: process.env.TWILIO_FROM_PHONE || "",
  autoRemindersEnabled: true,
  reminderHoursBefore: 24,
};

function getRequiredSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      "Supabase database connection is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return supabase;
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
    depositRefunded:
      row.deposit_refunded !== undefined && row.deposit_refunded !== null
        ? Number(row.deposit_refunded)
        : undefined,
    depositDeduction:
      row.deposit_deduction !== undefined && row.deposit_deduction !== null
        ? Number(row.deposit_deduction)
        : undefined,
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

function rowToSettings(row: any): AdminSettings {
  return {
    storeName: row.store_name || defaultSettings.storeName,
    storePhone: row.store_phone || defaultSettings.storePhone,
    storeAddress: row.store_address || defaultSettings.storeAddress,
    defaultSecurityDeposit:
      row.default_security_deposit !== null && row.default_security_deposit !== undefined
        ? Number(row.default_security_deposit)
        : defaultSettings.defaultSecurityDeposit,
    razorpayKeyId: row.razorpay_key_id || defaultSettings.razorpayKeyId,
    razorpayKeySecret: row.razorpay_key_secret || defaultSettings.razorpayKeySecret,
    razorpayTestMode:
      row.razorpay_test_mode !== null && row.razorpay_test_mode !== undefined
        ? Boolean(row.razorpay_test_mode)
        : defaultSettings.razorpayTestMode,
    upiId: row.upi_id || defaultSettings.upiId,
    smsGateway: row.sms_gateway || defaultSettings.smsGateway,
    fast2SmsApiKey: row.fast2sms_api_key || defaultSettings.fast2SmsApiKey,
    twilioSid: row.twilio_sid || defaultSettings.twilioSid,
    twilioAuthToken: row.twilio_auth_token || defaultSettings.twilioAuthToken,
    twilioFromPhone: row.twilio_from_phone || defaultSettings.twilioFromPhone,
    autoRemindersEnabled:
      row.auto_reminders_enabled !== null && row.auto_reminders_enabled !== undefined
        ? Boolean(row.auto_reminders_enabled)
        : defaultSettings.autoRemindersEnabled,
    reminderHoursBefore:
      row.reminder_hours_before !== null && row.reminder_hours_before !== undefined
        ? Number(row.reminder_hours_before)
        : defaultSettings.reminderHoursBefore,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOKINGS API (REAL SUPABASE DATABASE)
───────────────────────────────────────────────────────────────────────────── */

export async function getBookings(): Promise<Booking[]> {
  const supabase = getRequiredSupabase();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase bookings fetch error:", error.message);
    throw new Error(`Failed to fetch bookings from Supabase: ${error.message}`);
  }

  return (data || []).map(rowToBooking);
}

export async function saveBooking(booking: Booking): Promise<Booking> {
  const supabase = getRequiredSupabase();
  const row = bookingToRow(booking);
  const { error } = await supabase.from("bookings").upsert(row);

  if (error) {
    console.error("Supabase booking upsert error:", error.message);
    throw new Error(`Failed to save booking to Supabase: ${error.message}`);
  }

  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"],
  paymentStatus?: Booking["paymentStatus"]
): Promise<Booking | null> {
  const supabase = getRequiredSupabase();
  const patch: Record<string, any> = { status };
  if (paymentStatus) {
    patch.payment_status = paymentStatus;
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase updateBookingStatus error:", error.message);
    throw new Error(`Failed to update booking status in Supabase: ${error.message}`);
  }

  return data ? rowToBooking(data) : null;
}

export async function recordBookingReturn(
  id: string,
  options: {
    depositRefunded: number;
    depositDeduction: number;
    inspectionNotes: string;
    paymentStatus?: Booking["paymentStatus"];
  }
): Promise<Booking | null> {
  const supabase = getRequiredSupabase();
  const patch: Record<string, any> = {
    status: "returned",
    deposit_refunded: options.depositRefunded,
    deposit_deduction: options.depositDeduction,
    inspection_notes: options.inspectionNotes,
    returned_at: new Date().toISOString(),
  };
  if (options.paymentStatus) {
    patch.payment_status = options.paymentStatus;
  }

  const { data, error } = await supabase
    .from("bookings")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase recordBookingReturn error:", error.message);
    throw new Error(`Failed to record booking return in Supabase: ${error.message}`);
  }

  return data ? rowToBooking(data) : null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATE AVAILABILITY & DOUBLE-BOOKING PREVENTION
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
   INVENTORY OVERRIDES (REAL SUPABASE DATABASE)
───────────────────────────────────────────────────────────────────────────── */

export async function getInventoryOverrides(): Promise<Record<string, InventoryOverride>> {
  const supabase = getRequiredSupabase();
  const { data, error } = await supabase.from("inventory_overrides").select("*");

  if (error) {
    console.error("Supabase inventory_overrides fetch error:", error.message);
    throw new Error(`Failed to fetch inventory overrides from Supabase: ${error.message}`);
  }

  const map: Record<string, InventoryOverride> = {};
  (data || []).forEach((row: any) => {
    map[row.costume_id] = {
      id: row.costume_id,
      price: row.price !== null ? Number(row.price) : undefined,
      securityDeposit: row.security_deposit !== null ? Number(row.security_deposit) : undefined,
      isAvailable: row.is_available ?? true,
      isFeatured: row.is_featured ?? false,
      updatedAt: row.updated_at,
    };
  });

  cachedInventory = map;
  return map;
}

export async function updateInventoryPrice(
  costumeId: string,
  price: number,
  securityDeposit?: number,
  isAvailable?: boolean,
  isFeatured?: boolean
): Promise<InventoryOverride> {
  const supabase = getRequiredSupabase();
  const updatedItem: InventoryOverride = {
    id: costumeId,
    price,
    securityDeposit,
    isAvailable: isAvailable ?? true,
    isFeatured: isFeatured ?? false,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("inventory_overrides").upsert({
    costume_id: costumeId,
    price,
    security_deposit: updatedItem.securityDeposit,
    is_available: updatedItem.isAvailable,
    is_featured: updatedItem.isFeatured,
    updated_at: updatedItem.updatedAt,
  });

  if (error) {
    console.error("Supabase updateInventoryPrice error:", error.message);
    throw new Error(`Failed to update inventory price in Supabase: ${error.message}`);
  }

  if (!cachedInventory) cachedInventory = {};
  cachedInventory[costumeId] = updatedItem;
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
   SMS LOGS (REAL SUPABASE DATABASE)
───────────────────────────────────────────────────────────────────────────── */

export async function getSmsLogs(): Promise<SmsLog[]> {
  const supabase = getRequiredSupabase();
  const { data, error } = await supabase
    .from("sms_logs")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Supabase sms_logs fetch error:", error.message);
    throw new Error(`Failed to fetch SMS logs from Supabase: ${error.message}`);
  }

  return (data || []).map((r: any) => ({
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
}

export async function logSms(log: Omit<SmsLog, "id" | "timestamp">): Promise<SmsLog> {
  const supabase = getRequiredSupabase();
  const newLog: SmsLog = {
    ...log,
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };

  const { error } = await supabase.from("sms_logs").insert({
    id: newLog.id,
    booking_id: newLog.bookingId,
    customer_name: newLog.customerName,
    phone: newLog.phone,
    type: newLog.type,
    message: newLog.message,
    status: newLog.status,
    gateway: newLog.gateway,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.warn("Supabase logSms warning:", error.message);
  }

  return newLog;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ADMIN SETTINGS (REAL SUPABASE DATABASE)
───────────────────────────────────────────────────────────────────────────── */

export async function getSettings(): Promise<AdminSettings> {
  const supabase = getRequiredSupabase();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    console.error("Supabase getSettings error:", error.message);
    if (cachedSettings) return cachedSettings;
    return defaultSettings;
  }

  if (data) {
    const parsed = rowToSettings(data);
    cachedSettings = parsed;
    return parsed;
  }

  // Insert default settings row if none exists
  await supabase.from("admin_settings").insert({
    id: "default",
    store_name: defaultSettings.storeName,
    store_phone: defaultSettings.storePhone,
    store_address: defaultSettings.storeAddress,
    default_security_deposit: defaultSettings.defaultSecurityDeposit,
    razorpay_key_id: defaultSettings.razorpayKeyId,
    razorpay_key_secret: defaultSettings.razorpayKeySecret,
    razorpay_test_mode: defaultSettings.razorpayTestMode,
    upi_id: defaultSettings.upiId,
    sms_gateway: defaultSettings.smsGateway,
    fast2sms_api_key: defaultSettings.fast2SmsApiKey,
    twilio_sid: defaultSettings.twilioSid,
    twilio_auth_token: defaultSettings.twilioAuthToken,
    twilio_from_phone: defaultSettings.twilioFromPhone,
    auto_reminders_enabled: defaultSettings.autoRemindersEnabled,
    reminder_hours_before: defaultSettings.reminderHoursBefore,
    updated_at: new Date().toISOString(),
  });

  cachedSettings = defaultSettings;
  return defaultSettings;
}

export function getSettingsSync(): AdminSettings {
  return cachedSettings || defaultSettings;
}

export async function updateSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
  const supabase = getRequiredSupabase();
  const current = await getSettings();
  const updated: AdminSettings = { ...current, ...settings };

  const { error } = await supabase.from("admin_settings").upsert({
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

  if (error) {
    console.error("Supabase updateSettings error:", error.message);
    throw new Error(`Failed to update settings in Supabase: ${error.message}`);
  }

  cachedSettings = updated;
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
    isSupabase: true,
  };
}
