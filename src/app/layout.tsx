import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ThemeProvider, themeScript } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint — prevents dark-mode flash on reload */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <WhatsAppFloat />
        </ThemeProvider>
      </body>
    </html>
  );
}
