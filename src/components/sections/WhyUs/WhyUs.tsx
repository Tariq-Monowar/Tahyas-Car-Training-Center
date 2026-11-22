import { site } from "@/config/site";
import { Media } from "@/components/ui/Media";
import { roadmap, whyUs } from "@/content/copy";
import { digits, t, type Lang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SteeringWheel } from "./SteeringWheel";
import styles from "./WhyUs.module.css";

export function WhyUs({ lang }: { lang: Lang }) {
  // Honest numbers only — derived from the config, never invented.
  const stats = [
    { value: site.courses.length, label: whyUs.stats.courses },
    { value: roadmap.items.length, label: whyUs.stats.steps },
    { value: site.pricing.discount, label: whyUs.stats.discount, prefix: "৳" },
    ...(site.studentsTrained ? [{ value: site.studentsTrained, label: whyUs.stats.students, suffix: "+" }] : []),
  ];

  return (
    <section id="why-us" className="section" aria-labelledby="why-title">
      <SteeringWheel className={styles.wheel} />
      <div className="container">
        <SectionHeading lang={lang} id="why-title" eyebrow={whyUs.eyebrow} title={whyUs.title} center />

        <ul className={styles.bento}>
          {whyUs.items.map((item, i) => (
            <li key={item.title.en} className={`glass lift ${styles.tile}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
              {i === 0 && <Media slot="why" alt="" objectPosition="center" sizes="(min-width: 1024px) 50vw, 92vw" className={styles.tileImg} />}
              <span className={`icon-badge${i % 3 === 2 ? " icon-badge--teal" : ""}`}><Icon name={item.icon} /></span>
              <h3>{t(item.title, lang)}</h3>
              <p className="muted">{t(item.desc, lang)}</p>
            </li>
          ))}
        </ul>

        <dl className={styles.stats} data-reveal>
          {stats.map((s) => (
            <div key={s.label.en} className={styles.stat}>
              <dt className="sr-only">{t(s.label, lang)}</dt>
              <dd>
                <strong>
                  {s.prefix}
                  <span data-count={s.value} data-lang={lang}>{digits(s.value.toLocaleString("en-IN"), lang)}</span>
                  {s.suffix}
                </strong>
                <span aria-hidden="true">{t(s.label, lang)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
