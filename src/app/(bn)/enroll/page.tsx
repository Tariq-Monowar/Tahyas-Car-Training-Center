import { PageShell } from "@/components/layout/PageShell";
import { GraduationCap } from "lucide-react";
import EnrollForm from "./EnrollForm";
import styles from "./enroll.module.css";

export const metadata = { title: "ভর্তির আবেদন | তাহয়াস কার ট্রেনিং সেন্টার" };

export default function EnrollPage() {
  return (
    <PageShell lang="bn">
      <div className={styles.page}>
        <div className={styles.wrap}>
          <div className={styles.hero}>
            <div className={styles.badge}>
              <GraduationCap size={15} /> ভর্তি আবেদন
            </div>
            <h1>তাহয়াস কার ট্রেনিং সেন্টারে ভর্তি হন</h1>
            <p>ফর্মটি পূরণ করুন — আমরা শীঘ্রই যোগাযোগ করব এবং সময় নিশ্চিত করব।</p>
          </div>
          <div className={styles.card}>
            <EnrollForm />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
