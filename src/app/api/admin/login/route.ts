import { setAdminSession } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json() as { email?: string; password?: string };

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "ইমেইল বা পাসওয়ার্ড ভুল।" }, { status: 401 });
  }

  return setAdminSession(NextResponse.json({ success: true }));
}
