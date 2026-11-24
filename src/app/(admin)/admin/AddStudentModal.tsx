"use client";
import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { site } from "@/config/site";
import styles from "./admin.module.css";
import { addDays, bn, todayStr, type Enrollment } from "./shared";

const DURATIONS = [7, 15, 30, 45, 60];

const TEXT = {
  student: {
    title: "নতুন স্টুডেন্ট যোগ করুন",
    name: "নাম *", namePh: "স্টুডেন্টের পুরো নাম",
    phone: "ফোন *",
    course: "কোর্স *",
    email: "ইমেইল", age: "বয়স", optional: "ঐচ্ছিক",
    gender: "লিঙ্গ", gNone: "উল্লেখ নেই", gMale: "পুরুষ", gFemale: "নারী", gOther: "অন্যান্য",
    period: "ট্রেনিং সময়কাল", start: "শুরুর তারিখ", end: "শেষের তারিখ",
    days: (n: number) => `${bn(n)} দিন`, total: (n: number) => `মোট ${bn(n)} দিন`,
    note: "অ্যাডমিন নোট", notePh: "ঐচ্ছিক — যেমন: সকাল ৮টার ব্যাচ",
    cancel: "বাতিল", submit: "স্টুডেন্ট যোগ করুন", busy: "যোগ হচ্ছে…",
    badDates: "শুরুর তারিখ শেষের তারিখের পরে হতে পারে না",
    failed: "যোগ করা যায়নি",
  },
};

export default function AddStudentModal({
  onClose, onCreated,
}: { onClose: () => void; onCreated: (e: Enrollment) => void }) {
  const t = TEXT.student;
  const [f, setF] = useState({
    name: "", phone: "", email: "",
    course: site.courses[0]?.title.bn ?? "",
    age: "", gender: "",
    trainingStart: todayStr(), trainingEnd: addDays(todayStr(), 29), adminNote: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof f) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: ev.target.value }));

  function setDuration(days: number) {
    if (!f.trainingStart) return;
    setF((s) => ({ ...s, trainingEnd: addDays(s.trainingStart, days - 1) }));
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    if (f.trainingStart && f.trainingEnd && f.trainingStart > f.trainingEnd) { setError(t.badDates); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.item) throw new Error(d.error || t.failed);
      onCreated(d.item);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.failed);
      setBusy(false);
    }
  }

  const selectedDays = f.trainingStart && f.trainingEnd
    ? Math.round((new Date(f.trainingEnd).getTime() - new Date(f.trainingStart).getTime()) / 86_400_000) + 1
    : null;

  return (
    <div className={`${styles.overlay} ${styles.overlayCenter}`} onClick={onClose}>
      <form className={styles.formModal} onClick={(e) => e.stopPropagation()} onSubmit={submit} role="dialog" aria-label={t.title}>
        <div className={styles.formHead}>
          <h3><UserPlus size={18} /> {t.title}</h3>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label={t.cancel}><X size={18} /></button>
        </div>

        <div className={styles.formBody}>
          {error && <div className={styles.formError}>{error}</div>}

          <div className={styles.formGrid}>
            <label className={styles.fField}>
              <span>{t.name}</span>
              <input value={f.name} onChange={set("name")} required maxLength={80} placeholder={t.namePh} autoFocus />
            </label>
            <label className={styles.fField}>
              <span>{t.phone}</span>
              <input value={f.phone} onChange={set("phone")} required inputMode="tel" placeholder="01XXXXXXXXX" />
            </label>
            <label className={styles.fField}>
              <span>{t.course}</span>
              <select value={f.course} onChange={set("course")} required>
                {site.courses.map((c) => <option key={c.id} value={c.title.bn}>{c.title.bn}</option>)}
              </select>
            </label>
            <label className={styles.fField}>
              <span>{t.email}</span>
              <input type="email" value={f.email} onChange={set("email")} placeholder={t.optional} />
            </label>
            <label className={styles.fField}>
              <span>{t.age}</span>
              <input type="number" min={16} max={80} value={f.age} onChange={set("age")} placeholder={t.optional} />
            </label>
            <label className={styles.fField}>
              <span>{t.gender}</span>
              <select value={f.gender} onChange={set("gender")}>
                <option value="">{t.gNone}</option>
                <option value="male">{t.gMale}</option>
                <option value="female">{t.gFemale}</option>
                <option value="other">{t.gOther}</option>
              </select>
            </label>
          </div>

          <div className={styles.formSection}>{t.period}</div>
          <div className={styles.formGrid}>
            <label className={styles.fField}>
              <span>{t.start}</span>
              <input type="date" value={f.trainingStart} onChange={set("trainingStart")} />
            </label>
            <label className={styles.fField}>
              <span>{t.end}</span>
              <input type="date" value={f.trainingEnd} min={f.trainingStart || undefined} onChange={set("trainingEnd")} />
            </label>
          </div>
          <div className={styles.chips}>
            {DURATIONS.map((d) => (
              <button key={d} type="button" className={`${styles.chip} ${selectedDays === d ? styles.chipOn : ""}`}
                onClick={() => setDuration(d)} disabled={!f.trainingStart}>
                {t.days(d)}
              </button>
            ))}
            {selectedDays !== null && selectedDays > 0 && !DURATIONS.includes(selectedDays) && (
              <span className={styles.chipNote}>{t.total(selectedDays)}</span>
            )}
          </div>

          <label className={styles.fField}>
            <span>{t.note}</span>
            <textarea rows={2} value={f.adminNote} onChange={set("adminNote")} maxLength={2000} placeholder={t.notePh} />
          </label>
        </div>

        <div className={styles.formFoot}>
          <button type="button" className={styles.ghostBtn} onClick={onClose}>{t.cancel}</button>
          <button type="submit" className={styles.primaryBtn} disabled={busy}>
            {busy ? t.busy : t.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
