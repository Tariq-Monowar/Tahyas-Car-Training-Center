import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  await connectDB();
  const doc = await Enrollment.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}
