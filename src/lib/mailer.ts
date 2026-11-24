import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
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

  /* ── Admin email ── */
  const adminHtml = `<!DOCTYPE html>
<html lang="bn">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,'Noto Sans Bengali',sans-serif">
<div style="max-width:580px;margin:0 auto">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0b1324 0%,#192848 100%);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
    <div style="display:inline-block;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#d97706);font-size:1.6rem;line-height:52px;text-align:center;margin-bottom:12px">🚗</div>
    <h1 style="color:#fbbf24;margin:0;font-size:18px;font-weight:800;letter-spacing:0.05em">তাহয়াস কার ট্রেনিং সেন্টার</h1>
    <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">নতুন ভর্তির আবেদন এসেছে</p>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:28px 32px;border:1px solid #e2e8f0;border-top:none">

    <p style="margin:0 0 20px;font-size:15px;color:#374151">
      একটি নতুন ভর্তির আবেদন পাওয়া গেছে। নিচে বিবরণ দেওয়া হলো:
    </p>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:10px 0;color:#6b7280;font-weight:600;width:38%">নাম</td>
        <td style="padding:10px 0;font-weight:700;color:#111827">${data.name}</td>
      </tr>
      <tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">ফোন</td>
        <td style="padding:10px 0"><a href="tel:${data.phone}" style="color:#0b1324;font-weight:600">${data.phone}</a></td>
      </tr>
      ${data.email ? `
      <tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">ইমেইল</td>
        <td style="padding:10px 0"><a href="mailto:${data.email}" style="color:#2563eb">${data.email}</a></td>
      </tr>` : ""}
      <tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">কোর্স</td>
        <td style="padding:10px 0;font-weight:700;color:#0b1324">${data.course}</td>
      </tr>
      ${data.age ? `
      <tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">বয়স</td>
        <td style="padding:10px 0">${data.age} বছর</td>
      </tr>` : ""}
      <tr style="border-bottom:1px solid #f1f5f9">
        <td style="padding:10px 0;color:#6b7280;font-weight:600">তারিখ</td>
        <td style="padding:10px 0">${dateStr}</td>
      </tr>
      ${data.message ? `
      <tr>
        <td style="padding:10px 0;color:#6b7280;font-weight:600">মন্তব্য</td>
        <td style="padding:10px 0;color:#374151">${data.message}</td>
      </tr>` : ""}
    </table>

    <div style="margin-top:24px;text-align:center">
      <a href="${BASE}/admin" style="display:inline-block;background:#0b1324;color:#fbbf24;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">
        Admin Panel দেখুন →
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">তাহয়াস কার ট্রেনিং সেন্টার · দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর · WhatsApp: 01320381356</p>
  </div>

</div>
</body>
</html>`;

  /* ── Student email ── */
  const studentHtml = `<!DOCTYPE html>
<html lang="bn">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f1f5f9;font-family:Arial,'Noto Sans Bengali',sans-serif">
<div style="max-width:540px;margin:0 auto">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0b1324 0%,#192848 100%);border-radius:12px 12px 0 0;padding:28px 32px;text-align:center">
    <div style="display:inline-block;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#d97706);font-size:1.6rem;line-height:52px;text-align:center;margin-bottom:12px">🚗</div>
    <h1 style="color:#fbbf24;margin:0;font-size:18px;font-weight:800;letter-spacing:0.05em">তাহয়াস কার ট্রেনিং সেন্টার</h1>
    <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:13px">ভর্তির আবেদন পাওয়া গেছে ✅</p>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:28px 32px;border:1px solid #e2e8f0;border-top:none">

    <p style="margin:0 0 8px;font-size:16px;color:#111827">
      প্রিয় <strong>${data.name}</strong>,
    </p>
    <p style="margin:0 0 24px;font-size:14px;color:#4b5563;line-height:1.75">
      তাহয়াস কার ট্রেনিং সেন্টারে আপনার ভর্তির আবেদন সফলভাবে পাওয়া গেছে।
      আমাদের প্রতিষ্ঠান থেকে শীঘ্রই যোগাযোগ করা হবে এবং ক্লাসের সময়সূচি নিশ্চিত করা হবে।
    </p>

    <!-- Info box -->
    <div style="background:#faf8f2;border:1px solid #e8e0ce;border-radius:8px;padding:18px 20px;margin-bottom:24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr style="border-bottom:1px solid #ede5d4">
          <td style="padding:8px 0;color:#9c8060;font-weight:600;width:40%">নির্বাচিত কোর্স</td>
          <td style="padding:8px 0;font-weight:700;color:#0b1324">${data.course}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#9c8060;font-weight:600">আবেদনের তারিখ</td>
          <td style="padding:8px 0;color:#1a1008">${dateStr}</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:8px">
      <a href="${confirmUrl}" style="display:inline-block;background:#0b1324;color:#fbbf24;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px">
        📄 আবেদনের বিবরণ দেখুন
      </a>
    </div>
    <p style="text-align:center;margin:10px 0 0;font-size:12px;color:#94a3b8">
      এই বোতামে ক্লিক করলে আপনার পূর্ণ আবেদনের তথ্য ও প্রমাণপত্র দেখতে পাবেন।
    </p>

  </div>

  <!-- Footer -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:16px 32px;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">WhatsApp: 01320381356 · দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর</p>
  </div>

</div>
</body>
</html>`;

  await Promise.all([
    transporter.sendMail({
      from: FROM,
      to: process.env.NODE_MAILER_USER,
      subject: `🆕 নতুন আবেদন — ${data.name} · ${data.course}`,
      html: adminHtml,
    }),
    ...(data.email
      ? [transporter.sendMail({
          from: FROM,
          to: data.email,
          subject: `আবেদন নিশ্চিত হয়েছে — ${data.name} | তাহয়াস কার ট্রেনিং সেন্টার`,
          html: studentHtml,
        })]
      : []),
  ]);
}
