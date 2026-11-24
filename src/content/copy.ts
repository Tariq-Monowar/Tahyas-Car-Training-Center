/**
 * Page copy (headings, section texts). Business data lives in src/config/site.ts.
 * Every text is { bn, en }.
 */
import type { IconName } from "@/config/site";
import type { Text } from "@/lib/i18n";

type Item = { icon: IconName; title: Text; desc: Text };

/** Main menu. `id` = section on the home page; `href` = a separate page. */
export const nav: { id: string; label: Text; href?: Record<"bn" | "en", string> }[] = [
  { id: "courses", label: { bn: "কোর্স", en: "Courses" } },
  { id: "why-us", label: { bn: "কেন আমরা", en: "Why us" } },
  { id: "road-rules", label: { bn: "ট্রাফিক নিয়ম", en: "Road rules" }, href: { bn: "/road-rules", en: "/en/road-rules" } },
  { id: "license", label: { bn: "লাইসেন্স", en: "Licence" }, href: { bn: "/license", en: "/en/license" } },
  { id: "enroll", label: { bn: "ভর্তি আবেদন", en: "Enrol now" }, href: { bn: "/enroll", en: "/en/enroll" } },
  { id: "faq", label: { bn: "প্রশ্নোত্তর", en: "FAQ" } },
  { id: "location", label: { bn: "ঠিকানা", en: "Location" } },
];

export const ui = {
  whatsappCta: { bn: "WhatsApp এ মেসেজ করুন", en: "Message on WhatsApp" },
  seeCourses: { bn: "কোর্স দেখুন", en: "See courses" },
  askOnWhatsapp: { bn: "WhatsApp এ জানুন", en: "Ask on WhatsApp" },
  menu: { bn: "মেনু", en: "Menu" },
  close: { bn: "বন্ধ করুন", en: "Close" },
  skip: { bn: "মূল অংশে যান", en: "Skip to content" },
  themeToggle: { bn: "লাইট/ডার্ক মোড পরিবর্তন", en: "Toggle light/dark mode" },
  langSwitch: { bn: "Switch to English", en: "বাংলায় দেখুন" },
  illustrative: { bn: "কিছু ছবি প্রতীকী", en: "Some images are illustrative" },
  credits: { bn: "ছবির কৃতজ্ঞতা", en: "Photo credits" },
  rights: { bn: "সর্বস্বত্ব সংরক্ষিত", en: "All rights reserved" },
  hours: { bn: "সময়সূচি", en: "Hours" },
  address: { bn: "ঠিকানা", en: "Address" },
} satisfies Record<string, Text>;

export const hero = {
  eyebrow: { bn: "লক্ষ্মীপুরে ড্রাইভিং ট্রেনিং", en: "Driving training in Lakshmipur" },
  title: { bn: "গাড়ি চালানো শিখুন,", en: "Learn to drive," },
  titleAccent: { bn: "আত্মবিশ্বাসের সাথে", en: "with confidence" },
  chips: [
    { bn: "অভিজ্ঞ প্রশিক্ষক", en: "Experienced trainers" },
    { bn: "আধুনিক গাড়ি", en: "Modern cars" },
    { bn: "নারীদের জন্য বিশেষ ব্যবস্থা", en: "Special care for women" },
  ],
  beginnerNote: {
    bn: "আগে কখনো স্টিয়ারিং ধরেননি? সমস্যা নেই — আমরা একদম প্রথম থেকে শেখাব।",
    en: "Never held a steering wheel? No problem — we teach you from the very first step.",
  },
};

export const offer = {
  title: { bn: "বিশেষ অফার", en: "Special offer" },
  off: { bn: "ছাড়", en: "OFF" },
  now: { bn: "এখন মাত্র", en: "Now only" },
  cta: { bn: "অফারটি নিতে মেসেজ করুন", en: "Claim the offer" },
  message: {
    bn: "আসসালামু আলাইকুম, আমি ৳১০,০০০ টাকার অফারে ভর্তি হতে চাই। বিস্তারিত জানাবেন?",
    en: "Hello, I'd like to enrol with the ৳10,000 offer. Could you share details?",
  },
};

