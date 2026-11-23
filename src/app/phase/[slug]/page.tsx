import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPhase, phases } from "@/lib/curriculum";
import { PhaseView } from "@/components/phase-view";

export function generateStaticParams() {
  return phases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/phase/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPhase(slug);
  return p ? { title: `Phase ${p.num}: ${p.title}`, description: p.tagline } : {};
}

export default async function PhasePage({ params }: PageProps<"/phase/[slug]">) {
  const { slug } = await params;
  if (!getPhase(slug)) notFound();
  return <PhaseView slug={slug} />;
}
