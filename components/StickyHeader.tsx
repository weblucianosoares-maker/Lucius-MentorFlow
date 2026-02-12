import React from 'react';

const StickyHeader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 p-3 shadow-lg transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Lado Esquerdo: Perfil Compacto */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 shadow-inner">
            <img src="https://picsum.photos/100/100" alt="Luciano Soares" className="w-full h-full object-cover opacity-80" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider leading-none mb-0.5">Arquiteto do Sistema</span>
            <span className="text-xs text-zinc-300 font-bold leading-none">Luciano Soares</span>
          </div>
        </div>

        {/* Lado Direito: CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-[10px] text-zinc-400 hidden md:inline tracking-tight">Deseja implementar este plano?</span>
          <a
            href="https://wa.me/5521972070247?text=Eu%20fiz%20o%20diagn%C3%B3stico%20no%20Lucius%20e%20quero%20ajuda%20para%20implementar"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-black transition duration-300 ease-out bg-yellow-500 rounded-sm shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"></span>
            <span className="relative flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold">
              Agendar Diagnóstico
              <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;