export const courses = {
  eyebrow: { bn: "আমাদের কোর্সসমূহ", en: "Our courses" },
  title: { bn: "আপনার জন্য সঠিক কোর্স বেছে নিন", en: "Pick the right course for you" },
  lead: {
    bn: "লক্ষ্মীপুরে হাতে-কলমে গাড়ি চালানো শিখুন — নতুন থেকে অভিজ্ঞ, সবার জন্য।",
    en: "Hands-on driving lessons in Lakshmipur — for complete beginners and experienced drivers alike.",
  },
  youLearn: { bn: "যা শিখবেন", en: "You will learn" },
  details: { bn: "এই কোর্স সম্পর্কে জানুন", en: "Ask about this course" },
  message: (course: string) => ({
    bn: `আসসালামু আলাইকুম, আমি "${course}" সম্পর্কে জানতে চাই।`,
    en: `Hello, I'd like to know about the "${course}".`,
  }),
};

export const women = {
  eyebrow: { bn: "নারী ড্রাইভিং ট্রেনিং", en: "Driving training for women" },
  title: { bn: "নিরাপদ, সম্মানজনক ও স্বস্তিদায়ক পরিবেশে শিখুন", en: "Learn in a safe, respectful and comfortable space" },
  lead: {
    bn: "অনেক মা, বোন ও শিক্ষার্থী প্রথমবার স্টিয়ারিং ধরতে দ্বিধা বোধ করেন। তাই আমরা ধৈর্য নিয়ে, আপনার গতিতে শেখাই।",
    en: "Many women feel hesitant the first time behind the wheel. So we teach patiently, at your own pace.",
  },
  points: [
    {
      icon: "shield",
      title: { bn: "গোপনীয়তা ও সম্মান", en: "Privacy & respect" },
      desc: { bn: "আপনার তথ্য ও স্বস্তিকে আমরা গুরুত্ব দিই।", en: "We value your privacy and comfort." },
    },
    {
      icon: "smile",
      title: { bn: "ধৈর্যশীল প্রশিক্ষণ", en: "Patient teaching" },
      desc: { bn: "তাড়াহুড়ো নেই — প্রতিটি ধাপ বুঝে তারপর পরেরটা।", en: "No rush — master each step before the next." },
    },
    {
      icon: "users",
      title: { bn: "প্রশিক্ষক পছন্দের সুযোগ", en: "Trainer preference" },
      desc: {
        bn: "প্রশিক্ষক নিয়ে আপনার পছন্দ আগে থেকে জানান — আলোচনা করে ব্যবস্থা করা হবে।",
        en: "Share your trainer preference in advance — we'll discuss and arrange.",
      },
    },
  ] as Item[],
  femaleTrainer: { bn: "মহিলা প্রশিক্ষক রয়েছেন", en: "Female trainer available" },
  cta: { bn: "নারীদের ট্রেনিং নিয়ে জানুন", en: "Ask about women's training" },
  message: {
    bn: "আসসালামু আলাইকুম, আমি নারী ড্রাইভিং প্রশিক্ষণ সম্পর্কে জানতে চাই।",
    en: "Hello, I'd like to know about driving training for women.",
  },
};

