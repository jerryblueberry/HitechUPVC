import { JsonLd } from "@/components/ui/JsonLd";
import { getCompany } from "@/lib/getData";
import { buildLocalBusinessGraph } from "@/lib/schema";

export function OrganizationJsonLd() {
  return <JsonLd data={buildLocalBusinessGraph(getCompany())} />;
}
