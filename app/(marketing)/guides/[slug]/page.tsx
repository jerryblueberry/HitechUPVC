import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "@/components/guides/GuideView";
import { FaqJsonLd } from "@/components/ui/FaqJsonLd";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCompany, getGuideBySlug, getGuides } from "@/lib/getData";
import { buildGuideJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) {
    return { robots: { index: false, follow: false } };
  }
  return pageMetadata(guide.title, guide.description, `/guides/${slug}`, undefined, {
    keywords: guide.keywords,
  });
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const faqs = guide.faqs.map((faq, index) => ({
    id: `${guide.slug}-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <>
      <JsonLd data={buildGuideJsonLd(guide)} />
      {faqs.length > 0 ? <FaqJsonLd faqs={faqs} /> : null}
      <GuideView guide={guide} company={getCompany()} siblings={getGuides()} />
    </>
  );
}
