import { NextRequest, NextResponse } from "next/server";
import { sendOtpToAdmin, ADMIN_PHONE_NUMBER } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const result = await sendOtpToAdmin();
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json({
      success: true,
      message: result.message,
      phone: result.phone,
      otpPreview: isProd ? undefined : result.otpPreview,
      expiresInSeconds: result.expiresInSeconds,
    });
  } catch (error: any) {
    console.error("OTP send error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send OTP.", stack: error.stack },
      { status: 500 }
    );
  }
}
