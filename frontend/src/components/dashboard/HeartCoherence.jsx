import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Music, Image as ImageIcon, Timer, Settings2, Play, Pause, SkipForward, RefreshCw, Volume2 } from 'lucide-react';

const HeartCoherence = () => {
  const [activeTab, setActiveTab] = useState('breath'); // breath, music, gallery, pomodoro
  const [showSettings, setShowSettings] = useState(false);

  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const tracks = [
    { title: 'Alpha Waves', subtitle: 'Concentración Profunda', color: '#8b5cf6' },
    { title: 'Stoic Calm', subtitle: 'Serenidad Mental', color: '#06b6d4' },
    { title: 'Nature Pulse', subtitle: 'Reconexión Bio', color: '#10b981' },
  ];

  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'breath', icon: Wind, label: 'Respiración' },
    { id: 'music', icon: Music, label: 'Sonidos' },
    { id: 'gallery', icon: ImageIcon, label: 'Vision' },
    { id: 'pomodoro', icon: Timer, label: 'Foco' },
  ];

  return (
    <div className="glass-card p-10 flex flex-col lg:flex-row items-center gap-12 h-full relative overflow-hidden group border-white/10 bg-white/[0.02] shadow-2xl min-h-[400px]">
      
      {/* Selector de Tabs (Bento Style) */}
      <div className="absolute top-8 left-8 z-50 flex gap-2">
          {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl transition-all border ${
                  activeTab === tab.id ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'
                }`}
              >
                <tab.icon size={16} />
              </button>
          ))}
      </div>



      <AnimatePresence mode="wait">
        {/* ── BREATHING MODE ── */}
        {activeTab === 'breath' && (
          <motion.div 
            key="breath" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col lg:flex-row items-center gap-12 w-full pt-12"
          >
            <div className="relative z-10 lg:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                 <span className="text-[10px] uppercase font-black tracking-[0.4em] text-cyan-400">Coherencia Cardíaca</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">Respiración <br /> Consciente</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs italic">Sincroniza tu ritmo con el pulso lumínico para bajar el cortisol.</p>
            </div>
            <div className="relative flex-1 flex items-center justify-center min-h-[250px]">
              <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute w-40 h-40 bg-cyan-400 blur-[80px] rounded-full" />
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative w-48 h-48 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center shadow-inner">
                <motion.div animate={{ scale: [0.7, 1.1, 0.7] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-24 h-24 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 rounded-full border border-white/30 shadow-2xl" />
              </motion.div>
              <div className="absolute bottom-0 text-[9px] font-black text-cyan-400/40 uppercase tracking-[0.5em] animate-pulse">Inhala ... Exhala</div>
            </div>
          </motion.div>
        )}

        {/* ── MUSIC MODE (LO-FI PLAYER REAL) ── */}
        {activeTab === 'music' && (
          <motion.div 
            key="music" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12 w-full pt-12"
          >
            <div className="relative z-10 lg:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-violet-400" />
                 <span className="text-[10px] uppercase font-black tracking-[0.4em] text-violet-400">Sonidos de Paz</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">{tracks[currentTrack].title}</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs">{tracks[currentTrack].subtitle}</p>
            </div>
            <div className="relative flex-1 flex flex-col items-center justify-center gap-8">
              <div className="w-56 h-56 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center relative shadow-2xl group/music">
                <Music size={64} className={`${isPlaying ? 'text-violet-neon animate-bounce' : 'text-white/10'} transition-all`} />
                {isPlaying && <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} className="absolute inset-6 border border-dashed border-violet-neon/20 rounded-full" />}
              </div>
              
              <div className="flex items-center gap-10">
                <button 
                    onClick={() => setCurrentTrack((prev) => (prev === 0 ? tracks.length - 1 : prev - 1))}
                    className="text-white/20 hover:text-white transition-colors"
                >
                    <SkipForward size={24} className="rotate-180" />
                </button>
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 hover:bg-violet-neon hover:text-white transition-all shadow-2xl"
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
                </button>
                <button 
                    onClick={() => setCurrentTrack((prev) => (prev === tracks.length - 1 ? 0 : prev + 1))}
                    className="text-white/20 hover:text-white transition-colors"
                >
                    <SkipForward size={24} />
                </button>
              </div>
              
              <div className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
                  <Volume2 size={14} className="text-white" />
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-1/2 h-full bg-white" />
                  </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── POMODORO MODE ── */}
        {activeTab === 'pomodoro' && (
          <motion.div 
            key="pomodoro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12 w-full pt-12"
          >
            <div className="relative z-10 lg:w-1/3 space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">Foco <br /> Profundo</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs italic">Bloques de 25 minutos para máxima eficiencia neuronal.</p>
            </div>
            <div className="relative flex-1 flex flex-col items-center justify-center gap-8">
              <div className="text-8xl font-black text-white tracking-tighter italic tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {formatTime(timeLeft)}
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${
                    isActive ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-white text-black'
                  }`}
                >
                  {isActive ? 'Pausar' : 'Iniciar Foco'}
                </button>
                <button 
                  onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }}
                  className="p-4 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeartCoherence;
