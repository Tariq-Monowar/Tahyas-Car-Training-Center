"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import styles from "./enroll.module.css";

const COURSES = [
  "বেসিক ড্রাইভিং কোর্স",
  "এডভান্স ড্রাইভিং কোর্স",
  "রিভার্স পার্কিং",
  "হাইওয়ে ড্রাইভিং",
  "নারী ড্রাইভিং প্রশিক্ষণ",
];

function today() {
  return new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
}

function EnvelopeBottom({ signerName }: { signerName?: string }) {
  return (
    <div className={styles.envelopeBottom}>
      <div className={styles.envelopeFold} />
      <p className={styles.envelopeFoldText}>
        {signerName ? `${signerName} এর পক্ষ থেকে` : "আন্তরিক শুভেচ্ছায়"} ✦
      </p>
      <div className={styles.envelopeContent}>
        <div className={styles.envelopeLeft}>
          <span className={styles.envelopeLabel}>প্রেরণ করুন</span>
          <p className={styles.envelopeAddr}>
            <strong>তাহয়াস কার ট্রেনিং সেন্টার</strong><br />
            দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর
          </p>
          <div className={styles.envelopeContacts}>
            <a href="tel:01320381356" className={styles.envelopeBtn}>📞 ফোন করুন</a>
            <a href="https://wa.me/8801320381356" className={styles.envelopeBtn} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>
        </div>
        <div className={styles.envelopeStamp}>
          <span className={styles.stampEmoji}>🚗</span>
          <span className={styles.stampCity}>লক্ষ্মীপুর</span>
        </div>
      </div>
    </div>
  );
}

type DupInfo = { existingId: string; existingName: string; existingCourse: string };

