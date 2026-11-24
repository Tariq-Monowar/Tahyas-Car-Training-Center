"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Info } from "lucide-react";
import styles from "./enroll.module.css";

const COURSES = [
  "বেসিক ড্রাইভিং কোর্স",
  "এডভান্স ড্রাইভিং কোর্স",
  "রিভার্স পার্কিং",
  "হাইওয়ে ড্রাইভিং",
  "নারী ড্রাইভিং প্রশিক্ষণ",
];

export default function EnrollForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", course: "", age: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.course) {
      setError("নাম, ফোন নম্বর ও কোর্স অবশ্যই পূরণ করুন।");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success?: boolean; id?: string; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "অজানা সমস্যা");
      router.push(`/enroll/confirm/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "সার্ভার সমস্যা, পরে চেষ্টা করুন।");
      setBusy(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="name">পুরো নাম <span className={styles.required}>*</span></label>
          <input id="name" type="text" placeholder="আপনার নাম লিখুন" value={form.name} onChange={set("name")} required autoComplete="name" />
        </div>
        <div className={styles.field}>
          <label htmlFor="phone">মোবাইল নম্বর <span className={styles.required}>*</span></label>
          <input id="phone" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} required autoComplete="tel" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="course">কোর্স বেছে নিন <span className={styles.required}>*</span></label>
        <select id="course" value={form.course} onChange={set("course")} required>
          <option value="">— কোর্স নির্বাচন করুন —</option>
          {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.row2}>
        <div className={styles.field}>
          <label htmlFor="email">ইমেইল <span className={styles.hint}>(নিশ্চিতকরণের জন্য)</span></label>
          <input id="email" type="email" placeholder="example@gmail.com" value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div className={styles.field}>
          <label htmlFor="age">বয়স</label>
          <input id="age" type="number" placeholder="যেমন: ২৫" value={form.age} onChange={set("age")} min="16" max="80" />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="message">মন্তব্য বা প্রশ্ন</label>
        <textarea id="message" placeholder="কিছু জানাতে চাইলে লিখুন (ঐচ্ছিক)" value={form.message} onChange={set("message")} />
      </div>

      <div className={styles.infoBar}>
        <Info size={16} />
        আবেদনের পর আমরা আপনাকে ফোন করে সময় নিশ্চিত করব।
      </div>

      <button type="submit" className={styles.submit} disabled={busy}>
        <GraduationCap size={20} />
        {busy ? "আবেদন পাঠানো হচ্ছে…" : "ভর্তির আবেদন করুন"}
      </button>
    </form>
  );
}
