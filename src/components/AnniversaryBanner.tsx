"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { PartyPopper, Heart } from "lucide-react";

export default function AnniversaryBanner() {
  const [totalMonths, setTotalMonths] = useState(6); // Valor inicial

  useEffect(() => {
    // Calculando a partir de 29 de Abril de 2026
    const startDate = new Date(2026, 3, 29); // Mês 3 é Abril (Janeiro = 0)
    const today = new Date();
    
    // Matemática exata da diferença total de meses
    let m = (today.getFullYear() - startDate.getFullYear()) * 12;
    m -= startDate.getMonth();
    m += today.getMonth();
    
    // Se o dia de hoje for menor que 29, ainda não completou o mês cheio
    if (today.getDate() < startDate.getDate()) {
      m--;
    }
    
    if (m > 0) setTotalMonths(m);

    // Chuva de confetes automática ao carregar o site! 🎉
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#38bdf8", "#fbbf24", "#f43f5e", "#ffffff"]
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#38bdf8", "#fbbf24", "#f43f5e", "#ffffff"]
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Estourar confetes sempre que clicar no banner
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#38bdf8", "#fbbf24", "#f43f5e", "#ffffff"],
    });
  };

  // Função inteligente para formatar Anos e Meses
  const renderTimeText = () => {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const numberStyle = "text-cyan-glow text-4xl md:text-5xl mx-1 drop-shadow-[0_0_15px_#38bdf8]";

    // Menos de 1 ano (ex: 6 Meses)
    if (years === 0) {
      return (
        <>
          <span className={numberStyle}>{months}</span> {months === 1 ? "Mês" : "Meses"}
        </>
      );
    }

    // Exatamente X anos redondos (ex: 1 Ano, 2 Anos)
    if (years > 0 && months === 0) {
      return (
        <>
          <span className={numberStyle}>{years}</span> {years === 1 ? "Ano" : "Anos"}
        </>
      );
    }

    // Anos e Meses (ex: 1 Ano e 1 Mês, 2 Anos e 3 Meses)
    return (
      <>
        <span className={numberStyle}>{years}</span> {years === 1 ? "Ano" : "Anos"} e <span className={numberStyle}>{months}</span> {months === 1 ? "Mês" : "Meses"}
      </>
    );
  };

  return (
    <div
      onClick={triggerConfetti}
      className="cursor-pointer glass-card mb-12 w-full rounded-3xl p-6 flex flex-col items-center justify-center border border-rose-400/40 shadow-[0_0_25px_rgba(244,63,94,0.25)] bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-blue-950/40 hover:scale-[1.02] transition-transform text-center relative overflow-hidden group animate-fade-in"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 border border-rose-400/20">
        <PartyPopper className="w-3.5 h-3.5" /> Nosso Dia Especial
      </div>
      
      <h2 className="font-serif text-2xl md:text-4xl font-bold text-white tracking-wide flex items-center justify-center gap-2 flex-wrap">
        Feliz {renderTimeText()} de Namoro!
      </h2>
      
      <p className="text-xs md:text-sm text-slate-300 italic mt-3 flex items-center gap-1.5 font-light">
        Toque aqui para comemorar de novo <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
      </p>
    </div>
  );
}