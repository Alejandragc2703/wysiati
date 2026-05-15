import React from 'react';
import { Mic, Video, X, Sparkles, Activity, ShieldCheck } from 'lucide-react';

const TherapySession = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-dark-bg animate-in fade-in duration-1000 flex flex-col">
      {/* Background Avatar (Full Screen Mockup) */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-10" />
      <img 
        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=2000" 
        alt="Dr. Elara"
        className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-2000"
      />

      {/* Top HUD */}
      <header className="relative z-20 p-8 flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck size={16} />
            <span className="text-[10px] uppercase font-black tracking-[0.4em]">AI Therapy Session: 14:38</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Dr. Elara</h2>
        </div>
        <button className="p-3 bg-red-500/20 text-red-500 border border-red-500/30 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
          <X size={24} />
        </button>
      </header>

      {/* Side HUD: Kintsugi Analysis */}
      <div className="relative z-20 flex-1 flex justify-end items-center p-10">
        <div className="kintsugi-card p-6 w-[280px] space-y-6">
          <div className="flex items-center gap-2 text-gold">
            <Activity size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Kintsugi Analysis</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-bold uppercase">
                <span>Vocal Stress</span>
                <span className="text-gold">Calm</span>
              </div>
              <div className="w-full h-10 bg-white/5 rounded-xl flex items-end gap-1 p-2">
                {[4, 7, 3, 5, 8, 4, 6, 9, 3, 5].map((h, i) => (
                  <div key={i} className="flex-1 bg-gold/30 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-bold uppercase">
                <span>Micro-Expressions</span>
                <span className="text-cyan-neon">92% Empathy</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full">
                <div className="w-[92%] h-full bg-cyan-neon shadow-[0_0_8px_#06b6d4]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating HUD: Breathing Bubble */}
      <div className="absolute left-12 bottom-32 z-30">
        <div className="glass-card p-8 flex items-center gap-8 border-cyan-neon/30">
          <div className="w-24 h-24 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 breathing-bubble flex items-center justify-center">
             <div className="w-10 h-10 rounded-full bg-cyan-neon shadow-[0_0_20px_#06b6d4]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Breathe In...</h3>
            <p className="text-cyan-neon text-xs font-medium uppercase tracking-[0.2em] mt-1">(expanding)</p>
            <div className="mt-4 flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-neon" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">User Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD: Session Controls */}
      <footer className="relative z-20 p-8 flex justify-center gap-6">
        <div className="glass-card px-8 py-4 flex gap-6 shadow-2xl border-white/5 bg-black/40">
           <button className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <Mic size={20} className="text-gray-400 group-hover:text-white" />
              </div>
              <span className="text-[8px] uppercase font-black tracking-widest text-gray-600">Mute</span>
           </button>
           <button className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <Video size={20} className="text-gray-400 group-hover:text-white" />
              </div>
              <span className="text-[8px] uppercase font-black tracking-widest text-gray-600">Video</span>
           </button>
           <div className="w-[1px] h-full bg-white/5" />
           <button className="px-8 bg-red-500/20 text-red-500 border border-red-500/30 rounded-2xl text-xs font-black tracking-widest hover:bg-red-500 hover:text-white transition-all">
              END SESSION
           </button>
        </div>
      </footer>
    </div>
  );
};

export default TherapySession;