export const whyUs = {
  eyebrow: { bn: "কেন আমরা", en: "Why choose us" },
  title: { bn: "যেখানে ভয় নয়, আত্মবিশ্বাস তৈরি হয়", en: "Where fear turns into confidence" },
  items: [
    {
      icon: "users",
      title: { bn: "অভিজ্ঞ ও পেশাদার প্রশিক্ষক", en: "Experienced, professional trainers" },
      desc: { bn: "শান্তভাবে বুঝিয়ে, হাতে ধরে শেখানো হয়।", en: "Calm, clear and hands-on guidance." },
    },
    {
      icon: "car",
      title: { bn: "আধুনিক গাড়ি দিয়ে প্রশিক্ষণ", en: "Training in modern cars" },
      desc: { bn: "রক্ষণাবেক্ষণ করা, নিরাপদ গাড়ি।", en: "Well-maintained, safe cars." },
    },
    {
      icon: "steering",
      title: { bn: "প্র্যাকটিক্যাল ভিত্তিক প্রশিক্ষণ", en: "Practical-based training" },
      desc: { bn: "বেশিরভাগ সময় রাস্তায়, স্টিয়ারিং হাতে।", en: "Most of the time on the road, hands on the wheel." },
    },
    {
      icon: "shield",
      title: { bn: "নিরাপত্তা সবার আগে", en: "Safety first" },
      desc: { bn: "সিটবেল্ট থেকে ট্রাফিক আইন — নিরাপদ অভ্যাস গড়ে তোলা।", en: "From seat belts to traffic law — safe habits." },
    },
    {
      icon: "smile",
      title: { bn: "ছোট ব্যাচ", en: "Small batches" },
      desc: { bn: "প্রত্যেকে যথেষ্ট সময় পান।", en: "Everyone gets enough wheel time." },
    },
    {
      icon: "hand",
      title: { bn: "ধাপে ধাপে, ধৈর্য নিয়ে", en: "Patient, step by step" },
      desc: { bn: "নতুনদের জন্য সবচেয়ে উপযোগী পদ্ধতি।", en: "Designed for nervous beginners." },
    },
  ] as Item[],
  stats: {
    courses: { bn: "টি কোর্স", en: "courses" },
    steps: { bn: "ধাপের রোডম্যাপ", en: "step roadmap" },
    discount: { bn: "অফারে ছাড়", en: "offer discount" },
    students: { bn: "শিক্ষার্থী প্রশিক্ষিত", en: "students trained" },
  },
};

export const process = {
  eyebrow: { bn: "ভর্তি প্রক্রিয়া", en: "How it works" },
  title: { bn: "মাত্র ৪টি সহজ ধাপে শুরু করুন", en: "Get started in 4 easy steps" },
  steps: [
    {
      title: { bn: "WhatsApp এ যোগাযোগ", en: "Message on WhatsApp" },
      desc: { bn: "আপনার প্রশ্ন জানান — আমরা দ্রুত উত্তর দিই।", en: "Ask anything — we reply quickly." },
    },
    {
      title: { bn: "ভর্তি ও সময় নির্ধারণ", en: "Enrol & pick a time" },
      desc: { bn: "আপনার সুবিধামতো ক্লাসের সময় ঠিক করুন।", en: "Choose class times that suit you." },
    },
    {
      title: { bn: "প্র্যাকটিক্যাল ক্লাস", en: "Practical classes" },
      desc: { bn: "প্রশিক্ষকের পাশে বসে হাতে-কলমে শিখুন।", en: "Learn hands-on with your trainer beside you." },
    },
    {
      title: { bn: "আত্মবিশ্বাসী ড্রাইভার", en: "Confident driver" },
      desc: { bn: "নিজে নিরাপদে রাস্তায় চালান।", en: "Drive safely on your own." },
    },
  ],
};

