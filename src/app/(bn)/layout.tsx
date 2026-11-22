import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("bn");

export default function BnLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="bn">{children}</RootDocument>;
}
