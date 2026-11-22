import { site } from "@/config/site";
import type { Lang } from "@/lib/i18n";
import { faqJsonLd } from "@/lib/seo";
import { PageShell } from "./layout/PageShell";
import { Courses } from "./sections/Courses/Courses";
import { Faq } from "./sections/Faq/Faq";
import { FinalCta } from "./sections/FinalCta/FinalCta";
import { Gallery } from "./sections/Gallery/Gallery";
import { Hero } from "./sections/Hero/Hero";
import { Journey } from "./sections/Journey/Journey";
import { License } from "./sections/License/License";
import { Location } from "./sections/Location/Location";
import { Offer } from "./sections/Offer/Offer";
import { Process } from "./sections/Process/Process";
import { Roadmap } from "./sections/Roadmap/Roadmap";
import { Safety } from "./sections/Safety/Safety";
import { Testimonials } from "./sections/Testimonials/Testimonials";
import { Trainers } from "./sections/Trainers/Trainers";
import { Women } from "./sections/Women/Women";
import { WhyUs } from "./sections/WhyUs/WhyUs";

/** The whole single page, in order. Reorder or remove sections here. */
export function HomePage({ lang }: { lang: Lang }) {
  return (
    <PageShell lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(lang)) }} />
      <Hero lang={lang} />
      <Offer lang={lang} />
      <Courses lang={lang} />
      <Women lang={lang} />
      <WhyUs lang={lang} />
      <Process lang={lang} />
      <Journey lang={lang} />
      <Roadmap lang={lang} />
      <Safety lang={lang} />
      {site.features.licenseGuide && <License lang={lang} />}
      <Trainers lang={lang} />
      <Gallery lang={lang} />
      <Testimonials lang={lang} />
      <Faq lang={lang} />
      <Location lang={lang} />
      <FinalCta lang={lang} />
    </PageShell>
  );
}