export const journey = {
  eyebrow: { bn: "ভয় থেকে আত্মবিশ্বাস", en: "From nervous to confident" },
  title: { bn: "আগে কখনো স্টিয়ারিং ধরেননি? সমস্যা নেই।", en: "Never held a steering wheel? No problem." },
  steps: [
    {
      title: { bn: "প্রথম দিন", en: "Day one" },
      desc: { bn: "গাড়ি চেনা, সিট ও মিরর ঠিক করা, খালি জায়গায় ধীরে চালানো।", en: "Get to know the car, set seat & mirrors, drive slowly in an open area." },
    },
    {
      title: { bn: "অনুশীলন", en: "Practice" },
      desc: { bn: "গিয়ার, মোড় ঘোরা, পার্কিং — প্রতিদিন একটু একটু করে।", en: "Gears, turns, parking — a little more each day." },
    },
    {
      title: { bn: "একা চালানো", en: "Driving solo" },
      desc: { bn: "রাস্তায় নিজের সিদ্ধান্তে, নিরাপদে ও আত্মবিশ্বাসে।", en: "On the road, making your own safe decisions." },
    },
  ],
  firstClassTitle: { bn: "প্রথম ক্লাসে কী হয়?", en: "What happens in the first class?" },
  firstClass: [
    { bn: "প্রশিক্ষকের সাথে পরিচয় ও আপনার অভিজ্ঞতা জানা", en: "Meet your trainer and talk about your experience" },
    { bn: "গাড়ির কন্ট্রোল — ক্লাচ, ব্রেক, এক্সেলারেটর চেনা", en: "Learn the controls — clutch, brake, accelerator" },
    { bn: "সিটবেল্ট, সিট ও মিরর সঠিকভাবে সেট করা", en: "Set seat belt, seat and mirrors correctly" },
    { bn: "নিরাপদ জায়গায় প্রথমবার নিজে চালানো", en: "Your first drive in a safe, open space" },
  ],
};

export const roadmap = {
  eyebrow: { bn: "শেখার রোডম্যাপ", en: "Learning roadmap" },
  title: { bn: "শুরু থেকে দক্ষ ড্রাইভার — ধাপে ধাপে", en: "From first lesson to skilled driver" },
  levels: { basic: { bn: "বেসিক", en: "Basic" }, advance: { bn: "এডভান্স", en: "Advanced" } },
  items: [
    { level: "basic", title: { bn: "ক্লাচ, ব্রেক ও গিয়ার নিয়ন্ত্রণ", en: "Clutch, brake & gear control" } },
    { level: "basic", title: { bn: "স্টিয়ারিং নিয়ন্ত্রণ", en: "Steering control" } },
    { level: "basic", title: { bn: "ট্রাফিক আইন ও রোড সাইন", en: "Traffic rules & road signs" } },
    { level: "basic", title: { bn: "শহরে ড্রাইভিং", en: "City driving" } },
    { level: "advance", title: { bn: "রিভার্স পার্কিং", en: "Reverse parking" } },
    { level: "advance", title: { bn: "হাইওয়ে ড্রাইভিং", en: "Highway driving" } },
    { level: "advance", title: { bn: "রাতের ড্রাইভিংয়ের প্রাথমিক ধারণা", en: "Night driving basics" } },
    { level: "advance", title: { bn: "ডিফেন্সিভ ড্রাইভিং", en: "Defensive driving" } },
  ] as { level: "basic" | "advance"; title: Text }[],
};

export const safety = {
  title: { bn: "নিরাপদ ড্রাইভিং, সুরক্ষিত জীবন", en: "Drive smart, live safe" },
  items: [
    { icon: "shield", title: { bn: "সবসময় সিটবেল্ট বাঁধুন", en: "Always wear a seat belt" } },
    { icon: "phone-off", title: { bn: "চালানোর সময় মোবাইল নয়", en: "No phone while driving" } },
    { icon: "gauge", title: { bn: "গতিসীমা মেনে চলুন", en: "Respect speed limits" } },
    { icon: "signpost", title: { bn: "রোড সাইন বুঝে চলুন", en: "Read the road signs" } },
    { icon: "cone", title: { bn: "বাম দিক দিয়ে চলুন", en: "Keep left" } },
  ] as { icon: IconName; title: Text }[],
};

