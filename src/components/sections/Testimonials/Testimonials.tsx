import { Quote } from "lucide-react";
import { site } from "@/config/site";
import { testimonials as copy } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Testimonials.module.css";

/** Hidden until REAL reviews are added in src/config/site.ts → testimonials. */
export function Testimonials({ lang }: { lang: Lang }) {
  if (site.testimonials.length === 0) return null;
  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="container">
        <SectionHeading lang={lang} id="reviews-title" eyebrow={copy.eyebrow} title={copy.title} center />
        <ul className={styles.grid}>
          {site.testimonials.map((r, i) => (
            <li key={r.name + i} className={`glass ${styles.card}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <Quote aria-hidden="true" className={styles.quote} />
              <blockquote>{t(r.text, lang)}</blockquote>
              <p className={styles.name}>— {r.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
