import { CalendarCheck, Car, MessageCircle, Trophy } from "lucide-react";
import { process } from "@/content/copy";
import { digits, t, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Process.module.css";

const icons = [MessageCircle, CalendarCheck, Car, Trophy];

export function Process({ lang }: { lang: Lang }) {
  return (
    <section id="process" className="section section--alt" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading lang={lang} id="process-title" eyebrow={process.eyebrow} title={process.title} center />

        <ol className={styles.timeline}>
          {process.steps.map((s, i) => {
            const I = icons[i];
            return (
              <li key={s.title.en} className={styles.step} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className={styles.dot}>
                  <I aria-hidden="true" />
                  <span className={styles.num}>{digits(i + 1, lang)}</span>
                </span>
                <div className={`card ${styles.body}`}>
                  <h3>{t(s.title, lang)}</h3>
                  <p className="muted">{t(s.desc, lang)}</p>
                </div>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}
