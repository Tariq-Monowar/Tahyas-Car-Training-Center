import { NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otpStore";
import { setAdminSession } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, otp } = await req.json() as { email?: string; otp?: string };

  if (!email || !otp) {
    return NextResponse.json({ error: "ইমেইল এবং OTP দিন।" }, { status: 400 });
  }

  const result = verifyOTP(email, otp.trim());

  if (result === "expired") {
    return NextResponse.json({ error: "OTP মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।" }, { status: 410 });
  }
  if (result === "maxAttempts") {
    return NextResponse.json({ error: "অনেকবার ভুল OTP দেওয়া হয়েছে। নতুন OTP নিন।" }, { status: 429 });
  }
  if (result === "invalid") {
    return NextResponse.json({ error: "OTP ভুল হয়েছে। আবার চেক করুন।" }, { status: 401 });
  }

  // OTP matched — issue JWT and log in
  return setAdminSession(NextResponse.json({ success: true }));
}
