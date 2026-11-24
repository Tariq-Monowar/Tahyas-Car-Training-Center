import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tahiyas-car-training-center.vercel.app";
const FROM = `"তাহয়াস কার ট্রেনিং সেন্টার" <${process.env.NODE_MAILER_USER}>`;

export async function sendEnrollmentEmails(data: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  age?: string;
  message?: string;
  createdAt: Date;
}) {
  const confirmUrl = `${BASE}/enroll/confirm/${data.id}`;
  const dateStr = data.createdAt.toLocaleDateString("bn-BD", { dateStyle: "long" });

  const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:#0b1324;padding:24px;text-align:center">
    <h2 style="color:#fbbf24;margin:0;font-size:20px">তাহয়াস কার ট্রেনিং সেন্টার</h2>
    <p style="color:#9ca3af;margin:6px 0 0;font-size:13px">নতুন ভর্তির আবেদন</p>
  </div>
  <div style="padding:24px;background:#fff">
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280;width:40%">নাম</td><td style="padding:10px 0;font-weight:600">${data.name}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280">ফোন</td><td style="padding:10px 0;font-weight:600">${data.phone}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280">ইমেইল</td><td style="padding:10px 0">${data.email ?? "দেওয়া হয়নি"}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280">কোর্স</td><td style="padding:10px 0;font-weight:600">${data.course}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280">বয়স</td><td style="padding:10px 0">${data.age ?? "উল্লেখ নেই"}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280">তারিখ</td><td style="padding:10px 0">${dateStr}</td></tr>
      <tr><td style="padding:10px 0;color:#6b7280">মন্তব্য</td><td style="padding:10px 0">${data.message || "—"}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center">
      <a href="${BASE}/admin" style="display:inline-block;background:#0b1324;color:#fbbf24;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Admin Panel দেখুন</a>
    </div>
  </div>
</div>`;

  const studentHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
  <div style="background:#0b1324;padding:24px;text-align:center">
    <h2 style="color:#fbbf24;margin:0;font-size:20px">তাহয়াস কার ট্রেনিং সেন্টার</h2>
    <p style="color:#9ca3af;margin:6px 0 0;font-size:13px">ভর্তির আবেদন নিশ্চিত হয়েছে ✅</p>
  </div>
  <div style="padding:24px;background:#fff">
    <p style="font-size:16px">প্রিয় <strong>${data.name}</strong>,</p>
    <p style="color:#374151;line-height:1.7">তাহয়াস কার ট্রেনিং সেন্টারে আপনার ভর্তির আবেদন সফলভাবে পাওয়া গেছে। আমরা শীঘ্রই আপনার সাথে <strong>${data.phone}</strong> নম্বরে যোগাযোগ করব।</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px;margin:16px 0">
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280;width:40%">আবেদন নং</td><td style="padding:10px 0;font-family:monospace;font-size:13px">${data.id}</td></tr>
      <tr style="border-bottom:1px solid #f3f4f6"><td style="padding:10px 0;color:#6b7280">কোর্স</td><td style="padding:10px 0;font-weight:600">${data.course}</td></tr>
      <tr><td style="padding:10px 0;color:#6b7280">তারিখ</td><td style="padding:10px 0">${dateStr}</td></tr>
    </table>
    <div style="margin-top:20px;text-align:center">
      <a href="${confirmUrl}" style="display:inline-block;background:#0b1324;color:#fbbf24;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">প্রমাণপত্র দেখুন ও ডাউনলোড করুন</a>
    </div>
    <p style="font-size:13px;color:#9ca3af;margin-top:20px;text-align:center">WhatsApp: 01320381356 | দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর</p>
  </div>
</div>`;

  await Promise.all([
    transporter.sendMail({
      from: FROM,
      to: process.env.NODE_MAILER_USER,
      subject: `নতুন ভর্তির আবেদন — ${data.name} (${data.course})`,
      html: adminHtml,
    }),
    ...(data.email
      ? [transporter.sendMail({ from: FROM, to: data.email, subject: `আবেদন নিশ্চিত — ${data.name} | তাহয়াস কার ট্রেনিং সেন্টার`, html: studentHtml })]
      : []),
  ]);
}
