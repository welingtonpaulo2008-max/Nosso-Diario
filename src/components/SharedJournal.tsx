"use client";

import { useState, useEffect } from "react";
import { BookMarked, Plus, X, Moon, Sun, Heart, Sparkles } from "lucide-react";

interface JournalEntry {
  id: string;
  author: "Moon" | "Sunshine" | string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function SharedJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal para criar novo registro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState<"Moon" | "Sunshine">("Moon");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("O que vi você fazer");
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/journal");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error("Erro ao carregar diário:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, title, content, category }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setIsModalOpen(false);
        fetchEntries();
      }
    } catch (err) {
      console.error("Erro ao salvar diário:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="my-16 max-w-3xl mx-auto">
      {/* Cabeçalho */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-sky-400/30 text-accent-blue text-xs tracking-widest uppercase mb-3">
          <BookMarked className="w-3.5 h-3.5" /> Nosso Diário Íntimo
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
          Nosso Diário meu Amorzinho
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic max-w-xl mx-auto">
          Coisas que vimos o outro fazer, manias que amamos e sentimentos guardados no coração 💙
        </p>

        <div className="mt-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-medium text-xs md:text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-105 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Escrever no Diário de Hoje
          </button>
        </div>
      </div>

      {/* Lista de Registros do Diário */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-6 h-36 animate-pulse bg-slate-900/40" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-slate-400 italic text-sm">
          Ainda não há páginas escritas no diário. Seja o primeiro a registrar um momento de hoje!
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const isMoon = entry.author === "Moon";
            return (
              <div
                key={entry.id}
                className="glass-card rounded-2xl p-6 md:p-7 border border-sky-400/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        isMoon
                          ? "bg-rose-500/15 border border-rose-400/30 text-rose-300"
                          : "bg-sky-500/15 border border-sky-400/30 text-sky-300"
                      }`}
                    >
                      {isMoon ? (
                        <>
                          <Moon className="w-3 h-3 fill-rose-300" /> Escrito pelo Moon (Welington)
                        </>
                      ) : (
                        <>
                          <Sun className="w-3 h-3 fill-sky-300" /> Escrito pela Sunshine (Isadora)
                        </>
                      )}
                    </span>

                    <span className="px-3 py-0.5 rounded-full bg-slate-900 border border-white/10 text-[11px] text-slate-300">
                      {entry.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {new Date(entry.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="font-serif text-lg md:text-xl text-white font-semibold mb-2">
                  {entry.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-light whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Escrever no Diário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 md:p-8 border border-sky-400/30 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-white mb-1">Nova Página do Diário</h3>
            <p className="text-xs text-slate-400 mb-5">
              Guarde um sentimento ou uma atitude linda que você viu hoje.
            </p>

            <form onSubmit={handleCreateEntry} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                  Quem está escrevendo:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAuthor("Moon")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      author === "Moon"
                        ? "bg-rose-600 text-white border-rose-400 shadow-md"
                        : "bg-slate-900 text-slate-400 border-white/10"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" /> Moon (Welington)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthor("Sunshine")}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      author === "Sunshine"
                        ? "bg-sky-600 text-white border-sky-400 shadow-md"
                        : "bg-slate-900 text-slate-400 border-white/10"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" /> Sunshine (Isadora)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Sobre o que é:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-glow"
                >
                  <option value="O que vi você fazer">O que vi você fazer e me apaixonei</option>
                  <option value="Como me senti hoje">Como me senti com você hoje</option>
                  <option value="Nossa Rotina">Detalhe fofo do nosso dia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Título do Momento:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O jeito que você sorriu quando..."
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  O que aconteceu / O que senti:
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva o momento com carinho..."
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-xs shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {saving ? "Salvando no Diário..." : "Salvar Página no Diário 💙"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}