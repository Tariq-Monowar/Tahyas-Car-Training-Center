/**
 * Tiny i18n helpers. Every piece of text in the site is a `Text` = { bn, en }.
 * Bengali lives at "/", English at "/en" (two static pages → both indexed by Google).
 */
export type Lang = "bn" | "en";
export type Text = { bn: string; en: string };

export const LANGS: Lang[] = ["bn", "en"];

/** Pick the right language from a { bn, en } pair. */
export const t = (text: Text, lang: Lang): string => text[lang];

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert Latin digits to Bengali digits when lang is "bn". */
export function digits(value: string | number, lang: Lang): string {
  const s = String(value);
  return lang === "bn" ? s.replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : s;
}

/** 10000 → "৳১০,০০০" (bn) / "৳10,000" (en) */
export function taka(amount: number, lang: Lang): string {
  return "৳" + digits(amount.toLocaleString("en-IN"), lang);
}

/** Home URL for a language. */
export const homePath = (lang: Lang) => (lang === "bn" ? "/" : "/en");

/** Link for a menu item: a separate page, or a section on the home page (works from any page). */
export const navHref = (item: { id: string; href?: Record<Lang, string> }, lang: Lang) =>
  item.href ? item.href[lang] : `${homePath(lang)}#${item.id}`;
