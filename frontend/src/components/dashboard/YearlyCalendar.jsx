import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const YearlyCalendar = () => {
  const weeks = 53;
  const days = 7;
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);

  useEffect(() => {
    api.getYearlyStats()
      .then(res => {
        setStats(res);
        setLoading(false);
        // Auto-scroll al final para ver el día de hoy
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
          }
        }, 100);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fecha base: el lunes de hace (weeks-1) semanas
  const getStartDate = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.getFullYear(), d.getMonth(), diff - (weeks - 1) * 7);
  };
  const startDate = getStartDate();

  // Pre-computamos las fechas para todo el grid para no instanciar Dates en cada render
  const gridDates = Array.from({ length: weeks }).map((_, wIdx) => 
    Array.from({ length: days }).map((_, dIdx) => 
      new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (wIdx * 7) + dIdx)
    )
  );

  // Mapa de colores por estado de ánimo (Paleta Exacta de la Captura)
  const moodColors = [
    { label: 'Fatal',  color: '#CFD8DC' }, // 1
    { label: 'Mal',    color: '#FFE0B2' }, // 2
    { label: 'Meh',    color: '#FFF9C4' }, // 3
    { label: 'Bien',   color: '#DFFFD6' }, // 4
    { label: 'Genial', color: '#C1E1C1' }  // 5
  ];

  // Helper para encontrar datos por fecha
  const getMoodForDate = (dateObj) => {
    // Formato YYYY-MM-DD local
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    
    // Búsqueda ultra-robusta por si el backend añade timezones o espacios
    const entry = stats.find(s => JSON.stringify(s).includes(dateStr));
    return entry ? Number(entry.mood_score) - 1 : -1;
  };

  const totalGenial = stats.filter(s => s.mood_score === 5).length;

  return (
    <div className="glass-card p-12 bg-white/[0.01] border border-white/5 rounded-[4rem] shadow-2xl space-y-12 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(139,92,246,0.03)_0%,_transparent_70%)]" />
      
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-neon shadow-[0_0_12px_#8b5cf6]" />
              <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em]">Mapa Emocional Anual</h3>
           </div>
           <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Tu Camino 2026</h2>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 text-[9px] font-black text-gray-700 uppercase tracking-widest pb-1">
             <span>Intensidad Emocional</span>
             <div className="flex gap-1.5">
                {moodColors.map((m, i) => (
                  <div key={i} className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: m.color }} />
                ))}
             </div>
          </div>
          <p className="text-[9px] font-bold text-violet-neon/40 italic uppercase tracking-widest">Sincronizado con tus registros diarios</p>
        </div>
      </header>

      {/* Contenedor del Mapa de GitHub - MÁS GRANDE */}
      <div className="relative z-10 overflow-x-auto pb-10 scrollbar-hide select-none">
        <div className="flex gap-[6px] min-w-max">
          {/* Etiquetas de Días (L, M, X...) */}
          <div className="flex flex-col gap-[6px] pr-6 pt-[54px] opacity-20">
            {['Lun', '', 'Mié', '', 'Vie', '', 'Dom'].map((d, i) => (
              <span key={i} className="text-[10px] h-[16px] flex items-center font-black text-white uppercase tracking-tighter">{d}</span>
            ))}
          </div>

          {/* Contenedor del Scroll Anual */}
          <div ref={scrollRef} className="flex gap-[6px] overflow-x-auto pt-8 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {Array.from({ length: weeks }).map((_, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[6px] relative">
                {/* Meses */}
                {wIdx % 4 === 0 && (
                  <span className="absolute top-0 left-0 text-[9px] font-black text-white/10 uppercase tracking-[0.3em] whitespace-nowrap">
                    {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][Math.floor(wIdx/4.4)]}
                  </span>
                )}
                
                {Array.from({ length: days }).map((_, dIdx) => {
                  const date = gridDates[wIdx][dIdx];
                  const moodIdx = getMoodForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  
                  return (
                    <motion.div 
                      key={dIdx}
                      whileHover={{ scale: 1.5, zIndex: 50, rotate: 5 }}
                      className={`w-[16px] h-[16px] rounded-[3px] cursor-pointer transition-all duration-500 relative ${
                        isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-black z-30' : ''
                      }`}
                      style={{ 
                        backgroundColor: moodIdx !== -1 ? moodColors[moodIdx].color : 'rgba(255,255,255,0.02)',
                        boxShadow: moodIdx !== -1 ? `0 0 10px ${moodColors[moodIdx].color}20` : 'none'
                      }}
                    >
                      {isToday && (
                        <div className="absolute inset-0 bg-white animate-pulse rounded-[2px] shadow-[0_0_15px_white]" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex justify-between items-center pt-8 border-t border-white/5">
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-[#C1E1C1]/20 rounded-2xl flex items-center justify-center border border-[#C1E1C1]/30">
                  <span className="text-xl font-black text-[#C1E1C1] italic">{totalGenial}</span>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Días Geniales</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase">Este año</p>
               </div>
            </div>
            <div className="w-[1px] h-10 bg-white/5" />
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-violet-neon/10 rounded-2xl flex items-center justify-center border border-violet-neon/20">
                  <span className="text-xl font-black text-violet-neon italic">{stats.length > 0 ? '1' : '0'}</span>
               </div>
               <div>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Racha Actual</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase">Días Seguidos</p>
               </div>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1 italic">Arquitecto de Bienestar</p>
            <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Visualización en Tiempo Real</p>
         </div>
      </footer>
    </div>
  );
};

export default YearlyCalendar;