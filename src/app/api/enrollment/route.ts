import { connectDB } from "@/lib/mongodb";
import { sendEnrollmentEmails } from "@/lib/mailer";
import { Enrollment } from "@/models/Enrollment";
import { NextRequest, NextResponse } from "next/server";

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, string>;
    const { name, phone, email, course, age, gender, message } = body;

    if (!name?.trim() || !phone?.trim() || !course?.trim()) {
      return NextResponse.json({ error: "নাম, ফোন ও কোর্স আবশ্যক।" }, { status: 400 });
    }

    const ip = getClientIP(req);
    const userAgent = req.headers.get("user-agent") || "";

    await connectDB();

    // Rate limit: same IP max 3 submissions in 24 hours
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentByIP = await Enrollment.countDocuments({ ip, createdAt: { $gte: since } });
    if (recentByIP >= 3) {
      return NextResponse.json(
        { error: "আপনি আজ ইতিমধ্যে একাধিক আবেদন করেছেন। ২৪ ঘণ্টা পর আবার চেষ্টা করুন অথবা সরাসরি যোগাযোগ করুন।" },
        { status: 429 }
      );
    }

    // Duplicate check: same phone AND same name (case-insensitive) in last 48 hours
    const since48 = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const existing = await Enrollment.findOne({
      phone: phone.trim(),
      name: { $regex: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      createdAt: { $gte: since48 },
    }).lean();
    if (existing) {
      return NextResponse.json(
        {
          error: "duplicate",
          existingId: String(existing._id),
          existingName: existing.name,
          existingCourse: existing.course,
        },
        { status: 409 }
      );
    }

    const doc = await Enrollment.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      course,
      age: age?.trim(),
      gender: gender?.trim(),
      message: message?.trim(),
      ip,
      userAgent,
    });

    try {
      await sendEnrollmentEmails({
        id: String(doc._id),
        name: doc.name,
        phone: doc.phone,
        email: doc.email || undefined,
        course: doc.course,
        age: doc.age || undefined,
        message: doc.message || undefined,
        createdAt: doc.createdAt,
      });
    } catch (mailErr) {
      console.error("Email send failed:", mailErr);
      // Don't fail the enrollment if email fails
    }

    return NextResponse.json({ success: true, id: String(doc._id) }, { status: 201 });
  } catch (err) {
    console.error("Enrollment error:", err);
    return NextResponse.json({ error: "সার্ভার সমস্যা, পরে চেষ্টা করুন।" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const list = await Enrollment.find().sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json(list);
}
