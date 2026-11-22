import { ArrowRight, Check, Clock } from "lucide-react";
import { site } from "@/config/site";
import { courses } from "@/content/copy";
import { Media } from "@/components/ui/Media";
import type { SceneName } from "@/components/illustrations/Scenes";
import { waLink } from "@/lib/whatsapp";
import { t, type Lang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Courses.module.css";

/** Keep the useful part of each photo inside the 16:10 card. */
const focus: Record<string, string> = {
  basic: "center",
  advance: "center",
  parking: "62% center",
  highway: "center",
  women: "center",
};

export function Courses({ lang }: { lang: Lang }) {
  return (
    <section id="courses" className="section" aria-labelledby="courses-title">
      <div className="container">
        <SectionHeading lang={lang} id="courses-title" eyebrow={courses.eyebrow} title={courses.title} lead={courses.lead} center />

        <ul className={styles.grid}>
          {site.courses.map((c, i) => {
            const title = t(c.title, lang);
            return (
              <li key={c.id} className={`card lift ${styles.card}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <div className={`photo ${styles.media}`} data-variant={c.id}>
                  <Media slot={`course-${c.id}` as SceneName} alt={title} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" objectPosition={focus[c.id]} />
                </div>
                <span className={`icon-badge ${styles.badge}`}><Icon name={c.icon} /></span>

                <div className={styles.body}>
                  <div className={styles.titleRow}>
                    <h3>{title}</h3>
                    {c.badge && <span className={styles.tag}>{t(c.badge, lang)}</span>}
                  </div>
                  <p className="muted">{t(c.desc, lang)}</p>

                  <p className={styles.learnTitle}>{t(courses.youLearn, lang)}</p>
                  <ul className={styles.learn}>
                    {c.learn.map((l) => (
                      <li key={l.en}><Check aria-hidden="true" /> {t(l, lang)}</li>
                    ))}
                  </ul>

                  <p className={styles.duration}><Clock aria-hidden="true" /> {t(c.duration, lang)}</p>
                  <a href={waLink(lang, courses.message(title))} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                    {t(courses.details, lang)} <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
