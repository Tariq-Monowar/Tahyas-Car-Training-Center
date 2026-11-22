import { ChevronDown } from "lucide-react";
import { site } from "@/config/site";
import { faq } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { waLink } from "@/lib/whatsapp";
import styles from "./Faq.module.css";

/** Native <details> accordion: accessible by default, works without JS, animated with CSS. */
export function Faq({ lang }: { lang: Lang }) {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className={`container ${styles.inner}`}>
        <SectionHeading lang={lang} id="faq-title" eyebrow={faq.eyebrow} title={faq.title} center />
        <div className={styles.list}>
          {site.faqs.map((f, i) => (
            <details key={f.q.en} name="faq" className={styles.item} data-reveal style={{ "--i": Math.min(i, 4) } as React.CSSProperties}>
              <summary>
                <span>{t(f.q, lang)}</span>
                <ChevronDown aria-hidden="true" />
              </summary>
              <div className={styles.answer}><p>{t(f.a, lang)}</p></div>
            </details>
          ))}
        </div>
        <div className={styles.more} data-reveal>
          <p>
            {t(faq.more, lang)}{" "}
            <a href={waLink(lang)} target="_blank" rel="noopener noreferrer" className={styles.link}>{t(faq.ask, lang)}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
