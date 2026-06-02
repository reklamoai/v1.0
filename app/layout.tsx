import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { Inter, Instrument_Serif, Oi, Rubik_Spray_Paint, Barriecito, Rubik_Iso, Vast_Shadow, Uncial_Antiqua, Honk, Danfo, Hachi_Maru_Pop, Silkscreen, Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const oi = Oi({ subsets: ["latin"], weight: "400", variable: "--font-oi" });
const rubikSpray = Rubik_Spray_Paint({ subsets: ["latin"], weight: "400", variable: "--font-rubik-spray" });
const barriecito = Barriecito({ subsets: ["latin"], weight: "400", variable: "--font-barriecito" });
const rubikIso = Rubik_Iso({ subsets: ["latin"], weight: "400", variable: "--font-rubik-iso" });
const vastShadow = Vast_Shadow({ subsets: ["latin"], weight: "400", variable: "--font-vast-shadow" });
const uncialAntiqua = Uncial_Antiqua({ subsets: ["latin"], weight: "400", variable: "--font-uncial" });
const honk = Honk({ subsets: ["latin"], variable: "--font-honk" });
const danfo = Danfo({ subsets: ["latin"], variable: "--font-danfo" });
const hachiMaru = Hachi_Maru_Pop({ subsets: ["latin"], weight: "400", variable: "--font-hachi" });
const silkscreen = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--font-silkscreen" });

const inter = Inter({ subsets: ["latin"] });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Reklamo.ai — Prompts për reklama me AI",
  description:
    "Bibliotekë me prompts për reklama moderne, të ndara sipas kategorive reale të bizneseve.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
  lang="sq"
  data-theme="light"
  className={cn(instrumentSerif.variable, oi.variable, rubikSpray.variable, barriecito.variable, rubikIso.variable, vastShadow.variable, uncialAntiqua.variable, honk.variable, danfo.variable, hachiMaru.variable, silkscreen.variable, "font-sans", geist.variable)}
>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main style={{ paddingTop: "0px" }}>{children}</main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}