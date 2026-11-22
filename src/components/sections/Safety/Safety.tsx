import { safety } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import styles from "./Safety.module.css";

/** Road-sign style awareness strip. */
export function Safety({ lang }: { lang: Lang }) {
  return (
    <section className={styles.strip} aria-labelledby="safety-title">
      <div className="container">
        <h2 id="safety-title" className={styles.title} data-reveal>{t(safety.title, lang)}</h2>
        <ul className={styles.list}>
          {safety.items.map((s, i) => (
            <li key={s.title.en} className={styles.item} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <span className={styles.sign}><Icon name={s.icon} /></span>
              <span>{t(s.title, lang)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
