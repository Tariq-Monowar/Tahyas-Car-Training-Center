import { ArrowRight, BadgeCheck } from "lucide-react";
import { site } from "@/config/site";
import { women } from "@/content/copy";
import { Media } from "@/components/ui/Media";
import { waLink } from "@/lib/whatsapp";
import { t, type Lang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import styles from "./Women.module.css";

export function Women({ lang }: { lang: Lang }) {
  return (
    <section className="section section--alt" aria-labelledby="women-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.visual} data-reveal>
          <div className={`photo ${styles.photo}`}>
            <Media
              slot="women" objectPosition="38% center"
              alt={lang === "bn" ? "একজন তরুণী শান্তভাবে গাড়ি চালাচ্ছেন, পাশে সবুজ মাঠ" : "A young woman calmly driving beside green fields"}
              sizes="(min-width: 900px) 40vw, 92vw"
            />
          </div>
        </div>

        <div>
          <div className="heading" data-reveal>
            <p className="eyebrow">{t(women.eyebrow, lang)}</p>
            <h2 id="women-title">{t(women.title, lang)}</h2>
            <p>{t(women.lead, lang)}</p>
          </div>

          {site.women.femaleTrainerAvailable && (
            <p className={styles.available} data-reveal><BadgeCheck aria-hidden="true" /> {t(women.femaleTrainer, lang)}</p>
          )}

          <ul className={styles.points}>
            {women.points.map((p, i) => (
              <li key={p.title.en} className={`glass ${styles.point}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="icon-badge icon-badge--teal"><Icon name={p.icon} /></span>
                <div>
                  <h3>{t(p.title, lang)}</h3>
                  <p className="muted">{t(p.desc, lang)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.cta} data-reveal>
            <a href={waLink(lang, women.message)} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {t(women.cta, lang)} <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
