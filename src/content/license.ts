/**
 * Driving licence guide page (/license and /en/license).
 * General guidance on the BRTA process in Bangladesh — NOT legal advice.
 * Fees are intentionally not listed (they change). Review this text from time to time.
 */
import type { Text } from "@/lib/i18n";

export const licensePage = {
  meta: {
    title: {
      bn: "ড্রাইভিং লাইসেন্স করতে কী কী লাগে — কাগজপত্র ও পরীক্ষা | তাহয়াস, লক্ষ্মীপুর",
      en: "How to get a driving licence in Bangladesh — documents & tests | Tahyas, Lakshmipur",
    },
    description: {
      bn: "বাংলাদেশে (লক্ষ্মীপুর) ড্রাইভিং লাইসেন্স পেতে কী কী কাগজপত্র লাগে, লার্নার লাইসেন্স, লিখিত-মৌখিক-মাঠ পরীক্ষা, বায়োমেট্রিক ও স্মার্ট কার্ড — ধাপে ধাপে সহজ গাইড।",
      en: "Step-by-step guide to getting a driving licence in Bangladesh (Lakshmipur): documents, learner licence, written/viva/field tests, biometrics and the smart card.",
    },
  },
  crumbHome: { bn: "হোম", en: "Home" },
  crumb: { bn: "লাইসেন্স গাইড", en: "Licence guide" },
  eyebrow: { bn: "ড্রাইভিং লাইসেন্স গাইড", en: "Driving licence guide" },
  title: { bn: "ড্রাইভিং লাইসেন্স পেতে কী কী লাগে?", en: "What do you need for a driving licence?" },
  lead: {
    bn: "লক্ষ্মীপুর থেকে BRTA ড্রাইভিং লাইসেন্স পাওয়ার পুরো প্রক্রিয়া — কাগজপত্র থেকে স্মার্ট কার্ড পর্যন্ত — সহজ ভাষায়, ধাপে ধাপে।",
    en: "The full BRTA licence process from Lakshmipur — from documents to the smart card — in simple steps.",
  },
  updatedNote: {
    bn: "এটি সাধারণ তথ্য, আইনি পরামর্শ নয়। BRTA-র নিয়ম ও ফি পরিবর্তন হতে পারে — আবেদনের আগে অফিসিয়াল ওয়েবসাইট দেখে নিন।",
    en: "General information, not legal advice. BRTA rules and fees can change — check the official website before applying.",
  },

  /* Quick facts */
  facts: [
    { k: { bn: "কোথায় আবেদন", en: "Apply at" }, v: { bn: "BRTA সার্ভিস পোর্টাল (অনলাইন)", en: "BRTA Service Portal (online)" } },
    { k: { bn: "নিকটস্থ অফিস", en: "Nearest office" }, v: { bn: "বিআরটিএ লক্ষ্মীপুর সার্কেল", en: "BRTA Lakshmipur Circle" } },
    { k: { bn: "লাইসেন্সের বয়স", en: "Licence age" }, v: { bn: "অপেশাদার ১৮+, পেশাদার ২০+", en: "Non-professional 18+, professional 20+" } },
    { k: { bn: "পরীক্ষা", en: "Tests" }, v: { bn: "লিখিত, মৌখিক ও মাঠ পরীক্ষা", en: "Written, viva and field test" } },
  ] as { k: Text; v: Text }[],
  ageNote: {
    bn: "গাড়ি চালানো শেখা যেকোনো বয়সে শুরু করা যায়। লাইসেন্সের আবেদন করা যায় নির্ধারিত বয়স হলে।",
    en: "You can start learning to drive at any age; you apply for the licence once you reach the required age.",
  },

  /* Documents */
  docsTitle: { bn: "প্রয়োজনীয় কাগজপত্র", en: "Documents you need" },
  docsLead: {
    bn: "লার্নার লাইসেন্সের আবেদনের সময় এগুলো প্রস্তুত রাখুন (স্ক্যান কপি অনলাইনে আপলোড করতে হয়):",
    en: "Keep these ready when applying for the learner licence (scanned copies are uploaded online):",
  },
  docs: [
    {
      icon: "id",
      title: { bn: "জাতীয় পরিচয়পত্র (NID)", en: "National ID card (NID)" },
      desc: { bn: "NID নম্বর ও কার্ডের কপি। আবেদনের তথ্য NID-র সাথে হুবহু মিলতে হবে।", en: "NID number and a copy. Your application details must match the NID exactly." },
    },
    {
      icon: "photo",
      title: { bn: "সাম্প্রতিক ছবি", en: "Recent photo" },
      desc: { bn: "সাদা ব্যাকগ্রাউন্ডে তোলা পাসপোর্ট সাইজের রঙিন ছবি (ডিজিটাল কপি)।", en: "Passport-size colour photo on a white background (digital copy)." },
    },
    {
      icon: "medical",
      title: { bn: "মেডিকেল সার্টিফিকেট", en: "Medical certificate" },
      desc: {
        bn: "রেজিস্টার্ড এমবিবিএস ডাক্তারের দেওয়া সার্টিফিকেট (BMDC রেজিস্ট্রেশন নম্বরসহ) — চোখের দৃষ্টি ও শারীরিক সক্ষমতার জন্য।",
        en: "From a registered MBBS doctor (with BMDC number) — confirming eyesight and physical fitness.",
      },
    },
    {
      icon: "address",
      title: { bn: "ঠিকানার তথ্য", en: "Address details" },
      desc: { bn: "বর্তমান ও স্থায়ী ঠিকানা। লক্ষ্মীপুরের বাসিন্দারা সাধারণত লক্ষ্মীপুর সার্কেলে পরীক্ষা দেন।", en: "Present and permanent address. Lakshmipur residents usually take tests at the Lakshmipur circle." },
    },
    {
      icon: "edu",
      title: { bn: "শিক্ষাগত যোগ্যতার সনদ", en: "Education certificate" },
      desc: { bn: "পেশাদার লাইসেন্সের ক্ষেত্রে প্রয়োজন হয়। আপনার ক্ষেত্রে লাগবে কিনা আবেদনের সময় দেখে নিন।", en: "Needed for a professional licence. Check whether it applies to you when applying." },
    },
    {
      icon: "fee",
      title: { bn: "নির্ধারিত ফি", en: "Prescribed fee" },
      desc: { bn: "অনলাইন বা ব্যাংকের মাধ্যমে পরিশোধ। ফি পরিবর্তন হতে পারে, তাই BRTA ওয়েবসাইটে সর্বশেষ ফি দেখুন।", en: "Paid online or via bank. Fees change, so check the latest on the BRTA website." },
    },
  ] as { icon: "id" | "photo" | "medical" | "address" | "edu" | "fee"; title: Text; desc: Text }[],

  /* Steps */
  stepsTitle: { bn: "ধাপে ধাপে প্রক্রিয়া", en: "Step-by-step process" },
  steps: [
    {
      title: { bn: "লার্নার (শিক্ষানবিশ) লাইসেন্সের আবেদন", en: "Apply for a learner licence" },
      body: {
        bn: "BRTA সার্ভিস পোর্টালে অ্যাকাউন্ট খুলে অনলাইনে আবেদন করুন, কাগজপত্র আপলোড করুন ও ফি দিন। আবেদন সম্পন্ন হলে লার্নার কার্ড পাবেন — সেখানে পরীক্ষার তারিখ ও কেন্দ্র লেখা থাকে।",
        en: "Create an account on the BRTA Service Portal, apply online, upload documents and pay the fee. You'll receive a learner card showing your test date and centre.",
      },
      tip: { bn: "লার্নার কার্ড প্রিন্ট করে রাখুন — পরীক্ষার দিন লাগবে।", en: "Print the learner card — you'll need it on test day." },
    },
    {
      title: { bn: "লার্নার সময়ে অনুশীলন", en: "Practise during the learner period" },
      body: {
        bn: "লার্নার লাইসেন্সের মেয়াদে অনুশীলন করুন। এ সময় গাড়ির সামনে-পেছনে 'L' চিহ্ন রাখতে হয় এবং পাশে বৈধ লাইসেন্সধারী অভিজ্ঞ চালক থাকতে হয়।",
        en: "Practise while the learner licence is valid. Show an 'L' sign front and back and drive with an experienced licensed driver beside you.",
      },
      tip: { bn: "এই সময়েই আমাদের কোর্সে মাঠ পরীক্ষার মতো করে অনুশীলন করুন।", en: "This is the best time to practise test manoeuvres in our course." },
    },
    {
      title: { bn: "লিখিত পরীক্ষা", en: "Written test" },
      body: {
        bn: "বহুনির্বাচনী প্রশ্নে ট্রাফিক সাইন, সড়কের মার্কিং, ট্রাফিক আইন, গতিসীমা, ওভারটেকিং ও গাড়ির প্রয়োজনীয় কাগজপত্র (রেজিস্ট্রেশন, ফিটনেস, ট্যাক্স টোকেন, ইন্স্যুরেন্স) নিয়ে প্রশ্ন থাকে।",
        en: "Multiple-choice questions on traffic signs, road markings, traffic law, speed limits, overtaking and vehicle papers (registration, fitness, tax token, insurance).",
      },
      tip: { bn: "সাইনগুলো তিন ভাগে মনে রাখুন: বাধ্যতামূলক (গোল), সতর্কতামূলক (ত্রিভুজ), তথ্যমূলক (আয়তাকার)।", en: "Remember signs in three groups: mandatory (round), warning (triangle), informative (rectangle)." },
    },
    {
      title: { bn: "মৌখিক পরীক্ষা (ভাইভা)", en: "Viva (oral test)" },
      body: {
        bn: "পরীক্ষক সাইন দেখিয়ে অর্থ জিজ্ঞেস করতে পারেন, কিংবা নিরাপদ চালনা ও গাড়ির সাধারণ বিষয়ে ছোট প্রশ্ন করতে পারেন।",
        en: "The examiner may show signs and ask their meaning, or ask short questions on safe driving and basic vehicle knowledge.",
      },
      tip: { bn: "শান্তভাবে, সংক্ষেপে উত্তর দিন।", en: "Answer calmly and briefly." },
    },
    {
      title: { bn: "মাঠ (ব্যবহারিক) পরীক্ষা", en: "Field (practical) test" },
      body: {
        bn: "সাধারণত জিগজ্যাগ (কোনের ফাঁক দিয়ে আঁকাবাঁকা চালানো), র‍্যাম্প (ঢালে থামানো ও আবার চালু করা), রিভার্স/পার্কিং এবং রাস্তায় চালানো দেখা হয়। সিটবেল্ট, মিরর, ইন্ডিকেটর ব্যবহার খেয়াল করা হয়।",
        en: "Usually zig-zag between cones, ramp (stop and start on a slope), reversing/parking and a road drive. Use of seat belt, mirrors and indicators is checked.",
      },
      tip: { bn: "গাড়িতে উঠেই সিটবেল্ট, সিট ও মিরর ঠিক করুন — এটাও নম্বরে আসে।", en: "Fasten the seat belt and set the seat and mirrors first — it counts." },
    },
    {
      title: { bn: "বায়োমেট্রিক ও স্মার্ট কার্ড", en: "Biometrics & smart card" },
      body: {
        bn: "তিনটি পরীক্ষায় পাস করলে স্মার্ট কার্ডের ফি দিয়ে নির্ধারিত দিনে BRTA অফিসে ছবি, আঙুলের ছাপ ও স্বাক্ষর দিতে হয়। এরপর স্মার্ট কার্ড প্রস্তুত হলে তা সংগ্রহ বা ডাকযোগে পাওয়া যায়।",
        en: "After passing all three tests, pay the smart-card fee and give your photo, fingerprints and signature at the BRTA office. The smart card is then collected or delivered by post.",
      },
      tip: { bn: "কার্ড আসার আগ পর্যন্ত BRTA-র দেওয়া অস্থায়ী কাগজটি সাথে রাখুন।", en: "Carry the temporary BRTA slip until the card arrives." },
    },
  ] as { title: Text; body: Text; tip: Text }[],

  /* Test day checklist */
  checklistTitle: { bn: "পরীক্ষার দিন সাথে নিন", en: "Bring on test day" },
  checklist: [
    { bn: "লার্নার কার্ডের প্রিন্ট কপি", en: "Printed learner card" },
    { bn: "মূল জাতীয় পরিচয়পত্র (NID)", en: "Original NID card" },
    { bn: "কলম (লিখিত পরীক্ষার জন্য)", en: "A pen (for the written test)" },
    { bn: "'L' চিহ্নসহ পরীক্ষার উপযোগী গাড়ি (প্রয়োজনে)", en: "A test-ready car with 'L' signs (if required)" },
    { bn: "সময়ের আগে কেন্দ্রে পৌঁছান", en: "Arrive at the centre early" },
  ] as Text[],

  /* Common mistakes */
  mistakesTitle: { bn: "যে ভুলগুলোতে অনেকে ফেল করেন", en: "Common reasons people fail" },
  mistakes: [
    { bn: "সিটবেল্ট বাঁধতে ভুলে যাওয়া", en: "Forgetting the seat belt" },
    { bn: "জিগজ্যাগে কোনে ধাক্কা লাগা", en: "Touching cones in the zig-zag" },
    { bn: "র‍্যাম্পে গাড়ি পেছনে গড়িয়ে যাওয়া বা ইঞ্জিন বন্ধ হয়ে যাওয়া", en: "Rolling back or stalling on the ramp" },
    { bn: "মোড় নেওয়ার আগে ইন্ডিকেটর ও মিরর না দেখা", en: "Not checking mirrors or indicating before turning" },
    { bn: "ট্রাফিক সাইন গুলিয়ে ফেলা", en: "Mixing up traffic signs" },
  ] as Text[],

  /* How we help */
  helpTitle: { bn: "আমরা কীভাবে প্রস্তুত করি", en: "How we prepare you" },
  help: [
    { bn: "মাঠ পরীক্ষার মতো জিগজ্যাগ, র‍্যাম্প ও রিভার্স অনুশীলন", en: "Zig-zag, ramp and reverse practice, just like the field test" },
    { bn: "ট্রাফিক সাইন ও আইন সহজ ভাষায় বুঝিয়ে দেওয়া", en: "Traffic signs and rules explained simply" },
    { bn: "পরীক্ষার আগে আত্মবিশ্বাস তৈরি — ধৈর্য নিয়ে, ধাপে ধাপে", en: "Building confidence before the test — patiently, step by step" },
  ] as Text[],
  helpNote: {
    bn: "লাইসেন্স প্রক্রিয়ায় আমাদের সহায়তার বিস্তারিত WhatsApp এ জেনে নিন। আমরা কোনো পরীক্ষায় পাসের নিশ্চয়তা দিই না — পাস নির্ভর করে আপনার দক্ষতার উপর।",
    en: "Ask on WhatsApp what licence help we offer. We never guarantee a pass — passing depends on your skill.",
  },
  ctaMessage: {
    bn: "আসসালামু আলাইকুম, ড্রাইভিং লাইসেন্সের পরীক্ষার প্রস্তুতি নিয়ে জানতে চাই।",
    en: "Hello, I'd like to know about preparing for the driving licence test.",
  },

  /* Links */
  officialTitle: { bn: "অফিসিয়াল তথ্য", en: "Official information" },
  official: [
    { label: { bn: "BRTA অফিসিয়াল ওয়েবসাইট", en: "BRTA official website" }, href: "https://brta.gov.bd" },
    { label: { bn: "BRTA সার্ভিস পোর্টাল (অনলাইন আবেদন)", en: "BRTA Service Portal (apply online)" }, href: "https://bsp.brta.gov.bd" },
  ] as { label: Text; href: string }[],

  /* Page FAQ */
  faqTitle: { bn: "লাইসেন্স নিয়ে প্রশ্নোত্তর", en: "Licence questions" },
  faqs: [
    {
      q: { bn: "লাইসেন্স না থাকলে কি শেখা যাবে?", en: "Can I learn without a licence?" },
      a: { bn: "হ্যাঁ। শেখার জন্য লাইসেন্স লাগে না — প্রশিক্ষকের তত্ত্বাবধানে শিখুন। রাস্তায় একা চালাতে হলে লাইসেন্স লাগবে।", en: "Yes. You don't need a licence to learn under a trainer. You need one to drive alone on public roads." },
    },
    {
      q: { bn: "আগে শিখব, নাকি আগে লার্নার লাইসেন্স করব?", en: "Learn first or get the learner licence first?" },
      a: { bn: "দুটো একসাথে চলতে পারে। অনেকে কোর্স শুরু করে লার্নার লাইসেন্সের আবেদন করেন, যাতে পরীক্ষার তারিখের আগেই প্রস্তুত থাকেন।", en: "Both can run together. Many start the course and apply for the learner licence so they're ready by the test date." },
    },
    {
      q: { bn: "পরীক্ষায় ফেল করলে কী হবে?", en: "What if I fail?" },
      a: { bn: "নিয়ম অনুযায়ী আবার পরীক্ষার সুযোগ পাওয়া যায়। বিস্তারিত নিয়ম BRTA থেকে জেনে নিন, আর দুর্বল অংশগুলো আবার অনুশীলন করুন।", en: "You can retake as per the rules — check details with BRTA and practise your weak areas." },
    },
    {
      q: { bn: "দালাল ছাড়া নিজে কি আবেদন করা যায়?", en: "Can I apply myself, without an agent?" },
      a: { bn: "হ্যাঁ, পুরো আবেদন অনলাইনে নিজেই করা যায়। কোনো অনানুষ্ঠানিক টাকা দেবেন না — সব ফি অফিসিয়াল মাধ্যমে দিন।", en: "Yes, the whole application can be done online yourself. Never pay unofficial money — pay fees only through official channels." },
    },
  ] as { q: Text; a: Text }[],
};
