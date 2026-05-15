import React, { useState, useEffect } from 'react';
import { Award, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const SoberTracker = ({ days: initialDays = 1, milestone = 30 }) => {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [currentDays, setCurrentDays] = useState(initialDays);

  useEffect(() => {
    setCurrentDays(initialDays);
  }, [initialDays]);

  const handleCheckIn = async () => {
    try {
      const res = await api.checkInHabit();
      if (res.success) {
        setHasCheckedIn(true);
        setCurrentDays(res.newStreak);
      }
    } catch (error) {
      alert("Error al sincronizar tu racha con el Santuario.");
    }
  };

  const percentage = Math.min((currentDays / milestone) * 100, 100);

  return (
    <div className="glass-card p-10 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group border-white/10 bg-white/[0.01] shadow-2xl">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      
      {/* Stat Block */}
      <div className="relative z-10 flex items-center gap-10 lg:border-r lg:border-white/10 lg:pr-12 shrink-0">
         <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
               <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
               <circle cx="48" cy="48" r="40" stroke="url(#horizGrad2)" strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={(2 * Math.PI * 40) * (1 - currentDays / milestone)} strokeLinecap="round" fill="transparent" className="transition-all duration-1000" />
               <defs>
                  <linearGradient id="horizGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#8b5cf6" />
                     <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
               </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-black text-white leading-none">{currentDays}</span>
               <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Días</span>
            </div>
         </div>
         <div className="space-y-1">
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em]">Sober Staking</h3>
            <p className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Fortaleza</p>
            <div className="flex items-center gap-2 text-violet-neon/40">
               <Award size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">Sincronizado</span>
            </div>
         </div>
      </div>

      {/* Progress */}
      <div className="relative z-10 flex-1 w-full space-y-6">
         <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <Target size={12} className="text-cyan-400" /> Próxima Gema
               </p>
               <p className="text-lg font-black text-white uppercase italic">{milestone} Días de Paz</p>
            </div>
            <div className="text-right">
               <span className="text-2xl font-black text-cyan-400">{Math.round(percentage)}%</span>
            </div>
         </div>
         <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 to-cyan-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]" 
              style={{ width: `${percentage}%` }}
            />
         </div>
      </div>

      {/* Check-in Action */}
      <div className="relative z-10 lg:pl-12 lg:border-l lg:border-white/10 shrink-0 text-center space-y-4 min-w-[200px]">
          <button 
            onClick={handleCheckIn}
            disabled={hasCheckedIn}
            className={`w-full px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${
                !hasCheckedIn ? 'bg-white text-black hover:bg-violet-neon hover:text-white' : 'bg-green-500 text-white cursor-default'
            }`}
          >
            <CheckCircle2 size={18} />
            {hasCheckedIn ? '¡Confirmado!' : 'Hacer Check-In'}
          </button>
          {hasCheckedIn && (
            <motion.p 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-[8px] font-black uppercase tracking-widest leading-relaxed max-w-[180px] mx-auto text-green-400"
            >
              ¡Fortaleza confirmada! Tu sistema nervioso está en equilibrio.
            </motion.p>
          )}
      </div>
    </div>
  );
};

export default SoberTracker;
