import { verifyAdminToken, COOKIE } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { Enrollment, type ICertificate } from "@/models/Enrollment";
import { site } from "@/config/site";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import mongoose from "mongoose";

// No 0/O/1/I/L — easy to read aloud and type from a printed certificate.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function newCode(len = 8) {
  const bytes = randomBytes(len);
  let s = "";
  for (let i = 0; i < len; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return s;
}

async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value ?? "");
}

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/**
 * Issue or update a certificate. Body: { id, name, course, line?, issuedAt? (YYYY-MM-DD) }.
 * Training dates come from the enrollment.
 */
export async function POST(req: Request) {
  if (!await isAdmin()) return bad("Unauthorized", 401);
  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) return bad("Invalid id");

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const course = typeof body.course === "string" ? body.course.trim().slice(0, 80) : "";
  if (!name || !course) return bad("নাম ও কোর্স দিতে হবে");
  const line = typeof body.line === "string" ? body.line.trim().slice(0, 140) : "";
  // Certificates are English-only (their fonts have no Bengali glyphs).
  if ([name, course, line].some((v) => /[\u0980-\u09FF]/.test(v))) return bad("সার্টিফিকেটের সব লেখা ইংরেজিতে দিন");
  let issuedOverride: Date | undefined;
  if (body.issuedAt) {
    if (typeof body.issuedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.issuedAt)) return bad("তারিখ সঠিক নয়");
    issuedOverride = new Date(body.issuedAt + "T06:00:00Z"); // midday in Bangladesh
    if (isNaN(issuedOverride.getTime())) return bad("তারিখ সঠিক নয়");
  }

  await connectDB();
  const doc = await Enrollment.findById(id).select("status certificate").lean<{ status: string; certificate?: ICertificate | null }>();
  if (!doc) return bad("আবেদন পাওয়া যায়নি", 404);
  if (doc.status === "cancelled") return bad("বাতিল আবেদনের সার্টিফিকেট দেওয়া যায় না");

  // Editing keeps the same code/number/issue date so already-shared links stay valid.
  const existing = doc.certificate;
  let code = existing?.code;
  let no = existing?.no;
  const issuedAt = issuedOverride ?? existing?.issuedAt ?? new Date();
  if (!code) {
    for (let i = 0; i < 5 && !code; i++) {
      const c = newCode();
      if (!await Enrollment.exists({ "certificate.code": c })) code = c;
    }
    if (!code) return bad("আবার চেষ্টা করুন", 500);
    no = `${site.certificate.prefix}-${issuedAt.getFullYear()}-${code.slice(0, 6)}`;
  }

  const certificate: ICertificate = { code, no: no!, name, course, line, issuedAt };
  await Enrollment.updateOne({ _id: id }, { $set: { certificate } });
  return NextResponse.json({ ok: true, certificate });
}

/** Revoke a certificate. Body: { id } — the verify link stops working. */
export async function DELETE(req: Request) {
  if (!await isAdmin()) return bad("Unauthorized", 401);
  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (typeof id !== "string" || !mongoose.isValidObjectId(id)) return bad("Invalid id");
  await connectDB();
  await Enrollment.updateOne({ _id: id }, { $set: { certificate: null } });
  return NextResponse.json({ ok: true });
}
