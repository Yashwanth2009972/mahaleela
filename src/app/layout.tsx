import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CartProvider } from "@/lib/cart-context";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAHALEELA | Luxury Fashion & Atelier",
  description: "MAHALEELA — Where Style Becomes Expression. Quiet luxury, high-fashion architecture, and immaculate craftsmanship.",
  icons: {
    icon: "/assets/mahaleela-logo.jpg",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  // Load site settings from database
  let announcementText = "PAN-INDIA DISPATCH • DELIVERY CHARGES ACCORDING TO LOCATION";
  let announcementLink = "/#catalogue";
  let isAnnouncementEnabled = true;

  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        key: {
          in: ["announcement_text", "announcement_link", "announcement_enabled"],
        },
      },
    });

    for (const s of settings) {
      if (s.key === "announcement_text" && !s.value.includes("COMPLIMENTARY") && !s.value.includes("FREE")) {
        announcementText = s.value;
      }
      if (s.key === "announcement_link" && s.value !== "/collections") {
        announcementLink = s.value;
      }
      if (s.key === "announcement_enabled") isAnnouncementEnabled = s.value === "true";
    }
  } catch {
    // fallback to defaults if db connection warmup
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-gold font-sans antialiased selection:bg-gold selection:text-white">
        <CartProvider>
          <Header
            announcementText={announcementText}
            announcementLink={announcementLink}
            isAnnouncementEnabled={isAnnouncementEnabled}
            currentUser={currentUser}
          />
          <CartDrawer />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