export const license = {
  eyebrow: { bn: "ড্রাইভিং লাইসেন্স গাইড", en: "Driving licence guide" },
  title: { bn: "BRTA লাইসেন্স প্রক্রিয়া — সংক্ষেপে", en: "The BRTA licence process — in short" },
  steps: [
    { title: { bn: "লার্নার লাইসেন্স", en: "Learner licence" }, desc: { bn: "BRTA তে আবেদন করে শিক্ষানবিশ লাইসেন্স নিতে হয়।", en: "Apply to BRTA for a learner licence." } },
    { title: { bn: "লিখিত ও মৌখিক পরীক্ষা", en: "Written & viva test" }, desc: { bn: "ট্রাফিক আইন ও সাইন নিয়ে পরীক্ষা।", en: "A test on traffic rules and signs." } },
    { title: { bn: "প্র্যাকটিক্যাল টেস্ট", en: "Practical test" }, desc: { bn: "মাঠে ও রাস্তায় গাড়ি চালানোর পরীক্ষা।", en: "A driving test on the ground and road." } },
    { title: { bn: "স্মার্ট কার্ড", en: "Smart card" }, desc: { bn: "পাস করলে স্মার্ট কার্ড লাইসেন্স।", en: "Pass and receive your smart-card licence." } },
  ],
  fullGuide: { bn: "সম্পূর্ণ লাইসেন্স গাইড পড়ুন", en: "Read the full licence guide" },
  fullGuideSub: { bn: "কী কী কাগজ লাগে, কোন পরীক্ষা কীভাবে হয় — ধাপে ধাপে", en: "Documents, tests and tips — step by step" },
  disclaimer: {
    bn: "এটি একটি সাধারণ ধারণা। প্রক্রিয়া ও ফি পরিবর্তন হতে পারে, বিস্তারিত WhatsApp এ জানুন। সর্বশেষ নিয়মের জন্য BRTA এর অফিসিয়াল তথ্য দেখুন।",
    en: "This is a general overview. Process and fees may change — ask us on WhatsApp, and check BRTA's official information for current rules.",
  },
};

export const trainers = {
  eyebrow: { bn: "আমাদের প্রশিক্ষক", en: "Our trainers" },
  title: { bn: "যাদের কাছে শিখবেন", en: "The people who'll teach you" },
  years: { bn: "বছরের অভিজ্ঞতা", en: "years experience" },
};

export const gallery = {
  eyebrow: { bn: "গ্যালারি", en: "Gallery" },
  title: { bn: "আমাদের সেন্টারের মুহূর্ত", en: "Moments at our centre" },
  empty: { bn: "আসল ছবি শীঘ্রই যোগ করা হবে", en: "Real photos coming soon" },
};

export const testimonials = {
  eyebrow: { bn: "শিক্ষার্থীদের কথা", en: "What students say" },
  title: { bn: "যারা আমাদের সাথে শিখেছেন", en: "From people who learned with us" },
};

export const faq = {
  eyebrow: { bn: "প্রশ্নোত্তর", en: "FAQ" },
  title: { bn: "সাধারণ জিজ্ঞাসা", en: "Common questions" },
  more: { bn: "আরও প্রশ্ন আছে?", en: "Have another question?" },
  ask: { bn: "WhatsApp এ জিজ্ঞেস করুন", en: "Ask us on WhatsApp" },
};

export const location = {
  eyebrow: { bn: "ঠিকানা", en: "Location" },
  title: { bn: "আমাদের খুঁজে পাবেন যেখানে", en: "Where to find us" },
  howToCome: { bn: "কিভাবে আসবেন", en: "How to get here" },
  openMaps: { bn: "Google Maps এ খুলুন", en: "Open in Google Maps" },
  route: { bn: "রুট দেখুন", en: "Get directions" },
  mapTitle: { bn: "তাহয়াস কার ট্রেনিং সেন্টারের ম্যাপ", en: "Map of Tahyas Car Training Center" },
};

