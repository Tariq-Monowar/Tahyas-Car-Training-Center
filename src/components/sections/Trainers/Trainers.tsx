import Image from "next/image";
import { UserRound } from "lucide-react";
import { site } from "@/config/site";
import { trainers as copy } from "@/content/copy";
import { realPhoto } from "@/lib/photos";
import { digits, t, type Lang } from "@/lib/i18n";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Trainers.module.css";

/** Hidden until real trainers are added in src/config/site.ts → trainers. */
export function Trainers({ lang }: { lang: Lang }) {
  if (site.trainers.length === 0) return null;
  return (
    <section className="section" aria-labelledby="trainers-title">
      <div className="container">
        <SectionHeading lang={lang} id="trainers-title" eyebrow={copy.eyebrow} title={copy.title} center />
        <ul className={styles.grid}>
          {site.trainers.map((tr, i) => {
            const photo = realPhoto(tr.photo);
            return (
              <li key={tr.name.en} className={`card lift ${styles.card}`} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <div className={`photo ${styles.photo}`}>
                  {photo ? (
                    <Image src={photo.src} alt={t(tr.name, lang)} fill sizes="(min-width: 768px) 25vw, 60vw" quality={70} />
                  ) : (
                    <UserRound aria-hidden="true" className={styles.placeholder} />
                  )}
                </div>
                <h3>{t(tr.name, lang)}</h3>
                <p className="muted">{digits(tr.years, lang)}+ {t(copy.years, lang)}</p>
                {tr.note && <p>{t(tr.note, lang)}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
