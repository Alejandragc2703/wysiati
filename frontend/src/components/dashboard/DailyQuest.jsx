import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ChevronRight, Trophy } from 'lucide-react';

const DailyQuest = () => {
  const [step, setStep] = useState(0); // 0: Start, 1-3: Questions, 4: Results
  const [answers, setAnswers] = useState([]);

  const questions = [
    { q: '¿Cuál es tu nivel de energía actual?', options: ['Vibrante', 'Estable', 'Bajo'] },
    { q: '¿Cómo calificarías tu calma interior?', options: ['Paz total', 'Algo inquieto', 'Estrés alto'] },
    { q: '¿Qué tan enfocado te sientes en tus tareas?', options: ['Láser', 'Disperso', 'Sin rumbo'] },
    { q: '¿Te sientes conectado con los demás hoy?', options: ['Muy conectado', 'Algo aislado', 'Solo'] },
  ];

  const handleAnswer = (idx) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  // Simple Radar Chart SVG
  const RadarChart = ({ data }) => {
    const size = 140;
    const center = size / 2;
    const radius = size * 0.35;
    const labels = ['Energía', 'Calma', 'Enfoque', 'Social'];

    const points = data.map((val, i) => {
      const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
      const r = (val / 2) * radius + (radius * 0.1);
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

    return (
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid levels */}
        {[0.5, 1].map((level, i) => (
          <polygon
            key={i}
            points={data.map((_, j) => {
              const angle = (Math.PI * 2 * j) / data.length - Math.PI / 2;
              return `${center + radius * level * Math.cos(angle)},${center + radius * level * Math.sin(angle)}`;
            }).join(' ')}
            className="fill-none stroke-white/10 stroke-[0.5]"
          />
        ))}
        {/* Data Shape */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          points={points}
          className="fill-violet-neon/40 stroke-violet-neon stroke-2"
        />
        {/* Labels */}
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / data.length - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" className="fill-gray-500 text-[6px] font-black uppercase tracking-tighter">
              {label}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between h-full min-h-[220px] relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full justify-between relative z-10"
          >
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
        )}

        {step > 0 && step <= questions.length && (
          <motion.div
            key={`q-${step}`}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full justify-between relative z-10"
          >
            <div className="space-y-4">
              <span className="text-[8px] font-black text-violet-neon/60 uppercase tracking-[0.4em]">Pregunta {step}/{questions.length}</span>
              <p className="text-lg font-bold text-white leading-tight">{questions[step - 1].q}</p>
            </div>
            <div className="grid gap-2 mt-4">
              {questions[step - 1].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="px-4 py-2 bg-white/5 hover:bg-violet-neon/20 border border-white/5 hover:border-violet-neon/30 rounded-xl text-[10px] font-bold text-white/60 hover:text-white transition-all text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step > questions.length && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full relative z-10 w-full gap-4"
          >
            <div className="relative">
               <RadarChart data={answers} />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Trophy size={20} className="text-violet-neon/20" />
               </div>
            </div>
            
            <div className="text-center">
              <p className={`text-[12px] font-black uppercase tracking-[0.4em] italic animate-pulse ${
                (answers.reduce((a,b) => a+b, 0) / answers.length) < 0.7 ? 'text-green-400' :
                (answers.reduce((a,b) => a+b, 0) / answers.length) < 1.4 ? 'text-violet-neon' : 'text-orange-400'
              }`}>
                Estado: {
                  (answers.reduce((a,b) => a+b, 0) / answers.length) < 0.7 ? 'Óptimo' :
                  (answers.reduce((a,b) => a+b, 0) / answers.length) < 1.4 ? 'Estable' : 'Alerta'
                }
              </p>
              <button 
                onClick={() => {setStep(0); setAnswers([]);}}
                className="mt-2 text-[7px] font-black text-gray-700 uppercase tracking-widest hover:text-white transition-colors"
              >
                Reiniciar análisis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyQuest;
