import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  themeColor: "#E53935",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Chennai Housing - Premium Plots in Avadi & Chennai",
    template: "%s | Chennai Housing",
  },
  description:
    "Find DTCP approved plots and residential properties in Avadi, Chennai. Best prices, legal verification, and easy EMI options. Book your dream plot today!",
  keywords: [
    "plots in Chennai",
    "DTCP approved plots",
    "Avadi plots",
    "Chennai real estate",
    "residential plots",
    "buy land Chennai",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://chennaihousing.in",
    siteName: "Chennai Housing",
    title: "Chennai Housing - Premium Plots in Avadi & Chennai",
    description:
      "Find DTCP approved plots and residential properties in Avadi, Chennai.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chennai Housing - Premium Plots",
    description: "DTCP approved plots in Avadi & Chennai at best prices.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClientProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
