import { Clock, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { nav, ui } from "@/content/copy";
import { digits, navHref, t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import styles from "./Footer.module.css";

export function Footer({ lang }: { lang: Lang }) {
  const year = digits(new Date().getFullYear(), lang);
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Logo lang={lang} size={52} id="ft" />
          <p className={styles.tagline}>{t(site.tagline, lang)}</p>
          <p className={styles.slogan}>{t(site.slogan, lang)}</p>
        </div>

        <nav aria-label={lang === "bn" ? "ফুটার মেনু" : "Footer menu"}>
          <ul className={styles.links}>
            {nav.map((n) => (
              <li key={n.id}><a href={navHref(n, lang)}>{t(n.label, lang)}</a></li>
            ))}
          </ul>
        </nav>

        <div className={styles.contact}>
          <a href={waLink(lang)} target="_blank" rel="noopener noreferrer" className={styles.wa}>
            <WhatsAppIcon size={22} />
            <span>WhatsApp: {digits(site.whatsapp.display, lang)}</span>
          </a>
          <p><MapPin aria-hidden="true" /> {t(site.address, lang)}</p>
          <p><Clock aria-hidden="true" /> {t(site.hours, lang)}</p>
          {site.facebook && (
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={styles.fb}>Facebook</a>
          )}
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} {t(site.name, lang)} · {t(ui.rights, lang)}</p>
        <p className={styles.note}>
          {t(ui.illustrative, lang)} ·{" "}
          <a href="/images/CREDITS.md" target="_blank" rel="noopener" className={styles.credit}>{t(ui.credits, lang)}</a>
        </p>
      </div>
    </footer>
  );
}
