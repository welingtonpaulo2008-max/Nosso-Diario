export default function Timeline() {
  const events = [
    {
      date: "09 de Fevereiro de 2026",
      title: "A Declaração",
      description:
        "O dia em que as palavras saíram do peito. Quando eu admiti para o mundo (e pra você) que o meu coração já pertencia completamente à minha princesinha.",
    },
    {
      date: "29 de Abril de 2026",
      title: "O Pedido Oficial",
      description:
        "O momento em que o sentimento virou compromisso e certeza. Foi onde demos as mãos para construir o nosso universo juntos.",
    },
    {
      date: "O Presente & O Futuro",
      title: "A Cada Dia Mais Certeza",
      description:
        "Tudo o que passamos só mostrou que a nossa ligação é única. Meu coração continua escolhendo você a cada nascer do sol, minha Rosa Azul.",
    },
  ];

  return (
    <section className="my-14">
      {/* Título da Seção */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-2xl md:text-3xl text-slate-100 tracking-wide mb-2">
          Os Capítulos de Nós
        </h2>
        <p className="text-xs md:text-sm text-slate-400 italic">
          Os marcos que desenharam a nossa história no tempo 💙
        </p>
      </div>

      {/* Linha Vertical Conectora */}
      <div className="relative pl-7 md:pl-9 border-l border-sky-300/25 ml-3 md:ml-4 space-y-9">
        {events.map((event, index) => (
          <div key={index} className="relative group">
            {/* Ponto Pulsante Estelar */}
            <div className="absolute -left-[33.5px] md:-left-[41.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-glow shadow-[0_0_12px_#38bdf8] animate-pulse" />

            {/* Data */}
            <span className="text-xs font-semibold text-accent-blue uppercase tracking-widest block mb-1">
              {event.date}
            </span>

            {/* Cartão de Conteúdo */}
            <div className="glass-card rounded-2xl p-5 md:p-6 transition-all duration-300 hover:translate-x-1.5 border border-white/5">
              <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                {event.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-300/90 leading-relaxed font-light">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}