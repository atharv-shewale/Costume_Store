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
  title: "Moti Atya Costume Corner – Premium Costume Rentals",
  description:
    "Rent stunning Garba, Navratri, mythological, and traditional Indian costumes in Mumbai. Chaniya choli, Ram-Sita sets, Kali Mata, Shiva and more. Affordable prices from ₹300.",
  keywords:
    "costume rental, chaniya choli, garba costume, navratri dress, ram sita costume, hanuman costume, kali mata costume, shiva costume, Mumbai costume rental",
  openGraph: {
    title: "Moti Atya Costume Corner",
    description: "Premium costume rentals for every Indian festival and event.",
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
