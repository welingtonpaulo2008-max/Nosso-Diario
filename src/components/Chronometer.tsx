"use client";

import { useState, useEffect } from "react";

type Mode = "pedido" | "declaracao";

interface DateConfig {
  target: Date;
  title: string;
  desc: string;
}

const dates: Record<Mode, DateConfig> = {
  pedido: {
    target: new Date(2026, 3, 29, 0, 0, 0), // 29 de Abril de 2026
    title: "Tempo de Nós Dois Juntos",
    desc: "Desde o pedido oficial em 29 de Abril de 2026",
  },
  declaracao: {
    target: new Date(2026, 1, 9, 0, 0, 0), // 09 de Fevereiro de 2026
    title: "Tempo Desde que Me Declarei",
    desc: "Desde o dia em que te abri meu coração (09 de Fevereiro de 2026)",
  },
};

export default function Chronometer() {
  const [mode, setMode] = useState<Mode>("pedido");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let diff = now.getTime() - dates[mode].target.getTime();

      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days,
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 text-center my-12">
      {/* Botões Seletores */}
      <div className="inline-flex flex-col sm:flex-row bg-slate-950/60 border border-sky-300/20 rounded-2xl sm:rounded-full p-1.5 mb-6 gap-1 w-full sm:w-auto">
        <button
          onClick={() => setMode("pedido")}
          className={`px-5 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${
            mode === "pedido"
              ? "bg-sky-500/25 text-white border border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          29 de Abril • O Pedido
        </button>

        <button
          onClick={() => setMode("declaracao")}
          className={`px-5 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${
            mode === "declaracao"
              ? "bg-sky-500/25 text-white border border-sky-400/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          09 de Fevereiro • A Declaração
        </button>
      </div>

      <h2 className="text-lg md:text-xl font-medium text-slate-100 tracking-wide mb-1">
        {dates[mode].title}
      </h2>
      <p className="text-xs md:text-sm text-accent-blue tracking-wide mb-6">
        {dates[mode].desc}
      </p>

      {/* Grade do Cronômetro */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
          <span className="block font-serif text-3xl md:text-4xl font-semibold text-cyan-glow drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            {timeLeft.days}
          </span>
          <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-medium">
            Dias
          </span>
        </div>

        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
          <span className="block font-serif text-3xl md:text-4xl font-semibold text-cyan-glow drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            {timeLeft.hours}
          </span>
          <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-medium">
            Horas
          </span>
        </div>

        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
          <span className="block font-serif text-3xl md:text-4xl font-semibold text-cyan-glow drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            {timeLeft.minutes}
          </span>
          <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-medium">
            Minutos
          </span>
        </div>

        <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 transition-transform hover:-translate-y-0.5">
          <span className="block font-serif text-3xl md:text-4xl font-semibold text-cyan-glow drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
            {timeLeft.seconds}
          </span>
          <span className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest font-medium">
            Segundos
          </span>
        </div>
      </div>
    </section>
  );
}