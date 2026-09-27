import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { getProductBySlug, getProductsByCategory } from "@/lib/getData";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProductsByCategory("panels").map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("panels", slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function PanelDetailPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug("panels", slug);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
