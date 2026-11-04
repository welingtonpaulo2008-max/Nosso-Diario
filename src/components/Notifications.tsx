"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [lastIndex, setLastIndex] = useState<number>(-1);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    const showNotification = () => {
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * reminders.length);
      } while (newIndex === lastIndex);

      setLastIndex(newIndex);
      setCurrentReminder(reminders[newIndex]);

      // Permanece visível por 5.5s
      hideTimer = setTimeout(() => {
        setCurrentReminder(null);

        // Aguarda entre 9 e 14s para mostrar a próxima
        const delay = Math.random() * 5000 + 9000;
        nextTimer = setTimeout(showNotification, delay);
      }, 5500);
    };

    // Primeira notificação aparece após 3.5 segundos
    const initialTimer = setTimeout(showNotification, 3500);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [lastIndex]);

  return (
    <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-[9999] pointer-events-none">
      <AnimatePresence>
        {currentReminder && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="pointer-events-auto flex items-start gap-3.5 rounded-2xl border border-sky-400/35 bg-slate-950/85 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-xl"
          >
            <span className="text-2xl pt-0.5">{currentReminder.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-accent-blue">
                  {currentReminder.title}
                </span>
                <span className="text-[10px] text-slate-400">Agora</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
                {currentReminder.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}