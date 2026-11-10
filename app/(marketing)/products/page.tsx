import type { Metadata } from "next";
import { ProductsView } from "@/components/products/ProductsView";
import { getColors, getCompany, getProducts } from "@/lib/getData";
import { absoluteUrl, getSiteUrl, pageMetadata } from "@/lib/seo";

const TITLE = "uPVC Windows, Doors & Panels in Nepal";
const DESCRIPTION =
  "Browse Hi-Tech uPVC windows, doors, and wall panels — sliding, casement, tilt & turn, French, and folding systems made to measure in Tarakeshwar for Kathmandu and across Nepal.";

export const metadata: Metadata = pageMetadata(TITLE, DESCRIPTION, "/products", undefined, {
  keywords: [
    "uPVC windows Kathmandu",
    "uPVC doors Kathmandu",
    "uPVC windows Nepal",
    "uPVC doors Nepal",
    "uPVC panels Nepal",
    "uPVC products Nepal",
    "made to measure windows Nepal",
    "Hi-Tech uPVC products",
  ],
});

function ProductsJsonLd() {
  const company = getCompany();
  const products = getProducts();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl("/products"),
        url: absoluteUrl("/products"),
        name: TITLE,
        description: DESCRIPTION,
        isPartOf: { "@id": `${getSiteUrl()}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") },
        ],
      },
      {
        "@type": "ItemList",
        name: "Hi-Tech uPVC product range",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: absoluteUrl(`/products/${product.category}/${product.slug}`),
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ProductsPage() {
  const company = getCompany();
  const products = getProducts();
  const colors = getColors();

  return (
    <>
      <ProductsJsonLd />
      <ProductsView company={company} products={products} colors={colors} />
    </>
  );
}