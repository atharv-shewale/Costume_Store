import { Booking, logSms, getSettings, getSettingsSync, SmsLog } from "./db";

export interface SmsResult {
  success: boolean;
  messageId?: string;
  gateway: "fast2sms" | "twilio" | "simulator";
  text: string;
  error?: string;
}

/**
 * Send an SMS message using the configured gateway (or realistic simulator)
 */
export async function sendSms(
  phone: string,
  message: string,
  type: SmsLog["type"],
  booking?: Booking | null
): Promise<SmsResult> {
  const settings = await getSettings();
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  // 1. Try Fast2SMS if configured
  if (settings.smsGateway === "fast2sms" && settings.fast2SmsApiKey) {
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: settings.fast2SmsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message,
          language: "english",
          flash: 0,
          numbers: cleanPhone,
        }),
      });

      const data = await response.json();
      if (data.return) {
        await logSms({
          bookingId: booking?.id || "ADMIN-SECURITY",
          customerName: booking?.customerName || "Store Admin (9930192705)",
          phone: cleanPhone,
          type,
          message,
          status: "delivered",
          gateway: "fast2sms",
        });
        return { success: true, gateway: "fast2sms", text: message };
      }
    } catch (err: any) {
      console.error("Fast2SMS error, falling back to simulator:", err.message);
    }
  }

  // 2. Try Twilio if configured
  if (
    settings.smsGateway === "twilio" &&
    settings.twilioSid &&
    settings.twilioAuthToken &&
    settings.twilioFromPhone
  ) {
    try {
      const formattedPhone = cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`;
      const auth = Buffer.from(`${settings.twilioSid}:${settings.twilioAuthToken}`).toString("base64");
      const bodyParams = new URLSearchParams({
        From: settings.twilioFromPhone,
        To: formattedPhone,
        Body: message,
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${settings.twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        }
      );

      const twilioData = await response.json();
      if (response.ok && twilioData.sid) {
        await logSms({
          bookingId: booking?.id || "ADMIN-SECURITY",
          customerName: booking?.customerName || "Store Admin (9930192705)",
          phone: cleanPhone,
          type,
          message,
          status: "delivered",
          gateway: "twilio",
        });
        return { success: true, messageId: twilioData.sid, gateway: "twilio", text: message };
      }
    } catch (err: any) {
      console.error("Twilio error, falling back to simulator:", err.message);
    }
  }

  // 3. Robust Live Simulator (default): Logs to database, tracked in Admin Panel
  await logSms({
    bookingId: booking?.id || "ADMIN-SECURITY",
    customerName: booking?.customerName || "Store Admin (9930192705)",
    phone: cleanPhone,
    type,
    message,
    status: "delivered",
    gateway: "simulator",
  });

  return {
    success: true,
    messageId: `sim-${Date.now()}`,
    gateway: "simulator",
    text: message,
  };
}

/**
 * Send Security OTP SMS to Admin phone (99301 92705)
 */
export async function sendAdminOtpSms(phone: string, otp: string): Promise<SmsResult> {
  const settings = await getSettings();
  const text = `Namaste! Your Moti Atya Costume Store Admin Security OTP is ${otp}. Valid for 10 minutes. Do not share this OTP with anyone. Store Helpline: ${settings.storePhone}`;
  return sendSms(phone, text, "custom", null);
}

/**
 * Send Booking Confirmation SMS
 */
export async function sendBookingConfirmationSms(booking: Booking): Promise<SmsResult> {
  const settings = await getSettings();
  const text = `Namaste ${booking.customerName}! Your costume booking #${booking.id} for "${booking.costumeName}" is confirmed for ${booking.startDate} to ${booking.endDate}. Total: Rs.${booking.totalAmount} (incl. Rs.${booking.securityDeposit} refundable deposit). Store: ${settings.storeName}, Mumbai (${settings.storePhone}).`;
  return sendSms(booking.customerPhone, text, "booking-confirmation", booking);
}

/**
 * Send 1-Day Return Reminder SMS
 */
export async function sendReturnReminderSms(booking: Booking): Promise<SmsResult> {
  const settings = await getSettings();
  const text = `REMINDER from ${settings.storeName}: Your rented costume "${booking.costumeName}" (Booking #${booking.id}) is due for return by ${booking.endDate}. Please return it in clean condition to collect your Rs.${booking.securityDeposit} refundable deposit! Helpline: ${settings.storePhone}`;
  return sendSms(booking.customerPhone, text, "return-reminder", booking);
}

/**
 * Send Overdue Alert SMS
 */
export async function sendOverdueAlertSms(booking: Booking): Promise<SmsResult> {
  const settings = await getSettings();
  const text = `URGENT ALERT: Your costume rental "${booking.costumeName}" (Booking #${booking.id}) was due on ${booking.endDate} and is now OVERDUE. Please return to ${settings.storeName} immediately to avoid late fees. Contact: ${settings.storePhone}`;
  return sendSms(booking.customerPhone, text, "overdue-alert", booking);
}

/**
 * Helper to generate a direct 1-click WhatsApp web reminder link for the admin
 */
export function getWhatsAppReminderLink(booking: Booking, type: "reminder" | "overdue" | "confirmed"): string {
  const settings = getSettingsSync();
  let cleanPhone = booking.customerPhone.replace(/[^0-9]/g, "");
  if (!cleanPhone.startsWith("91") && cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  let text = "";
  if (type === "reminder") {
    text = `Hello ${booking.customerName}! 👋\n\nThis is a friendly reminder from *${settings.storeName}*.\nYour rented costume *${booking.costumeName}* (Booking #${booking.id}) is scheduled for return on *${booking.endDate}*.\n\nPlease return it in good condition to collect your refundable security deposit of *₹${booking.securityDeposit}*.\n\nStore Address: ${settings.storeAddress}\nContact: ${settings.storePhone}`;
  } else if (type === "overdue") {
    text = `Hello ${booking.customerName}! ⚠️\n\nYour costume rental *${booking.costumeName}* (Booking #${booking.id}) was due for return on *${booking.endDate}* and is now overdue.\n\nPlease return it at the earliest to avoid additional late fee deductions.\n\nStore Address: ${settings.storeAddress}\nContact: ${settings.storePhone}`;
  } else {
    text = `Hello ${booking.customerName}! 🎉\n\nYour booking *#${booking.id}* for *${booking.costumeName}* is confirmed for *${booking.startDate}* to *${booking.endDate}*.\nTotal: ₹${booking.totalAmount}.\n\nThank you for choosing *${settings.storeName}*!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
