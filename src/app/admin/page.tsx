"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, MessageSquare, PlusCircle, Trash2, ArrowLeft, Heart } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string | null;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [authError, setAuthError] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  // Formulário de nova memória
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuth(true);
            const loaded = await loadDashboardData();
            if (!loaded) {
              setIsAuth(false);
            }
          }
        }
      } catch {
        setAuthError("Erro ao verificar sessão do painel.");
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.error || "Senha incorreta.");
        return;
      }

      const loaded = await loadDashboardData();
      if (!loaded) {
        return;
      }

      setIsAuth(true);
      setAuthError("");
    } catch {
      setAuthError("Erro ao autenticar no painel.");
    }
  };

  const loadDashboardData = async () => {
    try {
      const [msgRes, memRes] = await Promise.all([
        fetch("/api/messages"),
        fetch("/api/memories"),
      ]);

      if (msgRes.ok && memRes.ok) {
        const msgData = await msgRes.json();
        const memData = await memRes.json();
        setMessages(msgData);
        setMemories(memData);
        return true;
      }

      setAuthError("Erro ao carregar dados do painel.");
      return false;
    } catch {
      setAuthError("Erro ao carregar dados do painel.");
      return false;
    }
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setLoadingAction(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          description,
          imageUrl,
          password,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDate("");
        setDescription("");
        setImageUrl("");
        await loadDashboardData();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Senha incorreta ou erro ao salvar.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar essa memória?")) return;

    try {
      const res = await fetch("/api/memories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });

      if (res.ok) {
        await loadDashboardData();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erro ao excluir memória.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin", { method: "DELETE" });
    setPassword("");
    setIsAuth(false);
    setMessages([]);
    setMemories([]);
    setAuthError("");
  };

  if (!isAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full rounded-3xl p-8 border border-sky-400/25 text-center">
          <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/30 flex items-center justify-center mx-auto mb-4 text-accent-blue">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="font-serif text-2xl text-white mb-2">Painel Secreto</h1>
          <p className="text-xs text-slate-400 mb-6">
            Digite a senha definida no arquivo .env para acessar os recados e memórias.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha de administrador..."
              className="w-full rounded-xl bg-slate-950/80 border border-sky-400/25 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-glow"
              required
            />

            {authError && <p className="text-xs text-red-400">{authError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              Entrar no Painel
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site da Isadora
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Topo do Admin */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-sky-400/20">
        <div>
          <h1 className="font-serif text-2xl text-white flex items-center gap-2">
            Painel do Universo <Heart className="w-5 h-5 text-accent-blue fill-accent-blue" />
          </h1>
          <p className="text-xs text-slate-400">Gerencie as memórias e leia os recados da Isadora</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-sky-400/20 text-xs text-slate-300 hover:text-white"
          >
            Sair
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-sky-400/20 text-xs text-accent-blue hover:text-white"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Ir para o Site
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna 1: Recadinhos Deixados por Ela */}
        <section className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-cyan-glow" /> Recados da Isadora ({messages.length})
          </h2>

          {messages.length === 0 ? (
            <p className="text-xs text-slate-500 italic">Nenhum recadinho deixado ainda.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl bg-slate-950/60 border border-sky-400/15">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-accent-blue">{msg.sender}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-light">{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coluna 2: Cadastrar Nova Memória */}
        <section className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <PlusCircle className="w-5 h-5 text-cyan-glow" /> Adicionar Nova Memória
          </h2>

          <form onSubmit={handleCreateMemory} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Título do Momento:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Aquele pôr do sol..."
                required
                className="w-full rounded-xl bg-slate-950/60 border border-sky-400/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Subtítulo ou Data:
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Ex: 29 de Abril ou 'Nosso Primeiro Abraço'"
                className="w-full rounded-xl bg-slate-950/60 border border-sky-400/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Descrição da Memória:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escreva a lembrança desse dia..."
                required
                className="w-full rounded-xl bg-slate-950/60 border border-sky-400/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                URL da Imagem (Opcional):
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (link de uma foto de vocês)"
                className="w-full rounded-xl bg-slate-950/60 border border-sky-400/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-glow"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAction}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-medium text-xs shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
            >
              {loadingAction ? "Salvando..." : "Salvar Memória no Baú"}
            </button>
          </form>
        </section>
      </div>

      {/* Lista de Memórias Cadastradas */}
      <section className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Memórias Atuais no Site ({memories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memories.map((mem) => (
            <div key={mem.id} className="p-4 rounded-xl bg-slate-950/50 border border-sky-400/15 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-accent-blue uppercase tracking-widest font-semibold">{mem.date}</span>
                <h3 className="text-sm font-semibold text-white mt-1">{mem.title}</h3>
                <p className="text-xs text-slate-300 font-light mt-1.5 line-clamp-3">{mem.description}</p>
              </div>
              <button
                onClick={() => handleDeleteMemory(mem.id)}
                className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 mt-3 pt-2 border-t border-white/5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir do site
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}