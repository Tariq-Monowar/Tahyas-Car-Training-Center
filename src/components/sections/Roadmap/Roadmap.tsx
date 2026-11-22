import { roadmap } from "@/content/copy";
import { digits, t, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Roadmap.module.css";

export function Roadmap({ lang }: { lang: Lang }) {
  const levels = ["basic", "advance"] as const;
  let n = 0;
  return (
    <section className="section section--alt" aria-labelledby="roadmap-title">
      <div className="container">
        <SectionHeading lang={lang} id="roadmap-title" eyebrow={roadmap.eyebrow} title={roadmap.title} center />
        <div className={styles.levels}>
          {levels.map((level) => (
            <div key={level} className={styles.level} data-level={level} data-reveal>
              <p className={styles.levelName}>{t(roadmap.levels[level], lang)}</p>
              <ol className={styles.list}>
                {roadmap.items
                  .filter((i) => i.level === level)
                  .map((i) => {
                    n += 1;
                    return (
                      <li key={i.title.en}>
                        <span className={styles.km}>{digits(n, lang)}</span>
                        <span>{t(i.title, lang)}</span>
                      </li>
                    );
                  })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
