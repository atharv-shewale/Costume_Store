import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/db";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, costumeName, customerName, customerPhone } = body;

    const settings = await getSettings();
    const amountInPaise = Math.round(Number(amount) * 100);

    // If real keys are provided and not test placeholders
    if (
      settings.razorpayKeyId &&
      settings.razorpayKeySecret &&
      !settings.razorpayKeyId.includes("test_MotiAtyaCostumes")
    ) {
      try {
        const instance = new Razorpay({
          key_id: settings.razorpayKeyId,
          key_secret: settings.razorpayKeySecret,
        });

        const order = await instance.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
          notes: {
            costumeName,
            customerName,
            customerPhone,
          },
        });

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: settings.razorpayKeyId,
          upiId: settings.upiId,
          testMode: settings.razorpayTestMode,
        });
      } catch (err: any) {
        console.warn("Live Razorpay call failed, using mock order:", err.message);
      }
    }

    // Default / Mock test mode for seamless testing
    const mockOrderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: settings.razorpayKeyId,
      upiId: settings.upiId,
      testMode: true,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
