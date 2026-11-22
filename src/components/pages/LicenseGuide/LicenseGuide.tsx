import {
  AlertTriangle, BadgeCheck, Camera, ChevronDown, CircleCheck, ExternalLink, GraduationCap, IdCard, Info, MapPin, Receipt, Stethoscope,
} from "lucide-react";
import { licensePage as L } from "@/content/license";
import { homePath, digits, t, type Lang } from "@/lib/i18n";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import styles from "./LicenseGuide.module.css";

const docIcons = { id: IdCard, photo: Camera, medical: Stethoscope, address: MapPin, edu: GraduationCap, fee: Receipt };

/** Full page: how to get a driving licence in Bangladesh (BRTA), written for Lakshmipur learners. */
export function LicenseGuide({ lang }: { lang: Lang }) {
  return (
    <>
      {/* Intro */}
      <section className={styles.intro} aria-labelledby="lg-title">
        <div className="container">
          <nav aria-label="breadcrumb" className={styles.crumbs}>
            <a href={homePath(lang)}>{t(L.crumbHome, lang)}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t(L.crumb, lang)}</span>
          </nav>
          <p className="eyebrow">{t(L.eyebrow, lang)}</p>
          <h1 id="lg-title" className={styles.title}>{t(L.title, lang)}</h1>
          <p className={styles.lead}>{t(L.lead, lang)}</p>

          <dl className={styles.facts}>
            {L.facts.map((f) => (
              <div key={f.k.en} className={`glass ${styles.fact}`}>
                <dt>{t(f.k, lang)}</dt>
                <dd>{t(f.v, lang)}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.ageNote}><Info aria-hidden="true" /> {t(L.ageNote, lang)}</p>
        </div>
      </section>

      {/* Documents */}
      <section className="section section--alt" aria-labelledby="lg-docs">
        <div className="container">
          <div className="heading">
            <h2 id="lg-docs">{t(L.docsTitle, lang)}</h2>
            <p>{t(L.docsLead, lang)}</p>
          </div>
          <ul className={styles.docs}>
            {L.docs.map((d, i) => {
              const I = docIcons[d.icon];
              return (
                <li key={d.title.en} className={`card ${styles.doc}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
                  <span className="icon-badge"><I aria-hidden="true" /></span>
                  <div>
                    <h3>{t(d.title, lang)}</h3>
                    <p className="muted">{t(d.desc, lang)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Steps */}
      <section className="section" aria-labelledby="lg-steps">
        <div className="container">
          <div className="heading">
            <h2 id="lg-steps">{t(L.stepsTitle, lang)}</h2>
          </div>
          <ol className={styles.steps}>
            {L.steps.map((s, i) => (
              <li key={s.title.en} className={styles.step} data-reveal>
                <span className={styles.num}>{digits(i + 1, lang)}</span>
                <div className={`card ${styles.stepBody}`}>
                  <h3>{t(s.title, lang)}</h3>
                  <p>{t(s.body, lang)}</p>
                  <p className={styles.tip}><BadgeCheck aria-hidden="true" /> {t(s.tip, lang)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Checklist + mistakes */}
      <section className="section section--alt" aria-label={t(L.checklistTitle, lang)}>
        <div className={`container ${styles.twoCol}`}>
          <div className={`card ${styles.list}`} data-reveal>
            <h2>{t(L.checklistTitle, lang)}</h2>
            <ul>
              {L.checklist.map((c) => (
                <li key={c.en}><CircleCheck aria-hidden="true" className={styles.ok} /> {t(c, lang)}</li>
              ))}
            </ul>
          </div>
          <div className={`card ${styles.list}`} data-reveal>
            <h2>{t(L.mistakesTitle, lang)}</h2>
            <ul>
              {L.mistakes.map((c) => (
                <li key={c.en}><AlertTriangle aria-hidden="true" className={styles.warn} /> {t(c, lang)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How we help */}
      <section className="section" aria-labelledby="lg-help">
        <div className="container">
          <div className={styles.help} data-reveal>
            <div>
              <h2 id="lg-help">{t(L.helpTitle, lang)}</h2>
              <ul>
                {L.help.map((h) => (
                  <li key={h.en}><CircleCheck aria-hidden="true" /> {t(h, lang)}</li>
                ))}
              </ul>
              <p className={styles.helpNote}>{t(L.helpNote, lang)}</p>
            </div>
            <WhatsAppButton lang={lang} size="lg" message={L.ctaMessage} />
          </div>
        </div>
      </section>

      {/* FAQ + official links */}
      <section className="section section--alt" aria-labelledby="lg-faq">
        <div className={`container ${styles.faqWrap}`}>
          <h2 id="lg-faq">{t(L.faqTitle, lang)}</h2>
          <div className={styles.faq}>
            {L.faqs.map((f) => (
              <details key={f.q.en} name="lg-faq">
                <summary><span>{t(f.q, lang)}</span><ChevronDown aria-hidden="true" /></summary>
                <p>{t(f.a, lang)}</p>
              </details>
            ))}
          </div>

          <h2 className={styles.officialTitle}>{t(L.officialTitle, lang)}</h2>
          <ul className={styles.official}>
            {L.official.map((o) => (
              <li key={o.href}>
                <a href={o.href} target="_blank" rel="noopener noreferrer">{t(o.label, lang)} <ExternalLink aria-hidden="true" /></a>
              </li>
            ))}
          </ul>
          <p className={styles.disclaimer}><Info aria-hidden="true" /> {t(L.updatedNote, lang)}</p>
        </div>
      </section>
    </>
  );
}