export default function EnrollForm() {
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [dupInfo, setDupInfo] = useState<DupInfo | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; course?: string }>({});
  const [success, setSuccess] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", course: "", age: "", gender: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k in fieldErrors) setFieldErrors((fe) => ({ ...fe, [k]: undefined }));
    if (k === "phone") setDupInfo(null);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(""); setDupInfo(null);
    const errs: typeof fieldErrors = {};
    if (!form.name.trim()) errs.name = "নাম লিখুন";
    if (!form.phone.trim()) errs.phone = "মোবাইল নম্বর দিন";
    if (!form.course) errs.course = "কোর্স নির্বাচন করুন";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setBusy(true);
    try {
      const res = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as {
        success?: boolean; id?: string; error?: string;
        existingId?: string; existingName?: string; existingCourse?: string;
      };
      if (res.status === 409 && data.existingId) {
        setDupInfo({ existingId: data.existingId, existingName: data.existingName ?? "", existingCourse: data.existingCourse ?? "" });
        setBusy(false); return;
      }
      if (!res.ok || !data.success || !data.id) throw new Error(data.error ?? "অজানা সমস্যা");
      setSuccess({ id: data.id, name: form.name });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "সার্ভার সমস্যা, পরে চেষ্টা করুন।");
      setBusy(false);
    }
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div className={styles.envelopeWrap}>
        <div className={styles.letter}>
          <div className={styles.successHead}>
            <div className={styles.successIcon}>✅</div>
            <h2 className={styles.successTitle}>আবেদন সফল হয়েছে!</h2>
            <p className={styles.successSub}>তাহয়াস কার ট্রেনিং সেন্টার</p>
          </div>
          <div className={styles.successBody}>
            <p className={styles.successMessage}>
              ধন্যবাদ, <strong>{success.name}</strong>!<br />
              আপনার ভর্তির আবেদন পাওয়া গেছে। আমরা শীঘ্রই যোগাযোগ করব এবং ক্লাসের সময় নিশ্চিত করব।
            </p>
            <div className={styles.successActions}>
              <a href={`/enroll/confirm/${success.id}`} className={styles.btnCert}>
                📄 প্রমাণপত্র দেখুন ও ডাউনলোড করুন
              </a>
              <a href="/" className={styles.btnHome}>← হোম পেজে ফিরে যান</a>
            </div>
          </div>
        </div>
        <EnvelopeBottom signerName={success.name} />
      </div>
    );
  }

  /* ── Form state ── */
  return (
    <div className={styles.envelopeWrap}>
      <div className={styles.letter}>
        {/* Header */}
        <div className={styles.letterHead}>
          <div className={styles.medallion}>🚗</div>
          <p className={styles.letterHeadTitle}>তাহয়াস কার ট্রেনিং সেন্টার</p>
          <p className={styles.letterHeadSub}>TAHYAS CAR TRAINING CENTER · LAKSHMIPUR</p>
          <div className={styles.dividerOrnament}><span className={styles.dividerDot} /></div>
        </div>

        {/* Body */}
        <div className={styles.letterBody}>
          <div className={styles.letterMeta}>
            <span className={styles.letterType}>নতুন ভর্তি আবেদন</span>
            <span className={styles.letterDate}>{today()}</span>
          </div>
          <h1 className={styles.letterGreeting}>প্রিয় তাহয়াস টিম,</h1>
          <p className={styles.letterIntro}>
            গাড়ি চালানো শেখার জন্য তাহয়াস কার ট্রেনিং সেন্টারকেই বেছে নিয়েছি। নিচে আমার প্রয়োজনীয় তথ্য দেওয়া হলো — সুবিধামতো যোগাযোগ করুন।
          </p>
          <hr className={styles.dividerLine} />

          <form className={styles.form} onSubmit={submit} noValidate>
            {serverError && <div className={styles.errorMsg}>{serverError}</div>}

            {dupInfo && (
              <div className={styles.dupError}>
                <div className={styles.dupErrorIcon}>⚠️</div>
                <div className={styles.dupErrorBody}>
                  <p className={styles.dupErrorTitle}>এই নম্বরে ইতিমধ্যে আবেদন আছে!</p>
                  <p className={styles.dupErrorDetail}>
                    <strong>{dupInfo.existingName}</strong> নামে <strong>{dupInfo.existingCourse}</strong> কোর্সে এই নম্বর দিয়ে আবেদন করা হয়েছে।
                  </p>
                  <div className={styles.dupErrorActions}>
                    <a href={`/enroll/confirm/${dupInfo.existingId}`} className={styles.dupViewBtn}>
                      📄 আগের আবেদন দেখুন
                    </a>
                    <a href="https://wa.me/8801320381356" target="_blank" rel="noopener noreferrer" className={styles.dupContactBtn}>
                      💬 যোগাযোগ করুন
                    </a>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.row2}>
              <div className={`${styles.field} ${fieldErrors.name ? styles.fieldHasError : ""}`}>
                <label className={styles.fieldLabel} htmlFor="name">পুরো নাম <span className={styles.required}>*</span></label>
                <input id="name" className={styles.fieldInput} type="text" placeholder="আপনার নাম" value={form.name} onChange={set("name")} autoComplete="name" />
                <span className={styles.fieldUnderline} />
                {fieldErrors.name && <span className={styles.fieldErrMsg}>⚠ {fieldErrors.name}</span>}
              </div>
              <div className={`${styles.field} ${fieldErrors.phone ? styles.fieldHasError : ""}`}>
                <label className={styles.fieldLabel} htmlFor="phone">মোবাইল নম্বর <span className={styles.required}>*</span></label>
                <input id="phone" className={styles.fieldInput} type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={set("phone")} autoComplete="tel" />
                <span className={styles.fieldUnderline} />
                {fieldErrors.phone && <span className={styles.fieldErrMsg}>⚠ {fieldErrors.phone}</span>}
              </div>
            </div>

            <div className={`${styles.field} ${fieldErrors.course ? styles.fieldHasError : ""}`}>
              <label className={styles.fieldLabel} htmlFor="course">কোর্স বেছে নিন <span className={styles.required}>*</span></label>
              <select id="course" className={styles.fieldSelect} value={form.course} onChange={set("course")}>
                <option value="">— কোর্স নির্বাচন করুন —</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className={styles.fieldUnderline} />
              {fieldErrors.course && <span className={styles.fieldErrMsg}>⚠ {fieldErrors.course}</span>}
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="email">
                  ইমেইল <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "#b8a888" }}>(ঐচ্ছিক)</span>
                </label>
                <input id="email" className={styles.fieldInput} type="email" placeholder="example@gmail.com" value={form.email} onChange={set("email")} autoComplete="email" />
                <span className={styles.fieldUnderline} />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="age">বয়স</label>
                <input id="age" className={styles.fieldInput} type="number" placeholder="যেমন: ২৫" value={form.age} onChange={set("age")} min="16" max="80" />
                <span className={styles.fieldUnderline} />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>লিঙ্গ</label>
              <div className={styles.genderGroup}>
                {[["পুরুষ", "male", "👨"], ["নারী", "female", "👩"], ["অন্যান্য", "other", "🧑"]].map(([label, value, emoji]) => (
                  <label key={value} className={styles.genderLabel}>
                    <input type="radio" name="gender" value={value} checked={form.gender === value} onChange={set("gender")} />
                    {emoji} {label}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="message">মন্তব্য বা প্রশ্ন</label>
              <textarea id="message" className={styles.fieldTextarea} placeholder="কিছু জানাতে চাইলে এখানে লিখুন…" value={form.message} onChange={set("message")} rows={3} />
              <span className={styles.fieldUnderline} />
            </div>

            <div className={styles.signoff}>
              <div className={styles.signoffText}>
                আন্তরিকভাবে,
                <strong>{form.name || "আবেদনকারী"}</strong>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={busy}>
                {busy ? <span className={styles.spinner} /> : <Send size={16} />}
                {busy ? "পাঠানো হচ্ছে…" : "আবেদন পাঠান"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <EnvelopeBottom />
    </div>
  );
}
