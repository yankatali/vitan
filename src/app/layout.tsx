import type { Metadata } from "next";
import { Unbounded, Playfair_Display, Raleway, Manrope } from "next/font/google";
import Header from "@/app/components/Header/Header";
import {Footer} from "@/app/components/Footer/Footer";
import {DEFAULT_HEADER_CONFIG} from "@/constants/header";
import "./globals.css";

// Brand name font — варіант 1: Unbounded (геометричний bold)
const unbounded = Unbounded({
  variable: "--font-brand-1",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
});

// Brand name font — варіант 2: Playfair Display (елегантний serif)
const playfair = Playfair_Display({
  variable: "--font-brand-2",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
});

// Brand name font — варіант 3: Raleway (чистий геометричний)
const raleway = Raleway({
  variable: "--font-brand-3",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
});

// Основний шрифт для всього тексту
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vitan",
  description: "Інтернет-магазин Vitan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <html lang="uk">
        <body
            className={`${unbounded.variable} ${playfair.variable} ${raleway.variable} ${manrope.variable} antialiased`}
        >
            <div className="bg-layer" aria-hidden="true" />
            <Header config={DEFAULT_HEADER_CONFIG} />
            <div className='container min-w-full'>{children}</div>
            <Footer />
        </body>
    </html>
    );
}
