"use client";
import { useEffect, useState } from "react";
import { Award, Download, MessageCircle, Share2, Trash2, X } from "lucide-react";
import {
  useCertificateImage, courseEnglish, DEFAULT_LINE, certificateFileName, downloadBlob, shareImage,
} from "@/components/certificate/certificate";
import { site } from "@/config/site";
import styles from "./admin.module.css";
import CoursePicker from "./CoursePicker";
import { certificateMessage, fmtDay, hasBengali, todayStr, waNumber, type Certificate, type Enrollment } from "./shared";

/** ISO timestamp → local "YYYY-MM-DD". */
function localDay(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CertificateModal({
  enrollment: e, onClose, onSaved, onRevoked, toast,
}: {
  enrollment: Enrollment;
  onClose: () => void;
  onSaved: (c: Certificate) => void;
  onRevoked: () => void;
  toast: (text: string, kind?: "ok" | "err") => void;
}) {
  const cert = e.certificate ?? null;
  const [name, setName] = useState(cert?.name ?? e.name);
  const [course, setCourse] = useState(cert?.course ?? courseEnglish(e.course));
  const [line, setLine] = useState(cert?.line ?? "");
  const [issued, setIssued] = useState(cert ? localDay(cert.issuedAt) : todayStr());
  const [busy, setBusy] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  // Re-render the preview only after typing pauses (canvas render is not free).
  const [preview, setPreview] = useState({ name, course, line });
  useEffect(() => {
    const t = setTimeout(() => setPreview({ name: name.trim() || " ", course: course.trim() || " ", line: line.trim() }), 350);
    return () => clearTimeout(t);
  }, [name, course, line]);

  const issuedIso = issued ? `${issued}T06:00:00.000Z` : new Date().toISOString();
  const year = new Date(cert?.issuedAt ?? issuedIso).getFullYear();
  const { url, blob, error } = useCertificateImage({
    name: preview.name,
    course: preview.course,
    no: cert?.no ?? `${site.certificate.prefix}-${year}-XXXXXX`,
    code: cert?.code ?? "PREVIEW",
    line: preview.line,
    issuedAt: issuedIso,
    from: e.trainingStart ?? null,
    to: e.trainingEnd ?? null,
  });

  const dirty = !cert || cert.name !== name.trim() || cert.course !== course.trim()
    || (cert.line ?? "") !== line.trim() || localDay(cert.issuedAt) !== issued;
  const file = cert ? certificateFileName(cert) : "certificate.png";

  const notEnglish = hasBengali(name) || hasBengali(course) || hasBengali(line);

  async function save() {
    if (!name.trim() || !course.trim()) { toast("নাম ও কোর্স দিতে হবে", "err"); return; }
    if (notEnglish) { toast("সার্টিফিকেটের সব লেখা ইংরেজিতে দিন", "err"); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: e._id, name, course, line, issuedAt: issued }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.certificate) throw new Error(d.error || "সংরক্ষণ ব্যর্থ");
      onSaved({ ...d.certificate, issuedAt: new Date(d.certificate.issuedAt).toISOString() });
      toast(cert ? "সার্টিফিকেট আপডেট হয়েছে" : "সার্টিফিকেট তৈরি হয়েছে 🎉");
    } catch (err) {
      toast(err instanceof Error ? err.message : "সংরক্ষণ ব্যর্থ", "err");
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/certificate", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: e._id }),
      });
      if (!r.ok) throw new Error();
      onRevoked();
      toast("সার্টিফিকেট বাতিল করা হয়েছে");
    } catch {
      toast("বাতিল করা যায়নি", "err");
      setBusy(false);
    }
  }

  /**
   * Send the certificate IMAGE (no link).
   * Phone: OS share sheet with the file → pick WhatsApp → the student.
   * Computer: WhatsApp links cannot carry files, so download the image and open
   * the student's chat with the message ready — attach the image there.
   */
  async function sendWhatsApp() {
    if (!blob || !cert) return;
    const text = certificateMessage(e, cert);
    if (await shareImage(blob, file, text)) return;
    downloadBlob(blob, file);
    window.open(`https://wa.me/${waNumber(e.phone)}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    toast("ছবি ডাউনলোড হয়েছে — খোলা চ্যাটে 📎 দিয়ে ছবিটি অ্যাটাচ করে পাঠান");
  }

  return (
    <div className={`${styles.overlay} ${styles.overlayCenter}`} onClick={onClose}>
      <div className={styles.certModal} onClick={(ev) => ev.stopPropagation()} role="dialog" aria-label="সার্টিফিকেট">
        <div className={styles.formHead}>
          <h3><Award size={18} /> সার্টিফিকেট {cert && <span className={styles.certNo}>{cert.no}</span>}</h3>
          <button className={styles.iconBtn} onClick={onClose} aria-label="বন্ধ করুন"><X size={18} /></button>
        </div>

        <div className={styles.certBody}>
          <div className={styles.certPreview}>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="সার্টিফিকেট প্রিভিউ" />
            ) : (
              <div className={styles.certLoading}>{error ? "প্রিভিউ তৈরি করা যায়নি" : "প্রিভিউ তৈরি হচ্ছে…"}</div>
            )}
            {!cert && <span className={styles.previewTag}>প্রিভিউ</span>}
          </div>

          <div className={styles.certSide}>
            <label className={styles.fField}>
              <span>সার্টিফিকেটে নাম (ইংরেজিতে)</span>
              <input value={name} onChange={(ev) => setName(ev.target.value)} maxLength={80} />
            </label>
            <label className={styles.fField}>
              <span>কোর্স (ইংরেজিতে)</span>
              <CoursePicker value={course} onChange={setCourse} otherLabel="অন্য কোর্স (নিজে লিখুন)…" otherPlaceholder="কোর্সের নাম ইংরেজিতে" />
            </label>
            <label className={styles.fField}>
              <span>বর্ণনার লাইন (ইংরেজিতে, ঐচ্ছিক)</span>
              <textarea rows={2} value={line} onChange={(ev) => setLine(ev.target.value)} maxLength={140} placeholder={DEFAULT_LINE} />
            </label>
            <label className={styles.fField}>
              <span>প্রদানের তারিখ</span>
              <input type="date" value={issued} onChange={(ev) => setIssued(ev.target.value)} required />
            </label>
            <div className={styles.certMeta}>
              ট্রেনিং: {e.trainingStart && e.trainingEnd
                ? <b>{fmtDay(e.trainingStart)} – {fmtDay(e.trainingEnd)}</b>
                : <i>তারিখ দেওয়া নেই (সার্টিফিকেটে দেখাবে না)</i>}
            </div>

            {notEnglish && (
              <div className={styles.formError}>সার্টিফিকেটের সব লেখা ইংরেজিতে হবে — নাম, কোর্স ও বর্ণনা ইংরেজিতে লিখুন।</div>
            )}

            {dirty && (
              <button className={styles.primaryBtn} onClick={save} disabled={busy || notEnglish} style={{ width: "100%", justifyContent: "center" }}>
                <Award size={15} /> {busy ? "সংরক্ষণ হচ্ছে…" : cert ? "পরিবর্তন সংরক্ষণ" : "সার্টিফিকেট তৈরি করুন"}
              </button>
            )}

            {cert && (
              <>
                <div className={styles.dSection}>পাঠান</div>
                <button className={styles.waBtn} onClick={sendWhatsApp} disabled={!blob || dirty}>
                  <MessageCircle size={17} /> WhatsApp-এ পাঠান
                </button>
                <p className={styles.hint}>
                  মোবাইলে: শেয়ার থেকে WhatsApp বেছে স্টুডেন্টকে ({e.phone}) ছবিটি পাঠান। কম্পিউটারে: ছবি ডাউনলোড হবে ও স্টুডেন্টের চ্যাট খুলবে — ছবিটি অ্যাটাচ করে Send চাপুন।
                </p>
                <div className={styles.certActions}>
                  <button className={styles.ghostBtn} onClick={() => blob && downloadBlob(blob, file)} disabled={!blob || dirty}><Download size={14} /> ডাউনলোড (PNG)</button>
                  <button className={styles.ghostBtn} onClick={() => blob && shareImage(blob, file, certificateMessage(e, cert))} disabled={!blob || dirty}><Share2 size={14} /> অন্যভাবে শেয়ার</button>
                </div>

                <div className={styles.revokeRow}>
                  {confirmRevoke ? (
                    <>
                      <span>নিশ্চিত? সার্টিফিকেট নম্বরটি মুছে যাবে।</span>
                      <button className={styles.ghostBtn} onClick={() => setConfirmRevoke(false)}>না</button>
                      <button className={styles.dangerBtn} onClick={revoke} disabled={busy}>হ্যাঁ, বাতিল</button>
                    </>
                  ) : (
                    <button className={styles.textDanger} onClick={() => setConfirmRevoke(true)}><Trash2 size={13} /> সার্টিফিকেট বাতিল করুন</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
