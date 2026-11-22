import { CircleCheck, Hand, Info, Scale } from "lucide-react";
import { roadRules as R } from "@/content/roadRules";
import { digits, homePath, t, type Lang } from "@/lib/i18n";
import { LaneDiagram } from "@/components/road/LaneDiagram";
import { Marking } from "@/components/road/Marking";
import { RoadSign } from "@/components/road/Signs";
import { TrafficLight } from "@/components/road/TrafficLight";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import road from "@/components/road/Road.module.css";
import styles from "./RoadRulesGuide.module.css";

/** Full page: traffic lights, all signs, lane position, markings, police signals and key road law. */
export function RoadRulesGuide({ lang }: { lang: Lang }) {
  const lights = {
    red: { name: t(R.lights.red.name, lang), meaning: t(R.lights.red.meaning, lang) },
    yellow: { name: t(R.lights.yellow.name, lang), meaning: t(R.lights.yellow.meaning, lang) },
    green: { name: t(R.lights.green.name, lang), meaning: t(R.lights.green.meaning, lang) },
  };
  const toc = [
    { id: "lights", label: R.lightsTitle },
    { id: "signs", label: R.signsTitle },
    { id: "lane", label: R.laneTitle },
    { id: "markings", label: R.markingsTitle },
    { id: "police", label: R.policeTitle },
    { id: "law", label: R.lawTitle },
  ];

  return (
    <>
      <section className={styles.intro} aria-labelledby="rr-page-title">
        <div className="container">
          <nav aria-label="breadcrumb" className={styles.crumbs}>
            <a href={homePath(lang)}>{lang === "bn" ? "হোম" : "Home"}</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t(R.crumb, lang)}</span>
          </nav>
          <p className="eyebrow">{t(R.eyebrow, lang)}</p>
          <h1 id="rr-page-title" className={styles.title}>{t(R.title, lang)}</h1>
          <p className={styles.lead}>{t(R.lead, lang)}</p>
          <nav className={styles.toc} aria-label={lang === "bn" ? "এই পেজে" : "On this page"}>
            {toc.map((x, i) => (
              <a key={x.id} href={`#${x.id}`}><span>{digits(i + 1, lang)}</span> {t(x.label, lang)}</a>
            ))}
          </nav>
        </div>
      </section>

      {/* 1. Lights */}
      <section id="lights" className="section section--alt" aria-labelledby="h-lights">
        <div className="container">
          <h2 id="h-lights" className={styles.h2} data-num={digits(1, lang)}>{t(R.lightsTitle, lang)}</h2>
          <div className={`card ${styles.box}`}>
            <TrafficLight items={lights} hint={t(R.tapLight, lang)} />
          </div>
          <p className={styles.note}><Info aria-hidden="true" /> {t(R.lightsNote, lang)}</p>
        </div>
      </section>

      {/* 2. Signs */}
      <section id="signs" className="section" aria-labelledby="h-signs">
        <div className="container">
          <h2 id="h-signs" className={styles.h2} data-num={digits(2, lang)}>{t(R.signsTitle, lang)}</h2>
          <p className={styles.sub}>{t(R.signsLead, lang)}</p>
          {R.groups.map((g) => (
            <div key={g.id} className={styles.group} data-group={g.id}>
              <div className={styles.groupHead}>
                <h3>{t(g.name, lang)}</h3>
                <p>{t(g.hint, lang)}</p>
              </div>
              <ul className={styles.signs}>
                {g.signs.map((s) => (
                  <li key={s.kind} className={road.signCard}>
                    <RoadSign kind={s.kind} label={t(s.name, lang)} size={76} />
                    <span className={road.signName}>{t(s.name, lang)}</span>
                    <span className={road.signMeaning}>{t(s.meaning, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Lane */}
      <section id="lane" className="section section--alt" aria-labelledby="h-lane">
        <div className={`container ${styles.laneGrid}`}>
          <div>
            <h2 id="h-lane" className={styles.h2} data-num={digits(3, lang)}>{t(R.laneTitle, lang)}</h2>
            <p className={styles.sub}>{t(R.laneLead, lang)}</p>
            <ul className={styles.list}>
              {R.laneRules.map((r) => (
                <li key={r.en}><CircleCheck aria-hidden="true" /> {t(r, lang)}</li>
              ))}
            </ul>
          </div>
          <div className={`card ${styles.box}`}>
            <LaneDiagram you={t(R.laneDiagram.you, lang)} overtake={t(R.laneDiagram.overtake, lang)} oncoming={t(R.laneDiagram.oncoming, lang)} />
          </div>
        </div>
      </section>

      {/* 4. Markings */}
      <section id="markings" className="section" aria-labelledby="h-markings">
        <div className="container">
          <h2 id="h-markings" className={styles.h2} data-num={digits(4, lang)}>{t(R.markingsTitle, lang)}</h2>
          <ul className={styles.markings}>
            {R.markings.map((m) => (
              <li key={m.id} className={`card ${styles.marking}`}>
                <Marking id={m.id} />
                <div>
                  <h3>{t(m.name, lang)}</h3>
                  <p className="muted">{t(m.meaning, lang)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Police */}
      <section id="police" className="section section--alt" aria-labelledby="h-police">
        <div className="container">
          <h2 id="h-police" className={styles.h2} data-num={digits(5, lang)}>{t(R.policeTitle, lang)}</h2>
          <ul className={styles.police}>
            {R.police.map((p, i) => {
              const full = t(p, lang);
              const dash = full.indexOf("—");
              const headline = dash !== -1 ? full.slice(0, dash).trim() : full;
              const detail   = dash !== -1 ? full.slice(dash + 1).trim() : "";
              return (
                <li key={p.en} className={styles.policeCard}>
                  <div className={styles.policeTop}>
                    <span className={styles.policeNum}>{digits(i + 1, lang)}</span>
                    <span className={styles.policeIconWrap}><Hand aria-hidden="true" /></span>
                  </div>
                  <div className={styles.policeBody}>
                    <strong>{headline}</strong>
                    {detail && <p>{detail}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className={styles.note}><Info aria-hidden="true" /> {t(R.policeNote, lang)}</p>
        </div>
      </section>

      {/* 6. Law */}
      <section id="law" className="section" aria-labelledby="h-law">
        <div className="container">
          <h2 id="h-law" className={styles.h2} data-num={digits(6, lang)}>{t(R.lawTitle, lang)}</h2>
          <p className={styles.sub}>{t(R.lawLead, lang)}</p>
          <ol className={styles.laws}>
            {R.laws.map((l, i) => (
              <li key={l.en} className="card"><span className={styles.lawNum}>{digits(i + 1, lang)}</span> <span>{t(l, lang)}</span></li>
            ))}
          </ol>
          <p className={styles.note}><Scale aria-hidden="true" /> {t(R.lawNote, lang)}</p>

          <div className={styles.cta}>
            <div>
              <h2>{t(R.ctaTitle, lang)}</h2>
              <p>{t(R.ctaLead, lang)}</p>
            </div>
            <WhatsAppButton lang={lang} size="lg" message={R.ctaMessage} />
          </div>
        </div>
      </section>
    </>
  );
}
