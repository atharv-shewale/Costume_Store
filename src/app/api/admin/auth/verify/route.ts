import { NextRequest, NextResponse } from "next/server";
import { verifyDeviceToken, ADMIN_PHONE_NUMBER } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("admin_device_token")?.value;
    const bodyToken = body?.deviceToken;

    const token = bodyToken || cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (token && verifyDeviceToken(token)) {
      return NextResponse.json({
        authenticated: true,
        method: "remembered_device",
        adminPhone: ADMIN_PHONE_NUMBER,
      });
    }

    return NextResponse.json({
      authenticated: false,
      adminPhone: ADMIN_PHONE_NUMBER,
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
