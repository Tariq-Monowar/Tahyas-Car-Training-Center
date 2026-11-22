import { chat, ui } from "@/content/copy";
import { t, type Lang } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";
import { ChatLauncher } from "./ChatLauncher";

/** Server wrapper: resolves the texts for the current language, then renders the tiny client launcher. */
export function Chat({ lang }: { lang: Lang }) {
  return (
    <ChatLauncher
      lang={lang}
      strings={{
        title: t(chat.title, lang),
        subtitle: t(chat.subtitle, lang),
        open: t(chat.open, lang),
        close: t(ui.close, lang),
        greeting: t(chat.greeting, lang),
        pickTopic: t(chat.pickTopic, lang),
        more: t(chat.more, lang),
        topics: chat.topics.map((x) => ({ icon: x.icon, label: t(x.label, lang), ask: t(x.ask, lang) })),
        placeholder: t(chat.placeholder, lang),
        listening: t(chat.listening, lang),
        mic: t(chat.mic, lang),
        micStop: t(chat.micStop, lang),
        send: t(chat.send, lang),
        restart: t(chat.restart, lang),
        askWhatsapp: t(chat.askWhatsapp, lang),
        disclaimer: t(chat.disclaimer, lang),
        tooLong: t(chat.tooLong, lang),
        whatsappCta: t(ui.whatsappCta, lang),
        whatsappHref: waLink(lang),
      }}
    />
  );
}
