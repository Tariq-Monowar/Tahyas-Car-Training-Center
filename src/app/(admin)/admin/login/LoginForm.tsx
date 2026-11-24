"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../admin.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
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
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "সমস্যা হয়েছে।");
      setBusy(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>🚗 Admin Login</h1>
        <p className={styles.loginSub}>তাহয়াস কার ট্রেনিং সেন্টার</p>
        {error && <div className={styles.loginError}>{error}</div>}
        <form onSubmit={submit}>
          <div className={styles.loginField}>
            <label>ইমেইল</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@email.com" required autoComplete="email" />
          </div>
          <div className={styles.loginField}>
            <label>পাসওয়ার্ড</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" required autoComplete="current-password" />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={busy}>
            {busy ? "লগইন হচ্ছে…" : "লগইন করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
