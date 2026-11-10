import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProductBySlug, getProductsByCategory } from "@/lib/getData";
import { buildProductJsonLd } from "@/lib/schema";
import { pageMetadata, productSeoKeywords, productSeoTitle } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return getProductsByCategory("panels").map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("panels", slug);
  if (!product) {
    return { robots: { index: false, follow: false } };
  }

  return pageMetadata(
    productSeoTitle(product.name, "panels"),
    `${product.shortDescription} Made to measure by Hi-Tech uPVC in Tarakeshwar, Kathmandu.`,
    `/products/panels/${slug}`,
    product.heroImage,
    { keywords: productSeoKeywords(product.name, "panels") }
  );
}

export default async function PanelDetailPage({ params }: Params) {
  const { slug } = await params;
  if (!slug) redirect("/products/panels");
  const product = getProductBySlug("panels", slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={buildProductJsonLd(product, "panels")} />
      <ProductDetailView product={product} />
    </>
  );
}
