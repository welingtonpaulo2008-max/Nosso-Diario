"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sun, Moon, Sparkles, Check } from "lucide-react";

export default function FloatingGreeting() {
  const [sender, setSender] = useState<"Moon" | "Sunshine">("Moon");
  const [isOpen, setIsOpen] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [counts, setCounts] = useState({ bomDia: 0, boaNoite: 0 });

  const fetchGreetings = async () => {
    try {
      const res = await fetch("/api/greetings");
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || { bomDia: 0, boaNoite: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGreetings();
  }, []);

  const handleSend = async (type: "bom_dia" | "boa_noite") => {
    // Efeito de confetes temático
    if (type === "bom_dia") {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.9, x: 0.15 },
        colors: ["#fbbf24", "#f59e0b", "#fde68a", "#ffffff"],
      });
      setSentMessage(`Bom dia enviado com amor! ☀️`);
    } else {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.9, x: 0.15 },
        colors: ["#38bdf8", "#818cf8", "#f43f5e", "#ffffff"],
      });
      setSentMessage(`Boa noite enviado nas estrelas! 🌙`);
    }

    try {
      const res = await fetch("/api/greetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, sender }),
      });
      if (res.ok) {
        fetchGreetings();
      }
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setSentMessage(null);
      setIsOpen(false);
    }, 2800);
  };

  return (
    <div className="fixed bottom-5 left-5 z-[9990] flex flex-col items-start gap-2">
      {/* Toast de Confirmação */}
      {sentMessage && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/90 border border-sky-400/40 text-xs text-white shadow-2xl backdrop-blur-xl animate-fade-in">
          <Check className="w-3.5 h-3.5 text-cyan-glow" />
          <span>{sentMessage}</span>
        </div>
      )}

      {/* Menu Aberto */}
      {isOpen && (
        <div className="glass-card rounded-2xl p-4 border border-sky-400/30 shadow-2xl backdrop-blur-2xl w-64 animate-fade-in space-y-3">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-[11px] font-semibold text-accent-blue uppercase tracking-wider">
              Quem está enviando:
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setSender("Moon")}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  sender === "Moon" ? "bg-rose-600 text-white" : "bg-slate-900 text-slate-400"
                }`}
                title="Moon (Welington)"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSender("Sunshine")}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  sender === "Sunshine" ? "bg-sky-600 text-white" : "bg-slate-900 text-slate-400"
                }`}
                title="Sunshine (Isadora)"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSend("bom_dia")}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-t from-amber-950/40 to-amber-500/20 border border-amber-400/30 text-amber-200 hover:scale-105 transition-all cursor-pointer"
            >
              <Sun className="w-5 h-5 mb-1 fill-amber-300 text-amber-300" />
              <span className="text-xs font-semibold">Bom Dia!</span>
              <span className="text-[10px] text-amber-300/70">{counts.bomDia} enviados</span>
            </button>

            <button
              onClick={() => handleSend("boa_noite")}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gradient-to-t from-indigo-950/40 to-blue-500/20 border border-blue-400/30 text-blue-200 hover:scale-105 transition-all cursor-pointer"
            >
              <Moon className="w-5 h-5 mb-1 fill-indigo-300 text-indigo-300" />
              <span className="text-xs font-semibold">Boa Noite!</span>
              <span className="text-[10px] text-blue-300/70">{counts.boaNoite} enviados</span>
            </button>
          </div>
        </div>
      )}

      {/* Botão Principal Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950/85 border border-sky-400/40 text-slate-100 shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:border-cyan-glow hover:scale-105 transition-all backdrop-blur-xl cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span className="text-xs font-medium tracking-wide">
          {isOpen ? "Fechar" : "Bom Dia / Boa Noite"}
        </span>
      </button>
    </div>
  );
}