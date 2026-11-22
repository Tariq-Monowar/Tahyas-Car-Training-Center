import { PageShell } from "@/components/layout/PageShell";
import { RoadRulesGuide } from "@/components/pages/RoadRules/RoadRulesGuide";
import { roadRules } from "@/content/roadRules";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("bn", "road-rules", roadRules.meta);

/** Traffic signs, signals & road rules → "/road-rules" */
export default function Page() {
  return (
    <PageShell lang="bn" altHref="/en/road-rules">
      <RoadRulesGuide lang="bn" />
    </PageShell>
  );
}
