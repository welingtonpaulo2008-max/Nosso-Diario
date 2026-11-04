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

export default function Home() {
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
    <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      {/* Botão Flutuante de Bom Dia e Boa Noite no Canto */}
      <FloatingGreeting />

      {/* Cabeçalho */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <span className="animate-spin-slow">✦</span> Nosso Diário meu Amorzinho • 2026
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide bg-gradient-to-b from-white via-sky-100 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.25)] mb-3">
          Isadora Deguchi & Welington de Paulo
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

      {/* 3. Nosso Diário Íntimo (Novo!) */}
      <SharedJournal />

      {/* 4. Coisas Que Amo Em Você */}
      <Reasons />

      {/* 5. O Livro dos Nossos Ships (Moon & Sunshine Compartilhado) */}
      <Ships />

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

      {/* 7. Nosso Baú de Memórias (Com fotos e vídeos) */}
      <Memories />

      {/* 8. Botão Interativo de Carinho (Confetes + Backend) */}
      <LoveCounter />

      {/* 9. Caixa Para Ela Enviar Recados (Backend) */}
      <GuestMessage />

      {/* 10. Trilha Sonora com as 17 Faixas do Spotify */}
      <MusicCarousel />

      {/* 11. Carta Romântica Final */}
      <section className="glass-card rounded-3xl p-8 md:p-12 text-center my-16 bg-gradient-to-br from-blue-950/30 via-slate-900/80 to-slate-950 border border-sky-400/25">
        <p className="text-sm md:text-base text-slate-200 italic leading-relaxed mb-6 max-w-2xl mx-auto font-light">
          &ldquo;Cada segundo ao seu lado é uma certeza a mais de que o amor verdadeiro existe. Você
          é e sempre será a minha Rosa Azul — rara, preciosa e a mulher da minha vida.&rdquo;
        </p>
        <span className="font-serif text-base md:text-lg text-accent-blue font-semibold tracking-wider">
          Com todo o meu amor, do seu Moon 🌙
        </span>
      </section>

      {/* Rodapé Discreto */}
      <footer className="text-center text-xs text-slate-600 mt-16 mb-6">
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