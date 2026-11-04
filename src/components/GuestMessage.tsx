"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function GuestMessage() {
  const [content, setContent] = useState("");
  const [sender, setSender] = useState("Isadora");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, content }),
      });

      if (res.ok) {
        setSent(true);
        setContent("");
      }
    } catch (err) {
      console.error("Erro ao enviar recadinho:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="my-16 max-w-xl mx-auto">
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-sky-400/25 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-accent-blue text-xs uppercase tracking-widest mb-3">
          <span>💌</span> Correio do Nosso Universo
        </div>

        <h2 className="font-serif text-xl md:text-2xl text-slate-100 tracking-wide mb-2">
          Deixe um Recado Para Mim
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic mb-6">
          Escreva o que você está sentindo agora... Eu vou ler tudo com todo o amor do mundo 💙
        </p>

        {sent ? (
          <div className="flex flex-col items-center justify-center p-6 bg-sky-500/10 border border-sky-400/30 rounded-2xl animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-cyan-glow mb-2" />
            <h3 className="text-base font-semibold text-white">Recadinho guardado no coração!</h3>
            <p className="text-xs text-slate-300 mt-1">
              Sua mensagem já está segura no meu banco de dados secreto.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-xs text-accent-blue underline hover:text-white"
            >
              Escrever outro recado
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                De quem é:
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Ex: Isadora, Sua Rosa Azul..."
                className="w-full rounded-xl bg-slate-950/60 border border-sky-400/20 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
                Sua Mensagem:
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva algo que você queira me dizer..."
                required
                className="w-full rounded-xl bg-slate-950/60 border border-sky-400/20 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Enviando..." : "Guardar Recado"}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}