export const finalCta = {
  title: { bn: "আজই শুরু করুন আপনার ড্রাইভিং যাত্রা", en: "Start your driving journey today" },
  lead: { bn: "একটি মেসেজই যথেষ্ট — বাকিটা আমরা দেখিয়ে দেব।", en: "One message is all it takes — we'll guide you from there." },
};

export const chat = {
  title: { bn: "তাহয়াস সহকারী", en: "Tahyas Assistant" },
  subtitle: { bn: "অনলাইন • সাধারণত তাৎক্ষণিক উত্তর", en: "Online • usually replies instantly" },
  open: { bn: "প্রশ্ন করুন", en: "Ask a question" },
  greeting: {
    bn: "আসসালামু আলাইকুম! 👋 আমি তাহয়াস সহকারী। নিচের যেকোনো বিষয়ে চাপ দিন, অথবা নিজের মতো করে লিখুন বা 🎤 চেপে মুখে বলুন।",
    en: "Hello! 👋 I'm the Tahyas assistant. Tap a topic below, type your own question, or press 🎤 and speak.",
  },
  pickTopic: { bn: "আপনি কী জানতে চান?", en: "What would you like to know?" },
  more: { bn: "আরও জানতে চাইলে", en: "You can also ask" },
  /** Topic buttons: `label` is shown, `ask` is sent as the question. */
  topics: [
    { icon: "fee", label: { bn: "কোর্স ও ফি", en: "Courses & fees" }, ask: { bn: "কোর্সগুলো কী কী আর ফি কত?", en: "What courses do you have and what are the fees?" } },
    { icon: "women", label: { bn: "নারীদের ট্রেনিং", en: "Women's training" }, ask: { bn: "নারীদের জন্য ড্রাইভিং ট্রেনিংয়ের ব্যবস্থা কেমন?", en: "How is the driving training for women?" } },
    { icon: "beginner", label: { bn: "একদম নতুন, পারব?", en: "Total beginner?" }, ask: { bn: "আমি আগে কখনো গাড়ি চালাইনি, আমি কি শিখতে পারব?", en: "I've never driven before. Can I learn?" } },
    { icon: "license", label: { bn: "লাইসেন্স করতে কী লাগে", en: "Licence requirements" }, ask: { bn: "ড্রাইভিং লাইসেন্স করতে কী কী কাগজ আর পরীক্ষা লাগে?", en: "What documents and tests are needed for a driving licence?" } },
    { icon: "map", label: { bn: "ঠিকানা ও রুট", en: "Location & route" }, ask: { bn: "আপনাদের ঠিকানা কোথায়, কীভাবে আসব?", en: "Where are you and how do I get there?" } },
    { icon: "enrol", label: { bn: "ভর্তি হতে চাই", en: "I want to enrol" }, ask: { bn: "আমি ভর্তি হতে চাই, কীভাবে করব?", en: "I want to enrol. How do I do it?" } },
  ] as { icon: "fee" | "women" | "beginner" | "license" | "map" | "enrol"; label: Text; ask: Text }[],
  placeholder: { bn: "এখানে প্রশ্ন লিখুন…", en: "Type your question…" },
  listening: { bn: "শুনছি… বলুন", en: "Listening… speak now" },
  mic: { bn: "মুখে বলে প্রশ্ন করুন", en: "Ask by voice" },
  micStop: { bn: "শোনা বন্ধ করুন", en: "Stop listening" },
  send: { bn: "পাঠান", en: "Send" },
  restart: { bn: "নতুন করে শুরু করুন", en: "Start over" },
  askWhatsapp: { bn: "WhatsApp এ সরাসরি জিজ্ঞেস করুন", en: "Ask us directly on WhatsApp" },
  disclaimer: { bn: "এটি AI সহকারী — নিশ্চিত তথ্যের জন্য WhatsApp করুন।", en: "This is an AI assistant — confirm details on WhatsApp." },
  tooLong: { bn: "মেসেজটি একটু ছোট করে লিখুন।", en: "Please keep your message shorter." },
};
