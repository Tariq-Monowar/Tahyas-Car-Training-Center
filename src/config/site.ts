/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  SITE CONFIG — the ONLY file the owner normally needs to edit.     ║
 * ║  সাইটের সব তথ্য (নাম, WhatsApp, দাম, কোর্স, প্রশ্নোত্তর) এখানে।     ║
 * ║                                                                  ║
 * ║  Every text is { bn: "বাংলা", en: "English" }.                    ║
 * ║  ✏️ = placeholder — please confirm / replace with real info.       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
import type { Text } from "@/lib/i18n";

export type IconName =
  | "steering" | "gauge" | "parking" | "highway" | "women" | "users" | "shield"
  | "car" | "hand" | "smile" | "signpost" | "cone" | "phone-off" | "moon" | "compass";

export const site = {
  /* ───────────── Business ───────────── */
  name: { bn: "তাহয়াস কার ট্রেনিং সেন্টার", en: "Tahyas Car Training Center" } as Text,
  shortName: { bn: "তাহয়াস", en: "Tahyas" } as Text,
  tagline: {
    bn: "দক্ষতা অর্জন করুন, আত্মবিশ্বাসের সাথে গাড়ি চালান",
    en: "Build real skill, drive with confidence",
  } as Text,
  slogan: { bn: "নিরাপদ ড্রাইভিং, সুরক্ষিত জীবন", en: "Drive Smart… Live Safe…" } as Text,

  /** Live website address. Can also be set with NEXT_PUBLIC_SITE_URL. ✏️ */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tahyascartraining.com",

  /* ───────────── Contact (WhatsApp ONLY) ───────────── */
  whatsapp: {
    display: "01320381356",
    number: "8801320381356", // with country code, no "+"
    defaultMessage: {
      bn: "আসসালামু আলাইকুম, আমি তাহয়াস কার ট্রেনিং সেন্টারে ড্রাইভিং শিখতে চাই। বিস্তারিত জানাবেন?",
      en: "Hello, I want to learn driving at Tahyas Car Training Center. Could you share the details?",
    } as Text,
  },
  /** Leave "" to hide the Facebook link. ✏️ */
  facebook: "",

  /* ───────────── Location ───────────── */
  address: {
    bn: "দক্ষিণ তেমুনি, লক্ষ্মীপুর সদর, লক্ষ্মীপুর",
    en: "South Temuni, Lakshmipur Sadar, Lakshmipur",
  } as Text,
  addressParts: { locality: "Lakshmipur Sadar", region: "Lakshmipur", country: "BD" },
  geo: { lat: 22.93394902786183, lng: 90.82897227145918 },
  /** "কিভাবে আসবেন" — a nearby landmark. ✏️ */
  directions: {
    bn: "লক্ষ্মীপুর সদর থেকে দক্ষিণ তেমুনি। রাস্তা চিনতে সমস্যা হলে WhatsApp এ লোকেশন চেয়ে নিন।",
    en: "From Lakshmipur Sadar to South Temuni. If you need help finding us, ask for the location on WhatsApp.",
  } as Text,
  /** Working hours. ✏️ e.g. { bn: "শনি – বৃহস্পতি, সকাল ৮টা – সন্ধ্যা ৬টা", en: "Sat – Thu, 8 AM – 6 PM" } */
  hours: { bn: "সময়সূচি জানতে WhatsApp করুন", en: "Message us on WhatsApp for timings" } as Text,

  /* ───────────── Price & Offer ───────────── */
  pricing: {
    regular: 12000,
    discount: 2000,
    // The final price is calculated automatically: regular − discount
    label: { bn: "সম্পূর্ণ ড্রাইভিং কোর্স", en: "Complete driving course" } as Text,
    note: {
      bn: "অফারের বিস্তারিত ও কোন কোন কোর্সে প্রযোজ্য তা WhatsApp এ জেনে নিন।",
      en: "Ask on WhatsApp which courses the offer covers.",
    } as Text,
  },

  /* ───────────── Courses ───────────── */
  courses: [
    {
      id: "basic",
      icon: "steering",
      title: { bn: "বেসিক ড্রাইভিং কোর্স", en: "Basic Driving Course" },
      desc: {
        bn: "একদম নতুনদের জন্য — স্টিয়ারিং ধরা থেকে রাস্তায় নিজে চালানো পর্যন্ত, ধাপে ধাপে।",
        en: "For complete beginners — from holding the wheel to driving on the road yourself, step by step.",
      },
      learn: [
        { bn: "ক্লাচ, ব্রেক ও গিয়ার নিয়ন্ত্রণ", en: "Clutch, brake & gear control" },
        { bn: "স্টিয়ারিং ও লেন ধরে চালানো", en: "Steering & lane keeping" },
        { bn: "ট্রাফিক সাইন ও নিয়ম", en: "Traffic signs & rules" },
      ],
      duration: { bn: "সময়কাল: WhatsApp এ জানুন", en: "Duration: ask on WhatsApp" }, // ✏️
    },
    {
      id: "advance",
      icon: "gauge",
      title: { bn: "এডভান্স ড্রাইভিং কোর্স", en: "Advanced Driving Course" },
      desc: {
        bn: "যারা একটু চালাতে পারেন — শহরের ভিড়, ওভারটেকিং আর কঠিন পরিস্থিতিতে আত্মবিশ্বাস।",
        en: "For those who can drive a little — confidence in traffic, overtaking and tricky situations.",
      },
      learn: [
        { bn: "শহরের ট্রাফিকে চালানো", en: "City traffic driving" },
        { bn: "নিরাপদ ওভারটেকিং", en: "Safe overtaking" },
        { bn: "ডিফেন্সিভ ড্রাইভিং", en: "Defensive driving" },
      ],
      duration: { bn: "সময়কাল: WhatsApp এ জানুন", en: "Duration: ask on WhatsApp" }, // ✏️
    },
    {
      id: "parking",
      icon: "parking",
      title: { bn: "রিভার্স পার্কিং", en: "Reverse Parking" },
      desc: {
        bn: "মিরর দেখে নিখুঁতভাবে পেছনে নেওয়া ও পার্ক করা — যা অনেকের সবচেয়ে বড় ভয়।",
        en: "Reverse and park precisely using mirrors — the part most learners fear the most.",
      },
      learn: [
        { bn: "মিরর ব্যবহার", en: "Using mirrors" },
        { bn: "রিভার্স ও প্যারালাল পার্কিং", en: "Reverse & parallel parking" },
        { bn: "সরু জায়গায় ঘোরানো", en: "Turning in tight spaces" },
      ],
      duration: { bn: "সময়কাল: WhatsApp এ জানুন", en: "Duration: ask on WhatsApp" }, // ✏️
    },
    {
      id: "highway",
      icon: "highway",
      title: { bn: "হাইওয়ে ড্রাইভিং", en: "Highway Driving" },
      desc: {
        bn: "মহাসড়কে গতি নিয়ন্ত্রণ, নিরাপদ দূরত্ব আর বড় গাড়ির পাশে শান্ত থাকা।",
        en: "Speed control, safe following distance and staying calm next to big vehicles.",
      },
      learn: [
        { bn: "গতি ও দূরত্ব নিয়ন্ত্রণ", en: "Speed & distance control" },
        { bn: "লেন পরিবর্তন", en: "Lane changes" },
        { bn: "রাতের ড্রাইভিংয়ের প্রাথমিক ধারণা", en: "Night driving basics" },
      ],
      duration: { bn: "সময়কাল: WhatsApp এ জানুন", en: "Duration: ask on WhatsApp" }, // ✏️
    },
    {
      id: "women",
      icon: "women",
      title: { bn: "নারী ড্রাইভিং প্রশিক্ষণ", en: "Driving Training for Women" },
      badge: { bn: "বিশেষ ব্যবস্থা", en: "Special care" },
      desc: {
        bn: "স্বস্তিদায়ক ও সম্মানজনক পরিবেশে, ধৈর্য নিয়ে — নিজের গতিতে শিখুন।",
        en: "Learn at your own pace in a comfortable, respectful environment, with patient guidance.",
      },
      learn: [
        { bn: "প্রথম থেকে ধাপে ধাপে", en: "Step by step from zero" },
        { bn: "গোপনীয়তা ও স্বস্তি", en: "Privacy & comfort" },
        { bn: "আত্মবিশ্বাস তৈরি", en: "Building confidence" },
      ],
      duration: { bn: "সময়কাল: WhatsApp এ জানুন", en: "Duration: ask on WhatsApp" }, // ✏️
    },
  ] as Course[],

  /* ───────────── Women's training ───────────── */
  women: {
    /** Set true ONLY if a female trainer is really available. ✏️ */
    femaleTrainerAvailable: false,
  },

  /* ───────────── Section switches ───────────── */
  features: {
    /** Show the BRTA licence guidance section. Turn off if you don't help with licences. */
    licenseGuide: true,
  },

  /** Show "আনুমানিক N+ শিক্ষার্থী" counter only when you have a real number. ✏️ e.g. 250 */
  studentsTrained: null as number | null,

  /* ───────────── Trainers (hidden until filled) ─────────────
     Example:
     { name: { bn: "মোঃ করিম", en: "Md. Karim" }, years: 8, photo: "trainer-1" }
     → put the photo at public/images/real/trainer-1.jpg                       */
  trainers: [] as Trainer[],

  /* ───────────── Reviews (hidden until filled) ─────────────
     Add ONLY real reviews, with the student's permission. Example:
     { name: "রাশেদ, লক্ষ্মীপুর", text: { bn: "...", en: "..." }, course: "basic" }        */
  testimonials: [] as Testimonial[],

  /* ───────────── Gallery captions ─────────────
     Drop photos into public/images/real/gallery/ — they appear automatically.
     Optional captions by file name:                                          */
  galleryCaptions: {
    // "01.jpg": { bn: "প্র্যাকটিক্যাল ক্লাস", en: "Practical class" },
  } as Record<string, Text>,

  /* ───────────── FAQ (✏️ = confirm the answer) ───────────── */
  faqs: [
    {
      q: { bn: "আমি আগে কখনো গাড়ি চালাইনি — আমি কি শিখতে পারব?", en: "I've never driven before — can I learn?" },
      a: {
        bn: "অবশ্যই। নতুনদের কথা ভেবেই আমাদের পদ্ধতি সাজানো — প্রথম ক্লাসে গাড়ির কন্ট্রোল চেনা থেকে শুরু করে ধাপে ধাপে রাস্তায় চালানো পর্যন্ত নিয়ে যাওয়া হয়।",
        en: "Absolutely. We start from knowing the controls and take you step by step to driving on the road.",
      },
    },
    {
      q: { bn: "কোর্স কতদিনের, প্রতিদিন কতক্ষণ ক্লাস হয়?", en: "How long is the course and each class?" },
      a: {
        bn: "কোর্স ও আপনার অগ্রগতির উপর নির্ভর করে। সঠিক সময়সূচি জানতে WhatsApp এ মেসেজ করুন।", // ✏️
        en: "It depends on the course and your progress. Message us on WhatsApp for the exact schedule.",
      },
    },
    {
      q: { bn: "ছাত্র বা চাকরিজীবী — নিজের সুবিধামতো সময়ে ক্লাস করা যাবে?", en: "Can students or job-holders choose their class time?" },
      a: {
        bn: "ভর্তির সময় আপনার সুবিধাজনক সময় জানান — সাধ্যমতো সেভাবে সময় ঠিক করা হয়।", // ✏️
        en: "Tell us your preferred time when enrolling — we arrange it as far as possible.",
      },
    },
    {
      q: { bn: "৳১০,০০০ অফারে কী কী অন্তর্ভুক্ত?", en: "What does the ৳10,000 offer include?" },
      a: {
        bn: "অফারটি কোন কোর্সে ও কতগুলো ক্লাসে প্রযোজ্য, তা WhatsApp এ জেনে নিন। কোনো লুকানো খরচ থাকলে ভর্তির আগেই জানিয়ে দেওয়া হয়।", // ✏️
        en: "Ask on WhatsApp which course and how many classes the offer covers. Any extra cost is told before enrolling.",
      },
    },
    {
      q: { bn: "নারীরা কি নিরাপদ ও স্বস্তিতে শিখতে পারবেন?", en: "Can women learn safely and comfortably?" },
      a: {
        bn: "হ্যাঁ। সম্মানজনক ও স্বস্তিদায়ক পরিবেশে, ধৈর্য নিয়ে আপনার গতিতে শেখানো হয়। কোনো প্রশ্ন থাকলে ভর্তির আগে WhatsApp এ জানান।",
        en: "Yes. Training is respectful, comfortable and patient, at your own pace. Any questions — ask on WhatsApp before enrolling.",
      },
    },
    {
      q: { bn: "লক্ষ্মীপুর শহর থেকে কীভাবে আসব?", en: "How do I get there from Lakshmipur town?" },
      a: {
        bn: "আমরা দক্ষিণ তেমুনি, লক্ষ্মীপুর সদরে। নিচের ম্যাপে \"রুট দেখুন\" চাপলে Google Maps পথ দেখাবে। রাস্তা চিনতে সমস্যা হলে WhatsApp এ লোকেশন চেয়ে নিন।",
        en: "We're in South Temuni, Lakshmipur Sadar. Tap \"Get directions\" on the map below, or ask for the location on WhatsApp.",
      },
    },
    {
      q: { bn: "কোন ধরনের গাড়িতে শেখানো হয় — ম্যানুয়াল না অটো?", en: "Manual or automatic car?" },
      a: { bn: "গাড়ির ধরন সম্পর্কে WhatsApp এ জেনে নিন।", en: "Ask us on WhatsApp about the car type." }, // ✏️
    },
    {
      q: { bn: "ফি কীভাবে দিতে হয়? কিস্তিতে দেওয়া যায়?", en: "How do I pay? Are instalments possible?" },
      a: { bn: "পেমেন্টের নিয়ম ভর্তির সময় জানানো হয়। কিস্তির সুযোগ আছে কিনা WhatsApp এ জিজ্ঞেস করুন।", en: "Payment terms are shared at admission. Ask on WhatsApp about instalments." }, // ✏️
    },
    {
      q: { bn: "ড্রাইভিং লাইসেন্স পেতে কী কী লাগে?", en: "What do I need for a driving licence?" },
      a: {
        bn: "NID, ছবি, মেডিকেল সার্টিফিকেট ও অনলাইনে লার্নার লাইসেন্সের আবেদন — এরপর লিখিত, মৌখিক ও মাঠ পরীক্ষা। পুরো ধাপগুলো আমাদের \"লাইসেন্স গাইড\" পেজে বিস্তারিত দেওয়া আছে।",
        en: "NID, photo, medical certificate and an online learner-licence application — then written, viva and field tests. See our Licence guide page for every step.",
      },
    },
    {
      q: { bn: "প্রথম ক্লাসে কী নিয়ে আসব?", en: "What should I bring to the first class?" },
      a: {
        bn: "আরামদায়ক পোশাক ও শক্ত জুতা (স্যান্ডেল বা চপ্পল নয়)। ভর্তির জন্য কোনো কাগজ লাগলে আগেই WhatsApp এ জানিয়ে দেওয়া হবে।",
        en: "Comfortable clothes and closed shoes (not sandals or slippers). If any paper is needed for admission, we'll tell you on WhatsApp.",
      },
    },
  ] as Faq[],

  /* ───────────── Certificate ─────────────
     Printed at the bottom of every course-completion certificate.
     A name is drawn as a handwritten signature above the line and printed
     under it. Leave a name "" to show only the signature line + title.
     Signatures sit on the left (and right, if a second one is added); the seal stays in the middle. ✏️ */
  certificate: {
    prefix: "TCTC",
    signatories: [
      { name: "Tahsan Tahsin", title: "Director & Trainer" },
    ],
  },

  /** Analytics placeholder. Paste a lightweight script id here later (e.g. Cloudflare Web Analytics token). */
  analytics: { cloudflareToken: "" },
};

/* ───────────── Types (no need to edit) ───────────── */
export type Course = {
  id: string;
  icon: IconName;
  title: Text;
  desc: Text;
  learn: Text[];
  duration: Text;
  badge?: Text;
};
export type Trainer = { name: Text; years: number; photo?: string; note?: Text };
export type Testimonial = { name: string; text: Text; course?: string };
export type Faq = { q: Text; a: Text };

export const finalPrice = site.pricing.regular - site.pricing.discount;
