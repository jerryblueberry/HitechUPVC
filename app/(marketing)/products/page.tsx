import type { Metadata } from "next";
import { ProductsView } from "@/components/products/ProductsView";
import { getColors, getCompany, getProducts } from "@/lib/getData";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

const TITLE = "uPVC Windows, Doors & Panels";
const DESCRIPTION =
  "Browse Hi-Tech uPVC Profile Industries windows, doors, and fluted wall panels. Sliding, casement, tilt & turn, French, and folding systems made to measure in Kathmandu.";

export const metadata: Metadata = pageMetadata(TITLE, DESCRIPTION, "/products", undefined, {
  keywords: [
    "uPVC windows Nepal",
    "uPVC doors Kathmandu",
    "uPVC panels Nepal",
    "tilt and turn windows",
    "sliding patio doors",
    "French doors Kathmandu",
    "Hi-Tech uPVC products",
    "made to measure windows Nepal",
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
        isPartOf: { "@type": "WebSite", name: company.companyName, url: absoluteUrl("/") },
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