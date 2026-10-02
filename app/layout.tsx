import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { OrganizationJsonLd } from "@/components/ui/OrganizationJsonLd";
import { defaultMetadata } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-charcoal font-body">
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
