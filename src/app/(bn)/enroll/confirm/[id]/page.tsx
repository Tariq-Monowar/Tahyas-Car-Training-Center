import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import styles from "./confirm.module.css";
import PrintButton from "./PrintButton";

export const metadata = { title: "আবেদন প্রমাণপত্র | তাহয়াস কার ট্রেনিং সেন্টার" };

const statusLabel: Record<string, string> = { pending: "অপেক্ষমান", confirmed: "নিশ্চিত", cancelled: "বাতিল" };
const genderLabel: Record<string, string> = { male: "পুরুষ", female: "নারী", other: "অন্যান্য" };

export default async function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const doc = await Enrollment.findById(id).lean();
  if (!doc) notFound();

  const date = new Date(doc.createdAt).toLocaleDateString("bn-BD", { dateStyle: "long" });
  const dateEn = new Date(doc.createdAt).toLocaleDateString("en-US", { dateStyle: "long" });
  const status = doc.status ?? "pending";
  const refNo = id.slice(-8).toUpperCase();

  return (
    <div className={styles.page}>

      {/* ── Action bar (screen only) ── */}
      <div className={styles.actions}>
        <div className={styles.actionsLeft}>
          <a href="/" className={styles.btnNav}>← হোম</a>
          <a href="/enroll" className={styles.btnNav}>+ নতুন আবেদন</a>
        </div>
        <PrintButton />
      </div>

      {/* ── Certificate ── */}
      <div className={styles.cert} id="certificate">

        {/* Outer border frame */}
        <div className={styles.frame}>

          {/* Inner content */}
          <div className={styles.inner}>

            {/* ── Organization header ── */}
            <div className={styles.orgSection}>
              <div className={styles.orgSeal}>
                <div className={styles.sealRing}>
                  <span className={styles.sealEmoji}>🚗</span>
                </div>
              </div>
              <h1 className={styles.orgTitle}>তাহয়াস কার ট্রেনিং সেন্টার</h1>
              <p className={styles.orgSubtitle}>TAHYAS CAR TRAINING CENTER</p>
              <p className={styles.orgAddress}>দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর · স্থাপিত ২০২৩</p>
            </div>

            {/* ── Gold divider ── */}
            <div className={styles.goldDivider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerOrn}>✦ ✦ ✦</span>
              <span className={styles.dividerLine} />
            </div>

            {/* ── Certificate title ── */}
            <div className={styles.certTitleSection}>
              <p className={styles.certTitleBn}>ভর্তি আবেদন প্রমাণপত্র</p>
              <p className={styles.certTitleEn}>CERTIFICATE OF ENROLLMENT</p>
            </div>

            {/* ── Attestation text ── */}
            <p className={styles.attestText}>
              এই মর্মে প্রমাণ করা যাইতেছে যে,
            </p>

            {/* ── Name block ── */}
            <div className={styles.nameBlock}>
              <div className={styles.nameUnderline} />
              <p className={styles.nameValue}>{doc.name}</p>
              <div className={styles.nameUnderline} />
            </div>

            {/* ── Course statement ── */}
            <p className={styles.courseStatement}>
              তাহয়াস কার ট্রেনিং সেন্টারে যানবাহন চালনা প্রশিক্ষণের জন্য
              সফলভাবে ভর্তির আবেদন সম্পন্ন করিয়াছেন।
            </p>

            {/* ── Course highlight ── */}
            <div className={styles.courseBox}>
              <span className={styles.courseLabel}>নির্বাচিত কোর্স</span>
              <span className={styles.courseValue}>{doc.course}</span>
            </div>

            {/* ── Details row ── */}
            <div className={styles.detailsRow}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>মোবাইল নম্বর</span>
                <span className={styles.detailVal}>{doc.phone}</span>
              </div>
              {doc.email && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>ইমেইল ঠিকানা</span>
                  <span className={styles.detailVal}>{doc.email}</span>
                </div>
              )}
              {doc.age && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>বয়স</span>
                  <span className={styles.detailVal}>{doc.age} বছর</span>
                </div>
              )}
              {doc.gender && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>লিঙ্গ</span>
                  <span className={styles.detailVal}>{genderLabel[doc.gender] ?? doc.gender}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>আবেদনের তারিখ</span>
                <span className={styles.detailVal}>{date}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>অবস্থা</span>
                <span className={styles.detailVal}>
                  <span className={`${styles.statusBadge} ${styles[status]}`}>
                    {statusLabel[status] ?? status}
                  </span>
                </span>
              </div>
            </div>

            {/* ── Bottom divider ── */}
            <div className={styles.goldDivider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerOrn}>✦ ✦ ✦</span>
              <span className={styles.dividerLine} />
            </div>

            {/* ── Footer: seal + ref + signature ── */}
            <div className={styles.certBottom}>

              {/* Official seal */}
              <div className={styles.bottomSeal}>
                <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <path id="topText" d="M 12,60 A 48,48 0 0,1 108,60" />
                    <path id="bottomText" d="M 18,72 A 44,44 0 0,0 102,72" />
                  </defs>
                  {/* Outer solid ring */}
                  <circle cx="60" cy="60" r="57" fill="none" stroke="#c8a827" strokeWidth="1.5"/>
                  {/* Dashed decorative ring */}
                  <circle cx="60" cy="60" r="51" fill="none" stroke="#c8a827" strokeWidth="1" strokeDasharray="4 3" opacity="0.7"/>
                  {/* Inner solid ring */}
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#c8a827" strokeWidth="1.5"/>
                  {/* Background fill */}
                  <circle cx="60" cy="60" r="44" fill="#fdf9ed"/>

                  {/* Top curved text — Bengali */}
                  <text fontSize="7.5" fontWeight="700" fill="#6b5030" letterSpacing="1.5">
                    <textPath href="#topText" startOffset="5%">তাহয়াস কার ট্রেনিং সেন্টার</textPath>
                  </text>

                  {/* Bottom curved text — English */}
                  <text fontSize="6.5" fontWeight="600" fill="#c8a827" letterSpacing="2.5">
                    <textPath href="#bottomText" startOffset="10%">LAKSHMIPUR · BANGLADESH</textPath>
                  </text>

                  {/* Center car emoji */}
                  <text x="60" y="58" textAnchor="middle" fontSize="26" dominantBaseline="middle">🚗</text>

                  {/* CERTIFIED text */}
                  <text x="60" y="78" textAnchor="middle" fontSize="7" fontWeight="800" fill="#0b1324" letterSpacing="3" textDecoration="none">CERTIFIED</text>

                  {/* Small dots at sides */}
                  <circle cx="12" cy="60" r="2.5" fill="#c8a827"/>
                  <circle cx="108" cy="60" r="2.5" fill="#c8a827"/>
                </svg>
                <p className={styles.sealText}>অনুমোদিত সীল</p>
              </div>

              {/* Ref info (center) */}
              <div className={styles.bottomCenter}>
                <p className={styles.refLabel}>Ref. No.</p>
                <p className={styles.refVal}>{refNo}</p>
                <p className={styles.refDate}>{dateEn}</p>
                <p className={styles.contactLine}>📞 ০১৩২০৩৮১৩৫৬ · লক্ষ্মীপুর, বাংলাদেশ</p>
              </div>

              {/* Signature */}
              <div className={styles.signatureArea}>
                <div className={styles.signatureStamp}>
                  <span className={styles.signatureScriptBn}>তাহয়াস কার ট্রেনিং সেন্টার</span>
                  <span className={styles.signatureScriptEn}>Tahyas Car Training Center</span>
                </div>
                <div className={styles.signatureLine} />
                <p className={styles.signatureTitle}>অনুমোদনকারী কর্তৃপক্ষ</p>
                <p className={styles.signatureOrg}>তাহয়াস কার ট্রেনিং সেন্টার</p>
              </div>


            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
