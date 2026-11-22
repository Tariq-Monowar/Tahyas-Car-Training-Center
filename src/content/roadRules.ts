/**
 * Road rules & signs (home section + /road-rules page).
 * General road-safety guidance for Bangladesh — not legal advice. Fines are intentionally not listed (they change).
 */
import type { SignKind } from "@/components/road/Signs";
import type { Text } from "@/lib/i18n";

type Sign = { kind: SignKind; name: Text; meaning: Text };

export const roadRules = {
  meta: {
    title: {
      bn: "ট্রাফিক সাইন, সংকেত ও সড়ক আইন — সহজ গাইড | তাইয়াস, লক্ষ্মীপুর",
      en: "Traffic signs, signals & road rules in Bangladesh — simple guide | Tahyas, Lakshmipur",
    },
    description: {
      bn: "বাংলাদেশের ট্রাফিক লাইট, সব ধরনের রোড সাইন, রাস্তায় গাড়ির সঠিক অবস্থান, ওভারটেকিং, রাস্তার দাগ ও গুরুত্বপূর্ণ সড়ক পরিবহন আইন — ছবি দিয়ে সহজ ভাষায়।",
      en: "Bangladesh traffic lights, road signs, lane position, overtaking, road markings and key road-transport rules — explained simply with pictures.",
    },
  },
  crumb: { bn: "ট্রাফিক নিয়ম ও সাইন", en: "Road rules & signs" },
  eyebrow: { bn: "রাস্তার নিয়ম", en: "Rules of the road" },
  title: { bn: "ট্রাফিক সাইন, সংকেত ও সড়ক আইন", en: "Traffic signs, signals & road rules" },
  lead: {
    bn: "নিরাপদে গাড়ি চালাতে আর লাইসেন্স পরীক্ষায় পাস করতে যা জানা দরকার — ছবি দিয়ে, সহজ ভাষায়।",
    en: "What you need to know to drive safely and pass the licence test — with pictures, in simple words.",
  },

  /* Home teaser */
  homeTitle: { bn: "রাস্তার নিয়ম ও সাইন শিখুন", en: "Learn the road rules & signs" },
  homeLead: {
    bn: "ট্রাফিক লাইট, রোড সাইন আর রাস্তায় সঠিক অবস্থান — নিরাপদ চালনা আর লাইসেন্স পরীক্ষার জন্য জরুরি।",
    en: "Traffic lights, road signs and lane position — essential for safe driving and the licence test.",
  },
  tapLight: { bn: "বাতিতে চাপ দিয়ে দেখুন", en: "Tap a light to see its meaning" },
  quickRules: [
    { bn: "সবসময় রাস্তার বাম দিক দিয়ে চলুন", en: "Always keep to the left" },
    { bn: "ওভারটেক করুন শুধু ডান দিক দিয়ে", en: "Overtake only on the right" },
    { bn: "জেব্রা ক্রসিংয়ে পথচারী আগে", en: "Pedestrians first at zebra crossings" },
  ] as Text[],
  fullPage: { bn: "সব সাইন ও ট্রাফিক আইন দেখুন", en: "See all signs & road rules" },
  fullPageSub: { bn: "ট্রাফিক লাইট, {n}টি সাইন, লেন, রাস্তার দাগ ও আইন — এক জায়গায়", en: "Lights, {n} signs, lanes, markings and law — in one place" },
  homeSigns: ["stop", "no-entry", "speed-limit", "no-overtaking", "pedestrian-crossing", "school", "speed-breaker", "keep-left"] as SignKind[],

  /* 1. Traffic lights */
  lightsTitle: { bn: "ট্রাফিক লাইট", en: "Traffic lights" },
  lights: {
    red: {
      name: { bn: "লাল বাতি", en: "Red" },
      meaning: { bn: "থামুন। স্টপ লাইন বা জেব্রা ক্রসিংয়ের আগে সম্পূর্ণ থামুন এবং সবুজ না হওয়া পর্যন্ত অপেক্ষা করুন।", en: "Stop. Come to a full stop before the stop line or zebra crossing and wait for green." },
    },
    yellow: {
      name: { bn: "হলুদ বাতি", en: "Yellow" },
      meaning: { bn: "থামার প্রস্তুতি নিন — লাল আসছে। নিরাপদে থামা সম্ভব হলে থামুন; গতি বাড়িয়ে পার হওয়ার চেষ্টা করবেন না।", en: "Get ready to stop — red is coming. Stop if you safely can; never speed up to beat it." },
    },
    green: {
      name: { bn: "সবুজ বাতি", en: "Green" },
      meaning: { bn: "চলতে পারেন — তবে সামনে-পাশে দেখে। মোড়ে থাকা পথচারী ও যানবাহনকে আগে যেতে দিন।", en: "You may go — but look first. Let pedestrians and vehicles already in the junction clear." },
    },
  },
  lightsNote: {
    bn: "ট্রাফিক পুলিশ হাতের সংকেত দিলে বাতির চেয়ে পুলিশের সংকেত মানতে হবে।",
    en: "If a traffic officer is directing traffic, follow the officer over the lights.",
  },

  /* 2. Signs */
  signsTitle: { bn: "রোড সাইন", en: "Road signs" },
  signsLead: {
    bn: "আকৃতি আর রং দেখেই সাইনের ধরন বোঝা যায়:",
    en: "The shape and colour tell you the type of sign:",
  },
  groups: [
    {
      id: "prohibitory",
      name: { bn: "নিষেধমূলক সাইন", en: "Prohibitory signs" },
      hint: { bn: "গোল, লাল বর্ডার — যা করা যাবে না", en: "Round, red border — what you must not do" },
      signs: [
        { kind: "stop", name: { bn: "থামুন", en: "Stop" }, meaning: { bn: "সম্পূর্ণ থামুন, দেখে তারপর চলুন।", en: "Stop completely, look, then go." } },
        { kind: "no-entry", name: { bn: "প্রবেশ নিষেধ", en: "No entry" }, meaning: { bn: "এই দিক দিয়ে কোনো যান ঢুকবে না।", en: "No vehicle may enter this way." } },
        { kind: "speed-limit", name: { bn: "সর্বোচ্চ গতিসীমা", en: "Speed limit" }, meaning: { bn: "সাইনে লেখা গতির (কিমি/ঘণ্টা) বেশি চালানো যাবে না।", en: "Do not exceed the speed shown (km/h)." } },
        { kind: "no-overtaking", name: { bn: "ওভারটেকিং নিষেধ", en: "No overtaking" }, meaning: { bn: "এখানে অন্য গাড়িকে পেছন থেকে অতিক্রম করা যাবে না।", en: "Do not overtake other vehicles here." } },
        { kind: "no-horn", name: { bn: "হর্ন বাজানো নিষেধ", en: "No horn" }, meaning: { bn: "হাসপাতাল, স্কুলের মতো নীরব এলাকায় হর্ন নয়।", en: "No horn in silent zones like hospitals and schools." } },
        { kind: "no-right-turn", name: { bn: "ডানে মোড় নিষেধ", en: "No right turn" }, meaning: { bn: "এখান থেকে ডানে ঘোরা যাবে না।", en: "Do not turn right here." } },
        { kind: "no-left-turn", name: { bn: "বামে মোড় নিষেধ", en: "No left turn" }, meaning: { bn: "এখান থেকে বামে ঘোরা যাবে না।", en: "Do not turn left here." } },
        { kind: "no-u-turn", name: { bn: "ইউ-টার্ন নিষেধ", en: "No U-turn" }, meaning: { bn: "এখানে গাড়ি ঘুরিয়ে উল্টো দিকে যাওয়া যাবে না।", en: "Do not make a U-turn here." } },
        { kind: "no-parking", name: { bn: "পার্কিং নিষেধ", en: "No parking" }, meaning: { bn: "এখানে গাড়ি রেখে যাওয়া যাবে না।", en: "Do not park here." } },
        { kind: "no-stopping", name: { bn: "থামা নিষেধ", en: "No stopping" }, meaning: { bn: "এখানে এক মুহূর্তের জন্যও থামা যাবে না।", en: "Do not stop here at all." } },
      ] as Sign[],
    },
    {
      id: "mandatory",
      name: { bn: "বাধ্যতামূলক সাইন", en: "Mandatory signs" },
      hint: { bn: "গোল, নীল — যা অবশ্যই করতে হবে", en: "Round, blue — what you must do" },
      signs: [
        { kind: "keep-left", name: { bn: "বাম দিক দিয়ে চলুন", en: "Keep left" }, meaning: { bn: "সাইনের বাম পাশ দিয়ে চলতে হবে।", en: "Pass on the left of the sign." } },
        { kind: "ahead-only", name: { bn: "শুধু সোজা চলুন", en: "Ahead only" }, meaning: { bn: "শুধু সামনের দিকে যাওয়া যাবে।", en: "You may only go straight ahead." } },
        { kind: "turn-left", name: { bn: "বামে ঘুরুন", en: "Turn left" }, meaning: { bn: "সামনে বামে মোড় নিতে হবে।", en: "You must turn left ahead." } },
        { kind: "roundabout", name: { bn: "গোলচত্বর", en: "Roundabout" }, meaning: { bn: "গোলচত্বরে ঘড়ির কাঁটার দিকে ঘুরুন।", en: "Go round the roundabout clockwise." } },
      ] as Sign[],
    },
    {
      id: "warning",
      name: { bn: "সতর্কতামূলক সাইন", en: "Warning signs" },
      hint: { bn: "ত্রিভুজ, লাল বর্ডার — সামনে বিপদ/সতর্কতা", en: "Triangle, red border — hazard ahead" },
      signs: [
        { kind: "bend-left", name: { bn: "সামনে বামে বাঁক", en: "Bend to the left" }, meaning: { bn: "গতি কমান, বাঁকে ওভারটেক করবেন না।", en: "Slow down; don't overtake on the bend." } },
        { kind: "bend-right", name: { bn: "সামনে ডানে বাঁক", en: "Bend to the right" }, meaning: { bn: "গতি কমান, নিজের লেনে থাকুন।", en: "Slow down and keep to your lane." } },
        { kind: "pedestrian-crossing", name: { bn: "পথচারী পারাপার", en: "Pedestrian crossing" }, meaning: { bn: "সামনে জেব্রা ক্রসিং — থামার জন্য প্রস্তুত থাকুন।", en: "Zebra crossing ahead — be ready to stop." } },
        { kind: "school", name: { bn: "স্কুল / শিশু", en: "School / children" }, meaning: { bn: "শিশুরা রাস্তা পার হতে পারে — খুব ধীরে চলুন।", en: "Children may cross — drive very slowly." } },
        { kind: "speed-breaker", name: { bn: "সামনে গতিরোধক", en: "Speed breaker ahead" }, meaning: { bn: "গতি কমিয়ে আস্তে পার হোন।", en: "Slow down and cross gently." } },
        { kind: "railway-crossing", name: { bn: "রেলক্রসিং", en: "Railway crossing" }, meaning: { bn: "থামুন, দুই দিকে দেখে তারপর পার হোন।", en: "Stop, look both ways, then cross." } },
        { kind: "narrow-road", name: { bn: "সামনে সরু রাস্তা", en: "Road narrows" }, meaning: { bn: "রাস্তা সরু হচ্ছে — সামনের গাড়িকে জায়গা দিন।", en: "The road narrows — give way where needed." } },
        { kind: "signals-ahead", name: { bn: "সামনে ট্রাফিক লাইট", en: "Traffic signals ahead" }, meaning: { bn: "থামার জন্য প্রস্তুত থাকুন।", en: "Be ready to stop." } },
        { kind: "two-way", name: { bn: "দুই দিকের যান চলাচল", en: "Two-way traffic" }, meaning: { bn: "উল্টো দিক থেকেও গাড়ি আসবে — বাম পাশে থাকুন।", en: "Oncoming traffic — keep left." } },
        { kind: "crossroads", name: { bn: "সামনে চৌরাস্তা", en: "Crossroads ahead" }, meaning: { bn: "গতি কমান, দুই পাশ দেখুন।", en: "Slow down and look both ways." } },
      ] as Sign[],
    },
    {
      id: "informative",
      name: { bn: "তথ্যমূলক সাইন", en: "Informative signs" },
      hint: { bn: "আয়তাকার, নীল — দরকারি তথ্য", en: "Rectangular, blue — useful information" },
      signs: [
        { kind: "parking", name: { bn: "পার্কিং", en: "Parking" }, meaning: { bn: "এখানে গাড়ি রাখা যাবে।", en: "Parking is allowed here." } },
        { kind: "hospital", name: { bn: "হাসপাতাল", en: "Hospital" }, meaning: { bn: "কাছে হাসপাতাল — হর্ন নয়, ধীরে চলুন।", en: "Hospital nearby — no horn, go slowly." } },
        { kind: "fuel", name: { bn: "পেট্রল পাম্প", en: "Fuel station" }, meaning: { bn: "সামনে জ্বালানি নেওয়ার জায়গা।", en: "Fuel station ahead." } },
        { kind: "bus-stop", name: { bn: "বাস স্টপ", en: "Bus stop" }, meaning: { bn: "বাস থামার জায়গা — এখানে অন্য গাড়ি থামাবেন না।", en: "Bus stop — other vehicles should not stop here." } },
        { kind: "one-way", name: { bn: "একমুখী রাস্তা", en: "One-way road" }, meaning: { bn: "শুধু তীর চিহ্নের দিকে চলা যাবে।", en: "Traffic only in the direction of the arrow." } },
      ] as Sign[],
    },
  ],

  /* 3. Position on the road */
  laneTitle: { bn: "রাস্তায় গাড়ির সঠিক অবস্থান", en: "Your position on the road" },
  laneLead: {
    bn: "বাংলাদেশে গাড়ি চলে রাস্তার বাম দিক দিয়ে, আর স্টিয়ারিং থাকে ডান দিকে।",
    en: "In Bangladesh, traffic keeps to the left and the steering wheel is on the right.",
  },
  laneRules: [
    { bn: "সবসময় রাস্তার বাম পাশ দিয়ে চলুন; ধীরগতির যান সবচেয়ে বাম লেনে।", en: "Always keep left; slower vehicles use the leftmost lane." },
    { bn: "ওভারটেক করবেন শুধু ডান দিক দিয়ে — সামনে পরিষ্কার দেখে, ইন্ডিকেটর দিয়ে।", en: "Overtake only on the right — with a clear view ahead and the indicator on." },
    { bn: "বাঁক, ব্রিজ, মোড়, জেব্রা ক্রসিং ও অবিচ্ছিন্ন দাগে ওভারটেক নয়।", en: "Never overtake on bends, bridges, junctions, zebra crossings or solid lines." },
    { bn: "বামে মোড় নিতে বাম লেনে থাকুন; ডানে মোড় নিতে আগেই রাস্তার মাঝের দিকে আসুন।", en: "To turn left, stay in the left lane; to turn right, move towards the centre early." },
    { bn: "সামনের গাড়ি থেকে নিরাপদ দূরত্ব রাখুন — অন্তত ২-৩ সেকেন্ডের ব্যবধান।", en: "Keep a safe gap — at least 2–3 seconds behind the vehicle ahead." },
    { bn: "গোলচত্বরে আগে থেকে থাকা গাড়িকে (আপনার ডান দিক থেকে আসা) আগে যেতে দিন।", en: "At a roundabout, give way to traffic already on it (coming from your right)." },
  ] as Text[],
  laneDiagram: {
    you: { bn: "আপনি (বাম লেন)", en: "You (left lane)" },
    overtake: { bn: "ওভারটেক: ডান দিক দিয়ে", en: "Overtake: on the right" },
    oncoming: { bn: "উল্টো দিকের গাড়ি", en: "Oncoming traffic" },
  },

  /* 4. Road markings */
  markingsTitle: { bn: "রাস্তার দাগ (মার্কিং)", en: "Road markings" },
  markings: [
    { id: "broken", name: { bn: "ভাঙা সাদা দাগ", en: "Broken white line" }, meaning: { bn: "লেন আলাদা করে; নিরাপদ হলে লেন বদল বা ওভারটেক করা যায়।", en: "Separates lanes; you may change lanes or overtake when safe." } },
    { id: "solid", name: { bn: "অবিচ্ছিন্ন দাগ", en: "Solid line" }, meaning: { bn: "দাগ পার হওয়া বা ওভারটেক করা যাবে না।", en: "Do not cross the line or overtake." } },
    { id: "double", name: { bn: "দুটি অবিচ্ছিন্ন দাগ", en: "Double solid line" }, meaning: { bn: "কোনো অবস্থাতেই পার হওয়া যাবে না।", en: "Never cross it." } },
    { id: "zebra", name: { bn: "জেব্রা ক্রসিং", en: "Zebra crossing" }, meaning: { bn: "পথচারী পার হচ্ছেন বা অপেক্ষা করছেন — থামুন, তাঁদের আগে যেতে দিন।", en: "Stop and let pedestrians cross first." } },
    { id: "stopline", name: { bn: "স্টপ লাইন", en: "Stop line" }, meaning: { bn: "লাল বাতি বা 'থামুন' সাইনে এই দাগের আগে থামুন।", en: "At a red light or stop sign, stop before this line." } },
  ] as { id: "broken" | "solid" | "double" | "zebra" | "stopline"; name: Text; meaning: Text }[],

  /* 5. Police hand signals */
  policeTitle: { bn: "ট্রাফিক পুলিশের হাতের সংকেত", en: "Traffic police hand signals" },
  police: [
    { bn: "হাত সোজা উপরে তোলা — সব দিকের যান থামুন।", en: "Arm raised straight up — all traffic stop." },
    { bn: "হাতের তালু আপনার দিকে সামনে বাড়ানো — আপনি থামুন।", en: "Palm held out towards you — you stop." },
    { bn: "হাত দিয়ে নিজের দিকে বা সামনে ইশারা — আপনি এগিয়ে আসুন।", en: "Beckoning or waving forward — you may come on." },
  ] as Text[],
  policeNote: { bn: "পুলিশের সংকেত ট্রাফিক লাইট ও সাইনের চেয়ে অগ্রাধিকার পায়।", en: "Police signals take priority over lights and signs." },

  /* 6. Key road law */
  lawTitle: { bn: "গুরুত্বপূর্ণ ট্রাফিক আইন", en: "Key road-traffic rules" },
  lawLead: {
    bn: "সড়ক পরিবহন আইন, ২০১৮ অনুযায়ী মূল নিয়মগুলো:",
    en: "The main rules under the Road Transport Act, 2018:",
  },
  laws: [
    { bn: "বৈধ ড্রাইভিং লাইসেন্স ছাড়া গাড়ি চালানো দণ্ডনীয় অপরাধ।", en: "Driving without a valid licence is a punishable offence." },
    { bn: "গাড়িতে রাখুন: লাইসেন্স, রেজিস্ট্রেশন, ফিটনেস সনদ, ট্যাক্স টোকেন ও ইন্স্যুরেন্সের কাগজ।", en: "Carry: licence, registration, fitness certificate, tax token and insurance." },
    { bn: "সিটবেল্ট বাঁধুন; মোটরসাইকেলে চালক ও আরোহী দুজনেই হেলমেট পরবেন।", en: "Wear a seat belt; on motorcycles both rider and passenger wear helmets." },
    { bn: "চালানোর সময় মোবাইল ফোনে কথা বলা বা ব্যবহার নিষেধ।", en: "No phone calls or phone use while driving." },
    { bn: "নির্ধারিত গতিসীমা মেনে চলুন; শহর, বাজার ও স্কুল এলাকায় ধীরে।", en: "Obey speed limits; go slowly in towns, markets and school zones." },
    { bn: "উল্টো পথে (রং সাইডে) গাড়ি চালানো নিষেধ।", en: "Never drive on the wrong side of the road." },
    { bn: "মাদক বা অ্যালকোহল সেবন করে গাড়ি চালানো গুরুতর অপরাধ।", en: "Driving under the influence of drugs or alcohol is a serious offence." },
    { bn: "অপ্রয়োজনে হর্ন নয়; হাইড্রোলিক হর্ন ব্যবহার নিষেধ।", en: "No unnecessary horn; hydraulic horns are banned." },
    { bn: "দুর্ঘটনা ঘটলে থামুন, আহতকে সাহায্য করুন ও নিকটস্থ থানা/৯৯৯-এ জানান।", en: "After an accident, stop, help the injured and call 999 or the nearest police station." },
  ] as Text[],
  lawNote: {
    bn: "আইন ভাঙলে জরিমানা, কারাদণ্ড ও লাইসেন্সে পয়েন্ট কাটা যেতে পারে। জরিমানার পরিমাণ পরিবর্তন হতে পারে — সর্বশেষ তথ্যের জন্য BRTA ও বাংলাদেশ পুলিশের অফিসিয়াল সূত্র দেখুন। এটি আইনি পরামর্শ নয়।",
    en: "Breaking the law can mean fines, jail and licence penalty points. Amounts change — check official BRTA and Bangladesh Police sources. This is not legal advice.",
  },
  ctaTitle: { bn: "সাইন আর নিয়ম মাঠে-রাস্তায় শিখুন", en: "Learn the signs and rules on the road" },
  ctaLead: { bn: "আমাদের প্রশিক্ষণে প্রতিটি নিয়ম বাস্তবে অনুশীলন করানো হয় — লাইসেন্স পরীক্ষার প্রস্তুতিসহ।", en: "Our training practises every rule on the road — including licence test preparation." },
  ctaMessage: { bn: "আসসালামু আলাইকুম, ট্রাফিক নিয়ম ও ড্রাইভিং প্রশিক্ষণ সম্পর্কে জানতে চাই।", en: "Hello, I'd like to know about driving training and road rules." },
};
