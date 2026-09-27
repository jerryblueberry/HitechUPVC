import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Hi-Tech uPVC Profile Industries | Windows, Doors & Panels",
    template: "%s | Hi-Tech uPVC",
  },
  description:
    "Hi-Tech uPVC Profile Industries: premium uPVC windows, doors, and panels. Energy efficient, secure, low maintenance. Get a free quote today.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-charcoal font-body">
        {children}
      </body>
    </html>
  );
}
