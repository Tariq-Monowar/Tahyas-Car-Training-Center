import { verifyAdminToken, setAdminSession, COOKIE } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";

const STATUSES = ["pending", "confirmed", "cancelled"] as const;
const LIST_FIELDS = "name phone email course age gender message adminNote status trainingStart trainingEnd certificate source createdAt";
const DAY = 86_400_000;
const BD_OFFSET = 6 * 3_600_000; // Asia/Dhaka, UTC+6, no DST

/** Today's date in Bangladesh as a UTC-midnight Date (training dates are stored that way). */
function bdToday() {
  const t = Date.now() + BD_OFFSET;
  return new Date(t - (t % DAY));
}

/** "YYYY-MM-DD" → UTC-midnight Date; "" / null → null; invalid → undefined. */
function parseDay(v: unknown): Date | null | undefined {
  if (v === "" || v === null) return null;
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return undefined;
  const d = new Date(v + "T00:00:00Z");
  return isNaN(d.getTime()) ? undefined : d;
}
const MAX_LIMIT = 50;
const EXPORT_CAP = 5000;

async function isAdmin() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value ?? "");
}

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

function parseIds(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 500) return null;
  const ids = raw.filter((v): v is string => typeof v === "string" && mongoose.isValidObjectId(v));
  return ids.length === raw.length ? ids : null;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Build the Mongo filter from query params (everything except the cursor). */
function buildFilter(p: URLSearchParams) {
  const filter: Record<string, unknown> = {};

  const status = p.get("status");
  if (status && (STATUSES as readonly string[]).includes(status)) filter.status = status;

  const course = p.get("course");
  if (course) filter.course = course.slice(0, 200);

  const gender = p.get("gender");
  if (gender !== null) {
    if (gender === "none") filter.gender = { $in: ["", null] };
    else if (["male", "female", "other"].includes(gender)) filter.gender = gender;
  }

  const from = Number(p.get("from"));
  const to = Number(p.get("to"));
  if (from > 0 || to > 0) {
    const range: Record<string, Date> = {};
    if (from > 0) range.$gte = new Date(from);
    if (to > 0) range.$lte = new Date(to);
    filter.createdAt = range;
  }

  const training = p.get("training");
  if (training) {
    const today = bdToday();
    if (training === "ongoing") { filter.trainingStart = { $lte: today }; filter.trainingEnd = { $gte: today }; }
    else if (training === "upcoming") filter.trainingStart = { $gt: today };
    else if (training === "ended") filter.trainingEnd = { $lt: today };
    else if (training === "unset") filter.trainingEnd = null;
    else if (training === "certified") filter["certificate.code"] = { $type: "string" };
  }

  const q = p.get("q")?.trim().slice(0, 100);
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ name: rx }, { phone: rx }, { email: rx }, { course: rx }];
  }

  return filter;
}

/**
 * GET /api/admin/enrollments
 *   ?limit=20&cursor=<lastId>&sort=newest|oldest
 *   &status=&course=&gender=&from=<ms>&to=<ms>&q=
 *   &meta=1   → also return status counts + course list (first load / refresh only)
 *   &export=1 → return all matching rows (capped) for CSV
 *
 * Cursor = _id of the last row. ObjectIds are time-ordered, so sorting by _id
 * matches createdAt order and uses the default _id index — no skip/offset scans.
 */
