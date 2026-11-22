import { ui } from "@/content/copy";
import { t, type Lang, type Text } from "@/lib/i18n";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icon";

type Props = {
  lang: Lang;
  message?: Text;   // pre-filled WhatsApp message
  label?: Text;     // button text (defaults to "WhatsApp এ মেসেজ করুন")
  size?: "md" | "lg";
  block?: boolean;
  pulse?: boolean;
  className?: string;
};

export function WhatsAppButton({ lang, message, label = ui.whatsappCta, size = "md", block, pulse, className = "" }: Props) {
  const cls = ["btn", "btn--wa", size === "lg" && "btn--lg", block && "btn--block", pulse && "btn--pulse", className]
    .filter(Boolean)
    .join(" ");
  return (
    <a href={waLink(lang, message)} target="_blank" rel="noopener noreferrer" className={cls}>
      <WhatsAppIcon />
      <span>{t(label, lang)}</span>
    </a>
  );
}
