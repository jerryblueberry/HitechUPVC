import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceAreaView } from "@/components/service-areas/ServiceAreaView";
import { FaqJsonLd } from "@/components/ui/FaqJsonLd";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  getCompany,
  getServiceAreaBySlug,
  getServiceAreas,
} from "@/lib/getData";
import { buildServiceAreaJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getServiceAreas().map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceAreaBySlug(slug);
  if (!area) {
    return { robots: { index: false, follow: false } };
  }
  return pageMetadata(area.title, area.description, `/service-areas/${slug}`, undefined, {
    keywords: area.keywords,
  });
}

export default async function ServiceAreaPage({ params }: Params) {
  const { slug } = await params;
  const area = getServiceAreaBySlug(slug);
  if (!area) notFound();

  const faqs = area.faqs.map((faq, index) => ({
    id: `${area.slug}-${index}`,
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <>
      <JsonLd data={buildServiceAreaJsonLd(area)} />
      {faqs.length > 0 ? <FaqJsonLd faqs={faqs} /> : null}
      <ServiceAreaView
        area={area}
        company={getCompany()}
        siblings={getServiceAreas()}
      />
    </>
  );
}
