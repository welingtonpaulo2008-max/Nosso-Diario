"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  Plus,
  X,
  Moon,
  Sun,
  Bookmark,
  Feather,
  Upload,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

interface Ship {
  id?: string;
  author: "Moon" | "Sunshine" | string;
  shipName: string;
  universe?: string | null;
  trope?: string | null;
  whyWeMatch: string;
  quote?: string | null;
  imageUrl?: string | null; // Pode ser link de imagem OU apenas um emoji (ex: 🌹)
}

export default function Ships() {
  const [ships, setShips] = useState<Ship[]>([]);
  const [filter, setFilter] = useState<"all" | "Moon" | "Sunshine">("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modal para criar ou editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Campos do formulário
  const [author, setAuthor] = useState<"Moon" | "Sunshine">("Moon");
  const [shipName, setShipName] = useState("");
  const [universe, setUniverse] = useState("");
  const [trope, setTrope] = useState("");
  const [whyWeMatch, setWhyWeMatch] = useState("");
  const [quote, setQuote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Busca os ships do banco de dados
  const fetchShips = async () => {
    try {
      const res = await fetch("/api/ships");
      if (res.ok) {
        const data = await res.json();
        setShips(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erro ao carregar livro de ships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShips();
  }, []);

  // Filtra as páginas
  const filteredShips = ships.filter((s) => {
    if (filter === "all") return true;
    return s.author === filter;
  });

  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  // Navegação
  const nextPage = useCallback(() => {
    if (currentPage < filteredShips.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, filteredShips.length]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Suporte a setas do teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) return;
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage, isModalOpen]);

  // Abrir modal de criação limpa
  const openCreateModal = () => {
    setEditingId(null);
    setAuthor("Moon");
    setShipName("");
    setUniverse("");
    setTrope("");
    setWhyWeMatch("");
    setQuote("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  // Abrir modal de edição
  const openEditModal = (ship: Ship) => {
    setEditingId(ship.id || null);
    setAuthor((ship.author as "Moon" | "Sunshine") || "Moon");
    setShipName(ship.shipName);
    setUniverse(ship.universe || "");
    setTrope(ship.trope || "");
    setWhyWeMatch(ship.whyWeMatch);
    setQuote(ship.quote || "");
    setImageUrl(ship.imageUrl || "");
    setIsModalOpen(true);
  };

  // Upload e compressão da imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = (h * maxDim) / w;
            w = maxDim;
          } else {
            w = (w * maxDim) / h;
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        setImageUrl(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Salvar no banco (criação ou edição)
  const handleSubmitShip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipName.trim() || !whyWeMatch.trim()) return;

    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const payload = {
      id: editingId,
      author,
      shipName,
      universe,
      trope,
      whyWeMatch,
      quote,
      imageUrl,
    };

    try {
      const res = await fetch("/api/ships", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await fetchShips();
      } else {
        alert("Erro ao salvar o capítulo.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Excluir capítulo
  const handleDeleteShip = async (id?: string) => {
    if (!id) return;
    if (!confirm("Tem certeza que deseja apagar este capítulo do livro?")) return;

    try {
      const res = await fetch("/api/ships", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        await fetchShips();
        setCurrentPage(0);
      } else {
        alert("Erro ao excluir capítulo.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Função para verificar se a string é apenas um emoji (para o suporte a Emoji Gigante)
  const isEmojiOnly = (str: string) => {
    if (!str) return false;
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
    return emojiRegex.test(str.trim());
  };

  if (loading) {
    return <div className="glass-card max-w-3xl mx-auto rounded-3xl p-8 h-80 animate-pulse my-16 bg-slate-900/40" />;
  }

  const hasShips = filteredShips.length > 0;
  const current = hasShips ? filteredShips[currentPage] : null;
  const isCurrentMoon = current?.author === "Moon";

  return (
    <section className="my-16 max-w-3xl mx-auto relative">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-sky-400/30 text-accent-blue text-xs tracking-widest uppercase mb-3">
          <BookOpen className="w-3.5 h-3.5" /> Livro de Memórias & Ficção
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-1">
          O Livro dos Nossos Ships
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic">
          Onde o <span className="text-rose-400 font-medium">Moon 🌙</span> e a{" "}
          <span className="text-sky-300 font-medium">Sunshine ☀️</span> escrevem sobre os casais que lembram nós dois
        </p>
      </div>

      {/* Fitas Marcadoras */}
      <div className="flex justify-between items-end px-3 mb-[-12px] relative z-20">
        <div className="flex items-end gap-1.5 sm:gap-2 pl-6 md:pl-10">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-t-xl text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-slate-800 text-amber-300 border-t border-x border-amber-300/40 shadow-lg h-9"
                : "bg-slate-950/80 text-slate-400 hover:text-white border-t border-x border-white/5 h-7"
            }`}
          >
            <Bookmark className="w-3 h-3 hidden sm:block" /> Todos ({ships.length})
          </button>

          <button
            onClick={() => setFilter("Moon")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
              filter === "Moon"
                ? "bg-gradient-to-t from-rose-700 to-red-600 text-white border-t border-x border-rose-400/50 shadow-[0_0_15px_rgba(225,29,72,0.4)] h-9"
                : "bg-rose-950/60 text-rose-300 hover:text-white border-t border-x border-rose-900/40 h-7"
            }`}
          >
            <Moon className="w-3 h-3 fill-white hidden sm:block" /> Moon
          </button>

          <button
            onClick={() => setFilter("Sunshine")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-[10px] sm:text-xs font-semibold transition-all cursor-pointer ${
              filter === "Sunshine"
                ? "bg-gradient-to-t from-blue-700 to-sky-600 text-white border-t border-x border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.4)] h-9"
                : "bg-sky-950/60 text-sky-300 hover:text-white border-t border-x border-sky-900/40 h-7"
            }`}
          >
            <Sun className="w-3 h-3 fill-amber-300 text-amber-300 hidden sm:block" /> Sunshine
          </button>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-sky-400/30 text-accent-blue text-[10px] sm:text-xs rounded-t-xl hover:text-white hover:border-cyan-glow transition-all cursor-pointer h-8"
        >
          <Plus className="w-3.5 h-3.5" /> Escrever
        </button>
      </div>

      {/* Livro com Capa Dura (Classes do globals.css) */}
      <div className="book-cover min-h-[420px] flex">
        <div className="book-spine" />
        
        <div className="book-page flex-1 p-6 md:p-9 flex flex-col justify-between relative z-10">
          {hasShips && current ? (
            <div>
              {/* Topo da Página */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xs md:text-sm tracking-widest text-accent-blue uppercase font-bold">
                    Capítulo {currentPage + 1}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      isCurrentMoon
                        ? "bg-rose-500/15 border border-rose-400/30 text-rose-300"
                        : "bg-sky-500/15 border border-sky-400/30 text-sky-300"
                    }`}
                  >
                    {isCurrentMoon ? (
                      <>
                        <Moon className="w-2.5 h-2.5 fill-rose-300" /> Welington (Moon)
                      </>
                    ) : (
                      <>
                        <Sun className="w-2.5 h-2.5 fill-sky-300" /> Isadora (Sunshine)
                      </>
                    )}
                  </span>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block px-3 py-0.5 rounded-full bg-slate-900 border border-white/10 text-[11px] text-slate-300">
                    {current.trope || "Nossa Conexão"}
                  </span>
                  <button onClick={() => openEditModal(current)} className="p-1 rounded-lg text-slate-400 hover:text-accent-blue cursor-pointer">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteShip(current.id)} className="p-1 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Imagem OU Emoji Gigante */}
                {current.imageUrl && (
                  <div className="md:col-span-4 rounded-2xl overflow-hidden border border-sky-400/20 shadow-lg bg-slate-950/50 flex items-center justify-center min-h-[160px]">
                    {isEmojiOnly(current.imageUrl) ? (
                      <span className="text-6xl md:text-8xl drop-shadow-2xl">{current.imageUrl}</span>
                    ) : (
                      <img src={current.imageUrl} alt={current.shipName} className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                )}

                <div className={current.imageUrl ? "md:col-span-8" : "md:col-span-12"}>
                  <div className="mb-3">
                    <h3 className="font-serif text-xl md:text-2xl text-white font-semibold">
                      {current.shipName}
                    </h3>
                    {current.universe && (
                      <span className="text-xs text-slate-400 italic">Universo: {current.universe}</span>
                    )}
                  </div>

                  {current.quote && (
                    <blockquote className="italic text-xs md:text-sm text-sky-200/90 border-l-2 border-accent-blue pl-3 py-1 mb-4 bg-sky-950/20 rounded-r-lg">
                      {current.quote}
                    </blockquote>
                  )}

                  <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-accent-blue font-semibold block mb-1">
                      Na Visão de {current.author === "Moon" ? "Welington" : "Isadora"}:
                    </span>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light">
                      {current.whyWeMatch}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400 mr-1">Avaliação:</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] text-amber-300 font-semibold ml-1">(Somos Nós)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full my-auto">
              <div className="w-14 h-14 rounded-full bg-slate-900 border border-sky-400/25 flex items-center justify-center mb-4 text-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.15)]">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg md:text-xl text-white font-medium mb-2">
                O Livro está aberto em branco...
              </h3>
              <p className="text-xs md:text-sm text-slate-400 italic max-w-md mb-6">
                O <span className="text-rose-400">Moon 🌙</span> e a <span className="text-sky-300">Sunshine ☀️</span> têm todas as páginas para preencher com os casais que combinam com vocês.
              </p>
              <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-medium text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <Plus className="w-4 h-4" /> Escrever o Primeiro Capítulo
              </button>
            </div>
          )}

          {/* Rodapé com Navegação */}
          {hasShips && (
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
              <button onClick={prevPage} disabled={currentPage === 0} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <span className="text-xs text-slate-400 tracking-wider">Página {currentPage + 1} de {filteredShips.length}</span>
              <button onClick={nextPage} disabled={currentPage === filteredShips.length - 1} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-xs text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer">
                Próxima <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Escrever ou Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 md:p-8 border border-sky-400/30 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>

            <h3 className="font-serif text-xl text-white mb-1">{editingId ? "Editar Capítulo" : "Escrever Nosso Capítulo"}</h3>
            <p className="text-xs text-slate-400 mb-5">
              {editingId ? "Altere os textos ou a imagem deste capítulo." : "Adicione um casal e conte por que ele é a cara de vocês dois."}
            </p>

            <form onSubmit={handleSubmitShip} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">Quem está escrevendo:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setAuthor("Moon")} className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${author === "Moon" ? "bg-rose-600 text-white border-rose-400 shadow-md" : "bg-slate-900 text-slate-400 border-white/10"}`}>
                    <Moon className="w-3.5 h-3.5" /> Moon
                  </button>
                  <button type="button" onClick={() => setAuthor("Sunshine")} className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${author === "Sunshine" ? "bg-sky-600 text-white border-sky-400 shadow-md" : "bg-slate-900 text-slate-400 border-white/10"}`}>
                    <Sun className="w-3.5 h-3.5" /> Sunshine
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Nome do Casal:</label>
                <input type="text" value={shipName} onChange={(e) => setShipName(e.target.value)} required className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Universo (Livro/Filme):</label>
                  <input type="text" value={universe} onChange={(e) => setUniverse(e.target.value)} className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Dinâmica / Trope:</label>
                  <input type="text" value={trope} onChange={(e) => setTrope(e.target.value)} className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3 py-2 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Por que acho que combina com a gente:</label>
                <textarea rows={3} value={whyWeMatch} onChange={(e) => setWhyWeMatch(e.target.value)} required className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Frase Marcante (Opcional):</label>
                  <input type="text" value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Link da Imagem ou Emoji (ex: 🌹):</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-900 border border-sky-400/30 text-accent-blue text-[10px] hover:text-white transition-all cursor-pointer">
                      <Upload className="w-3.5 h-3.5" /> Abrir Galeria
                    </button>
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Ou digite um Emoji 🪐" className="w-1/2 rounded-xl bg-slate-950/80 border border-sky-400/20 px-2 py-2 text-xs text-white" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-xs shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                {saving ? "Salvando..." : editingId ? "Atualizar Capítulo 💙" : "Gravar Capítulo 💙"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}