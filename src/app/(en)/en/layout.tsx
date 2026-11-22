import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("en");

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
