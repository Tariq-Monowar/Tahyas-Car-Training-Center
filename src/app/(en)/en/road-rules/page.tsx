import { PageShell } from "@/components/layout/PageShell";
import { RoadRulesGuide } from "@/components/pages/RoadRules/RoadRulesGuide";
import { roadRules } from "@/content/roadRules";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("en", "road-rules", roadRules.meta);

/** Traffic signs, signals & road rules → "/en/road-rules" */
export default function Page() {
  return (
    <PageShell lang="en" altHref="/road-rules">
      <RoadRulesGuide lang="en" />
    </PageShell>
  );
}
