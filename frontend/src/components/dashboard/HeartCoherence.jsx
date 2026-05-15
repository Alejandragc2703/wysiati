import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Music, Image as ImageIcon, Timer, Play, Pause, SkipForward, RefreshCw, Volume2, Upload, X } from 'lucide-react';

// Tracks gratuitos de relajación (archivos públicos de freesound / wikimedia)
const TRACKS = [
  {
    title: 'Rain & Forest',
    subtitle: 'Naturaleza — Reconexión Bio',
    color: '#10b981',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Ocean Waves',
    subtitle: 'Mar — Calma Profunda',
    color: '#06b6d4',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Binaural Alpha',
    subtitle: 'Ondas Alpha — Enfoque Puro',
    color: '#8b5cf6',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

const HeartCoherence = () => {
  const [activeTab, setActiveTab] = useState('breath');

  // ── Music ──
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
    audio.src = TRACKS[currentTrack].url;
    setAudioError(false);
    if (isPlaying) {
      audio.play().catch(() => setAudioError(true));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.src = TRACKS[currentTrack].url;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => { setAudioError(true); setIsPlaying(false); });
    }
  };

  const changeTrack = (dir) => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setCurrentTrack(prev => (prev + dir + TRACKS.length) % TRACKS.length);
    setIsPlaying(false);
  };

  // ── Gallery ──
  const [galleryImages, setGalleryImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setGalleryImages(prev => [...prev, { src: ev.target.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
  };

  // ── Pomodoro ──
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomMode, setPomMode] = useState('focus'); // focus | break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (pomMode === 'focus') { setPomMode('break'); setTimeLeft(5 * 60); }
      else { setPomMode('focus'); setTimeLeft(25 * 60); }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const tabs = [
    { id: 'breath', icon: Wind, label: 'Respiración' },
    { id: 'music', icon: Music, label: 'Sonidos' },
    { id: 'gallery', icon: ImageIcon, label: 'Visión' },
    { id: 'pomodoro', icon: Timer, label: 'Foco' },
  ];

  return (
    <div className="glass-card p-10 flex flex-col lg:flex-row items-center gap-12 h-full relative overflow-hidden border-white/10 bg-white/[0.02] shadow-2xl min-h-[400px]">
      <audio ref={audioRef} />

      {/* Tab Selector */}
      <div className="absolute top-8 left-8 z-50 flex gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-3 rounded-xl transition-all border ${
              activeTab === tab.id
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'
            }`}
            title={tab.label}
          >
            <tab.icon size={16} />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── BREATHING ── */}
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
              <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute w-40 h-40 bg-cyan-400 blur-[80px] rounded-full" />
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative w-48 h-48 rounded-full border border-white/10 backdrop-blur-3xl flex items-center justify-center shadow-inner">
                <motion.div animate={{ scale: [0.7, 1.1, 0.7] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="w-24 h-24 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 rounded-full border border-white/30 shadow-2xl" />
              </motion.div>
              <div className="absolute bottom-0 text-[9px] font-black text-cyan-400/40 uppercase tracking-[0.5em] animate-pulse">Inhala ... Exhala</div>
            </div>
          </motion.div>
        )}

        {/* ── MUSIC ── */}
        {activeTab === 'music' && (
          <motion.div
            key="music" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12 w-full pt-12"
          >
            <div className="relative z-10 lg:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: TRACKS[currentTrack].color }} />
                <span className="text-[10px] uppercase font-black tracking-[0.4em]" style={{ color: TRACKS[currentTrack].color }}>Sonidos de Paz</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">{TRACKS[currentTrack].title}</h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs">{TRACKS[currentTrack].subtitle}</p>
              {audioError && (
                <p className="text-[9px] text-red-400/60 uppercase tracking-widest">No se pudo cargar el audio. Comprueba la conexión.</p>
              )}
            </div>

            <div className="relative flex-1 flex flex-col items-center justify-center gap-8">
              {/* Disc */}
              <div className="w-56 h-56 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-center relative shadow-2xl">
                <Music size={64} className={`${isPlaying ? 'text-violet-neon' : 'text-white/10'} transition-all duration-500`} />
                {isPlaying && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-6 border border-dashed border-violet-neon/20 rounded-full"
                  />
                )}
                {/* Waveform bars */}
                {isPlaying && (
                  <div className="absolute bottom-6 flex items-end gap-1">
                    {[...Array(7)].map((_, i) => (
                      <motion.div key={i}
                        animate={{ height: ['8px', `${12 + Math.random() * 16}px`, '8px'] }}
                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 bg-violet-neon/60 rounded-full"
                        style={{ height: '8px' }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-10">
                <button onClick={() => changeTrack(-1)} className="text-white/20 hover:text-white transition-colors">
                  <SkipForward size={24} className="rotate-180" />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 hover:bg-violet-neon hover:text-white transition-all shadow-2xl"
                >
                  {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
                </button>
                <button onClick={() => changeTrack(1)} className="text-white/20 hover:text-white transition-colors">
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3 w-48">
                <Volume2 size={14} className="text-white/30" />
                <input
                  type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="flex-1 accent-violet-500 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── GALLERY / VISION BOARD ── */}
        {activeTab === 'gallery' && (
          <motion.div
            key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col w-full gap-6 pt-12"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-yellow-400">Vision Board</span>
                <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Tu Visión</h2>
                <p className="text-gray-600 text-xs">Sube imágenes que representen tus metas — visualízalas cada día.</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-white hover:border-white/30 transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <Upload size={16} /> Subir Imagen
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageUpload}
              />
            </div>

            {galleryImages.length === 0 ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/10 rounded-[2.5rem] h-48 text-gray-700 hover:border-white/20 hover:text-gray-500 transition-all"
              >
                <ImageIcon size={36} />
                <span className="text-[10px] uppercase font-black tracking-widest">Haz clic para subir tu primera imagen</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-1">
                {galleryImages.map((img, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden aspect-video bg-black border border-white/5">
                    <img src={img.src} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-gray-700 hover:border-white/20 hover:text-gray-500 transition-all"
                >
                  <Upload size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── POMODORO ── */}
        {activeTab === 'pomodoro' && (
          <motion.div
            key="pomodoro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row items-center gap-12 w-full pt-12"
          >
            <div className="relative z-10 lg:w-1/3 space-y-4">
              <span className={`text-[10px] uppercase font-black tracking-[0.4em] ${pomMode === 'focus' ? 'text-violet-400' : 'text-green-400'}`}>
                {pomMode === 'focus' ? 'Bloque de Enfoque' : 'Descanso Activo'}
              </span>
              <h2 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">
                {pomMode === 'focus' ? 'Foco Profundo' : 'Recarga Mental'}
              </h2>
              <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-xs italic">
                {pomMode === 'focus'
                  ? 'Bloques de 25 minutos para máxima eficiencia neuronal.'
                  : '5 minutos para recuperar energía cognitiva.'}
              </p>
            </div>
            <div className="relative flex-1 flex flex-col items-center justify-center gap-8">
              <div className="relative">
                <svg className="w-48 h-48 -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/5" />
                  <circle cx="96" cy="96" r="88"
                    stroke={pomMode === 'focus' ? '#8b5cf6' : '#10b981'}
                    strokeWidth="4" fill="none" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - timeLeft / (pomMode === 'focus' ? 25 * 60 : 5 * 60))}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${
                    isActive ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-white text-black hover:bg-violet-neon hover:text-white'
                  }`}
                >
                  {isActive ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                  onClick={() => { setIsActive(false); setPomMode('focus'); setTimeLeft(25 * 60); }}
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
