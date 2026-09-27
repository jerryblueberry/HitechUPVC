import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { getProductBySlug, getProductsByCategory } from "@/lib/getData";
import { pageMetadata } from "@/lib/seo";

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
  if (!product) return {};

  return pageMetadata(
    product.name,
    product.shortDescription,
    `/products/panels/${slug}`,
    product.heroImage
  );
}

export default async function PanelDetailPage({ params }: Params) {
  const { slug } = await params;
  if (!slug) redirect("/products/panels");
  const product = getProductBySlug("panels", slug);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
