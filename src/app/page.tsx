"use client";

import { useState } from "react";
import Chronometer from "@/components/Chronometer";
import Timeline from "@/components/Timeline";
import Reasons from "@/components/Reasons";
import Ships from "@/components/Ships";
import SharedJournal from "@/components/SharedJournal";
import Memories from "@/components/Memories";
import LoveCounter from "@/components/LoveCounter";
import GuestMessage from "@/components/GuestMessage";
import MusicCarousel from "@/components/MusicCarousel";
import FloatingGreeting from "@/components/FloatingGreeting";
import FloatingNav from "@/components/FloatingNav";
import AnniversaryBanner from "@/components/AnniversaryBanner";

export default function Home() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  const declarations = [
    {
      quote: "Você é o meu primeiro pensamento bom do dia e a minha paz antes de dormir.",
      author: "— Seu Moon (Welington)",
    },
    {
      quote: "Mesmo nos dias comuns, você faz tudo parecer mágico só por estar comigo.",
      author: "— Para a minha Estrelinha",
    },
    {
      quote: "Dizem que perfeição não existe, mas o seu sorriso do meu lado discorda disso.",
      author: "— Para a minha Rosa Azul",
    },
  ];

  return (
    <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 pb-32">
      
      {/* Botões e Navegação Flutuante */}
      <FloatingGreeting />
      <FloatingNav />

      {/* 🎉 BANNER DE COMEMORAÇÃO DOS MESES NO TOPO! */}
      <AnniversaryBanner />

      {/* Cabeçalho */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <span className="animate-spin-slow">✦</span> Nosso Diário meu Amorzinho • 2026
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide bg-gradient-to-b from-white via-sky-100 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.25)] mb-3">
          Isadora Martins Deguchi & Welington
        </h1>

        <p className="text-sm md:text-base text-slate-400 italic">
          O <span className="text-rose-400 font-medium not-italic">Moon 🌙</span> e a{" "}
          <span className="text-sky-300 font-medium not-italic">Sunshine ☀️</span> • Minha{" "}
          <span className="text-accent-blue font-medium not-italic">Princesa</span> &{" "}
          <span className="text-accent-blue font-medium not-italic">Rosa Azul</span>
        </p>
      </header>

      {/* 1. Cronômetro Duplo (29 de Abril & 09 de Fevereiro) */}
      <Chronometer />

      {/* 2. Linha do Tempo */}
      <Timeline />

      {/* 3. Nosso Diário Íntimo */}
      <div id="secao-diario">
        <SharedJournal />
      </div>

      {/* 4. Coisas Que Amo Em Você */}
      <Reasons />

      {/* 5. O Livro dos Nossos Ships */}
      <div id="secao-livro">
        <Ships />
      </div>

      {/* 6. Coisas Que Sempre Quero Te Dizer (Declarações) */}
      <section className="my-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs tracking-widest uppercase mb-3">
            <span>✦</span> Do Meu Peito
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
            Coisas Que Sempre Quero Te Dizer
          </h2>
          <p className="text-xs md:text-sm text-slate-400 italic max-w-xl mx-auto">
            Para você ler e nunca se esquecer de quem você é para mim 💙
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {declarations.map((item, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <span className="font-serif text-4xl text-sky-400/30 leading-none mb-1 block">
                &ldquo;
              </span>
              <p className="text-xs md:text-sm text-slate-200 italic leading-relaxed mb-4">
                {item.quote}
              </p>
              <span className="text-xs font-medium text-accent-blue tracking-wide">
                {item.author}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Nosso Baú de Memórias */}
      <div id="secao-memorias">
        <Memories />
      </div>

      {/* 8. Botão Interativo de Carinho */}
      <LoveCounter />

      {/* 9. Caixa Para Ela Enviar Recados */}
      <GuestMessage />

      {/* 10. Trilha Sonora com as 17 Faixas do Spotify */}
      <div id="secao-musicas">
        <MusicCarousel />
      </div>

      {/* 11. Carta Romântica com Envelope e Lacre de Cera */}
      <section className="my-16 max-w-2xl mx-auto relative pt-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
            Uma Carta Para Você
          </h2>
          <p className="text-xs md:text-sm text-slate-400 italic">
            Toque no lacre de cera para abrir a mensagem 💌
          </p>
        </div>

        <div className="envelope-card min-h-[300px] flex flex-col items-center justify-center p-8 relative">
          <div className={`envelope-flap ${isLetterOpen ? "open" : ""}`} />

          <div
            onClick={() => setIsLetterOpen(true)}
            className={`wax-seal ${isLetterOpen ? "broken" : ""}`}
            title="Quebrar o lacre"
          >
            🌙
          </div>

          <div
            className={`transition-all duration-700 ease-out z-0 w-full text-center ${
              isLetterOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-sm md:text-base text-slate-200 italic leading-relaxed mb-8 font-light">
              &ldquo;Cada segundo ao seu lado é uma certeza a mais de que o amor verdadeiro existe. Você
              é e sempre será a minha Rosa Azul — rara, preciosa e a mulher da minha vida.&rdquo;
            </p>
            
            <span className="font-serif text-base md:text-lg text-accent-blue font-semibold tracking-wider block mb-6">
              Com todo o meu amor, do seu Moon 🌙
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLetterOpen(false);
              }}
              className="text-[10px] text-slate-500 hover:text-white uppercase tracking-widest border-b border-slate-700 hover:border-white transition-colors cursor-pointer"
            >
              Guardar Carta
            </button>
          </div>
        </div>
      </section>

      {/* Rodapé Discreto */}
      <footer className="text-center text-xs text-slate-600 mt-16 mb-6 relative z-10">
        <p>Feito por Welington (Moon) para Isadora (Sunshine) • 2026</p>
        <a
          href="/admin"
          className="text-slate-700 hover:text-slate-400 transition-colors text-[10px] mt-2 inline-block"
        >
          Acesso Restrito
        </a>
      </footer>
    </main>
  );
}