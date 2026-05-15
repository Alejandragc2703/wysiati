import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingFlow = () => {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const questions = [
    { 
      id: 'p1',
      text: "¿Cómo reaccionas ante una situación de alta presión?", 
      options: [
        { label: 'Analizo cada detalle obsesivamente', val: 'A' },
        { label: 'Tomo acción inmediata con calma', val: 'B' },
        { label: 'Me siento bloqueado y sin energía', val: 'C' }
      ] 
    },
    { 
        id: 'p2',
        text: "¿Cuál es tu prioridad principal hoy?", 
        options: [
          { label: 'Reducir el ruido mental', val: 'A' },
          { label: 'Maximizar mi productividad', val: 'B' },
          { label: 'Simplemente llegar al final del día', val: 'C' }
        ] 
      }
  ];

  const handleFinish = () => {
    setLoading(true);
    // Simulación de sincronización instantánea
    setTimeout(() => {
      setLoading(false);
      setStep(4);
      setTimeout(() => navigate('/dashboard'), 2000);
    }, 1000);
  };

  const variants = {
    enter: { opacity: 0, x: 50, filter: 'blur(10px)' },
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -50, filter: 'blur(10px)' }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 overflow-hidden relative font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#8b5cf610_0%,_transparent_50%)]" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            variants={variants} initial="enter" animate="center" exit="exit"
            className="w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-[4rem] p-16 text-center shadow-2xl relative z-10 backdrop-blur-3xl"
          >
            <div className="w-20 h-20 bg-violet-neon/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_#8b5cf630]">
               <User className="text-violet-neon" size={40} />
            </div>
            <h1 className="text-white font-black text-5xl tracking-tighter mb-6 leading-none italic uppercase">Tu Identidad Bio-Sync</h1>
            <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto italic font-light">¿Cómo deberíamos llamarte dentro del Santuario?</p>
            
            <input 
                type="text" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Escribe tu Nickname..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon transition-all text-center text-2xl mb-10"
            />

            <button 
              disabled={!nickname.trim()}
              onClick={() => setStep(2)}
              className="group bg-white text-black px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-4 mx-auto disabled:opacity-20 disabled:grayscale"
            >
              Continuar
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            variants={variants} initial="enter" animate="center" exit="exit"
            className="w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-[4rem] p-16 relative z-10 backdrop-blur-3xl"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="text-violet-neon font-black text-xs uppercase tracking-[0.5em]">Diagnóstico de Arquetipo</span>
               <span className="text-white/20 font-black text-xs">PASO 1/2</span>
            </div>
            
            <h2 className="text-white font-black text-4xl tracking-tighter mb-12 max-w-2xl italic leading-tight">"{questions[0].text}"</h2>
            
            <div className="grid gap-4">
               {questions[0].options.map((opt) => (
                 <button 
                   key={opt.label}
                   onClick={() => {
                     setAnswers({ ...answers, [questions[0].id]: opt.val });
                     setStep(3);
                   }}
                   className="group relative bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] text-left hover:bg-violet-neon transition-all hover:scale-[1.01] overflow-hidden"
                 >
                    <span className="relative z-10 text-white font-bold text-xl tracking-tight">{opt.label}</span>
                 </button>
               ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            variants={variants} initial="enter" animate="center" exit="exit"
            className="w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-[4rem] p-16 relative z-10 backdrop-blur-3xl"
          >
            <div className="flex justify-between items-center mb-12">
               <span className="text-violet-neon font-black text-xs uppercase tracking-[0.5em]">Diagnóstico de Arquetipo</span>
               <span className="text-white/20 font-black text-xs">PASO 2/2</span>
            </div>
            
            <h2 className="text-white font-black text-4xl tracking-tighter mb-12 max-w-2xl italic leading-tight">"{questions[1].text}"</h2>
            
            <div className="grid gap-4">
               {questions[1].options.map((opt) => (
                 <button 
                   key={opt.label}
                   onClick={() => {
                     setAnswers({ ...answers, [questions[1].id]: opt.val });
                     handleFinish();
                   }}
                   className="group relative bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] text-left hover:bg-violet-neon transition-all hover:scale-[1.01] overflow-hidden"
                 >
                    <span className="relative z-10 text-white font-bold text-xl tracking-tight">{opt.label}</span>
                 </button>
               ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            variants={variants} initial="enter" animate="center" exit="exit"
            className="w-full max-w-2xl text-center"
          >
            <div className="relative mb-12">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="relative z-10"
               >
                  <Loader2 className="text-violet-neon mx-auto" size={100} strokeWidth={1} />
               </motion.div>
               <div className="absolute inset-0 blur-3xl bg-violet-neon/30 animate-pulse scale-75" />
            </div>
            <h2 className="text-white font-black text-3xl uppercase tracking-[0.4em] mb-4 italic">Sincronizando Perfil</h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Bienvenido al Santuario, {nickname}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;
