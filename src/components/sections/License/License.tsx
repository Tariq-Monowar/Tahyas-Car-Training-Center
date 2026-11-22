import { ArrowRight, BookOpenCheck, ClipboardCheck, FileText, IdCard, Route } from "lucide-react";
import { license } from "@/content/copy";
import { digits, t, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./License.module.css";

const icons = [FileText, ClipboardCheck, Route, IdCard];

/** General BRTA overview — no fees, no guarantees. Toggle in site.features.licenseGuide. */
export function License({ lang }: { lang: Lang }) {
  return (
    <section id="license" className="section" aria-labelledby="license-title">
      <div className="container">
        <SectionHeading lang={lang} id="license-title" eyebrow={license.eyebrow} title={license.title} center />
        <ol className={styles.steps}>
          {license.steps.map((s, i) => {
            const I = icons[i];
            return (
              <li key={s.title.en} className={`card ${styles.step}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className={styles.n}>{digits(i + 1, lang)}</span>
                <I aria-hidden="true" className={styles.icon} />
                <h3>{t(s.title, lang)}</h3>
                <p className="muted">{t(s.desc, lang)}</p>
              </li>
            );
          })}
        </ol>
        <a href={lang === "bn" ? "/license" : "/en/license"} className={styles.guide} data-reveal>
          <span className={styles.guideIcon}><BookOpenCheck aria-hidden="true" /></span>
          <span className={styles.guideText}>
            <strong>{t(license.fullGuide, lang)}</strong>
            <span>{t(license.fullGuideSub, lang)}</span>
          </span>
          <span className={styles.guideArrow}><ArrowRight aria-hidden="true" /></span>
        </a>
      </div>
    </section>
  );
}
