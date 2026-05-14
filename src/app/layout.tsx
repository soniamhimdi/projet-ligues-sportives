import type { Metadata } from "next";

import { ClerkProvider } from "@clerk/nextjs";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",

  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plateforme Ligues Sportives Communautaires",

  description: "Plateforme de gestion de ligues sportives communautaires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <HeaderWrapper />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
