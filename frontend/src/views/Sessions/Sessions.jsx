import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, Sparkles, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sessions = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);

  const history = [
    { 
        created_at: new Date().toISOString(), 
        advice: "Tu estado de determinación calmada es óptimo para el trabajo profundo." 
    },
    { 
        created_at: new Date(Date.now() - 86400000).toISOString(), 
        advice: "La coherencia cardíaca muestra una mejora del 15% respecto a ayer." 
    }
  ];

  const sessions = [
    {
      type: 'Voz',
      path: '/session/voice',
      icon: Mic,
      title: 'Sesión de Voz',
      description: 'Análisis emocional en tiempo real mediante patrones vocales y microtonos de frecuencia.',
      accentColor: '#8b5cf6',
      buttonLabel: 'Iniciar Vínculo',
    },
    {
      type: 'Video',
      path: '/session/video',
      icon: Video,
      title: 'Video Análisis',
      description: 'Seguimiento de micro-expresiones faciales y lenguaje corporal mediante visión por IA.',
      accentColor: '#06b6d4',
      buttonLabel: 'Activar Cámara',
    },
  ];

  return (
    <div className="space-y-10 pb-24">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col lg:flex-row justify-between items-center
                   bg-white/[0.02] border border-white/5 rounded-[3.5rem] px-14 py-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,_rgba(139,92,246,0.06)_0%,_transparent_50%)]" />
        <div className="relative z-10 space-y-3 text-center lg:text-left">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Sesiones IA</h1>
          <p className="text-gray-500 max-w-lg font-medium leading-relaxed italic">
            Tu espacio seguro de consulta y análisis emocional en tiempo real.
          </p>
        </div>
      </motion.header>

      {/* BENTO SESSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sessions.map((session, idx) => (
          <motion.div
            key={idx}
            className="group relative glass-card border-white/5 rounded-[3.5rem] overflow-hidden flex flex-col bg-white/[0.01]"
          >
            <div className="p-12 flex flex-col gap-8 flex-1 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ backgroundColor: `${session.accentColor}15` }}>
                  <session.icon size={36} style={{ color: session.accentColor }} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">{session.title}</h2>
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">{session.description}</p>
              <button
                onClick={() => navigate(session.path)}
                className="mt-auto w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all"
                style={{ background: `${session.accentColor}20`, border: `1px solid ${session.accentColor}40`, color: session.accentColor }}
              >
                <Zap size={18} />
                {session.buttonLabel}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* HISTORY */}
      <motion.div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-6">
        <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Historial Reciente</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 rounded-2xl px-6 py-5 border border-white/5">
              <div>
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{new Date(s.created_at).toLocaleDateString()}</p>
                <p className="text-sm font-black text-white uppercase italic mt-1">Sesión Bio-Sync</p>
                <p className="text-[10px] text-violet-neon italic mt-2">"{s.advice.substring(0, 60)}..."</p>
              </div>
              <CheckCircle2 size={20} className="text-green-500 opacity-30" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Sessions;
