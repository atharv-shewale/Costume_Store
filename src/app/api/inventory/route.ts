import { NextRequest, NextResponse } from "next/server";
import { getLiveProducts, updateInventoryPrice } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const products = getLiveProducts();
    return NextResponse.json(
      { success: true, products },
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
    const { costumeId, price, securityDeposit, isAvailable, isFeatured } = body;

    if (!costumeId) {
      return NextResponse.json({ success: false, error: "costumeId is required" }, { status: 400 });
    }

    const updated = updateInventoryPrice(
      costumeId,
      Number(price),
      securityDeposit !== undefined ? Number(securityDeposit) : undefined,
      isAvailable,
      isFeatured
    );

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
