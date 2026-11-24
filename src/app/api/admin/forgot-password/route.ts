import { NextResponse } from "next/server";
import { saveOTP, hasOTP } from "@/lib/otpStore";
import nodemailer from "nodemailer";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json() as { email?: string };

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  if (!email || email.toLowerCase() !== adminEmail.toLowerCase()) {
    // Don't reveal whether email is correct — always return 200
    return NextResponse.json({ success: true });
  }

  if (hasOTP(email)) {
    return NextResponse.json({ error: "OTP ইতিমধ্যে পাঠানো হয়েছে। ১০ মিনিট অপেক্ষা করুন।" }, { status: 429 });
  }

  const otp = generateOTP();
  saveOTP(email, otp);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODE_MAILER_USER,
      pass: process.env.NODE_MAILER_PASSWORD,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="bn">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,sans-serif">
<div style="max-width:480px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#0b1324,#192848);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
    <div style="display:inline-block;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#d97706);font-size:1.6rem;line-height:52px;text-align:center;margin-bottom:12px">🚗</div>
    <h1 style="color:#fbbf24;margin:0;font-size:18px;font-weight:800">তাহয়াস কার ট্রেনিং সেন্টার</h1>
    <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">Admin Password Reset</p>
  </div>
  <div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none">
    <p style="color:#374151;margin:0 0 16px;font-size:15px">আপনার Admin পাসওয়ার্ড রিসেটের OTP কোড:</p>
    <div style="text-align:center;margin:24px 0">
      <div style="display:inline-block;background:#0b1324;color:#fbbf24;font-size:36px;font-weight:800;letter-spacing:0.2em;padding:16px 32px;border-radius:12px;font-family:monospace">${otp}</div>
    </div>
    <p style="color:#6b7280;font-size:13px;margin:0;text-align:center">এই OTP ১০ মিনিটের জন্য বৈধ। কাউকে জানাবেন না।</p>
  </div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">তাহয়াস কার ট্রেনিং সেন্টার · লক্ষ্মীপুর</p>
  </div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"তাহয়াস Admin" <${process.env.NODE_MAILER_USER}>`,
    to: adminEmail,
    subject: `🔐 Admin OTP: ${otp} — তাহয়াস কার ট্রেনিং সেন্টার`,
    html,
  });

  return NextResponse.json({ success: true });
}
