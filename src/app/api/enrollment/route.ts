import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { name?: string; phone?: string; course?: string; message?: string };

    if (!body.name?.trim() || !body.phone?.trim() || !body.course?.trim()) {
      return NextResponse.json({ error: "name, phone ও course আবশ্যক।" }, { status: 400 });
    }

    await connectDB();
    const doc = await Enrollment.create({
      name:    body.name.trim(),
      phone:   body.phone.trim(),
      course:  body.course.trim(),
      message: body.message?.trim() ?? "",
    });

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (err) {
    console.error("Enrollment error:", err);
    return NextResponse.json({ error: "সার্ভার সমস্যা, পরে চেষ্টা করুন।" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const list = await Enrollment.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
