import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
import { PageShell } from "@/components/layout/PageShell";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import styles from "./confirm.module.css";
import PrintButton from "./PrintButton";

export const metadata = { title: "আবেদন প্রমাণপত্র | তাহয়াস কার ট্রেনিং সেন্টার" };

const statusLabel: Record<string, string> = { pending: "অপেক্ষমান", confirmed: "নিশ্চিত", cancelled: "বাতিল" };

export default async function ConfirmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const doc = await Enrollment.findById(id).lean();
  if (!doc) notFound();

  const date = new Date(doc.createdAt).toLocaleDateString("bn-BD", { dateStyle: "long" });
  const status = doc.status ?? "pending";

  return (
    <PageShell lang="bn">
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.actions}>
            <PrintButton />
            <a href="/enroll" className={styles.btnBack}>← আরেকটি আবেদন</a>
            <a href="/" className={styles.btnBack}>হোম পেজ</a>
          </div>

          <div className={styles.cert} id="certificate">
            {/* Header */}
            <div className={styles.certHeader}>
              <div className={styles.certLogo}>🚗</div>
              <h1 className={styles.certTitle}>তাহয়াস কার ট্রেনিং সেন্টার</h1>
              <p className={styles.certSub}>দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর, লক্ষ্মীপুর</p>
              <div className={styles.certBadge}>✅ ভর্তির আবেদন প্রমাণপত্র</div>
            </div>

            {/* Body */}
            <div className={styles.certBody}>
              <p className={styles.certHeading}>আবেদনের বিবরণ</p>
              <table className={styles.certTable}>
                <tbody>
                  <tr>
                    <td>আবেদনকারীর নাম</td>
                    <td>{doc.name}</td>
                  </tr>
                  <tr>
                    <td>মোবাইল নম্বর</td>
                    <td>{doc.phone}</td>
                  </tr>
                  {doc.email && (
                    <tr>
                      <td>ইমেইল</td>
                      <td>{doc.email}</td>
                    </tr>
                  )}
                  <tr>
                    <td>নির্বাচিত কোর্স</td>
                    <td>{doc.course}</td>
                  </tr>
                  {doc.age && (
                    <tr>
                      <td>বয়স</td>
                      <td>{doc.age} বছর</td>
                    </tr>
                  )}
                  <tr>
                    <td>আবেদনের তারিখ</td>
                    <td>{date}</td>
                  </tr>
                  <tr>
                    <td>অবস্থা</td>
                    <td>
                      <span className={`${styles.certStatus} ${styles[status]}`}>
                        {statusLabel[status] ?? status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>আবেদন নং</td>
                    <td className={styles.certId}>{String(doc._id)}</td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.certFooter}>
                <div className={styles.certFooterLeft}>
                  <p>এই প্রমাণপত্রটি ভর্তির আবেদনের নিশ্চিতকরণ।</p>
                  <p>যোগাযোগ: 01320381356 (WhatsApp)</p>
                </div>
                <div className={styles.certSeal}>
                  <div className={styles.certSealCircle}>তাহয়াস কার ট্রেনিং সেন্টার</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
