import { CircleCheck, Flag, Footprints, Sparkles } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { journey } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import styles from "./Journey.module.css";

const icons = [Footprints, Sparkles, Flag];

/** "From nervous to confident" story band + what happens in the first class. */
export function Journey({ lang }: { lang: Lang }) {
  return (
    <section className="section" aria-labelledby="journey-title">
      <div className={`container ${styles.inner}`}>
        <div>
          <div className="heading" data-reveal>
            <p className="eyebrow">{t(journey.eyebrow, lang)}</p>
            <h2 id="journey-title">{t(journey.title, lang)}</h2>
          </div>
          <ol className={styles.steps}>
            {journey.steps.map((s, i) => {
              const I = icons[i];
              return (
                <li key={s.title.en} className={styles.step} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  <span className={styles.icon} data-level={i}><I aria-hidden="true" /></span>
                  <div>
                    <h3>{t(s.title, lang)}</h3>
                    <p className="muted">{t(s.desc, lang)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <aside className={`glass ${styles.first}`} data-reveal aria-labelledby="first-class-title">
          <div className={`photo ${styles.pic}`}>
            <Media slot="journey" alt="" objectPosition="center 48%" sizes="(min-width: 900px) 35vw, 92vw" />
          </div>
          <h3 id="first-class-title">{t(journey.firstClassTitle, lang)}</h3>
          <ul>
            {journey.firstClass.map((f) => (
              <li key={f.en}><CircleCheck aria-hidden="true" /> {t(f, lang)}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
