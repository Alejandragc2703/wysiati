import React, { useState } from 'react';
import { Smile, Meh, Frown, Laugh } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const MoodSelectorDaylio = ({ onSuccess, hasRegistered }) => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { icon: Laugh, label: 'Genial', score: 5, color: 'bg-[#C1E1C1]', hover: 'hover:bg-[#A8D1A8]', text: '#2D5A27', load: 'cyan' }, 
    { icon: Smile, label: 'Bien', score: 4, color: 'bg-[#DFFFD6]', hover: 'hover:bg-[#C9FFB8]', text: '#3E6B34', load: 'cyan' },  
    { icon: Meh, label: 'Meh', score: 3, color: 'bg-[#FFF9C4]', hover: 'hover:bg-[#FFF59D]', text: '#6D6027', load: 'violet' },    
    { icon: Frown, label: 'Mal', score: 2, color: 'bg-[#FFE0B2]', hover: 'hover:bg-[#FFCC80]', text: '#8D512E', load: 'orange' },   
    { icon: Frown, label: 'Fatal', score: 1, color: 'bg-[#CFD8DC]', hover: 'hover:bg-[#B0BEC5]', text: '#455A64', load: 'orange' },  
  ];

  const handleMoodSelect = async (mood, idx) => {
    if (loading || hasRegistered) return;
    setLoading(true);
    setSelected(idx);
    
    try {
      await api.saveJournalEntry({
        title: `Estado: ${mood.label}`,
        content: `Registro rápido de estado de ánimo: ${mood.label}`,
        mood_score: mood.score,
        emotional_load: mood.load
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar mood:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] py-20 px-12 rounded-[3.5rem] border border-white/5 flex flex-col items-center justify-center gap-14 h-full relative overflow-hidden group">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(139,92,246,0.05)_0%,_transparent_70%)]" />
      
      <div className="flex flex-col items-center gap-2 relative z-10">
        <h3 className="text-xl font-black text-white tracking-tight italic uppercase">
          {hasRegistered ? '¡Estado Registrado!' : '¿Cómo te sientes hoy?'}
        </h3>
        {loading && <span className="text-[9px] font-bold text-violet-neon animate-pulse uppercase tracking-widest">Sincronizando con el Arquetipo...</span>}
        {hasRegistered && !loading && <span className="text-[9px] font-bold text-violet-neon uppercase tracking-[0.4em]">Vuelve mañana para tu próxima sincronización</span>}
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-12 relative z-10 w-full">
        {moods.map((mood, idx) => (
          <motion.button
            key={idx}
            disabled={loading || hasRegistered}
            whileHover={{ scale: (loading || hasRegistered) ? 1 : 1.15 }}
            whileTap={{ scale: (loading || hasRegistered) ? 1 : 0.95 }}
            onClick={() => handleMoodSelect(mood, idx)}
            className={`flex flex-col items-center gap-4 group ${(loading || hasRegistered) ? 'cursor-not-allowed opacity-40' : ''}`}
          >
            <div className={`w-16 h-16 ${mood.color} ${mood.hover} rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${selected === idx ? 'ring-4 ring-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-110' : 'opacity-70 group-hover:opacity-100'}`}>
              <mood.icon size={28} style={{ color: mood.text }} className="opacity-90" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${selected === idx ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelectorDaylio;
