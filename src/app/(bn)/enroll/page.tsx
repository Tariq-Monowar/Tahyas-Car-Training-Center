import { PageShell } from "@/components/layout/PageShell";
import EnrollForm from "./EnrollForm";
import styles from "./enroll.module.css";

export const metadata = { title: "ভর্তির আবেদন | তাহয়াস কার ট্রেনিং সেন্টার" };

export default function EnrollPage() {
  return (
    <PageShell lang="bn">
      <div className={styles.section}>
        <EnrollForm />
      </div>
    </PageShell>
  );
}
