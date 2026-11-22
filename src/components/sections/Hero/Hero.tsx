import { ArrowDown, BadgeCheck } from "lucide-react";
import { site } from "@/config/site";
import { hero, ui } from "@/content/copy";
import { Media } from "@/components/ui/Media";
import { t, type Lang } from "@/lib/i18n";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import styles from "./Hero.module.css";

export function Hero({ lang }: { lang: Lang }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.blob1} />
        <span className={styles.grid} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.visual}>
          <div className={styles.frame}>
            <Media
              slot="hero" priority className={styles.photo} sizes="(min-width: 900px) 45vw, 92vw"
              objectPosition="center"
              alt={lang === "bn" ? "শিক্ষার্থী গাড়ি চালাচ্ছে, প্রশিক্ষক বাম সিট থেকে স্টিয়ারিং ধরে আছেন, সামনে সবুজ মাঠের রাস্তা" : "A student drives while the trainer guides the wheel from the left seat, on a green country road"}
            />
          </div>
        </div>

        <div className={styles.copy}>
          <p className="eyebrow">{t(hero.eyebrow, lang)}</p>
          <h1 id="hero-title" className={styles.title}>
            {t(hero.title, lang)} <span className={styles.accent}>{t(hero.titleAccent, lang)}</span>
          </h1>
          <p className={styles.tagline}>{t(site.tagline, lang)}</p>

          <div className={styles.ctas}>
            <WhatsAppButton lang={lang} size="lg" pulse />
            <a href="#courses" className="btn btn--ghost btn--lg">
              {t(ui.seeCourses, lang)} <ArrowDown aria-hidden="true" />
            </a>
          </div>

          <ul className={styles.chips}>
            {hero.chips.map((c) => (
              <li key={c.en} className="chip"><BadgeCheck aria-hidden="true" /> {t(c, lang)}</li>
            ))}
          </ul>

          <p className={styles.note}>{t(hero.beginnerNote, lang)}</p>
        </div>
      </div>
    </section>
  );
}
