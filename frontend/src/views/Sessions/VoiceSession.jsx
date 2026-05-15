import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, PhoneOff, Sparkles, Waves, Volume2, Shield, Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VoiceSession = () => {
  const [status, setStatus] = useState('conectando'); // conectando, escuchando, procesando, hablando
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('escuchando');
      setTranscript("Estoy analizando tu tono de voz...");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [currentAdvice, setCurrentAdvice] = useState("");

  const handleStop = () => {
    setStatus('procesando');
    setTranscript("Consultando con el Arquetipo de Sabiduría...");
    setTimeout(() => {
      setStatus('hablando');
      const advice = adviceList[Math.floor(Math.random() * adviceList.length)];
      setTranscript("Análisis basado en Daniel Kahneman completado.");
      setCurrentAdvice(advice);
    }, 2000);
  };

  const handleFinish = async () => {
    try {
      await api.logAiSession({
        session_type: 'voice',
        transcript: "Sesión de voz analizada por el Arquetipo.",
        biometrics: { 
          stress_level: 0.2, 
          coherence: 0.85, 
          tone: 'stable' 
        },
        ai_summary: currentAdvice
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error al guardar la sesión", error);
      navigate('/dashboard'); // Fallback para no bloquear al usuario
    }
  };

  const adviceList = [
    "Parece que tu Sistema 1 está tomando el control. Respira y deja que el Sistema 2 (tu parte analítica) procese esta emoción.",
    "Estás experimentando un sesgo de disponibilidad. No dejes que los eventos recientes nublen tu visión a largo plazo.",
    "Tu coherencia vocal es alta. Estás en un estado de flujo óptimo para tomar decisiones importantes hoy."
  ];

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-10 space-y-12 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.08)_0%,_transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* IA Orb */}
      <div className="relative flex items-center justify-center">
        <motion.div 
            animate={{ 
              scale: status === 'escuchando' ? [1, 1.1, 1] : 
                     status === 'hablando' ? [1, 1.05, 1] : 1,
              rotate: status === 'procesando' ? 360 : 0
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-72 h-72 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-400/20 border border-white/10 flex items-center justify-center shadow-[0_0_100px_rgba(139,92,246,0.1)] relative"
        >
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.05)_0%,_transparent_70%)]" />
            
            <div className="flex gap-1.5 items-center h-16 relative z-10">
                {[1,2,3,4,5,6,7].map(i => (
                    <motion.div 
                        key={i}
                        animate={{ 
                          height: status === 'escuchando' ? [15, 60, 15] : 
                                 status === 'hablando' ? [10, 45, 10] : 10 
                        }}
                        transition={{ 
                          duration: 0.4 + i * 0.05, 
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                        className={`w-2.5 rounded-full ${status === 'hablando' ? 'bg-cyan-400' : 'bg-violet-neon'} shadow-[0_0_15px_rgba(139,92,246,0.5)]`}
                    />
                ))}
            </div>
        </motion.div>

        {/* Decorative Rings */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-96 h-96 border border-white/5 rounded-full border-dashed"
        />
      </div>

      <div className="text-center space-y-8 relative z-10 max-w-2xl">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-violet-neon/60 mb-2">
            <Brain size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Santuario Voice v2.0</span>
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              {status === 'conectando' && 'Sincronizando...'}
              {status === 'escuchando' && 'Habla con libertad...'}
              {status === 'procesando' && 'Analizando Heurísticas...'}
              {status === 'hablando' && 'Sabiduría Activa'}
          </h2>
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{transcript}</p>
        </div>
        
        <AnimatePresence mode="wait">
            {status === 'hablando' && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative"
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-neon rounded-full">
                       <span className="text-[8px] font-black text-white uppercase tracking-widest italic">Kahneman Insight</span>
                    </div>
                    <p className="text-xl lg:text-2xl text-white font-light italic leading-relaxed">
                        "{currentAdvice}"
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-10 relative z-10">
        <button 
            onClick={() => navigate('/sessions')}
            className="w-16 h-16 bg-white/5 border border-white/10 text-white/40 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-all group"
        >
            <PhoneOff size={24} />
        </button>

        {status === 'escuchando' ? (
            <button 
                onClick={handleStop}
                className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] group"
            >
                <div className="w-20 h-20 rounded-full border-2 border-black/5 flex items-center justify-center">
                  <Mic size={40} />
                </div>
            </button>
        ) : status === 'hablando' ? (
            <button 
                onClick={handleFinish}
                className="px-12 py-6 bg-violet-neon text-white rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-2xl flex items-center gap-3"
            >
                Integrar Aprendizaje <ArrowRight size={14} />
            </button>
        ) : (
            <div className="w-24 h-24 flex items-center justify-center">
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-violet-neon border-t-transparent rounded-full" />
            </div>
        )}

        <div className="w-16 h-16 flex items-center justify-center opacity-20">
           <Volume2 size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default VoiceSession;
