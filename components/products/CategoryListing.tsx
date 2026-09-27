import { CategoryView } from "@/components/products/CategoryView";
import { CATEGORY_PAGES } from "@/lib/categoryPages";
import { CATEGORY_LABELS } from "@/lib/constants";
import { getColors, getCompany, getProducts } from "@/lib/getData";
import { absoluteUrl } from "@/lib/seo";
import type { ProductCategory } from "@/lib/types";

function CategoryJsonLd({ category }: { category: ProductCategory }) {
  const company = getCompany();
  const products = getProducts().filter((product) => product.category === category);
  const copy = CATEGORY_PAGES[category];
  const path = `/products/${category}`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": absoluteUrl(path),
        url: absoluteUrl(path),
        name: copy.title,
        description: copy.description,
        isPartOf: { "@type": "WebSite", name: company.companyName, url: absoluteUrl("/") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") },
          {
            "@type": "ListItem",
            position: 3,
            name: CATEGORY_LABELS[category],
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `Hi-Tech uPVC ${CATEGORY_LABELS[category].toLowerCase()}`,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.name,
          url: absoluteUrl(`${path}/${product.slug}`),
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

export function CategoryListing({ category }: { category: ProductCategory }) {
  const company = getCompany();
  const products = getProducts().filter((product) => product.category === category);
  const colors = getColors();

  return (
    <>
      <CategoryJsonLd category={category} />
      <CategoryView
        category={category}
        company={company}
        products={products}
        colors={colors}
      />
    </>
  );
}