import { NextRequest, NextResponse } from "next/server";
import { getCostumeReservedDateRanges, checkDateAvailability } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const costumeId = searchParams.get("costumeId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!costumeId) {
      return NextResponse.json({ success: false, error: "costumeId is required" }, { status: 400 });
    }

    // Specific range check
    if (startDate && endDate) {
      const { isAvailable, conflict } = await checkDateAvailability(costumeId, startDate, endDate);
      return NextResponse.json({
        success: true,
        costumeId,
        startDate,
        endDate,
        isAvailable,
        conflict: conflict ? { id: conflict.id, startDate: conflict.startDate, endDate: conflict.endDate } : null,
      });
    }

    // General reserved ranges for this costume
    const reservedRanges = await getCostumeReservedDateRanges(costumeId);
    return NextResponse.json(
      {
        success: true,
        costumeId,
        reservedRanges,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
