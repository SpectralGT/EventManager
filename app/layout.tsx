import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "../components/NextAuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import bg from '@/public/bg.jpeg';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased` } style={{
      backgroundImage: `url(${bg.src})`,
      backgroundSize:'100%',
      backgroundRepeat: 'no-repeat'
    }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextAuthProvider><Suspense fallback={<div>Loading...</div>}>{children}</Suspense></NextAuthProvider>{" "}
        </ThemeProvider>
      </body>
    </html>
  );
}
