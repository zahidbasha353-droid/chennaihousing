import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#E53935",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Chennai Housing - Premium Plots in Avadi & Chennai",
  description: "Find DTCP approved plots and residential properties in Avadi, Chennai. Best prices, legal verification, and easy EMI options. Book your dream plot today!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
