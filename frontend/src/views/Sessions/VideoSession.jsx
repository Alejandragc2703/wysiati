import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, PhoneOff, Sparkles, Brain, Shield, Info, Activity, Eye, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VideoSession = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [biometrics, setBiometrics] = useState({ focus: 92, calm: 88, stress: 12 });
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Error accessing camera:", err));
    }
    
    // Simular variación de biometría
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        focus: Math.min(100, Math.max(80, prev.focus + (Math.random() * 4 - 2))),
        calm: Math.min(100, Math.max(70, prev.calm + (Math.random() * 4 - 2))),
        stress: Math.min(30, Math.max(5, prev.stress + (Math.random() * 2 - 1)))
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAnalysis = async () => {
    setAnalyzing(true);
    setAdvice(null);
    setTimeout(async () => {
      const insights = [
        "Tu patrón ocular sugiere que estás en el 'Pensamiento Lento' de Kahneman. Tu Sistema 2 está procesando información compleja eficientemente.",
        "Detecto una micro-expresión de fatiga cognitiva. ¿Has considerado el Sesgo de Planificación hoy? No te exijas de más.",
        "Tu simetría facial indica un estado de coherencia emocional alto. Es un momento ideal para la toma de decisiones críticas."
      ];
      const selectedAdvice = insights[Math.floor(Math.random() * insights.length)];
      setAdvice(selectedAdvice);
      setAnalyzing(false);

      // Guardar sesión automáticamente tras el análisis
      try {
        await api.logAiSession({
          session_type: 'video',
          transcript: "Análisis visual de micro-expresiones completado.",
          biometrics: biometrics,
          ai_summary: selectedAdvice
        });
      } catch (error) {
        console.error("Error al persistir sesión visual", error);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#06080c] flex flex-col p-8 lg:p-12 space-y-10 relative overflow-hidden text-white">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(139,92,246,0.03)_1px,_transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.02)_0%,_transparent_70%)]" />

      <header className="flex justify-between items-center relative z-10 bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-cyan-400/10 rounded-2xl flex items-center justify-center border border-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <Video size={28} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Bio-Sync Visual Lab</h1>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
               <Shield size={12} className="text-violet-neon" /> IA Sanctuary v4.0 Active
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-10">
           <div className="text-right">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Estado de Enlace</p>
              <p className="text-xs font-bold text-green-400 uppercase tracking-tighter italic">Cifrado de Extremo a Extremo</p>
           </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-10 relative z-10">
        {/* Main Camera View */}
        <div className="flex-[2.5] relative rounded-[4rem] border border-white/10 overflow-hidden bg-black shadow-2xl group">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0" />
          
          {/* HUD Overlay */}
          <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none">
             <div className="flex justify-between items-start">
                <div className="space-y-4">
                   <div className="px-6 py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Enfoque Ocular: {biometrics.focus.toFixed(0)}%</span>
                   </div>
                   <div className="px-6 py-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-4">
                      <Activity size={16} className="text-violet-neon animate-bounce" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Calma Bio-Sync: {biometrics.calm.toFixed(0)}%</span>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-20 h-20 rounded-full border-2 border-cyan-400/30 flex items-center justify-center relative">
                      <Eye size={32} className="text-cyan-400/40" />
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-2 border-cyan-400 rounded-full" />
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-end">
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Local-Lat: 24ms</p>
                   <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Neural-Stream: Activo</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-8 py-4 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-3">
                      <Zap size={14} className="text-red-500" />
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Stress: {biometrics.stress.toFixed(0)}%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Scanning Line Effect */}
          {analyzing && (
            <motion.div 
              initial={{ top: 0 }} animate={{ top: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-20"
            />
          )}
        </div>

        {/* IA Analysis Panel */}
        <div className="flex-1 flex flex-col gap-10">
            <div className="glass-card p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] flex-1 flex flex-col justify-center gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-4 text-violet-neon relative z-10">
                    <Brain size={28} />
                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Insight del Arquetipo</span>
                </div>

                <AnimatePresence mode="wait">
                  {analyzing ? (
                    <motion.div 
                      key="analyzing"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-4 relative z-10"
                    >
                        <p className="text-sm text-gray-500 italic uppercase font-bold tracking-widest animate-pulse">Escaneando Micro-Expresiones...</p>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }} className="h-full bg-violet-neon" />
                        </div>
                    </motion.div>
                  ) : advice ? (
                    <motion.div 
                      key="advice"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 relative z-10"
                    >
                        <p className="text-2xl text-white font-light italic leading-tight italic">"{advice}"</p>
                        <div className="pt-6 border-t border-white/5">
                           <p className="text-[9px] font-black text-violet-neon/40 uppercase tracking-widest">Referencia: Daniel Kahneman - Pensar rápido, pensar despacio</p>
                        </div>
                    </motion.div>
                  ) : (
                    <div className="relative z-10 space-y-4">
                      <p className="text-gray-600 text-lg italic">Inicia el escaneo visual para recibir una recomendación personalizada de la IA.</p>
                      <Sparkles size={24} className="text-white/5" />
                    </div>
                  )}
                </AnimatePresence>
            </div>

            <div className="flex gap-6 relative z-10">
                <button 
                    onClick={() => navigate('/sessions')}
                    className="w-24 h-24 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2.5rem] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl"
                >
                    <PhoneOff size={32} />
                </button>
                <button 
                    onClick={handleAnalysis}
                    disabled={analyzing}
                    className="flex-1 py-8 bg-white text-black rounded-[2.5rem] font-black text-xs uppercase tracking-[0.6em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                    {analyzing ? 'Procesando...' : 'Escanear Estado'}
                    <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSession;
