import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Costume Store Fancy dress Rental Shop – Mira Road East, Mumbai",
  description:
    "Reliable costume rental shop in Mira Road East featuring a wide variety of high-quality outfits at reasonable rates. Rent Garba, Navratri, mythological, fancy dress, and school annual day costumes.",
  keywords:
    "Costume Store Fancy dress Rental Shop, costume rental Mira Road, fancy dress rental Mumbai, chaniya choli rental, navratri dress, ram sita costume, halloween costume, kids fancy dress, Mira Road East",
  openGraph: {
    title: "Costume Store Fancy dress Rental Shop (Moti Atya)",
    description: "Reliable costume rental shop in Mira Road featuring high-quality outfits at reasonable rates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
