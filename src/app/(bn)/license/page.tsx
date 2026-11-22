import { PageShell } from "@/components/layout/PageShell";
import { LicenseGuide } from "@/components/pages/LicenseGuide/LicenseGuide";
import { licensePage } from "@/content/license";
import { licenseJsonLd, licenseMetadata } from "@/lib/seo";

export const metadata = licenseMetadata("bn", licensePage.meta);

/** Driving licence guide → "/license" */
export default function Page() {
  return (
    <PageShell lang="bn" altHref="/en/license">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(licenseJsonLd("bn", licensePage)) }} />
      <LicenseGuide lang="bn" />
    </PageShell>
  );
}
