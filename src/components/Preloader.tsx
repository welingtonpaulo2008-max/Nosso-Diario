"use client";

import { useState, useEffect } from "react";

const loadingPhrases = [
  "Alinhando as constelações para você...",
  "Buscando a Rosa Azul mais rara do universo...",
  "Calculando cada segundo ao seu lado...",
  "Preparando a nossa trilha sonora...",
  "Abrindo o nosso universo... 💙",
];

export default function Preloader() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Alterna as frases a cada 750ms
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
        setFade(false);
      }, 300);
    }, 750);

    // Revela o site suavemente após 2.8s
    const timer = setTimeout(() => {
      clearInterval(interval);
      setVisible(false);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center bg-[radial-gradient(circle_at_center,#071026_0%,#02050e_100%)] transition-opacity duration-700 ${
        !visible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center p-5 text-center">
        {/* Anel Orbital & Núcleo */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <span className="text-3xl animate-pulse drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
            💙
          </span>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-blue border-r-cyan-glow/40 animate-spin" />
        </div>

        {/* Frase Fofa que Alterna */}
        <p
          className={`min-h-[28px] text-sm md:text-base italic text-slate-200 tracking-wide transition-all duration-300 ${
            fade ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {loadingPhrases[phraseIndex]}
        </p>

        {/* Barra de Progresso com Brilho */}
        <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full bg-gradient-to-r from-blue-700 via-cyan-400 to-sky-300 shadow-[0_0_10px_#38bdf8] animate-[fillProgress_2.8s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}