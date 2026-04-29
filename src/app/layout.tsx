import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OKINNOVATION PE | Fabricacion & Accesorios Off-Road 4x4",
  description:
    "Especialistas en fabricacion de accesorios off-road 4x4. Bumpers, suspension, estribos, bovedas, iluminacion LED y mas. Llevamos la personalizacion a otro nivel.",
  keywords: [
    "off-road",
    "4x4",
    "accesorios",
    "bumpers",
    "suspension",
    "estribos",
    "iluminacion LED",
    "Peru",
    "OKINNOVATION",
    "fabricacion",
    "personalizacion",
  ],
  authors: [{ name: "OKINNOVATION PE" }],
  openGraph: {
    title: "OKINNOVATION PE | Fabricacion & Accesorios Off-Road 4x4",
    description:
      "Especialistas en fabricacion de accesorios off-road 4x4. Llevamos la personalizacion a otro nivel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
