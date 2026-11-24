"use client";
import { Printer } from "lucide-react";
import styles from "./confirm.module.css";

export default function PrintButton() {
  return (
    <button className={styles.btnPrint} onClick={() => window.print()}>
      <Printer size={17} /> মুদ্রণ / PDF সংরক্ষণ
    </button>
  );
}
