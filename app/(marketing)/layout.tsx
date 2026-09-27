import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { getCompany, getNavigation } from "@/lib/getData";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = getNavigation();
  const company = getCompany();

  return (
    <>
      <ScrollProgress />
      <Header
        navigation={navigation}
        companyName={company.companyName}
        logo={company.logo}
        whatsapp={company.contact.whatsapp}
        tagline={company.tagline}
      />
      <main className="flex-1">{children}</main>
      <Footer navigation={navigation} company={company} />
    </>
  );
}
