import React from 'react';
import { Mic, Video, MessageSquare, Sparkles } from 'lucide-react';

const SessionCard = () => {
  return (
    <div className="glass-card p-8 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-neon/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-cyan-neon/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-neon/10 rounded-xl text-cyan-neon">
            <Sparkles size={20} />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-neon/80">Live Status</span>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">Momento de Calma</h2>
        <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed">
          Sincroniza tu respiración con la burbuja para reducir el cortisol.
        </p>
      </div>

      <div className="flex items-center justify-between mt-8 relative z-10">
        {/* Quick Access */}
        <div className="flex gap-3">
          {[Mic, Video, MessageSquare].map((Icon, idx) => (
            <button 
              key={idx}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-neon/30 hover:bg-cyan-neon/10 transition-all duration-300 group/btn"
            >
              <Icon size={20} className="text-gray-400 group-hover/btn:text-cyan-neon transition-colors" />
            </button>
          ))}
        </div>

        {/* Breathing Bubble */}
        <div className="relative flex items-center justify-center mr-4">
          <div className="w-16 h-16 rounded-full bg-cyan-neon/20 border border-cyan-neon/30 breathing-bubble flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-cyan-neon shadow-[0_0_15px_#06b6d4]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;
