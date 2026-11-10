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
  return getProductsByCategory("windows").map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("windows", slug);
  if (!product) {
    return { robots: { index: false, follow: false } };
  }

  return pageMetadata(
    productSeoTitle(product.name, "windows"),
    `${product.shortDescription} Made to measure by Hi-Tech uPVC in Tarakeshwar, Kathmandu.`,
    `/products/windows/${slug}`,
    product.heroImage,
    { keywords: productSeoKeywords(product.name, "windows") }
  );
}

export default async function WindowDetailPage({ params }: Params) {
  const { slug } = await params;
  if (!slug) redirect("/products/windows");
  const product = getProductBySlug("windows", slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={buildProductJsonLd(product, "windows")} />
      <ProductDetailView product={product} />
    </>
  );
}
