# Tahyas Car Training Center — website

তাইয়াস কার ট্রেনিং সেন্টারের ওয়েবসাইট। Fast, mobile-first, Bengali-first single page built with **Next.js 16**.

- `/` → Bengali home · `/en` → English home
- `/license` → ড্রাইভিং লাইসেন্স গাইড (কাগজপত্র ও পরীক্ষা) · `/en/license` → English licence guide
- All pages are pre-built static HTML → fast, and Google indexes every page in both languages
- Light / dark mode, BN/EN switch (both remembered), WhatsApp-only contact, AI chat assistant (Groq)

---

## 1. Run on your computer (কম্পিউটারে চালানো)

```bash
npm install
cp .env.example .env.local      # then put your GROQ_API_KEY inside .env.local
npm run dev                     # open http://localhost:3000
```

Production test: `npm run build && npm start`.

---

## 2. Edit the content (তথ্য পরিবর্তন)

**Almost everything is in one file: [`src/config/site.ts`](src/config/site.ts)**
প্রায় সবকিছু এই একটি ফাইলে। প্রতিটি লেখা `{ bn: "বাংলা", en: "English" }` আকারে।
`✏️` চিহ্ন দেওয়া জায়গাগুলো placeholder — আসল তথ্য দিয়ে বদলে দিন।

| What | Where in `site.ts` |
|---|---|
| Name, tagline, slogan | `name`, `tagline`, `slogan` |
| WhatsApp number | `whatsapp.number` (with 880, no +) and `whatsapp.display` |
| **Price / offer** (দাম) | `pricing.regular` and `pricing.discount` — final price is calculated automatically |
| Courses (কোর্স) | `courses` — title, description, what you learn, duration |
| Working hours (সময়সূচি) | `hours` |
| Landmark / how to come | `directions` |
| FAQ (প্রশ্নোত্তর) | `faqs` |
| Female trainer available? | `women.femaleTrainerAvailable` → `true` only if it is true |
| Hide licence section | `features.licenseGuide` → `false` |
| Students counter | `studentsTrained` → a real number, e.g. `250` (hidden while `null`) |
| Facebook link | `facebook` (hidden while empty) |
| Website address | `url` (or env `NEXT_PUBLIC_SITE_URL`) |

Section headings and other page texts are in [`src/content/copy.ts`](src/content/copy.ts).
The licence guide text (documents, tests, tips) is in [`src/content/license.ts`](src/content/license.ts) — review it now and then, because BRTA rules can change.

### Add reviews (রিভিউ যোগ করা)
The reviews section is **hidden until you add real reviews** (no fake reviews).
`site.ts → testimonials`:
```ts
testimonials: [
  { name: "রাশেদ, লক্ষ্মীপুর", text: { bn: "খুব ধৈর্য নিয়ে শিখিয়েছেন…", en: "They taught me very patiently…" } },
],
```
Only add reviews with the student's permission.

### Add trainers (প্রশিক্ষক যোগ করা)
Also hidden until filled. `site.ts → trainers`:
```ts
trainers: [{ name: { bn: "মোঃ করিম", en: "Md. Karim" }, years: 8, photo: "trainer-1" }],
```
and put the photo at `public/images/real/trainer-1.jpg`.

---

## 3. Photos (ছবি)

The lesson photos now on the page are **illustrative scenes** made to match each section: a white training car on a palm-lined road, hands on a right-hand-drive wheel, town traffic, reverse parking with cones, a highway, a woman learner, and an instructor beside a student. They are **not** photos of this centre, its cars, or its students. The footer says so. See [`public/images/CREDITS.md`](public/images/CREDITS.md).

Replace any file in **`public/images/real/`** with your own photo using the **same file name** (`.jpg`, `.jpeg`, `.png`, or `.webp`). It replaces the stock photo on the next reload. See [`public/images/real/README.txt`](public/images/real/README.txt).

Slots already filled with stock: `hero.webp`, `women.webp`, `journey.webp`, `why.webp`, `course-basic.webp`, `course-advance.webp`, `course-parking.webp`, `course-highway.webp`, `course-women.webp`, and `gallery/`.

Still empty on purpose (add your own; do not use a random building):

