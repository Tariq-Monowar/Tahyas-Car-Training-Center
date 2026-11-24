import { connectDB } from "@/lib/mongodb";
import { sendEnrollmentEmails } from "@/lib/mailer";
import { Enrollment } from "@/models/Enrollment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, string>;
    const { name, phone, email, course, age, message } = body;

    if (!name?.trim() || !phone?.trim() || !course?.trim()) {
      return NextResponse.json({ error: "নাম, ফোন ও কোর্স আবশ্যক।" }, { status: 400 });
    }

    await connectDB();
    const doc = await Enrollment.create({ name: name.trim(), phone: phone.trim(), email: email?.trim(), course, age: age?.trim(), message: message?.trim() });

    // Send emails (don't block the response if it fails)
    sendEnrollmentEmails({
      id: String(doc._id),
      name: doc.name,
      phone: doc.phone,
      email: doc.email || undefined,
      course: doc.course,
      age: doc.age || undefined,
      message: doc.message || undefined,
      createdAt: doc.createdAt,
    }).catch(console.error);

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
