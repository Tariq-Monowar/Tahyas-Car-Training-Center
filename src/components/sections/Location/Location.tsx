import Image from "next/image";
import { Clock, MapPin, Navigation, SquareArrowOutUpRight } from "lucide-react";
import { site } from "@/config/site";
import { location, ui } from "@/content/copy";
import { realPhoto } from "@/lib/photos";
import { t, type Lang } from "@/lib/i18n";
import { maps } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Location.module.css";

export function Location({ lang }: { lang: Lang }) {
  const front = realPhoto("center-front");
  return (
    <section id="location" className={`section section--alt ${styles.section}`} aria-labelledby="location-title">
      <div className="container">
        <SectionHeading lang={lang} id="location-title" eyebrow={location.eyebrow} title={location.title} center />
        <div className={styles.grid}>

          <div className={styles.map} data-reveal>
            <iframe
              src={maps.embed}
              title={t(location.mapTitle, lang)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className={styles.info} data-reveal>
            {front && (
              <div className={`photo ${styles.front}`}>
                <Image src={front.src} alt={t(site.name, lang)} fill sizes="(min-width: 900px) 30vw, 92vw" quality={70} />
              </div>
            )}

            <div className={styles.infoRows}>
              <div className={styles.row}>
                <span className={styles.rowIcon}><MapPin aria-hidden="true" /></span>
                <div>
                  <h3>{t(ui.address, lang)}</h3>
                  <address>{t(site.address, lang)}</address>
                </div>
              </div>
              <div className={styles.row}>
                <span className={styles.rowIcon}><Navigation aria-hidden="true" /></span>
                <div>
                  <h3>{t(location.howToCome, lang)}</h3>
                  <p>{t(site.directions, lang)}</p>
                </div>
              </div>
              <div className={styles.row}>
                <span className={styles.rowIcon}><Clock aria-hidden="true" /></span>
                <div>
                  <h3>{t(ui.hours, lang)}</h3>
                  <p>{t(site.hours, lang)}</p>
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <a href={maps.open} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                <SquareArrowOutUpRight aria-hidden="true" /> {t(location.openMaps, lang)}
              </a>
              <a href={maps.route} target="_blank" rel="noopener noreferrer" className="btn btn--accent">
                <Navigation aria-hidden="true" /> {t(location.route, lang)}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
