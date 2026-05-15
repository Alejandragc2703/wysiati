import React from 'react';
import { Wind, Scissors, User, Sparkles, Zap, Ghost, Crown, Star } from 'lucide-react';

const AttributeGrid = () => {
  // Mapeo de 20 peinados con iconos representativos
  const hairStyles = [
    { id: 1, label: 'Largo Liso', icon: Wind },
    { id: 2, label: 'Buzz Cut', icon: Scissors },
    { id: 3, label: 'Bob Clásico', icon: User },
    { id: 4, label: 'Rizado Aura', icon: Sparkles },
    { id: 5, label: 'Punk Mohawk', icon: Zap },
    { id: 6, label: 'Ondas Mar', icon: Wind },
    { id: 7, label: 'Pixie Cut', icon: Scissors },
    { id: 8, label: 'Coleta Alta', icon: Crown },
    { id: 9, label: 'Trenzas IA', icon: Star },
    { id: 10, label: 'Fade Neón', icon: Zap },
    { id: 11, label: 'Afro Puff', icon: Sparkles },
    { id: 12, label: 'Shaggy', icon: Ghost },
    { id: 13, label: 'Undercut', icon: Scissors },
    { id: 14, label: 'Top Knot', icon: User },
    { id: 15, label: 'Side Part', icon: Wind },
    { id: 16, label: 'Mullet 2.0', icon: Zap },
    { id: 17, label: 'E-Boy Flow', icon: Ghost },
    { id: 18, label: 'Vintage Wave', icon: Crown },
    { id: 19, label: 'Cyber Spikes', icon: Zap },
    { id: 20, label: 'Zen Bald', icon: User },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
      {hairStyles.map((style) => (
        <button
          key={style.id}
          className="group relative flex flex-col items-center gap-3 p-5 glass-card border-white/5 hover:border-violet-neon/40 hover:bg-violet-neon/5 transition-all duration-500 overflow-hidden"
        >
          {/* Background Highlight on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:border-violet-neon/30 transition-all duration-500">
            <style.icon 
              size={24} 
              className="text-gray-600 group-hover:text-violet-neon transition-colors" 
            />
          </div>

          <div className="relative z-10 text-center">
            <span className="block text-[9px] font-black text-gray-600 uppercase tracking-[0.15em] group-hover:text-white transition-colors">
              {style.label}
            </span>
            <span className="block text-[7px] font-bold text-violet-neon/40 mt-1 opacity-0 group-hover:opacity-100 transition-all uppercase">
              Seleccionar
            </span>
          </div>

          {/* Active Indicator (Hidden by default) */}
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-neon shadow-[0_0_8px_#8b5cf6] scale-0 group-hover:scale-100 transition-transform" />
        </button>
      ))}
    </div>
  );
};

export default AttributeGrid;
