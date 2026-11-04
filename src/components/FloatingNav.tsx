"use client";

import { useState, useEffect } from "react";
import { Home, BookMarked, BookOpen, Music, Sparkles } from "lucide-react";

export default function FloatingNav() {
  const [showNav, setShowNav] = useState(false);

  // Mostra a barra flutuante assim que ela começa a rolar a página para baixo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!showNav) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9980] animate-fade-in w-[90%] max-w-md">
      <nav className="glass-card flex items-center justify-around py-3 px-4 rounded-full border border-sky-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-2xl">
        
        {/* Início / Topo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-accent-blue transition-colors cursor-pointer"
          title="Início"
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Início</span>
        </button>

        {/* Diário */}
        <button
          onClick={() => scrollToSection("secao-diario")}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-accent-blue transition-colors cursor-pointer"
          title="Nosso Diário"
        >
          <BookMarked className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Diário</span>
        </button>

        {/* Livro de Ships */}
        <button
          onClick={() => scrollToSection("secao-livro")}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-accent-blue transition-colors cursor-pointer"
          title="Livro de Ships"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Livro</span>
        </button>

        {/* Baú de Memórias */}
        <button
          onClick={() => scrollToSection("secao-memorias")}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-accent-blue transition-colors cursor-pointer"
          title="Baú de Memórias"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Memórias</span>
        </button>

        {/* Trilha Sonora */}
        <button
          onClick={() => scrollToSection("secao-musicas")}
          className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-accent-blue transition-colors cursor-pointer"
          title="Trilha Sonora"
        >
          <Music className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-wider font-medium">Músicas</span>
        </button>

      </nav>
    </div>
  );
}