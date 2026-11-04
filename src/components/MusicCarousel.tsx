"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";

const trackIds = [
  "1De425SCFJULIHbcmeebUw",
  "7kBQS11ThrXE5JC5UqRc7e",
  "7fo1xiF2rDoMvDgR31Gvg3",
  "1cMFYGtNoh5x3hCWrHAVca",
  "0BXQZCSSyxFNUMWDg6bmQv",
  "18RIZfNceLJfLMjgrBGCXx",
  "02XnQdf7sipaKBBHixz3Zp",
  "1DLKuppSYytOuxhtI6KBGu",
  "7vFv0yFGMJW3qVXbAd9BK9",
  "0T5iIrXA4p5GsubkhuBIKV",
  "3vkCueOmm7xQDoJ17W1Pm3",
  "5XeFesFbtLpXzIVDNQP22n",
  "0n4LWmby3eCHk0rYiuFlHf",
  "2L2ZaoKMki1MIYB5wsrGD5",
  "6G9YlbU3ByPJQvOFDRdwyM",
  "5WefDSA0tjrZnbuear6TWN",
  "6yU6bwP6s3iwFu2F8N0KQs",
];

export default function MusicCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trackIds.length) % trackIds.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trackIds.length);
  };

  return (
    <section className="my-16">
      {/* Cabeçalho */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs tracking-widest uppercase mb-3">
          <Music className="w-3.5 h-3.5" /> Nossa Trilha Sonora
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
          Músicas Que Falam Por Mim
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic max-w-xl mx-auto">
          Cada verso, cada acorde... todas elas me lembram você e o que sentimos 💙
        </p>
      </div>

      {/* Card do Player */}
      <div className="glass-card rounded-3xl p-5 md:p-7 max-w-2xl mx-auto">
        {/* Barra Superior */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-blue">
            Faixa {currentSlide + 1} de {trackIds.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              title="Faixa Anterior"
              className="w-9 h-9 rounded-full bg-slate-950/70 border border-sky-400/30 text-accent-blue flex items-center justify-center transition-all hover:bg-sky-500/20 hover:border-cyan-glow hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              title="Próxima Faixa"
              className="w-9 h-9 rounded-full bg-slate-950/70 border border-sky-400/30 text-accent-blue flex items-center justify-center transition-all hover:bg-sky-500/20 hover:border-cyan-glow hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Iframe do Spotify com transição suave */}
        <div className="relative min-h-[352px] rounded-xl overflow-hidden shadow-2xl">
          <iframe
            key={trackIds[currentSlide]}
            style={{ borderRadius: "12px" }}
            src={`https://open.spotify.com/embed/track/${trackIds[currentSlide]}?utm_source=generator`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full animate-fade-in"
          />
        </div>

        {/* Bolinhas Indicadoras (com quebra inteligente de linha) */}
        <div className="flex justify-center flex-wrap gap-2 mt-5 max-w-sm mx-auto">
          {trackIds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? "w-6 bg-cyan-glow shadow-[0_0_8px_#38bdf8]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}