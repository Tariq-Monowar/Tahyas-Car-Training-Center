import { finalPrice, site } from "@/config/site";
import { taka, type Lang } from "@/lib/i18n";

/**
 * Rule-based answers used when the AI is unavailable (no key, offline, rate-limited).
 * WhatsApp is suggested ONLY for enrollment / booking / unknown topics — not for
 * greetings or questions that can be fully answered here.
 */
export function fallbackReply(question: string, lang: Lang): string {
  const q = question.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));
  const courseList = site.courses.map((c) => "• " + c.title[lang]).join("\n");
  const wa = lang === "bn"
    ? `ভর্তি বা আরও জানতে WhatsApp করুন: ${site.whatsapp.display}`
    : `To enrol or learn more, WhatsApp us: ${site.whatsapp.display}`;

  // Greetings — no WhatsApp needed
  if (has("সালাম", "আদাব", "হ্যালো", "হেলো", "নমস্কার", "hi ", "hello", "assalam", "salam", "আসসালামু", "ওয়ালাইকুম"))
    return lang === "bn"
      ? "ওয়ালাইকুম আসসালাম! আমি তাহয়াস কার ট্রেনিং সেন্টারের সহকারী। কোর্স, ভর্তি বা গাড়ি চালানো সম্পর্কে যেকোনো প্রশ্ন করুন।"
      : "Hello! I'm the assistant for Tahyas Car Training Center. Ask me anything about our courses, enrolment or driving.";

  // Licence — answer + link, no WhatsApp
  if (has("লাইসেন্স", "licence", "license", "brta", "বিআরটিএ"))
    return lang === "bn"
      ? "লাইসেন্সের জন্য সাধারণত NID, ছবি ও মেডিকেল সার্টিফিকেট লাগে; এরপর লার্নার লাইসেন্স, লিখিত-মৌখিক-মাঠ পরীক্ষা ও স্মার্ট কার্ড। বিস্তারিত দেখুন: /license"
      : "You usually need NID, photo and a medical certificate, then a learner licence, written/viva/field tests and smart card. Full guide: /en/license";

  // Beginner — answer fully, no WhatsApp
  if (has("চালাইনি", "নতুন", "পারব", "beginner", "never driven", "first time", "শুরু থেকে"))
    return lang === "bn"
      ? "অবশ্যই পারবেন! আমরা একদম শুরু থেকে ধৈর্য নিয়ে ধাপে ধাপে শেখাই — কোনো পূর্ব অভিজ্ঞতা লাগবে না।"
      : "Absolutely! We teach from scratch, step by step, with patience — no prior experience needed.";

  // Women — answer, no WhatsApp
  if (has("নারী", "মহিলা", "মেয়ে", "আপু", "women", "woman", "female", "lady"))
    return lang === "bn"
      ? "নারীদের জন্য বিশেষ ব্যবস্থা আছে — স্বস্তিদায়ক ও সম্মানজনক পরিবেশে ধাপে ধাপে শেখানো হয়। প্রশিক্ষক পছন্দ WhatsApp-এ আগে জানাতে পারেন।"
      : "We have special arrangements for women — comfortable, respectful, step-by-step training. You can discuss trainer preference on WhatsApp.";

  // Address — answer, no WhatsApp
  if (has("ঠিকানা", "কোথায়", "লোকেশন", "ম্যাপ", "address", "where", "location", "map"))
    return lang === "bn"
      ? `📍 ${site.address.bn}\nপেজের নিচে ম্যাপ ও "রুট দেখুন" বাটন আছে।`
      : `📍 ${site.address.en}\nSee the map and "Get directions" button at the bottom of the page.`;

  // Courses / fees — answer + WhatsApp for enrollment
  if (has("ফি", "দাম", "টাকা", "খরচ", "কোর্স", "price", "fee", "cost", "course"))
    return lang === "bn"
      ? `আমাদের কোর্সসমূহ:\n${courseList}\n\nবিশেষ অফার: ${taka(site.pricing.regular, lang)} এর কোর্স এখন ${taka(finalPrice, lang)}।\n${wa}`
      : `Our courses:\n${courseList}\n\nSpecial offer: ${taka(site.pricing.regular, lang)} course now ${taka(finalPrice, lang)}.\n${wa}`;

  // Enrolment — WhatsApp required
  if (has("ভর্তি", "বুক", "enrol", "enroll", "admission", "book", "join"))
    return lang === "bn"
      ? `ভর্তি ও ক্লাসের সময় ঠিক করতে WhatsApp করুন: ${site.whatsapp.display}`
      : `To enrol and book your class, WhatsApp us: ${site.whatsapp.display}`;

  // Default — unknown topic, suggest WhatsApp
  return lang === "bn"
    ? `এই বিষয়ে আমি সঠিক তথ্য দিতে পারছি না। ${wa}`
    : `I'm not sure about that. ${wa}`;
}
