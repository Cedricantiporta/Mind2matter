import "./globals.css";
import { Unbounded, Plus_Jakarta_Sans, IBM_Plex_Mono, Baloo_2 } from "next/font/google";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-unbounded",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata = {
  title: "Mind2Matter — 3D Printing Studio, Caloocan",
  description:
    "Mind2Matter is a Caloocan-based 3D printing studio — custom prints, keychains, decor, prototypes, and personalized gifts.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${jakarta.variable} ${plexMono.variable} ${baloo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
