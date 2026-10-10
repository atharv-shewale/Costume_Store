import { NextRequest, NextResponse } from "next/server";
import { revokeDeviceToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cookieToken = req.cookies.get("admin_device_token")?.value;
    const bodyToken = body?.deviceToken;
    const token = bodyToken || cookieToken;

    if (token) {
      revokeDeviceToken(token);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.delete("admin_device_token");
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