export async function GET(req: Request) {
  if (!await isAdmin()) return unauthorized();
  const p = new URL(req.url).searchParams;
  const asc = p.get("sort") === "oldest";
  const filter = buildFilter(p);

  await connectDB();

  if (p.get("export") === "1") {
    const rows = await Enrollment.find(filter).sort({ _id: asc ? 1 : -1 }).limit(EXPORT_CAP)
      .select(LIST_FIELDS).lean().maxTimeMS(8000);
    return NextResponse.json({ items: rows });
  }

  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(p.get("limit")) || 20));
  const cursor = p.get("cursor");
  if (cursor) {
    if (!mongoose.isValidObjectId(cursor)) return bad("Invalid cursor");
    filter._id = { [asc ? "$gt" : "$lt"]: new mongoose.Types.ObjectId(cursor) };
  }

  // Fetch one extra row to know whether another page exists.
  const rows = await Enrollment.find(filter).sort({ _id: asc ? 1 : -1 }).limit(limit + 1)
    .select(LIST_FIELDS).lean().maxTimeMS(5000);
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? String(items[items.length - 1]._id) : null;

  let meta: { counts: Record<string, number>; courses: string[] } | undefined;
  if (p.get("meta") === "1") {
    const [grouped, courses] = await Promise.all([
      Enrollment.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
      Enrollment.distinct("course"),
    ]);
    const counts: Record<string, number> = { total: 0, pending: 0, confirmed: 0, cancelled: 0 };
    for (const g of grouped) { counts[g._id] = g.n; counts.total += g.n; }
    meta = { counts, courses: (courses as string[]).filter(Boolean).sort() };
  }

  const res = NextResponse.json({ items, nextCursor, meta });
  // Sliding session: renew the login whenever the panel loads (first page / refresh).
  return meta ? setAdminSession(res) : res;
}

/**
 * Add a student from the admin panel.
 * Body: { name, phone, course, email?, age?, gender?, trainingStart?, trainingEnd?, adminNote? }
 */
export async function POST(req: Request) {
  if (!await isAdmin()) return unauthorized();
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return bad("Invalid body");

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const name = str(b.name, 80);
  const phone = str(b.phone, 20);
  const course = str(b.course, 80);
  if (!name || !phone || !course) return bad("নাম, ফোন ও কোর্স দিতে হবে");
  if (!/^\+?[0-9\s-]{8,20}$/.test(phone)) return bad("ফোন নম্বর সঠিক নয়");

  const gender = ["male", "female", "other"].includes(b.gender) ? b.gender : "";
  const trainingStart = parseDay(b.trainingStart ?? "");
  const trainingEnd = parseDay(b.trainingEnd ?? "");
  if (trainingStart === undefined || trainingEnd === undefined) return bad("তারিখ সঠিক নয়");
  if (trainingStart && trainingEnd && trainingStart > trainingEnd) return bad("শুরুর তারিখ শেষের তারিখের পরে হতে পারে না");

  await connectDB();
  const doc = await Enrollment.create({
    name, phone, course,
    email: str(b.email, 120),
    age: str(b.age, 3),
    gender,
    adminNote: str(b.adminNote, 2000),
    trainingStart, trainingEnd,
    status: "confirmed",
    source: "admin",
  });
  const item = await Enrollment.findById(doc._id).select(LIST_FIELDS).lean();
  return NextResponse.json({ ok: true, item });
}

/**
 * Body: { ids: string[], status?, adminNote?, trainingStart?, trainingEnd? }
 * Training dates are "YYYY-MM-DD", or "" to clear.
 */
export async function PATCH(req: Request) {
  if (!await isAdmin()) return unauthorized();
  const body = await req.json().catch(() => null);
  const ids = parseIds(body?.ids);
  if (!ids) return bad("Invalid ids");

  const update: Record<string, string | Date | null> = {};
  for (const key of ["trainingStart", "trainingEnd"] as const) {
    if (body[key] === undefined) continue;
    const d = parseDay(body[key]);
    if (d === undefined) return bad("তারিখ সঠিক নয়");
    update[key] = d;
  }
  if (update.trainingStart && update.trainingEnd && update.trainingStart > update.trainingEnd) {
    return bad("শুরুর তারিখ শেষের তারিখের পরে হতে পারে না");
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return bad("Invalid status");
    update.status = body.status;
  }
  if (body.adminNote !== undefined) {
    if (typeof body.adminNote !== "string") return bad("Invalid note");
    update.adminNote = body.adminNote.slice(0, 2000);
  }
  if (Object.keys(update).length === 0) return bad("Nothing to update");

  await connectDB();
  const res = await Enrollment.updateMany({ _id: { $in: ids } }, { $set: update });
  return NextResponse.json({ ok: true, modified: res.modifiedCount });
}

/** Body: { ids: string[] } */
export async function DELETE(req: Request) {
  if (!await isAdmin()) return unauthorized();
  const body = await req.json().catch(() => null);
  const ids = parseIds(body?.ids);
  if (!ids) return bad("Invalid ids");
  await connectDB();
  const res = await Enrollment.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ ok: true, deleted: res.deletedCount });
}
