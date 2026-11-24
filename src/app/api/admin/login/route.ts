import { signAdminToken, COOKIE } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json() as { email?: string; password?: string };

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "ইমেইল বা পাসওয়ার্ড ভুল।" }, { status: 401 });
  }

  const token = await signAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}
