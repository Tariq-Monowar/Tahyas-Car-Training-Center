import type { Viewport } from "next";
import { RootDocument } from "@/components/layout/RootDocument";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata("bn");

/* Android Chrome: the on-screen keyboard resizes the page, so the chat input stays visible. */
export const viewport: Viewport = { width: "device-width", initialScale: 1, interactiveWidget: "resizes-content" };

export default function BnLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument lang="bn">{children}</RootDocument>;
}
