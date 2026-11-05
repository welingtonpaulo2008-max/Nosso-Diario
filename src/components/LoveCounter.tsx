"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

export default function LoveCounter() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);

  // Busca o total acumulado direto do MongoDB
  useEffect(() => {
    async function fetchCounter() {
      try {
        const res = await fetch("/api/love-counter");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count || 0);
        }
      } catch (err) {
        console.error("Erro ao carregar contador do banco:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounter();
  }, []);

  const handleClick = async () => {
    // Efeito de confetes cósmicos (tons de azul da Sunshine e vermelho do Moon)
    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.8 },
      colors: ["#38bdf8", "#7dd3fc", "#f43f5e", "#fb7185", "#ffffff"],
    });

    setSending(true);
    setCount((prev) => prev + 1); // Atualização instantânea na tela

    // Grava +1 de forma permanente no MongoDB
    try {
      const res = await fetch("/api/love-counter", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch (err) {
      console.error("Erro ao registrar carinho no banco:", err);
    } finally {
      setTimeout(() => setSending(false), 300);
    }
  };

  return (
    <section className="glass-card rounded-3xl p-6 md:p-8 text-center my-14 max-w-xl mx-auto border border-sky-400/25 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs uppercase tracking-widest mb-3">
        <span>💙</span> Conexão do Coração <span>❤️</span>
      </div>

      <h2 className="font-serif text-xl md:text-2xl text-slate-100 tracking-wide mb-2">
        Pensando em Você Agora
      </h2>
      <p className="text-xs md:text-sm text-slate-400 italic mb-6 font-light">
        Cada clique aqui é um &ldquo;eu te amo&rdquo; gravado para sempre no nosso universo 🪐
      </p>

      {/* Botão Interativo com Corações Orbitando */}
      <button
        onClick={handleClick}
        disabled={sending}
        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-rose-500 text-white font-medium text-sm md:text-base shadow-[0_0_25px_rgba(56,189,248,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-85 cursor-pointer"
      >
        <Heart
          className={`w-5 h-5 fill-white transition-transform ${
            sending ? "scale-125" : "group-hover:scale-110"
          }`}
        />
        <span className="tracking-wide">Enviar Amor</span>
      </button>

      {/* Placar em Tempo Real Salvo no Banco de Dados */}
      <div className="mt-6 text-slate-300 text-xs md:text-sm font-light">
        {loading ? (
          <span className="text-slate-500">Buscando batimentos no banco...</span>
        ) : (
          <p>
            Já nos lembramos um do outro{" "}
            <strong className="text-cyan-glow font-semibold text-base font-serif drop-shadow-[0_0_8px_#38bdf8]">
              {count}
            </strong>{" "}
            vezes aqui dentro.
          </p>
        )}
      </div>
    </section>
  );
}