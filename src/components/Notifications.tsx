"use client";

import { useState, useEffect } from "react";
import { Bell, X, Sparkles, Heart } from "lucide-react";

interface Reminder {
  icon: string;
  title: string;
  text: string;
}

const reminders: Reminder[] = [
  {
    icon: "🌹",
    title: "Lembrete do Coração",
    text: "Dizem que uma rosa azul é impossível na natureza... mas você existe e é a minha.",
  },
  {
    icon: "✨",
    title: "Aviso Sideral",
    text: "No meio de bilhões de pessoas nessa galáxia, a minha estrelinha é você.",
  },
  {
    icon: "💍",
    title: "Certeza Absoluta",
    text: "Aliança nenhuma no mundo mede o que sinto. O que é nosso está gravado no peito.",
  },
  {
    icon: "👑",
    title: "Nota Rápida",
    text: "Passando para avisar que a dona do meu coração mais linda está lendo isso agora.",
  },
  {
    icon: "💙",
    title: "Lembrete de 2026",
    text: "Seja em 09/02 ou 29/04... eu escolheria você todas as vezes de novo.",
  },
  {
    icon: "🪐",
    title: "Fato Inegável",
    text: "O universo pode conspirar de mil jeitos, mas a gente sempre acha o caminho de volta.",
  },
  {
    icon: "💌",
    title: "Pensamento do Dia",
    text: "Você sorrindo é a minha constelação favorita de observar.",
  },
];

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Reminder>(reminders[0]);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);

  // Troca de lembrete periodicamente em segundo plano
  useEffect(() => {
    const interval = setInterval(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * reminders.length);
      } while (newIndex === lastIndex);

      setLastIndex(newIndex);
      setCurrentReminder(reminders[newIndex]);
      setHasUnread(true); // Acende o alerta no sininho
    }, 18000); // A cada 18 segundos um novo lembrete sutil chega

    return () => clearInterval(interval);
  }, [lastIndex]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false); // Limpa o alerta ao abrir
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9990] flex flex-col items-end">
      {/* Botão do Sininho Discreto */}
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-slate-950/85 border border-sky-400/40 text-accent-blue shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:border-cyan-glow hover:scale-105 transition-all backdrop-blur-xl cursor-pointer"
        title="Lembretes do Universo"
      >
        <Bell className="w-5 h-5" />
        
        {/* Ponto indicador de nova mensagem */}
        {hasUnread && (
          <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-ping" />
        )}
        {hasUnread && (
          <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
        )}
      </button>

      {/* Caixa de Notificação Recolhível */}
      {isOpen && (
        <div className="mt-2 w-80 sm:w-96 glass-card rounded-2xl p-4 border border-sky-400/30 shadow-2xl backdrop-blur-2xl animate-fade-in relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{currentReminder.icon}</span>
            <div>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-accent-blue block">
                {currentReminder.title}
              </span>
              <span className="text-[9px] text-slate-500">Enviado pelo Destino</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light mt-2 bg-slate-950/40 p-3 rounded-xl border border-white/5">
            &ldquo;{currentReminder.text}&rdquo;
          </p>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" /> Para a minha Rosa Azul
            </span>
            <span className="text-accent-blue italic">Toque no X para fechar</span>
          </div>
        </div>
      )}
    </div>
  );
}