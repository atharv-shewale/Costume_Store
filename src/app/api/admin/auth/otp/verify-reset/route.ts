import { NextRequest, NextResponse } from "next/server";
import { verifyOtpAndResetPasscode } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { otp, newPasscode } = await req.json();

    if (!otp) {
      return NextResponse.json(
        { success: false, message: "OTP code is required." },
        { status: 400 }
      );
    }

    if (!newPasscode || newPasscode.trim().length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: "New passcode must be at least 4 characters.",
        },
        { status: 400 }
      );
    }

    const result = verifyOtpAndResetPasscode(otp, newPasscode);
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to reset passcode." },
      { status: 500 }
    );
  }
}
