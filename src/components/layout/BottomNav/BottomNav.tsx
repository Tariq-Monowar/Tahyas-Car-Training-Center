"use client";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";

const items = [
  { href: "/#courses",  icon: "🎓", label: "কোর্স" },
  { href: "/#location", icon: "📍", label: "ঠিকানা" },
  { href: "/enroll",    icon: "📝", label: "আবেদন", cta: true },
  { href: "/#faq",      icon: "💬", label: "প্রশ্ন" },
  { href: "https://wa.me/8801320381356", icon: "📞", label: "যোগাযোগ", external: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const isEnroll = pathname.includes("/enroll");

  return (
    <nav className={styles.nav} aria-label="Quick navigation">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={`${styles.item} ${item.cta ? styles.cta : ""} ${isEnroll && item.cta ? styles.active : ""}`}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          aria-label={item.label}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
