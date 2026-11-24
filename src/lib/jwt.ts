import { SignJWT, jwtVerify } from "jose";
import type { NextResponse } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "tahyas-jwt-secret-fallback-change-me"
);

export const COOKIE = "tahyas_admin";

/**
 * Admin session length. The session is *sliding*: every time the panel loads
 * (see GET /api/admin/enrollments) a fresh token is issued, so an admin who
 * opens the app at least once every 60 days stays signed in — important for
 * the installed PWA, which has no address bar to log in from easily.
 */
const SESSION_DAYS = 60;

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Sign a new token and attach it as the session cookie. */
export async function setAdminSession(res: NextResponse) {
  res.cookies.set(COOKIE, await signAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "lax" (not "strict") so the cookie is also sent when the installed app
    // is launched from the home screen; writes are still POST/PATCH/DELETE only.
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: "/",
  });
  return res;
}
