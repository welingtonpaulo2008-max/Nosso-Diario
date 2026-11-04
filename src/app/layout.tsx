import type { Metadata } from "next";
import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";

import Preloader from "@/components/Preloader";
import CosmicSky from "@/components/CosmicSky";
import Notifications from "@/components/Notifications";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Nosso Diário meu Amorzinho 💙",
  description: "Isadora & Welington (Moon & Sunshine) • 2026",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💙</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cinzel.variable} ${poppins.variable}`}>
      <body className="bg-space-black text-slate-100 min-h-screen relative antialiased selection:bg-sky-500/30 selection:text-white">
        {/* Tela de carregamento com frases fofas */}
        <Preloader />

        {/* Céu cósmico e constelações interativas */}
        <CosmicSky />

        {/* Notificações e lembretes aleatórios no topo */}
        <Notifications />

        {/* Conteúdo do site */}
        {children}
      </body>
    </html>
  );
}