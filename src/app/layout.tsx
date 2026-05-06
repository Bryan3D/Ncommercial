

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Naguabo Commercial — Tu Ferretería de Confianza",
  description:
    "Tools, building materials, paint, plumbing, and more. Serving Naguabo and Puerto Rico. Open 24/7 online with chat support.",
  keywords:
    "ferretería, hardware store, Naguabo, Puerto Rico, tools, construction",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
