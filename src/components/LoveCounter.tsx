"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

export default function LoveCounter() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCounter() {
      try {
        const res = await fetch("/api/love-counter");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch (err) {
        console.error("Erro ao carregar contador de amor:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounter();
  }, []);

  const handleClick = async () => {
    // Efeito de confetes cósmicos (tons de azul, ciano e branco)
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#38bdf8", "#7dd3fc", "#bae6fd", "#ffffff", "#1d4ed8"],
    });

    setSending(true);
    setCount((prev) => prev + 1);

    try {
      const res = await fetch("/api/love-counter", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch (err) {
      console.error("Erro ao registrar carinho:", err);
    } finally {
      setTimeout(() => setSending(false), 300);
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 text-center my-14 max-w-xl mx-auto border border-sky-400/25">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs uppercase tracking-widest mb-3">
        <span>💙</span> Toque de Carinho
      </div>

      <h2 className="font-serif text-xl md:text-2xl text-slate-100 tracking-wide mb-2">
        Pensando em Você Agora
      </h2>
      <p className="text-xs md:text-sm text-slate-400 italic mb-6">
        Cada clique aqui é um &ldquo;eu te amo&rdquo; que fica gravado no nosso universo 🪐
      </p>

      {/* Botão com Pulsação e Ícone */}
      <button
        onClick={handleClick}
        disabled={sending}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-medium text-sm md:text-base shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-80 cursor-pointer"
      >
        <Heart className={`w-5 h-5 fill-white transition-transform ${sending ? "scale-125" : "group-hover:scale-110"}`} />
        <span>Enviar Amor</span>
      </button>

      {/* Placar do Banco de Dados */}
      <div className="mt-6 text-slate-300 text-xs md:text-sm font-light">
        {loading ? (
          <span className="text-slate-500">Conectando ao coração...</span>
        ) : (
          <p>
            Já nos lembramos um do outro{" "}
            <strong className="text-cyan-glow font-semibold text-base font-serif">
              {count}
            </strong>{" "}
            vezes aqui dentro.
          </p>
        )}
      </div>
    </section>
  );
}