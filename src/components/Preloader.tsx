"use client";

import { useState, useEffect } from "react";

const loaderIcons = ["💙", "🌹", "💐", "✨", "🪐"];
const loadingPhrases = [
  "Processando amor entre o Moon e a Sunshine...",
  "Alinhando as constelações do nosso universo...",
  "Regando a Rosa Azul mais rara da galáxia...",
  "Carregando as memórias e os nossos capítulos...",
  "Quase pronto, meu amorzinho... 💙",
];

// Gerador de corações estáticos para a chuva fluida
const fallingHearts = Array.from({ length: 22 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 94 + 3}%`,
  animationDuration: `${Math.random() * 1.5 + 1.8}s`,
  animationDelay: `${Math.random() * 0.8}s`,
  fontSize: `${Math.random() * 0.8 + 0.8}rem`,
  type: i % 5 === 0 ? "❤️" : i % 3 === 0 ? "🤍" : "💙", // Mais azul e branco, alguns vermelhos
}));

export default function Preloader() {
  const [iconIndex, setIconIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeText, setFadeText] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % loaderIcons.length);
    }, 850);

    const phraseInterval = setInterval(() => {
      setFadeText(true);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
        setFadeText(false);
      }, 300);
    }, 1100);

    // Inicia o fade out suave do preloader aos 3.0s
    const closeTimer = setTimeout(() => {
      setIsClosing(true);
    }, 3000);

    // Remove do DOM totalmente após a transição terminar (3.8s)
    const removeTimer = setTimeout(() => {
      clearInterval(iconInterval);
      clearInterval(phraseInterval);
      setVisible(false);
    }, 3800);

    return () => {
      clearInterval(iconInterval);
      clearInterval(phraseInterval);
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,#071026_0%,#02050e_100%)] overflow-hidden transition-all duration-800 ease-out ${
        isClosing ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Chuva de Corações Fluida (Azul, Branco e Vermelho) */}
      <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${isClosing ? "opacity-0" : "opacity-75"}`}>
        {fallingHearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute -top-10 animate-[rainDown_linear_infinite]"
            style={{
              left: heart.left,
              animationDuration: heart.animationDuration,
              animationDelay: heart.animationDelay,
              fontSize: heart.fontSize,
            }}
          >
            {heart.type}
          </span>
        ))}
      </div>

      <div className={`flex flex-col items-center p-6 text-center relative z-10 transition-transform duration-700 ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
        {/* Núcleo com Troca Suave de Ícone & Anel Orbital */}
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-glow/20 blur-xl animate-pulse" />
          
          <span className="text-4xl transition-all duration-500 transform scale-110 drop-shadow-[0_0_20px_rgba(56,189,248,0.8)]">
            {loaderIcons[iconIndex]}
          </span>

          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-blue border-r-rose-500/50 border-b-cyan-glow/30 animate-spin" />
        </div>

        {/* Título de Processando */}
        <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-accent-blue mb-2">
          Processando Amor...
        </span>

        {/* Frase Fofa que Alterna */}
        <p
          className={`min-h-[32px] text-sm md:text-base italic text-slate-200 tracking-wide transition-all duration-300 max-w-xs ${
            fadeText ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
          }`}
        >
          {loadingPhrases[phraseIndex]}
        </p>

        {/* Barra de Progresso Fluida */}
        <div className="mt-6 h-[4px] w-52 overflow-hidden rounded-full bg-white/10 p-[0.5px] border border-white/5">
          <div className="h-full w-full bg-gradient-to-r from-blue-700 via-sky-400 to-rose-500 rounded-full shadow-[0_0_12px_#38bdf8] animate-[fillProgress_3.0s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}