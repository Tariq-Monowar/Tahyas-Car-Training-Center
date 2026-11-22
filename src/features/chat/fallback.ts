import { finalPrice, site } from "@/config/site";
import { taka, type Lang } from "@/lib/i18n";

/**
 * Rule-based answers used when the AI is unavailable (no key, offline, rate-limited).
 * Always ends by pointing to WhatsApp.
 */
export function fallbackReply(question: string, lang: Lang): string {
  const q = question.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));
  const courseList = site.courses.map((c) => "• " + c.title[lang]).join("\n");
  const wa = lang === "bn" ? "বিস্তারিত জানতে WhatsApp এ মেসেজ করুন 👇" : "Message us on WhatsApp for details 👇";

  if (has("লাইসেন্স", "licence", "license", "brta", "বিআরটিএ"))
    return lang === "bn"
      ? `লাইসেন্সের জন্য সাধারণত NID, ছবি ও মেডিকেল সার্টিফিকেট লাগে; এরপর লার্নার লাইসেন্স, লিখিত-মৌখিক-মাঠ পরীক্ষা ও স্মার্ট কার্ড। পুরো ধাপগুলো দেখুন: /license\n${wa}`
      : `You usually need your NID, a photo and a medical certificate, then a learner licence, written/viva/field tests and the smart card. Full steps: /en/license\n${wa}`;

  if (has("চালাইনি", "নতুন", "পারব", "beginner", "never driven", "first time"))
    return lang === "bn"
      ? `অবশ্যই পারবেন! নতুনদের জন্য আমরা একদম প্রথম থেকে, ধৈর্য নিয়ে ধাপে ধাপে শেখাই।\n${wa}`
      : `Of course! We teach complete beginners from the very first step, patiently.\n${wa}`;

  if (has("ফি", "দাম", "টাকা", "খরচ", "কোর্স", "price", "fee", "cost", "course"))
    return lang === "bn"
      ? `আমাদের কোর্সসমূহ:\n${courseList}\n\nবিশেষ অফার: ${taka(site.pricing.regular, lang)} এর কোর্স এখন ${taka(finalPrice, lang)} (${taka(site.pricing.discount, lang)} ছাড়)।\n${wa}`
      : `Our courses:\n${courseList}\n\nSpecial offer: ${taka(site.pricing.regular, lang)} course now ${taka(finalPrice, lang)} (${taka(site.pricing.discount, lang)} off).\n${wa}`;

  if (has("নারী", "মহিলা", "মেয়ে", "আপু", "women", "woman", "female", "lady"))
    return lang === "bn"
      ? `নারীদের জন্য আমাদের বিশেষ ব্যবস্থা আছে — স্বস্তিদায়ক ও সম্মানজনক পরিবেশে, ধৈর্য নিয়ে ধাপে ধাপে শেখানো হয়। প্রশিক্ষক পছন্দের বিষয়টি আগে জানাতে পারেন।\n${wa}`
      : `We offer special care for women — a comfortable, respectful environment with patient, step-by-step teaching. You can share your trainer preference in advance.\n${wa}`;

  if (has("ঠিকানা", "কোথায়", "লোকেশন", "ম্যাপ", "address", "where", "location", "map"))
    return lang === "bn"
      ? `📍 ${site.address.bn}\nপেজের নিচে ম্যাপ ও "রুট দেখুন" বাটন আছে।\n${wa}`
      : `📍 ${site.address.en}\nSee the map and "Get directions" button below.\n${wa}`;

  if (has("ভর্তি", "বুক", "শুরু", "enrol", "enroll", "admission", "book", "join", "start"))
    return lang === "bn"
      ? `চমৎকার! ভর্তি ও ক্লাসের সময় ঠিক করতে সরাসরি WhatsApp এ মেসেজ করুন: ${site.whatsapp.display}`
      : `Great! To enrol and pick class times, message us on WhatsApp: ${site.whatsapp.display}`;

  return lang === "bn"
    ? `এই বিষয়ে সঠিক তথ্য দিতে আমাদের টিম WhatsApp এ সাহায্য করবে।\n${wa}`
    : `Our team can answer that best on WhatsApp.\n${wa}`;
}
