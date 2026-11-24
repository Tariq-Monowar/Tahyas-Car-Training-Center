const store = new Map<string, { otp: string; exp: number; attempts: number }>();

export function saveOTP(email: string, otp: string) {
  store.set(email.toLowerCase(), { otp, exp: Date.now() + 10 * 60 * 1000, attempts: 0 });
}

export function verifyOTP(email: string, otp: string): "ok" | "expired" | "invalid" | "maxAttempts" {
  const key = email.toLowerCase();
  const entry = store.get(key);
  if (!entry) return "expired";
  if (Date.now() > entry.exp) { store.delete(key); return "expired"; }
  entry.attempts += 1;
  if (entry.attempts > 5) { store.delete(key); return "maxAttempts"; }
  if (entry.otp !== otp) return "invalid";
  store.delete(key);
  return "ok";
}

export function hasOTP(email: string): boolean {
  const entry = store.get(email.toLowerCase());
  return !!entry && Date.now() <= entry.exp;
}
