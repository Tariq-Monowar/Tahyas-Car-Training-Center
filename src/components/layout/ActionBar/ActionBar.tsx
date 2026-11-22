import type { Lang } from "@/lib/i18n";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ShowAfterHero } from "./ShowAfterHero";
import styles from "./ActionBar.module.css";

/**
 * Mobile only: sticky bottom bar with one big WhatsApp button.
 * It slides in only after the hero (which already has the same button) scrolls away,
 * so the visitor never sees two WhatsApp buttons at once. Desktop uses the header button.
 */
export function ActionBar({ lang }: { lang: Lang }) {
  return (
    <ShowAfterHero className={styles.bar}>
      <WhatsAppButton lang={lang} block size="lg" />
    </ShowAfterHero>
  );
}
