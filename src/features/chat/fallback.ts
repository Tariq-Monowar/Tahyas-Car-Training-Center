import { finalPrice, site } from "@/config/site";
import { taka, type Lang } from "@/lib/i18n";

/**
 * Rule-based answers used when the AI is unavailable (no key, offline, rate-limited).
 * WhatsApp is suggested ONLY for enrollment / booking / unknown topics — not for
 * greetings or questions that can be fully answered here.
 */
/** Keyboard-mash / one-word noise ("sds", "asdf") — answered locally, no AI tokens spent. */
export function isGibberish(text: string): boolean {
  const q = text.toLowerCase().trim();
  if (!q || /[\u0980-\u09ff]/.test(q) || /\d/.test(q)) return false; // Bengali or numbers → real question
  const word = q.replace(/[^a-z]/g, "");
  if (!word) return false;
  const known = /^(hi|hey|ok|okay|yes|no|ha|haha|lol|thx|ty|bye|fee|fees|vorti|bhorti|kemon|kmn|ki|hmm|tmi|ami|apni)$/;
  if (known.test(word)) return false;
  // short Banglish slurs must reach the AI (which answers them firmly), never a playful local reply
  if (/^(bkl|mc|bc|mf|bsdk|mkc|bal|wtf|stfu)$/.test(word)) return false;
  return (word.length <= 4 && !q.includes(" ")) || !/[aeiou]/.test(word);
}

export function fallbackReply(question: string, lang: Lang, previous: string[] = []): string {
  const q = question.toLowerCase().trim();
  const asked = previous.length;
  /** Pick a variant that wasn't used yet in this chat (falls back to rotating). */
  const pick = (options: string[]) => options.find((o) => !previous.includes(o)) ?? options[asked % options.length];
  const topicsHint = lang === "bn"
    ? "কোর্স ও ফি, নারীদের ট্রেনিং, লাইসেন্স বা ভর্তি — কোনটা জানতে চান?"
    : "Courses & fees, women's training, licence or enrolment — which would you like?";
  const has = (...words: string[]) => words.some((w) => q.includes(w));
  const courseList = site.courses.map((c) => "• " + c.title[lang]).join("\n");
  const wa = lang === "bn"
    ? `ভর্তি বা আরও জানতে WhatsApp করুন: ${site.whatsapp.display}`
    : `To enrol or learn more, WhatsApp us: ${site.whatsapp.display}`;

  // Abusive language — firm pushback (Bengali + Roman script variants)
  if (has(
    // Bengali script
    "মাদার", "মাদারচোদ", "বাল", "শালা", "শালি", "চোদ", "চুদ", "হারামজাদা",
    "কুত্তা", "কুত্তার", "বেশ্যা", "রান্ডি", "খানকি", "ভোদা", "গান্ড",
    // Roman script Bengali abuse
    "madar", "madarchood", "madarchod", "kuttar", "kutar", "khankir", "khanki",
    "banchod", "benchod", "chutia", "chutiya", "gaand", "gand", "boka choda",
    "bokachoda", "harami", "haramzada", "sala ", "shala", "randi",
    // English abuse
    "fuck", "bitch", "bastard", "asshole", "motherfucker", "idiot", "stupid",
  ))
    return lang === "bn"
      ? "এই ভাষায় কথা বলবেন না। সম্মান দিলে সম্মান পাবেন। 🛑"
      : "Please use respectful language. I'm here to help, not to be disrespected. 🛑";

  // Follow-up / context continuation
  if (has("এই বিষয়ে", "আরো বলো", "আরো বলুন", "বিস্তারিত", "আরো বিস্তারিত", "বিস্তা", "আরও", "আরো", "more about", "tell me more", "explain more"))
    return lang === "bn"
      ? "কোন বিষয়ে আরো জানতে চান? কোর্স, ভর্তি, নারীদের ব্যবস্থা, লাইসেন্স — নির্দিষ্টভাবে জিজ্ঞেস করুন! 😊"
      : "Which topic would you like more details on? Ask me specifically about courses, enrolment, women's training or the licence process!";

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
      ? "নারীরাও স্বস্তিদায়ক ও সম্মানজনক পরিবেশে, ধৈর্য নিয়ে নিজের গতিতে ধাপে ধাপে শিখতে পারেন।"
      : "Women learn in a comfortable, respectful setting — patient, step-by-step, at their own pace.";

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

  // Thanks / bye
  if (has("ধন্যবাদ", "থ্যাংক", "thanks", "thank you", "thx", "বিদায়", "bye"))
    return pick(lang === "bn"
      ? ["আপনাকেও ধন্যবাদ! নিরাপদে থাকুন 🚗", "খুশি হলাম সাহায্য করতে পেরে! আবার দরকার হলে লিখবেন।"]
      : ["You're welcome! Drive safe 🚗", "Happy to help — message anytime!"]);

  // Laughter — laugh along, then a light nudge
  if (/^(ha|he|লো|হা|হে|lol|lmao|😂|🤣|😄|😆)+[!. ]*$/i.test(q.replace(/\s+/g, "")))
    return pick(lang === "bn"
      ? ["হা হা 😄 আপনার মুড তো একদম গ্রিন সিগন্যাল! গাড়ি চালানো নিয়ে কিছু জানতে চান?",
         "হাসি দেখে ভালো লাগল! 😄 চাইলে কোর্স বা ফি জানিয়ে দিতে পারি।",
         "হা হা! হাসতে হাসতে ড্রাইভিংও শিখে ফেলা যায় 😉 কোন বিষয়ে সাহায্য করব?"]
      : ["Haha 😄 Love the mood! Anything about driving I can help with?",
         "Glad you're smiling! Want to hear about our courses?"]);

  // Gibberish / very short input — playful, then suggest topics
  if (q.length <= 4 || !/[aeiou\u0980-\u09ff]/i.test(q))
    return pick(lang === "bn"
      ? [`কিবোর্ডে আঙুল পিছলে গেল মনে হচ্ছে 😄 ${topicsHint}`,
         `ঠিক বুঝলাম না — আরেকটু লিখবেন? ${topicsHint}`,
         "মনে হচ্ছে টাইপিংয়ে গিয়ার শিফট মিস হয়েছে 😅 নিচের যেকোনো বিষয়ে চাপ দিয়েও জিজ্ঞেস করতে পারেন।"]
      : [`Looks like the keyboard slipped 😄 ${topicsHint}`, `I didn't quite get that — could you say a bit more? ${topicsHint}`]);

  // Anything else — friendly, honest redirect (varied, never the same twice in a row)
  return pick(lang === "bn"
    ? [`এই বিষয়ে আমি নিশ্চিত নই, তবে ড্রাইভিং নিয়ে যেকোনো কিছু জিজ্ঞেস করতে পারেন! ${topicsHint}`,
       "প্রশ্নটা মজার! তবে আমার আসল দক্ষতা ড্রাইভিং শেখানো নিয়ে 🚗 কোর্স বা ভর্তি নিয়ে জানতে চান?",
       `এটার উত্তর আমার জানা নেই। বিস্তারিত জানতে WhatsApp করতে পারেন: ${site.whatsapp.display}`]
    : [`I'm not sure about that, but ask me anything about driving! ${topicsHint}`,
       `I don't know that one. For anything else, WhatsApp us: ${site.whatsapp.display}`]);
}
