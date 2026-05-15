import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp, Info, Activity, Laugh, Smile, Meh, Frown } from 'lucide-react';

import YearlyCalendar from '../../components/dashboard/YearlyCalendar';

const card = {
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

const MoodHistory = () => {
  const moods = [
    { key: 'genial', label: 'Genial',  color: '#C1E1C1', textColor: '#2D5A27', icon: Laugh },
    { key: 'bien',   label: 'Bien',    color: '#DFFFD6', textColor: '#3E6B34', icon: Smile },
    { key: 'meh',    label: 'Meh',     color: '#FFF9C4', textColor: '#6D6027', icon: Meh   },
    { key: 'mal',    label: 'Mal',     color: '#FFE0B2', textColor: '#8D512E', icon: Frown },
    { key: 'fatal',  label: 'Fatal',   color: '#CFD8DC', textColor: '#455A64', icon: Frown },
  ];

  const moodColors = Object.fromEntries([
    ...moods.map(m => [m.key, m.color]),
    ['none', '#1a1d23']
  ]);

  const yearlyData = useMemo(() => {
    const keys = ['genial', 'bien', 'meh', 'none', 'none'];
    return Array.from({ length: 364 }, () => keys[Math.floor(Math.random() * keys.length)]);
  }, []);

  const monthDays = useMemo(() => {
    const keys = ['genial', 'bien', 'meh', 'none'];
    return Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      mood: keys[Math.floor(Math.random() * keys.length)]
    }));
  }, []);

  return (
    <div className="space-y-12 pb-32">

      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#0b0e14] px-14 py-12 rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,_rgba(139,92,246,0.05)_0%,_transparent_50%)]" />
        <div className="relative z-10 space-y-3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-violet-neon mb-1">
            <Activity size={15} />
            <span className="text-[9px] font-black uppercase tracking-[0.5em]">Tu camino</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Mi Evolución</h1>
          <p className="text-gray-500 max-w-lg font-medium leading-relaxed italic">
            Mira cuánto has crecido. Cada día que registras cómo te sientes es un paso más hacia el bienestar.
          </p>
        </div>
        <div className="relative z-10 bg-white/5 border border-white/10 px-8 py-6 rounded-3xl text-center">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Racha de Calma</p>
          <p className="text-3xl font-black text-white italic">14 <span className="text-violet-neon text-sm not-italic">Días</span></p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div variants={card} custom={0} initial="hidden" animate="visible" className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tight flex items-center gap-3">
              <CalendarIcon className="text-violet-neon" size={20} /> Mayo 2026
            </h3>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
              <div key={d} className="text-center text-[9px] font-black text-gray-600 uppercase tracking-widest mb-3">{d}</div>
            ))}
            {monthDays.map((day, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-2xl flex items-center justify-center relative cursor-pointer group"
                style={{ backgroundColor: moodColors[day.mood] }}
              >
                <span className={`text-xs font-black ${day.mood === 'none' ? 'text-gray-700' : 'text-black/50'}`}>{day.day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <motion.div variants={card} custom={1} initial="hidden" animate="visible" className="bg-white/5 border border-white/5 p-8 rounded-[3rem] flex-1">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Leyenda de Estados</h4>
            <div className="space-y-3">
              {moods.map((mood) => (
                <div key={mood.key} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shrink-0" style={{ backgroundColor: mood.color }}>
                    <mood.icon size={17} style={{ color: mood.textColor }} />
                  </div>
                  <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{mood.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div variants={card} custom={2} initial="hidden" animate="visible">
        <YearlyCalendar />
      </motion.div>
    </div>
  );
};

export default MoodHistory;
