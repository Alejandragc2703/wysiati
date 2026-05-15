import React, { useState, useEffect } from 'react';
import { Award, Target, CheckCircle2, Lock, Sparkles, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const HABIT_CATEGORIES = [
  {
    name: 'Sustancias',
    items: ['Alcohol', 'Nicotina', 'Cannabis', 'Cocaína', 'MDMA', 'Otros']
  },
  {
    name: 'Digital',
    items: ['Redes Sociales', 'Videojuegos', 'Pornografía', 'Streaming Infinito']
  },
  {
    name: 'Comportamiento',
    items: ['Apuestas (Gambling)', 'Compras Compulsivas', 'Comida Emocional']
  },
  {
    name: 'Personal',
    items: ['Procrastinación', 'Ira / Temperamento', 'Otros']
  }
];

const SoberTracker = ({ days = 0, milestone = 30, isUnlocked = false, selectedHabits = [], lastCheckIn, onStatusChange }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    if (lastCheckIn) {
      const last = new Date(lastCheckIn).toDateString();
      const today = new Date().toDateString();
      if (last === today) setHasCheckedIn(true);
    }
  }, [lastCheckIn]);

  const toggleHabit = (habit) => {
    setSelected(prev => 
      prev.includes(habit) ? prev.filter(h => h !== habit) : [...prev, habit]
    );
  };

  const handleUnlock = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await api.unlockFortress(selected);
      if (onStatusChange) onStatusChange();
      setShowOnboarding(false);
    } catch (error) {
      console.error("Error al desbloquear:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.checkInHabit();
      setHasCheckedIn(true);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      alert(error.message || "Error en check-in");
    }
  };

  if (!isUnlocked && !showOnboarding) {
    return (
      <div className="glass-card p-14 bg-white/[0.01] border border-white/5 rounded-[3.5rem] flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
            <Lock size={30} className="text-white/20" />
          </div>
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-violet-neon uppercase tracking-[0.5em]">Módulo Inactivo</h3>
            <p className="text-3xl font-black text-white italic tracking-tighter uppercase">Fortaleza Bloqueada</p>
            <p className="text-gray-500 text-sm font-medium">Define tu pacto para empezar a forjar tu voluntad.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowOnboarding(true)}
          className="relative z-10 px-12 py-6 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl"
        >
          Activar Fortaleza
        </button>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-14 bg-white/[0.02] border border-white/10 rounded-[4rem] relative z-20"
      >
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-violet-neon" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.5em]">Configuración Inicial</span>
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Tu Pacto de Poder</h2>
            <p className="text-gray-500 text-sm">Selecciona los hábitos o adicciones que deseas transmutar.</p>
          </div>
          <button onClick={() => setShowOnboarding(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {HABIT_CATEGORIES.map(cat => (
            <div key={cat.name} className="space-y-4">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">{cat.name}</h4>
              <div className="flex flex-col gap-2">
                {cat.items.map(item => (
                  <button 
                    key={item}
                    onClick={() => toggleHabit(item)}
                    className={`px-4 py-3 rounded-xl text-[10px] font-bold text-left transition-all border ${
                      selected.includes(item) 
                      ? 'bg-violet-neon/20 border-violet-neon text-white' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-8 border-t border-white/5">
          <button 
            disabled={selected.length === 0 || loading}
            onClick={handleUnlock}
            className="flex items-center gap-4 px-12 py-6 bg-violet-neon text-white rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)] disabled:opacity-30"
          >
            {loading ? 'Sincronizando...' : 'Confirmar Pacto'}
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    );
  }

  const percentage = Math.min((days / milestone) * 100, 100);

  return (
    <div className="glass-card p-10 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group border-white/10 bg-white/[0.01] shadow-2xl rounded-[3.5rem] w-full">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      
      <div className="relative z-10 flex items-center gap-10 lg:border-r lg:border-white/10 lg:pr-12 shrink-0">
         <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
               <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
               <circle cx="48" cy="48" r="40" stroke="url(#horizGrad2)" strokeWidth="6" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={(2 * Math.PI * 40) * (1 - days / milestone)} strokeLinecap="round" fill="transparent" className="transition-all duration-1000" />
               <defs>
                  <linearGradient id="horizGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#8b5cf6" />
                     <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
               </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-black text-white leading-none">{days}</span>
               <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Días</span>
            </div>
         </div>
         <div className="space-y-1">
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em]">Sober Staking</h3>
            <p className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Fortaleza</p>
            <div className="flex flex-wrap gap-1 mt-2">
               {selectedHabits.map(h => (
                 <span key={h} className="text-[6px] font-black bg-white/5 px-2 py-1 rounded-full text-violet-neon uppercase tracking-widest border border-violet-neon/20">{h}</span>
               ))}
            </div>
         </div>
      </div>

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

      <div className="relative z-10 lg:pl-12 lg:border-l lg:border-white/10 shrink-0 text-center space-y-4 min-w-[220px]">
          <button 
            onClick={handleCheckIn}
            disabled={hasCheckedIn}
            className={`w-full px-6 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${
                !hasCheckedIn ? 'bg-white text-black hover:bg-violet-neon hover:text-white' : 'bg-green-500 text-white cursor-default'
            }`}
          >
            <CheckCircle2 size={18} />
            {hasCheckedIn ? 'Confirmado' : 'Check-In'}
          </button>
      </div>
    </div>
  );
};

export default SoberTracker;
