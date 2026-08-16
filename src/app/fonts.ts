import {Manrope, Playfair_Display, Raleway, Unbounded} from "next/font/google";

export const unbounded = Unbounded({
  variable: "--font-brand-1",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
});

export const playfair = Playfair_Display({
  variable: "--font-brand-2",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
});

export const raleway = Raleway({
  variable: "--font-brand-3",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  display: "swap",
});

export const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});
