import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ChevronRight, Trophy, Lock, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const DailyQuest = ({ hasRegistered, initialData }) => {
  const [step, setStep] = useState(0); // 0: Start, 1-4: Questions, 5: Saving, 6: Results
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [completedToday, setCompletedToday] = useState(hasRegistered || false);
  const [finalResults, setFinalResults] = useState(initialData || null);

  useEffect(() => {
    if (hasRegistered && initialData) {
      setCompletedToday(true);
      setFinalResults(initialData);
      setStep(6);
    }
  }, [hasRegistered, initialData]);

  const questions = [
    { q: '¿Cómo ha sido tu calidad de sueño anoche?', options: ['Reparador', 'Interrumpido', 'Insomnio'] }, 
    { q: '¿Sientes interés o placer en tus tareas hoy?', options: ['Mucho', 'Algo', 'Nada'] },
    { q: '¿Cómo definirías tu claridad mental ahora?', options: ['Limpia', 'Nebulosa', 'Confusa'] },
    { q: '¿Qué nivel de optimismo sientes sobre mañana?', options: ['Alto', 'Neutro', 'Bajo'] },
  ];

  const handleAnswer = (idx) => {
    const val = 2 - idx; // Mejor: 2, Peor: 0
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(5); // Ir a estado de guardado
      finishQuest(newAnswers);
    }
  };

  const finishQuest = async (finalAnswers) => {
    setError(null);
    const avg = finalAnswers.reduce((a, b) => a + b, 0) / finalAnswers.length;
    const resultText = avg > 1.4 ? 'Óptimo' : avg > 0.7 ? 'Estable' : 'Alerta';
    
    try {
      await api.saveQuest({
        answers: finalAnswers,
        score: avg,
        resultText
      });
      setFinalResults(finalAnswers);
      setCompletedToday(true);
      setStep(6);
    } catch (err) {
      console.error("Error al guardar misión:", err);
      setError("No se pudo sincronizar. ¿Reintentar?");
      setStep(4); // Volver a la última pregunta para poder reintentar
    }
  };

  const RadarChart = ({ data }) => {
    if (!data || data.length < 4) return null;
    const size = 120;
    const center = size / 2;
    const radius = size * 0.35;
    const labels = ['Sueño', 'Interés', 'Claridad', 'Ánimo'];

    const points = data.map((val, i) => {
      const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
      const r = (val / 2) * radius + (radius * 0.2);
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

    return (
      <svg width={size} height={size} className="overflow-visible">
        {[0.5, 1].map((level, i) => (
          <polygon
            key={i}
            points={[0, 1, 2, 3].map((j) => {
              const angle = (Math.PI * 2 * j) / 4 - Math.PI / 2;
              return `${center + radius * level * Math.cos(angle)},${center + radius * level * Math.sin(angle)}`;
            }).join(' ')}
            className="fill-none stroke-white/10 stroke-[0.5]"
          />
        ))}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          points={points}
          className="fill-violet-neon/40 stroke-violet-neon stroke-2"
        />
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
          const x = center + (radius + 15) * Math.cos(angle);
          const y = center + (radius + 15) * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" className="fill-gray-600 text-[6px] font-black uppercase tracking-tighter">
              {label}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between h-full min-h-[260px] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <AnimatePresence mode="wait">
        {completedToday && step !== 6 ? (
          <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-12 h-12 bg-violet-neon/10 rounded-full flex items-center justify-center border border-violet-neon/20">
               <Lock size={20} className="text-violet-neon/40" />
            </div>
            <div>
               <p className="text-xs font-black text-white uppercase tracking-widest">Misión Cumplida</p>
               <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Sincronización completa por hoy</p>
            </div>
            <button onClick={() => setStep(6)} className="text-[9px] font-black text-violet-neon uppercase tracking-widest hover:underline">Ver resultados</button>
          </motion.div>
        ) : step === 0 ? (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-violet-neon rounded-full animate-pulse shadow-[0_0_8px_#8b5cf6]" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Misión Diaria</span>
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-tighter italic uppercase leading-none">Daily Quest</p>
              <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mt-1">Sincroniza tu estado</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-4 flex items-center justify-between w-full px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group/btn"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Comenzar</span>
              <ChevronRight size={14} className="text-violet-neon group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ) : step <= questions.length ? (
          <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full justify-between relative z-10">
            <div className="space-y-4">
              <span className="text-[8px] font-black text-violet-neon/60 uppercase tracking-[0.4em]">Pregunta {step}/{questions.length}</span>
              <p className="text-lg font-bold text-white leading-tight">{questions[step - 1].q}</p>
              {error && <p className="text-[8px] text-red-400 font-bold uppercase animate-pulse">{error}</p>}
            </div>
            <div className="grid gap-2 mt-4">
              {questions[step - 1].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)} className="px-4 py-2 bg-white/5 hover:bg-violet-neon/20 border border-white/5 hover:border-violet-neon/30 rounded-xl text-[10px] font-bold text-white/60 hover:text-white transition-all text-left">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        ) : step === 5 ? (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4 text-center">
             <Loader2 size={32} className="text-violet-neon animate-spin" />
             <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Sincronizando con el Arquetipo...</p>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full relative z-10 w-full gap-4">
            <RadarChart data={finalResults || answers} />
            <div className="text-center">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Tu Análisis</p>
              <p className="text-lg font-black text-violet-neon italic uppercase tracking-widest">Sincronizado</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyQuest;
