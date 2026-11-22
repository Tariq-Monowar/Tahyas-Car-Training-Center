import { t, type Lang, type Text } from "@/lib/i18n";

type Props = { lang: Lang; eyebrow: Text; title: Text; lead?: Text; center?: boolean; id?: string };

export function SectionHeading({ lang, eyebrow, title, lead, center, id }: Props) {
  return (
    <div className={`heading${center ? " heading--center" : ""}`} data-reveal>
      <p className="eyebrow">{t(eyebrow, lang)}</p>
      <h2 id={id}>{t(title, lang)}</h2>
      {lead && <p>{t(lead, lang)}</p>}
    </div>
  );
}
