import type { Metadata } from "next";
import { Alata, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const alata = Alata({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-body",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SRI SRI NIKHIL UTKAL SAIBA PANCHAL VISWA BRAHMIN SAMAJ",
  description: "SPVBS.in - Community Directory, Matrimonial, Events & Donations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${alata.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
