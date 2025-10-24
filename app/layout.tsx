"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChakraProviderWrapper, UrqlProvider } from "./providers";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Script from "next/script";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChakraProviderWrapper>
          <UrqlProvider>
            <Navbar />
            {children}
            <Footer />
          </UrqlProvider>
        </ChakraProviderWrapper>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
