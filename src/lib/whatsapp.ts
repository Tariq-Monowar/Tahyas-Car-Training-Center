import { site } from "@/config/site";
import type { Lang, Text } from "./i18n";

/** Build a wa.me link with a pre-filled (URL-encoded) message. */
export function waLink(lang: Lang, message?: Text): string {
  const text = (message ?? site.whatsapp.defaultMessage)[lang];
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

const { lat, lng } = site.geo;
export const maps = {
  embed: `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`,
  open: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  route: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
};
