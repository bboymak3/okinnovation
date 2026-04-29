import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
