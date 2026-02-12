import React from 'react';

const StickyFooter: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 p-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="hidden sm:block">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800">
                    <img src="https://picsum.photos/100/100" alt="Luciano Soares" className="w-full h-full object-cover opacity-80" />
                 </div>
                 <div className="flex flex-col">
                     <span className="text-xs text-zinc-500 uppercase tracking-wider">Arquiteto do Sistema</span>
                     <span className="text-sm text-zinc-300 font-medium">Luciano Soares</span>
                 </div>
             </div>
        </div>
        
        <div className="flex items-center gap-2 text-center sm:text-right w-full sm:w-auto justify-center sm:justify-end">
             <span className="text-xs text-zinc-400 hidden md:inline">Deseja que o arquiteto desse sistema implemente seu plano?</span>
             <a 
                href="#" 
                className="group relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-black transition duration-300 ease-out bg-yellow-500 rounded-sm shadow-md"
             >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"></span>
                <span className="relative flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider">
                    Agendar Diagnóstico 
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
             </a>
        </div>
      </div>
    </div>
  );
};

export default StickyFooter;
