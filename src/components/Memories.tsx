"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Video, Plus, X, Moon, Sun, Trash2, Sparkles } from "lucide-react";

interface Memory {
  id: string;
  author: "Moon" | "Sunshine" | string;
  title: string;
  date: string;
  description: string;
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | string;
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal para criar nova memória
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [author, setAuthor] = useState<"Moon" | "Sunshine">("Moon");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      console.error("Erro ao carregar memórias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // Upload e compactação automática de imagem ou vídeo do dispositivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaType(type);
    const reader = new FileReader();

    if (type === "image") {
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 900;
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
          setMediaUrl(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // Para vídeos (mantém em base64 ou URL se for menor)
      reader.onload = (event) => {
        setMediaUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          title,
          date,
          description,
          mediaUrl,
          mediaType,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDate("");
        setDescription("");
        setMediaUrl("");
        setIsModalOpen(false);
        fetchMemories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja apagar esta memória do baú?")) return;
    try {
      const res = await fetch("/api/memories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="my-16">
      {/* Cabeçalho */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-sky-400/30 text-accent-blue text-xs tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Nossos Tesouros
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
          Nosso Baú de Memórias
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic max-w-xl mx-auto">
          Pequenos instantes, fotos e vídeos que guardamos como as recordações mais preciosas da nossa vida 💙
        </p>

        <div className="mt-5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-medium text-xs md:text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-105 transition-transform cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Adicionar Foto ou Vídeo ao Baú
          </button>
        </div>
      </div>

      {/* Grade de Memórias */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card rounded-2xl p-6 h-56 animate-pulse bg-slate-900/40" />
          ))}
        </div>
      ) : memories.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-slate-400 italic text-sm">
          O baú ainda está vazio. Clique em &ldquo;Adicionar Foto ou Vídeo&rdquo; para guardar o primeiro momento!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {memories.map((mem) => {
            const isMoon = mem.author === "Moon";
            return (
              <div
                key={mem.id}
                className="glass-card rounded-2xl p-5 md:p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-accent-blue uppercase tracking-widest">
                      {mem.date || "Momento Especial"}
                    </span>
                    <button
                      onClick={() => handleDelete(mem.id)}
                      title="Excluir memória"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    {mem.title}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-300/85 leading-relaxed font-light mb-4">
                    {mem.description}
                  </p>
                </div>

                {/* Exibição de Mídia (Foto ou Vídeo) */}
                {mem.mediaUrl && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-sky-400/20 shadow-md">
                    {mem.mediaType === "video" ? (
                      <video
                        src={mem.mediaUrl}
                        controls
                        className="w-full h-48 object-cover bg-black"
                      />
                    ) : (
                      <img
                        src={mem.mediaUrl}
                        alt={mem.title}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
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
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Adicionar Memória */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full rounded-3xl p-6 md:p-8 border border-sky-400/30 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-white mb-1">Guardar no Baú de Memórias</h3>
            <p className="text-xs text-slate-400 mb-5">
              Adicione uma foto, um vídeo e uma lembrança inesquecível para vocês.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                  Quem está guardando:
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
                  Título da Memória:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Nossa primeira viagem..."
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Data ou Rótulo:
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Ex: 15 de Outubro / Nosso Passeio"
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Descrição da Lembrança:
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="O que aconteceu nesse dia que tornou ele tão especial?"
                  required
                  className="w-full rounded-xl bg-slate-950/80 border border-sky-400/20 px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow resize-none"
                />
              </div>

              {/* Seletor de Arquivos (Foto ou Vídeo da Galeria / PC) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                  Foto ou Vídeo:
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const isVid = f.type.startsWith("video");
                      handleFileChange(e, isVid ? "video" : "image");
                    }
                  }}
                  className="hidden"
                />

                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 border border-sky-400/30 text-accent-blue text-xs font-medium hover:text-white hover:border-cyan-glow transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> Abrir Galeria / Arquivos
                  </button>

                  {mediaUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaUrl("")}
                      className="px-3 py-2 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs hover:bg-red-900/50 cursor-pointer"
                    >
                      Remover Mídia
                    </button>
                  )}
                </div>

                {mediaUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-sky-400/30 h-32 bg-black">
                    {mediaType === "video" ? (
                      <video src={mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                      <img src={mediaUrl} alt="Prévia" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-xs shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {saving ? "Guardando no Baú..." : "Guardar no Baú de Memórias 💙"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}