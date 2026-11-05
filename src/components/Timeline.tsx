export default function Timeline() {
  const events = [
    {
      date: "09 de Fevereiro de 2026",
      title: "Declaração do Meu Amor",
      description:
        "Esse foi o dia em que meus sentimentos afloraram e venceram todos os medos. Com toda a vergonha e timidez do mundo kkkkkk finalmente admiti meu amor diante de todos. E, então, o inesperado aconteceu: você o aceitou e me mostrou que esse sentimento era recíproco.",
    },
    {
      date: "29 de Abril de 2026",
      title: "Nosso Compromisso de Amor",
      description:
        "Naquele momento, eu já sabia que você era a pessoa certa, que me amava e que não queria me perder. Literalmente dois meses depois, tivemos a certeza de que queríamos estar juntos e, ali, dois meses depois kkkkk eu te pedi em namoro. Você deixou de ser apenas um sentimento e se tornou uma certeza. Naquele instante, você me tornou um dos homens mais felizes do mundo.",
    },
    {
      date: "13 de Junho de 2026",
      title: "Primeiro Dia dos Namorados e Copa Juntos",
      description:
        "NOSSO PRIMEIRO DIA DOS NAMORADOS JUNTOS!! E, para completar, ainda tivemos a oportunidade de assistir à Copa do Mundo juntos. Foi um dia em que pudemos dedicar nosso tempo inteiramente um ao outro. Esse momento ficou marcado em mim, pois foi a primeira vez que pude ter você tão pertinho, te conhecer ainda mais de perto e enxergar, de verdade, cada detalhe seu. Ver a sua felicidade, o brilho nos seus olhos e o quanto você estava feliz me encantava de uma forma inexplicável. Sua alegria sempre teve um efeito enorme sobre mim, e poder vivenciar tudo aquilo ao seu lado tornou aquele dia ainda mais especial.",
    },
    {
      date: "O Presente & O Futuro",
      title: "Uma Historia de Certeza",
      description:
        "Cada momento que passamos juntos é uma prova de que nosso amor é verdadeiro e duradouro. Cada riso compartilhado, cada abraço apertado e cada olhar trocado fortalece nossa conexão. Estamos construindo uma história de amor baseada na confiança, no respeito e na cumplicidade. E, olhando para o futuro, sei que continuaremos a escrever capítulos incríveis juntos, enfrentando desafios e celebrando conquistas lado a lado. Aqui te confirmo que você não é só apenas um sentimento e compromisso, mas meu Mundo!!",
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