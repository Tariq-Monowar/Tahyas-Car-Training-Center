import { verifyAdminToken, COOKIE } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value ?? "";
  if (!await verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const list = await Enrollment.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}
