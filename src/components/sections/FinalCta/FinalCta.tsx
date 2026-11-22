import { site } from "@/config/site";
import { finalCta } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import { RoadScene } from "@/components/ui/RoadScene";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import styles from "./FinalCta.module.css";

export function FinalCta({ lang }: { lang: Lang }) {
  return (
    <section className={styles.section} aria-labelledby="final-title">
      <div className={`container ${styles.inner}`} data-reveal>
        <p className={styles.slogan}>{t(site.slogan, lang)}</p>
        <h2 id="final-title">{t(finalCta.title, lang)}</h2>
        <p className={styles.lead}>{t(finalCta.lead, lang)}</p>
        <WhatsAppButton lang={lang} size="lg" pulse />
      </div>
      <RoadScene className={styles.road} />
    </section>
  );
}
