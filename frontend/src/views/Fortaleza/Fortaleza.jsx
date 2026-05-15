import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, CheckCircle, Calendar, TrendingUp, Award, Shield, Lock, ChevronRight, X, Loader2 } from 'lucide-react';
import api from '../../services/api';
import SoberTracker from '../../components/dashboard/SoberTracker';

const HABIT_CATEGORIES = [
  { name: 'Sustancias', items: ['Alcohol', 'Nicotina', 'Cannabis', 'Cocaína', 'MDMA', 'Otros'] },
  { name: 'Digital', items: ['Redes Sociales', 'Videojuegos', 'Pornografía', 'Streaming Infinito'] },
  { name: 'Comportamiento', items: ['Apuestas (Gambling)', 'Compras Compulsivas', 'Comida Emocional'] },
  { name: 'Personal', items: ['Procrastinación', 'Ira / Temperamento', 'Otros'] }
];

const MEDALLAS = [
  { days: 3,  nombre: 'Semilla de Intención', descripcion: 'Los primeros pasos son los más valientes.', color: '#86efac', glow: '#86efac60', shape: 'circle'  },
  { days: 7,  nombre: 'Brote de Voluntad',    descripcion: 'Una semana entera eligiendo crecer.',      color: '#6ee7b7', glow: '#6ee7b760', shape: 'leaf'    },
  { days: 15, nombre: 'Piedra de Río',         descripcion: 'La perseverancia te pule como el agua.',   color: '#93c5fd', glow: '#93c5fd60', shape: 'oval'    },
  { days: 30, nombre: 'Cristal de Claridad',   descripcion: 'Un mes de días ganados. Eres tu propio faro.', color: '#c4b5fd', glow: '#c4b5fd60', shape: 'diamond' },
];

const GemSVG = ({ shape, color, glow, reached, size = 56 }) => {
  const opacity = reached ? 1 : 0.15;
  const shadow  = reached ? `drop-shadow(0 0 10px ${glow})` : 'none';
  const paths = {
    circle:  <circle cx="24" cy="24" r="15" />,
    leaf:    <ellipse cx="24" cy="24" rx="10" ry="17" transform="rotate(-30 24 24)" />,
    oval:    <ellipse cx="24" cy="24" rx="16" ry="11" />,
    diamond: <polygon points="24,6 40,24 24,42 8,24" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ opacity, filter: shadow }}>
      <defs>
        <linearGradient id={`g-${shape}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" /><stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <g fill={`url(#g-${shape})`} stroke={color} strokeWidth="1">{paths[shape] || paths.circle}</g>
    </svg>
  );
};

const Fortaleza = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selected, setSelected] = useState([]);

  const loadStatus = async () => {
    try {
      const res = await api.getFortressStatus();
      setData(res);
    } catch (error) {
      console.error("Error al cargar fortaleza:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleUnlock = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await api.unlockFortress(selected);
      await loadStatus();
      setShowOnboarding(false);
    } catch (error) {
      alert("Error al activar fortaleza");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-violet-neon" size={40} /></div>;

  if (!data?.is_unlocked && !showOnboarding) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-10 text-center space-y-10">
        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mx-auto shadow-2xl">
          <Shield size={60} className="text-white/20" />
        </div>
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter">Fortaleza Bloqueada</h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
            Para forjar tu voluntad, primero debes declarar tu compromiso. Define qué aspectos de tu vida deseas transmutar hoy.
          </p>
        </div>
        <button 
          onClick={() => setShowOnboarding(true)}
          className="px-14 py-7 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl active:scale-95"
        >
          Desbloquear Fortaleza
        </button>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="max-w-[1200px] mx-auto py-20 px-10">
        <div className="glass-card p-14 bg-white/[0.02] border border-white/10 rounded-[4rem] shadow-2xl">
          <div className="mb-12 space-y-2">
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Crea tu Pacto</h2>
            <p className="text-gray-500">Selecciona los desafíos que vas a superar. Puedes elegir varios.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {HABIT_CATEGORIES.map(cat => (
              <div key={cat.name} className="space-y-4">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">{cat.name}</h4>
                <div className="flex flex-col gap-2">
                  {cat.items.map(item => (
                    <button 
                      key={item}
                      onClick={() => setSelected(prev => prev.includes(item) ? prev.filter(h => h !== item) : [...prev, item])}
                      className={`px-4 py-3 rounded-xl text-[10px] font-bold text-left transition-all border ${
                        selected.includes(item) ? 'bg-violet-neon/20 border-violet-neon text-white' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-6 pt-8 border-t border-white/5">
            <button onClick={() => setShowOnboarding(false)} className="px-10 py-5 text-gray-500 font-black text-[10px] uppercase tracking-widest">Cancelar</button>
            <button 
              disabled={selected.length === 0}
              onClick={handleUnlock}
              className="px-12 py-6 bg-violet-neon text-white rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-xl disabled:opacity-30"
            >
              Confirmar Compromiso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-32 max-w-[1600px] mx-auto px-6">
      <header className="relative bg-[#0b0e14] px-14 py-14 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="relative z-10 space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic uppercase leading-none">Tu Camino de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">Fortaleza</span></h1>
          <div className="flex flex-wrap gap-2">
            {data.selected_habits?.map(h => (
              <span key={h} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-blue-300 uppercase tracking-widest">{h}</span>
            ))}
          </div>
        </div>
        <div className="text-center px-12 py-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl shrink-0">
          <p className="text-8xl font-black text-white italic leading-none">{data.current_streak}</p>
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mt-2">Días Ganados</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <SoberTracker 
            days={data.current_streak} 
            isUnlocked={true} 
            selectedHabits={data.selected_habits} 
            lastCheckIn={data.last_check_in}
            onStatusChange={loadStatus} 
          />
          
          <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 shadow-xl">
             <div className="flex items-center gap-3 mb-8">
                <Calendar size={18} className="text-blue-300/60" />
                <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Tus Metas Visuales</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {MEDALLAS.map((m, i) => {
                  const reached = data.current_streak >= m.days;
                  return (
                    <div key={i} className={`flex flex-col items-center gap-4 p-6 rounded-[2.5rem] border transition-all ${reached ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-30'}`}>
                       <GemSVG shape={m.shape} color={m.color} glow={m.glow} reached={reached} />
                       <p className="text-[10px] font-black text-white uppercase tracking-widest">{m.nombre}</p>
                       <span className="text-[8px] font-bold text-gray-500">{m.days} Días</span>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 shadow-xl">
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] mb-6">Tu Estado Actual</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Racha Máxima</span>
                    <span className="text-2xl font-black text-white">{data.max_streak}</span>
                 </div>
                 <div className="flex justify-between items-end border-t border-white/5 pt-6">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Próxima Medalla</span>
                    <span className="text-xl font-black text-violet-neon">
                      {MEDALLAS.find(m => m.days > data.current_streak)?.days - data.current_streak || 0} Días
                    </span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Fortaleza;
