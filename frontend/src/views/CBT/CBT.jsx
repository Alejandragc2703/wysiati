import React from 'react';
import ClinicalModule from '../../components/clinical/ClinicalModule';
import { ShieldCheck, Info } from 'lucide-react';

const CBT = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      {/* Dynamic Header */}
      <header className="flex justify-between items-start bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-gold mb-3">
            <ShieldCheck size={24} />
            <span className="text-[10px] uppercase font-black tracking-[0.4em]">Clinical Ecosystem</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Módulo TCC</h1>
          <p className="text-gray-500 max-w-lg mt-3 leading-relaxed">
            Protocolos de Terapia Cognitivo-Conductual diseñados para fortalecer la resiliencia mental mediante la exposición estructurada y la re-evaluación cognitiva.
          </p>
        </div>
        
        <div className="relative z-10 flex flex-col items-end gap-4">
           <div className="flex items-center gap-2 bg-gold/10 px-4 py-2 rounded-2xl border border-gold/20">
              <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#d4af37] animate-pulse" />
              <span className="text-xs font-bold text-gold uppercase tracking-widest">Protocolo Activo</span>
           </div>
           <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-bg bg-gray-800 flex items-center justify-center">
                   <span className="text-[10px] font-bold text-gray-500">{i}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-gold/10 transition-all duration-1000" />
      </header>

      {/* Main Clinical Component */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
           <ClinicalModule />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
           {/* Guidelines Card */}
           <div className="glass-card p-8 border-white/5 space-y-6">
              <div className="flex items-center gap-3 text-gold">
                 <Info size={20} />
                 <h3 className="font-bold text-sm uppercase tracking-widest">Guía de Exposición</h3>
              </div>
              <ul className="space-y-4">
                 {[
                   'Mantén un nivel de ansiedad manejable.',
                   'No utilices conductas de seguridad.',
                   'Permanece en la tarea hasta que la ansiedad baje al 50%.',
                   'Registra tus sensaciones al finalizar.'
                 ].map((text, i) => (
                   <li key={i} className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                      <span className="text-gold font-black">•</span>
                      {text}
                   </li>
                 ))}
              </ul>
           </div>

           {/* Progress Card */}
           <div className="glass-card p-8 border-white/5 relative overflow-hidden group">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Tu Progreso Semanal</h3>
              <div className="flex items-end gap-2 h-32">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                   <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gold/20 group-hover/bar:bg-gold/40 transition-all" style={{height: `${h}%`}} />
                   </div>
                 ))}
              </div>
              <div className="mt-4 flex justify-between text-[8px] font-bold text-gray-700 uppercase tracking-widest">
                 <span>Lun</span>
                 <span>Dom</span>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default CBT;
