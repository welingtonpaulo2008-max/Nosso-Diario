"use client";

import { useState, useEffect } from "react";
import { Plus, X, Moon, Sun, Trash2, Heart } from "lucide-react";

interface Reason {
  id: string;
  author: "Moon" | "Sunshine" | string;
  title: string;
  description: string;
}

export default function Reasons() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal para adicionar novo motivo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState<"Moon" | "Sunshine">("Moon");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchReasons = async () => {
    try {
      const res = await fetch("/api/reasons");
      if (res.ok) {
        const data = await res.json();
        setReasons(data);
      }
    } catch (err) {
      console.error("Erro ao carregar motivos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleCreateReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setIsModalOpen(false);
        fetchReasons();
      }
    } catch (err) {
      console.error("Erro ao salvar motivo:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja apagar este motivo?")) return;
    try {
      const res = await fetch("/api/reasons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchReasons();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="my-16">
      {/* Cabeçalho */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-sky-400/30 text-accent-blue text-xs tracking-widest uppercase mb-3">
          <span>✦</span> Meus Motivos
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
          Coisas Que Amo Em Você
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic max-w-xl mx-auto">
          Desde os detalhes mais bobos até as maiores certezas que me fazem te amar cada vez mais 💙
        </p>

        <div className="mt-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-medium text-xs md:text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-105 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Adicionar Novo Motivo
          </button>
        </div>
      </div>

      {/* Grade de Motivos */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-6 h-36 animate-pulse bg-slate-900/40" />
          ))}
        </div>
      ) : reasons.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-slate-400 italic text-sm">
          Nenhum motivo adicionado ainda. Clique em &ldquo;Adicionar Novo Motivo&rdquo; para começar!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {reasons.map((reason, index) => {
            const isMoon = reason.author === "Moon";
            return (
              <div
                key={reason.id}
                className="glass-card relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  {/* Número de Ordem */}
                  <span className="absolute top-4 right-5 font-serif text-3xl font-bold text-sky-400/25 group-hover:text-sky-400/40 transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-base md:text-lg font-semibold text-white mb-2 pr-10">
                    {reason.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300/85 leading-relaxed font-light mb-4">
                    {reason.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isMoon
                        ? "bg-rose-500/15 border border-rose-400/30 text-rose-300"
                        : "bg-sky-500/15 border border-sky-400/30 text-sky-300"
                    }`}
                  >
                    {isMoon ? <Moon className="w-2.5 h-2.5 fill-rose-300" /> : <Sun className="w-2.5 h-2.5 fill-sky-300" />}
                    {isMoon ? "Moon" : "Sunshine"}
                  </span>

                  <button
                    onClick={() => handleDelete(reason.id)}
                    title="Excluir motivo"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Adicionar Motivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full rounded-3xl p-6 md:p-8 border border-sky-400/30 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-white mb-1">Adicionar Novo Motivo</h3>
            <p className="text-xs text-slate-400 mb-5">
              Escreva mais um detalhe que faz você amar a Isadora.
            </p>

            <form onSubmit={handleCreateReason} className="space-y-4 text-left">
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
                  Título do Motivo:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: O jeito que você olha..."
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Por que você ama isso:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o motivo com carinho..."
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-xs shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {saving ? "Salvando Motivo..." : "Salvar Novo Motivo 💙"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}