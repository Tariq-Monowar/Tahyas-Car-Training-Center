import { Tag } from "lucide-react";
import { finalPrice, site } from "@/config/site";
import { offer } from "@/content/copy";
import { t, taka, type Lang } from "@/lib/i18n";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import styles from "./Offer.module.css";

export function Offer({ lang }: { lang: Lang }) {
  const { regular, discount, label, note } = site.pricing;
  return (
    <section id="offer" className={styles.section} aria-labelledby="offer-title">
      <div className="container">
        <div className={styles.card} data-reveal>
          <div className={styles.left}>
            <p className={styles.kicker}><Tag aria-hidden="true" /> {t(offer.title, lang)}</p>
            <h2 id="offer-title" className={styles.title}>{t(label, lang)}</h2>
            <p className={styles.note}>{t(note, lang)}</p>
          </div>

          <div className={styles.price}>
            <span className={styles.badge}>{taka(discount, lang)} {t(offer.off, lang)}</span>
            <p className={styles.old}>
              <span className="sr-only">{lang === "bn" ? "আগের দাম" : "Regular price"}</span>
              <s>{taka(regular, lang)}</s>
            </p>
            <p className={styles.now}>
              <span>{t(offer.now, lang)}</span>
              <strong>{taka(finalPrice, lang)}</strong>
            </p>
            <WhatsAppButton lang={lang} message={offer.message} label={offer.cta} block />
          </div>
        </div>
      </div>
    </section>
  );
}
