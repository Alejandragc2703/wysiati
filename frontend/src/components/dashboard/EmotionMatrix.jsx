import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Moon, Wind } from 'lucide-react';

const EmotionMatrix = () => {
  const [point, setPoint] = useState({ x: 50, y: 50 });

  return (
    <div className="glass-card p-10 flex flex-col h-full border-white/10 bg-white/[0.03] relative overflow-hidden group shadow-xl">
      {/* Blurred Pastel Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-40 h-40 bg-pink-400/30 blur-[60px] rounded-full" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/30 blur-[60px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-400/30 blur-[60px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400/30 blur-[60px] rounded-full" />
      </div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-[11px] font-black text-white/50 uppercase tracking-[0.3em]">Cielo Emocional</h3>
        <Sun size={16} className="text-yellow-400/50" />
      </div>

      <div className="flex-1 relative flex items-center justify-center z-10">
        <div 
          className="relative w-full aspect-square cursor-pointer rounded-3xl border border-white/10 backdrop-blur-sm bg-white/[0.02]"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setPoint({ x, y });
          }}
        >
          {/* Axis Markings (Very subtle) */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5" />
          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-white/5" />

          {/* Icon Labels */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
             <Sun size={14} className="text-yellow-200" /><span className="text-[7px] font-bold uppercase tracking-widest text-white/40">Paz</span>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
             <Moon size={14} className="text-indigo-200" /><span className="text-[7px] font-bold uppercase tracking-widest text-white/40">Profundidad</span>
          </div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-40 -rotate-90">
             <Wind size={14} className="text-cyan-200" /><span className="text-[7px] font-bold uppercase tracking-widest text-white/40">Calma</span>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-40 rotate-90">
             <Cloud size={14} className="text-pink-200" /><span className="text-[7px] font-bold uppercase tracking-widest text-white/40">Energía</span>
          </div>

          {/* Selection Point (Soft Glow) */}
          <motion.div 
            animate={{ x: `${point.x}%`, y: `${point.y}%` }}
            className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center"
          >
            <div className="w-6 h-6 rounded-full bg-white border-4 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
            <div className="absolute inset-0 bg-white blur-xl opacity-20" />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 flex justify-between relative z-10">
         <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Estado Identificado</p>
         <p className="text-xs font-black text-white italic tracking-wider">
           {point.y < 50 ? 'Serenidad' : 'Introspección'} {point.x > 50 ? 'Vibrante' : 'Suave'}
         </p>
      </div>
    </div>
  );
};

export default EmotionMatrix;
