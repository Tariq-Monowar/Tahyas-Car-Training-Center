import { PageShell } from "@/components/layout/PageShell";
import { LicenseGuide } from "@/components/pages/LicenseGuide/LicenseGuide";
import { licensePage } from "@/content/license";
import { licenseJsonLd, licenseMetadata } from "@/lib/seo";

export const metadata = licenseMetadata("en", licensePage.meta);

/** Driving licence guide → "/en/license" */
export default function Page() {
  return (
    <PageShell lang="en" altHref="/license">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(licenseJsonLd("en", licensePage)) }} />
      <LicenseGuide lang="en" />
    </PageShell>
  );
}
