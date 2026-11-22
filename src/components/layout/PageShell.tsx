import { ui } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import { Chat } from "@/features/chat/Chat";
import { ActionBar } from "./ActionBar/ActionBar";
import { Footer } from "./Footer/Footer";
import { Header } from "./Header/Header";

/** Header + main + footer + mobile WhatsApp bar + chat — shared by every page. */
export function PageShell({ lang, altHref, children }: { lang: Lang; altHref?: string; children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">{t(ui.skip, lang)}</a>
      <Header lang={lang} altHref={altHref} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
      <ActionBar lang={lang} />
      <Chat lang={lang} />
    </>
  );
}
