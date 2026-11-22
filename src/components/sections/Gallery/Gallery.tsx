import Image from "next/image";
import { Camera } from "lucide-react";
import { site, type IconName } from "@/config/site";
import { gallery } from "@/content/copy";
import { galleryPhotos } from "@/lib/photos";
import { t, type Lang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "./GalleryGrid";
import styles from "./Gallery.module.css";

const placeholders: IconName[] = ["steering", "parking", "highway", "shield"];

export function Gallery({ lang }: { lang: Lang }) {
  const photos = galleryPhotos().map((p, i) => ({
    src: p.src,
    caption: site.galleryCaptions[p.file]?.[lang] ?? `${t(site.name, lang)} — ${i + 1}`,
  }));

  // Hidden until the owner adds real photos to public/images/real/gallery/
  if (photos.length === 0) return null;

  return (
    <section className="section section--alt" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHeading lang={lang} id="gallery-title" eyebrow={gallery.eyebrow} title={gallery.title} center />

        {photos.length > 0 ? (
          <GalleryGrid photos={photos} closeLabel={lang === "bn" ? "বন্ধ করুন" : "Close"} />
        ) : (
          <>
            <ul className={styles.grid}>
              <li className={`${styles.tile} ${styles.feature}`} data-reveal>
                <Image src="/images/brand/logo-badge.jpg" alt={t(site.name, lang)} fill sizes="(min-width: 768px) 40vw, 92vw" quality={70} className={styles.logo} />
              </li>
              {placeholders.map((icon, i) => (
                <li key={icon} className={`${styles.tile} ${styles.placeholder}`} data-reveal style={{ "--i": i + 1 } as React.CSSProperties}>
                  <Icon name={icon} strokeWidth={1.25} />
                </li>
              ))}
            </ul>
            <p className={styles.empty}><Camera aria-hidden="true" /> {t(gallery.empty, lang)}</p>
          </>
        )}
      </div>
    </section>
  );
}
