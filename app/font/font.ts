// app/fonts.ts
import { Red_Hat_Display, Noto_Sans_JP } from "next/font/google";
import { Libre_Bodoni } from "next/font/google";

export const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

export const notSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["700"],
});

