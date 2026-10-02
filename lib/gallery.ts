import type {
  GalleryCollection,
  GalleryImage,
  GalleryOrientation,
  Project,
} from "@/lib/types";

export const GALLERY_COLLECTIONS: {
  id: GalleryCollection | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "installations", label: "Installations" },
  { id: "factory", label: "Factory" },
  { id: "products", label: "Products" },
];

export const COLLECTION_LABEL: Record<GalleryCollection, string> = {
  installations: "Installation",
  factory: "Factory",
  products: "Product",
};

export function resolveGalleryImage(
  image: string | GalleryImage,
  fallbackAlt = ""
): GalleryImage {
  if (typeof image === "string") {
    return { src: image, alt: fallbackAlt };
  }
  return {
    ...image,
    alt: image.alt ?? fallbackAlt,
  };
}

export function getProjectCover(project: Project): GalleryImage {
  const first = project.images[0];
  const resolved = first
    ? resolveGalleryImage(first, project.title)
    : { src: "", alt: project.title };
  return {
    ...resolved,
    orientation:
      resolved.orientation ?? project.orientation ?? "landscape",
  };
}

export function filterProjects(
  projects: Project[],
  collection: GalleryCollection | "all"
): Project[] {
  if (collection === "all") return projects;
  return projects.filter((p) => p.collection === collection);
}

export function masonryAspectClass(
  orientation: GalleryOrientation = "landscape"
): string {
  switch (orientation) {
    case "portrait":
      return "aspect-[3/4]";
    case "square":
      return "aspect-square";
    default:
      return "aspect-[4/3]";
  }
}
