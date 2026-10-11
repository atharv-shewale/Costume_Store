import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || "").trim();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Please enter your Booking ID (e.g. BK-1234) or 10-digit Mobile Number." },
        { status: 400 }
      );
    }

    const cleanDigits = query.replace(/[^0-9]/g, "");
    const cleanId = query.toUpperCase();

    const allBookings = await getBookings();

    // Match either exact/partial booking ID or exact 10-digit phone number
    const matched = allBookings.filter((b) => {
      const matchId = b.id.toUpperCase() === cleanId || b.id.toUpperCase().includes(cleanId);
      const matchPhone =
        cleanDigits.length >= 10 && b.customerPhone.replace(/[^0-9]/g, "").includes(cleanDigits);
      return matchId || matchPhone;
    });

    if (matched.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `No bookings found for "${query}". Please check your Booking ID or registered phone number.`,
        },
        { status: 404 }
      );
    }

    // Return safe customer-facing booking information
    const safeBookings = matched.map((b) => ({
      id: b.id,
      costumeId: b.costumeId,
      costumeName: b.costumeName,
      costumeImage: b.costumeImage,
      category: b.category,
      customerName: b.customerName,
      customerPhone: b.customerPhone ? b.customerPhone.slice(0, 2) + "******" + b.customerPhone.slice(-2) : "",
      deliveryType: b.deliveryType,
      customerAddress: b.customerAddress,
      startDate: b.startDate,
      endDate: b.endDate,
      days: b.days,
      dailyRate: b.dailyRate,
      rentalTotal: b.rentalTotal,
      securityDeposit: b.securityDeposit,
      totalAmount: b.totalAmount,
      paymentMethod: b.paymentMethod,
      paymentStatus: b.paymentStatus,
      status: b.status,
      createdAt: b.createdAt,
      depositRefunded: b.depositRefunded,
      depositDeduction: b.depositDeduction,
      inspectionNotes: b.inspectionNotes,
      returnedAt: b.returnedAt,
    }));

    return NextResponse.json({
      success: true,
      bookings: safeBookings,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to search for booking." },
      { status: 500 }
    );
  }
}
