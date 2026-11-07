import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProductBySlug, getProductsByCategory } from "@/lib/getData";
import { buildProductJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export function generateStaticParams() {
  return getProductsByCategory("doors").map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug("doors", slug);
  if (!product) {
    return { robots: { index: false, follow: false } };
  }

  return pageMetadata(
    product.name,
    product.shortDescription,
    `/products/doors/${slug}`,
    product.heroImage,
    {
      keywords: [
        product.name,
        "uPVC doors Kathmandu",
        "uPVC doors Nepal",
        "Hi-Tech uPVC",
      ],
    }
  );
}

export default async function DoorDetailPage({ params }: Params) {
  const { slug } = await params;
  if (!slug) redirect("/products/doors");
  const product = getProductBySlug("doors", slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={buildProductJsonLd(product, "doors")} />
      <ProductDetailView product={product} />
    </>
  );
}
