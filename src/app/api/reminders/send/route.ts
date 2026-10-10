import { NextRequest, NextResponse } from "next/server";
import { getBookings, saveBooking, getSmsLogs } from "@/lib/db";
import { sendReturnReminderSms, sendOverdueAlertSms, sendBookingConfirmationSms } from "@/lib/sms";

export async function GET(req: NextRequest) {
  try {
    const logs = getSmsLogs();
    const bookings = getBookings();

    // Check which bookings are due today or overdue
    const todayStr = new Date().toISOString().split("T")[0];
    const dueToday = bookings.filter((b) => b.endDate === todayStr && b.status === "picked-up");
    const overdue = bookings.filter((b) => b.endDate < todayStr && (b.status === "picked-up" || b.status === "overdue"));

    return NextResponse.json(
      {
        success: true,
        logs,
        dueToday,
        overdue,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, type } = body; // type: "return-reminder" | "overdue-alert" | "booking-confirmation"

    const bookings = getBookings();
    const booking = bookings.find((b) => b.id === bookingId);

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    let result;
    if (type === "overdue-alert") {
      result = await sendOverdueAlertSms(booking);
    } else if (type === "booking-confirmation") {
      result = await sendBookingConfirmationSms(booking);
    } else {
      result = await sendReturnReminderSms(booking);
      booking.reminderSent = true;
      booking.reminderSentAt = new Date().toISOString().replace("T", " ").substring(0, 16);
      saveBooking(booking);
    }

    return NextResponse.json({
      success: true,
      result,
      booking,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
