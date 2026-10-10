import { NextRequest, NextResponse } from "next/server";
import {
  getBookings,
  saveBooking,
  updateBookingStatus,
  recordBookingReturn,
  checkDateAvailability,
  Booking,
} from "@/lib/db";
import { sendBookingConfirmationSms } from "@/lib/sms";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.toLowerCase();

    let bookings = await getBookings();

    if (status && status !== "all") {
      bookings = bookings.filter((b) => b.status === status);
    }

    if (query) {
      bookings = bookings.filter(
        (b) =>
          b.id.toLowerCase().includes(query) ||
          b.customerName.toLowerCase().includes(query) ||
          b.customerPhone.includes(query) ||
          b.costumeName.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(
      { success: true, bookings },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
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

    // 1. Strict Date Availability Check (Double-Booking Prevention)
    if (body.costumeId && body.startDate && body.endDate) {
      const { isAvailable, conflict } = await checkDateAvailability(
        body.costumeId,
        body.startDate,
        body.endDate
      );

      if (!isAvailable && conflict) {
        return NextResponse.json(
          {
            success: false,
            error: `Costume is already booked from ${conflict.startDate} to ${conflict.endDate} (Booking #${conflict.id}). Please pick different dates.`,
            conflictBookingId: conflict.id,
          },
          { status: 409 }
        );
      }
    }

    // Generate Booking ID: BK-XXXX
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      costumeId: body.costumeId,
      costumeName: body.costumeName,
      costumeImage: body.costumeImage,
      category: body.category || "general",
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || "",
      customerAddress: body.customerAddress || "",
      deliveryType: body.deliveryType || "store-pickup",
      startDate: body.startDate,
      endDate: body.endDate,
      days: body.days || 1,
      dailyRate: body.dailyRate,
      rentalTotal: body.rentalTotal,
      securityDeposit: body.securityDeposit || 500,
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod || "razorpay",
      paymentStatus: body.paymentStatus || "paid",
      paymentId: body.paymentId || `pay_${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString().split("T")[0],
      notes: body.notes || "",
      reminderSent: false,
      idProofUrl: body.idProofUrl || undefined,
      idProofType: body.idProofType || undefined,
      agreementAccepted: body.agreementAccepted ?? true,
    };

    const saved = await saveBooking(newBooking);

    // Automatically trigger confirmation SMS
    try {
      await sendBookingConfirmationSms(saved);
    } catch (smsErr) {
      console.error("SMS notification non-fatal error:", smsErr);
    }

    return NextResponse.json({ success: true, booking: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, paymentStatus, action, depositRefunded, depositDeduction, inspectionNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing booking id" }, { status: 400 });
    }

    // Specialized Inspection & Return Handler
    if (action === "return" || depositRefunded !== undefined) {
      const updated = await recordBookingReturn(id, {
        depositRefunded: Number(depositRefunded) || 0,
        depositDeduction: Number(depositDeduction) || 0,
        inspectionNotes: inspectionNotes || "Returned in good condition",
        paymentStatus: paymentStatus || "refunded",
      });

      if (!updated) {
        return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, booking: updated });
    }

    // Standard status update
    if (!status) {
      return NextResponse.json({ success: false, error: "Missing status" }, { status: 400 });
    }

    const updated = await updateBookingStatus(id, status, paymentStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
