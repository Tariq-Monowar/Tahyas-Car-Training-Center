import { nav, ui } from "@/content/copy";
import { homePath, navHref, t, type Lang } from "@/lib/i18n";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { HeaderShell, LangSwitch, MobileMenu, ThemeToggle } from "./HeaderClient";
import styles from "./Header.module.css";

/** altHref = the same page in the other language (defaults to the other home page). */
export function Header({ lang, altHref }: { lang: Lang; altHref?: string }) {
  const items = nav.map((n) => ({ href: navHref(n, lang), label: t(n.label, lang) }));
  const other: Lang = lang === "bn" ? "en" : "bn";

  return (
    <HeaderShell className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href={homePath(lang)} className={styles.brand}>
          <Logo lang={lang} size={42} />
        </a>

        <nav className={styles.nav} aria-label={lang === "bn" ? "প্রধান মেনু" : "Main menu"}>
          {items.map((i) => (
            <a key={i.href} href={i.href} className={styles.link}>{i.label}</a>
          ))}
        </nav>

        <div className={styles.actions}>
          <LangSwitch to={other} href={altHref ?? homePath(other)} label={t(ui.langSwitch, lang)} className={styles.iconBtn} />
          <ThemeToggle label={t(ui.themeToggle, lang)} className={styles.iconBtn} />
          <WhatsAppButton lang={lang} className={styles.cta} label={{ bn: "WhatsApp", en: "WhatsApp" }} />
          <MobileMenu
            items={items}
            menuLabel={t(ui.menu, lang)}
            closeLabel={t(ui.close, lang)}
            className={styles.iconBtn}
          />
        </div>
      </div>
    </HeaderShell>
  );
}