- `center-front.jpg` — the front of the training centre, shown next to the map
- `trainer-1.jpg` … — only after you add that trainer in `src/config/site.ts`

No resizing needed: Next.js serves small AVIF/WebP versions sized for each phone.
If a slot file is removed, the site falls back to the hand-drawn illustration — never a broken image.

**Replace with your own photos first:** 1) centre front 2) training car 3) trainers 4) learners in class (with permission), especially the women's section.

---

## 4. AI chat — Groq key (চ্যাট সহকারী)

The browser never sees the key. The chat calls `/api/chat` (our own server function), which reads `GROQ_API_KEY` from the environment and forwards the question to Groq.

- Get a key: https://console.groq.com/keys
- Local: put it in `.env.local` (this file is git-ignored)
- Live: Vercel → Project → Settings → Environment Variables → `GROQ_API_KEY`
- Model: `openai/gpt-oss-120b` by default (change with `GROQ_MODEL`). Note: `llama-3.3-70b-versatile` is no longer offered by Groq.

Protections in [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts): allowed-origin check, 20 messages / 10 min per visitor, 500-character message limit, `max_tokens` cap, 20 s timeout.
If the AI is down or the key is missing, the chat automatically answers common questions from the config and shows the WhatsApp button.

The assistant's knowledge is built from `site.ts`, so when you change prices or courses, the chat knows immediately.

---

## 5. Deploy (অনলাইনে প্রকাশ) — Vercel (recommended, free)

1. Push this folder to a GitHub repository (the `.gitignore` already excludes `.env.local`).
2. Go to https://vercel.com → **Add New → Project** → import the repository → **Deploy**.
3. In **Settings → Environment Variables** add:
   - `GROQ_API_KEY` = your key
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`
4. **Settings → Domains** → add your domain. Redeploy once.

Every later `git push` updates the site automatically.

> Netlify and Cloudflare Pages also support Next.js, but Vercel needs zero configuration for the `/api/chat` function.

---

## 6. After going live — SEO checklist

- Google Search Console → add the domain → submit `https://your-domain.com/sitemap.xml`
- Google Business Profile for the centre (same name, address, WhatsApp number) — the most important thing for local search in Lakshmipur
- Built in already: Bengali + English pages with `hreflang`, JSON-LD (`DrivingSchool` with geo, address, ৳10,000 offer, FAQ), Open Graph image, sitemap, robots, web manifest

Analytics (optional, cookie-free): paste a Cloudflare Web Analytics token into `site.ts → analytics.cloudflareToken`.

---

## Folder structure

```
src/
  app/                    Routes only
    (bn)/                 "/"   Bengali page + layout
    (bn)/license/         "/license" licence guide (Bengali)
    (en)/en/              "/en" English page + layout
    (en)/en/license/      "/en/license" licence guide (English)
    api/chat/route.ts     Groq proxy (server only)
    robots.ts sitemap.ts manifest.ts icon.svg apple-icon.png
  config/site.ts          ← EDIT ME: all business data
  content/copy.ts         Page texts (headings, labels)
  content/license.ts      Licence guide texts
  components/
    HomePage.tsx          The home page: list of sections in order
    pages/LicenseGuide/   The licence guide page
    illustrations/        Hand-drawn SVG scenes (kit.tsx = building blocks, Scenes.tsx = scenes)
    layout/               PageShell, Header, Footer, ActionBar (WhatsApp bar), RootDocument (<html>, fonts, theme)
    sections/<Name>/      One folder per section: Name.tsx + Name.module.css
    ui/                   Small shared pieces: Logo, Media (real photo or illustration), Icon, WhatsAppButton, RoadScene, SectionHeading
  features/chat/          Chat widget (lazy-loaded), system prompt, offline fallback
  lib/                    i18n (bn/en, Bengali digits), whatsapp links, photo slots, SEO
  styles/globals.css      Design tokens (colors, type scale, spacing) + shared styles
public/images/
  brand/                  App icons, social-share (OG) image, original logo badge
  real/                   ← Put real photos here
```

## Performance notes
- Static HTML, CSS inlined, fonts self-hosted (only the body font preloaded), images AVIF/WebP with `srcset`
- Chat code is downloaded only when the visitor opens the chat
- Animations use transform/opacity only; disabled for "reduce motion" and on Save-Data / 2G connections
