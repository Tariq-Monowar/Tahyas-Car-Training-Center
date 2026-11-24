"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

type Step = "login" | "forgot" | "otp";

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  /* ── Normal login ── */
  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "লগইন ব্যর্থ");
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে।");
      setBusy(false);
    }
  }

  /* ── Send OTP ── */
  async function sendOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "সমস্যা হয়েছে।");
      setInfo(`OTP পাঠানো হয়েছে। ইমেইল চেক করুন।`);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে।");
    } finally {
      setBusy(false);
    }
  }

  /* ── Verify OTP → login ── */
  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? "যাচাই ব্যর্থ");
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে।");
      setBusy(false);
    }
  }

  /* ── Render ── */
  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>

        {/* ── Step: Normal login ── */}
        {step === "login" && (
          <>
            <h1 className={styles.loginTitle}>🚗 Admin Login</h1>
            <p className={styles.loginSub}>তাহয়াস কার ট্রেনিং সেন্টার</p>
            {error && <div className={styles.loginError}>{error}</div>}
            <form onSubmit={submitLogin}>
              <div className={styles.loginField}>
                <label>ইমেইল</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="admin@email.com" required autoComplete="email" />
              </div>
              <div className={styles.loginField}>
                <label>পাসওয়ার্ড</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••" required autoComplete="current-password" />
              </div>
              <button type="submit" className={styles.loginBtn} disabled={busy}>
                {busy ? "লগইন হচ্ছে…" : "লগইন করুন"}
              </button>
            </form>
            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => { setError(""); setStep("forgot"); }}
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </>
        )}

        {/* ── Step: Forgot — enter email ── */}
        {step === "forgot" && (
          <>
            <h1 className={styles.loginTitle}>🔐 পাসওয়ার্ড রিসেট</h1>
            <p className={styles.loginSub}>Admin ইমেইলে OTP পাঠানো হবে</p>
            {error && <div className={styles.loginError}>{error}</div>}
            <form onSubmit={sendOTP}>
              <div className={styles.loginField}>
                <label>Admin ইমেইল</label>
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  placeholder="admin@email.com" required autoComplete="email" />
              </div>
              <button type="submit" className={styles.loginBtn} disabled={busy}>
                {busy ? "পাঠানো হচ্ছে…" : "OTP পাঠান"}
              </button>
            </form>
            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => { setError(""); setStep("login"); }}
            >
              ← লগইনে ফিরে যান
            </button>
          </>
        )}

        {/* ── Step: OTP verify ── */}
        {step === "otp" && (
          <>
            <h1 className={styles.loginTitle}>✉️ OTP যাচাই</h1>
            <p className={styles.loginSub}>ইমেইলে আসা ৬ সংখ্যার কোডটি দিন</p>
            {info && <div className={styles.loginInfo}>{info}</div>}
            {error && <div className={styles.loginError}>{error}</div>}
            <form onSubmit={verifyOTP}>
              <div className={styles.loginField}>
                <label>OTP কোড</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  autoComplete="one-time-code"
                  className={styles.otpInput}
                />
              </div>
              <button type="submit" className={styles.loginBtn} disabled={busy || otp.length !== 6}>
                {busy ? "যাচাই হচ্ছে…" : "যাচাই করুন ও লগইন করুন"}
              </button>
            </form>
            <button
              type="button"
              className={styles.forgotLink}
              onClick={() => { setError(""); setInfo(""); setOtp(""); setStep("forgot"); }}
            >
              ← নতুন OTP নিন
            </button>
          </>
        )}

      </div>
    </div>
  );
}
