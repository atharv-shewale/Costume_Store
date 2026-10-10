import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPasscode, registerRememberedDevice } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { passcode, rememberDevice, deviceName } = await req.json();

    if (!passcode) {
      return NextResponse.json(
        { success: false, message: "Security passcode is required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPasscode(passcode);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect security passcode. Please check and try again.",
        },
        { status: 401 }
      );
    }

    // Always issue a token; if rememberDevice is true, mark it with long expiration
    const token = registerRememberedDevice(
      deviceName || (rememberDevice ? "Remembered Admin Device" : "Admin Session")
    );

    const response = NextResponse.json({
      success: true,
      message: "Security passcode verified. Welcome to Admin Panel!",
      token,
      remembered: !!rememberDevice,
    });

    // Set cookie
    const maxAge = rememberDevice ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
    response.cookies.set("admin_device_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Authentication error." },
      { status: 500 }
    );
  }
}
