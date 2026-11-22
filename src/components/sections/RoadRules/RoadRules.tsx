import { ArrowRight, CircleCheck, Signpost } from "lucide-react";
import { roadRules as R } from "@/content/roadRules";
import { digits, t, type Lang } from "@/lib/i18n";
import { RoadSign } from "@/components/road/Signs";
import { TrafficLight } from "@/components/road/TrafficLight";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./RoadRules.module.css";

/** Home teaser: interactive traffic light, key signs, 3 rules + link to the full /road-rules page. */
export function RoadRules({ lang }: { lang: Lang }) {
  const allSigns = R.groups.flatMap((g) => g.signs.map((s) => ({ ...s, group: g.id, groupName: g.name })));
  const signs = R.homeSigns.map((k) => allSigns.find((s) => s.kind === k)!).filter(Boolean);
  const total = allSigns.length;
  const lights = {
    red: { name: t(R.lights.red.name, lang), meaning: t(R.lights.red.meaning, lang) },
    yellow: { name: t(R.lights.yellow.name, lang), meaning: t(R.lights.yellow.meaning, lang) },
    green: { name: t(R.lights.green.name, lang), meaning: t(R.lights.green.meaning, lang) },
  };
  const href = lang === "bn" ? "/road-rules" : "/en/road-rules";

  return (
    <section id="road-rules" className={`section ${styles.section}`} aria-labelledby="rr-title">
      <div className={styles.roadStrip} aria-hidden="true"><span /></div>
      <div className="container">
        <SectionHeading lang={lang} id="rr-title" eyebrow={R.eyebrow} title={R.homeTitle} lead={R.homeLead} center />

        <div className={styles.grid}>
          <div className={styles.lightCard} data-reveal>
            <div className={styles.cardHead}>
              <span className={styles.badge}>{digits(1, lang)}</span>
              <h3>{t(R.lightsTitle, lang)}</h3>
            </div>
            <TrafficLight items={lights} hint={t(R.tapLight, lang)} />
            <ul className={styles.rules}>
              {R.quickRules.map((r) => (
                <li key={r.en}><CircleCheck aria-hidden="true" /> {t(r, lang)}</li>
              ))}
            </ul>
          </div>

          <div className={styles.signsCard} data-reveal>
            <div className={styles.cardHead}>
              <span className={styles.badge}>{digits(2, lang)}</span>
              <h3>{t(R.signsTitle, lang)}</h3>
            </div>
            <ul className={styles.legend}>
              {R.groups.map((g) => (
                <li key={g.id} data-group={g.id}>{t(g.name, lang)}</li>
              ))}
            </ul>
            <ul className={styles.signs}>
              {signs.map((s, i) => (
                <li key={s.kind} className={styles.sign} data-group={s.group} style={{ "--i": i } as React.CSSProperties}>
                  <span className={styles.signPlate}><RoadSign kind={s.kind} label={t(s.name, lang)} size={64} /></span>
                  <span className={styles.signName}>{t(s.name, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a href={href} className={styles.more} data-reveal>
          <span className={styles.moreIcon}><Signpost aria-hidden="true" /></span>
          <span className={styles.moreText}>
            <strong>{t(R.fullPage, lang)}</strong>
            <span>{t(R.fullPageSub, lang).replace("{n}", digits(total, lang))}</span>
          </span>
          <span className={styles.moreArrow}><ArrowRight aria-hidden="true" /></span>
        </a>
      </div>
    </section>
  );
}
