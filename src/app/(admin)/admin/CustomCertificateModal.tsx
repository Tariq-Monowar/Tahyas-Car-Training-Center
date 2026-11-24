"use client";
/**
 * One-off certificate: designed and exported entirely in the browser.
 * Nothing is saved — no database record, no server request.
 */
import { useEffect, useState } from "react";
import { Award, Download, MessageCircle, Share2, X } from "lucide-react";
import {
  useCertificateImage, DEFAULT_LINE, certificateFileName, downloadBlob, shareImage,
} from "@/components/certificate/certificate";
import { site } from "@/config/site";
import styles from "./admin.module.css";
import CoursePicker from "./CoursePicker";
import { addDays, hasBengali, todayStr, waNumber } from "./shared";

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
function randomNo() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${site.certificate.prefix}-${new Date().getFullYear()}-${code}`;
}

export default function CustomCertificateModal({
  onClose, toast,
}: { onClose: () => void; toast: (text: string, kind?: "ok" | "err") => void }) {
  const [f, setF] = useState({
    name: "",
    course: site.courses[0]?.title.en ?? "",
    from: todayStr(),
    to: addDays(todayStr(), 29),
    issued: todayStr(),
    line: "",
    phone: "",
  });
  const [no] = useState(randomNo);
  const set = (k: keyof typeof f) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: ev.target.value }));

  // Re-render the preview only after typing pauses.
  const [preview, setPreview] = useState(f);
  useEffect(() => {
    const t = setTimeout(() => setPreview(f), 350);
    return () => clearTimeout(t);
  }, [f]);

  const notEnglish = hasBengali(f.name) || hasBengali(f.course) || hasBengali(f.line);
  const badDates = !!(f.from && f.to && f.from > f.to);

  const { url, blob, error } = useCertificateImage({
    name: preview.name.trim() || "Full Name",
    course: preview.course.trim() || "Course Name",
    no,
    code: "",
    line: preview.line.trim(),
    issuedAt: `${preview.issued || todayStr()}T06:00:00.000Z`,
    from: preview.from ? `${preview.from}T00:00:00.000Z` : null,
    to: preview.to ? `${preview.to}T00:00:00.000Z` : null,
  });

  const ready = !!blob && !!f.name.trim() && !!f.course.trim() && !notEnglish && !badDates && preview === f;
  const file = certificateFileName({ name: f.name || "certificate", no });
  const message = [
    `আসসালামু আলাইকুম ${f.name.trim()},`,
    ``,
    `🎉 অভিনন্দন! আপনি সফলভাবে "${f.course.trim()}" সম্পন্ন করেছেন।`,
    `আপনার সার্টিফিকেট এই মেসেজের সাথে পাঠানো হলো।`,
    ``,
    `— ${site.name.bn}`,
  ].join("\n");

  async function sendWhatsApp() {
    if (!blob) return;
    if (await shareImage(blob, file, message)) return;
    downloadBlob(blob, file);
    const phone = waNumber(f.phone);
    window.open(phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    toast("ছবি ডাউনলোড হয়েছে — খোলা চ্যাটে 📎 দিয়ে ছবিটি অ্যাটাচ করে পাঠান");
  }

  return (
    <div className={`${styles.overlay} ${styles.overlayCenter}`} onClick={onClose}>
      <div className={styles.certModal} onClick={(ev) => ev.stopPropagation()} role="dialog" aria-label="Custom certificate" lang="en">
        <div className={styles.formHead}>
          <h3><Award size={18} /> Custom Certificate <span className={styles.certNo}>{no}</span></h3>
          <button className={styles.iconBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>

        <div className={styles.certBody}>
          <div className={styles.certPreview}>
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="Certificate preview" />
            ) : (
              <div className={styles.certLoading}>{error ? "Could not render the preview" : "Rendering preview…"}</div>
            )}
          </div>

          <div className={styles.certSide}>
            <p className={styles.hint} style={{ margin: 0 }}>
              Not saved anywhere — download or send it before closing. Everything on the certificate must be in English.
            </p>

            <label className={styles.fField}>
              <span>Full name *</span>
              <input value={f.name} onChange={set("name")} maxLength={80} placeholder="e.g. Tahsan Tahsin" autoFocus />
            </label>
            <label className={styles.fField}>
              <span>Course *</span>
              <CoursePicker value={f.course} onChange={(v) => setF((s) => ({ ...s, course: v }))} />
            </label>
            <div className={styles.trainInputs}>
              <label className={styles.fField}>
                <span>Training start</span>
                <input type="date" value={f.from} onChange={set("from")} />
              </label>
              <label className={styles.fField}>
                <span>Training end</span>
                <input type="date" value={f.to} min={f.from || undefined} onChange={set("to")} />
              </label>
            </div>
            <label className={styles.fField}>
              <span>Date of issue</span>
              <input type="date" value={f.issued} onChange={set("issued")} />
            </label>
            <label className={styles.fField}>
              <span>Description line (optional)</span>
              <textarea rows={2} value={f.line} onChange={set("line")} maxLength={140} placeholder={DEFAULT_LINE} />
            </label>

            {notEnglish && <div className={styles.formError}>Please write everything in English.</div>}
            {badDates && <div className={styles.formError}>Training start can&apos;t be after the end date.</div>}

            <div className={styles.dSection}>Send / save</div>
            <label className={styles.fField}>
              <span>WhatsApp number (optional)</span>
              <input value={f.phone} onChange={set("phone")} inputMode="tel" placeholder="01XXXXXXXXX" />
            </label>
            <button className={styles.waBtn} onClick={sendWhatsApp} disabled={!ready}>
              <MessageCircle size={17} /> Send on WhatsApp
            </button>
            <div className={styles.certActions}>
              <button className={styles.ghostBtn} onClick={() => blob && downloadBlob(blob, file)} disabled={!ready}>
                <Download size={14} /> Download PNG
              </button>
              <button className={styles.ghostBtn} onClick={() => blob && shareImage(blob, file, message)} disabled={!ready}>
                <Share2 size={14} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
