import { Anek_Bangla, Hind_Siliguri, DM_Sans } from "next/font/google";
import { site } from "@/config/site";
import type { Lang } from "@/lib/i18n";
import { jsonLd } from "@/lib/seo";
import { MotionObserver } from "./MotionObserver";
import "@/styles/globals.css";

/* Fonts are self-hosted by Next.js at build time (no Google request at runtime, no layout shift).
   Only the body font is preloaded; heading/Latin fonts swap in without blocking the first paint. */
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600"], variable: "--font-hind", display: "swap" });
const anek = Anek_Bangla({ subsets: ["bengali", "latin"], weight: ["600", "700", "800"], variable: "--font-anek", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta", display: "swap", preload: false });

/**
 * Runs before first paint:
 *  • sets the theme (saved choice → system preference) so there is no flash of the wrong theme
 *  • marks slow connections (.lite) to skip heavy animation
 *  • remembers the language choice (BN default)
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t;var c=navigator.connection;if(c&&(c.saveData||/2g/.test(c.effectiveType||'')))d.classList.add('lite');if(location.pathname==='/'&&localStorage.getItem('lang')==='en'&&!/bot|crawl|spider/i.test(navigator.userAgent))location.replace('/en'+location.hash);}catch(e){d.dataset.theme='light'}})();`;

export function RootDocument({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const token = site.analytics.cloudflareToken;
  return (
    <html lang={lang} className={`${hind.variable} ${anek.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f5ef" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a1220" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
      </head>
      <body>
        {children}
        <MotionObserver />
        {/* Lightweight, cookie-free analytics placeholder — set the token in src/config/site.ts */}
        {token && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token })} />
        )}
      </body>
    </html>
  );
}
