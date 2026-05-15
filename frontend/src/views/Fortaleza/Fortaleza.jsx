import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sparkles, CheckCircle, Calendar, TrendingUp, Award, Shield } from 'lucide-react';

// ─── Datos ────────────────────────────────────────────────────────────────────

const FRASES = [
  'La constancia es tu mayor superpoder.',
  'Hoy has elegido tu paz.',
  'Cada día que cumples, te vuelves más tú.',
  'El camino se hace al andar, un día a la vez.',
  'Tu voluntad es más fuerte de lo que crees.',
  'Hoy también has ganado.',
  'El progreso silencioso sigue siendo progreso.',
  'La claridad llega cuando actúas con intención.',
];

const MEDALLAS = [
  { days: 3,  nombre: 'Semilla de Intención', descripcion: 'Los primeros pasos son los más valientes.', color: '#86efac', glow: '#86efac60', shape: 'circle'  },
  { days: 7,  nombre: 'Brote de Voluntad',    descripcion: 'Una semana entera eligiendo crecer.',      color: '#6ee7b7', glow: '#6ee7b760', shape: 'leaf'    },
  { days: 15, nombre: 'Piedra de Río',         descripcion: 'La perseverancia te pule como el agua.',   color: '#93c5fd', glow: '#93c5fd60', shape: 'oval'    },
  { days: 30, nombre: 'Cristal de Claridad',   descripcion: 'Un mes de días ganados. Eres tu propio faro.', color: '#c4b5fd', glow: '#c4b5fd60', shape: 'diamond' },
  { days: 60, nombre: 'Luz de Voluntad',       descripcion: 'Sesenta días de intención pura.',          color: '#fde68a', glow: '#fde68a60', shape: 'star'    },
  { days: 90, nombre: 'Raíz Profunda',         descripcion: 'Tres meses. Ya eres quien querías ser.',   color: '#f9a8d4', glow: '#f9a8d460', shape: 'root'    },
];

const CONFETTI_COLORS = ['#86efac', '#93c5fd', '#fde68a', '#f9a8d4', '#c4b5fd', '#6ee7b7'];

// ─── SVG Gemas ───────────────────────────────────────────────────────────────

const GemSVG = ({ shape, color, glow, reached, size = 56 }) => {
  const opacity = reached ? 1 : 0.15;
  const shadow  = reached ? `drop-shadow(0 0 10px ${glow})` : 'none';

  const paths = {
    circle:  <circle cx="24" cy="24" r="15" />,
    leaf:    <ellipse cx="24" cy="24" rx="10" ry="17" transform="rotate(-30 24 24)" />,
    oval:    <ellipse cx="24" cy="24" rx="16" ry="11" />,
    diamond: <polygon points="24,6 40,24 24,42 8,24" />,
    star:    <polygon points="24,4 28,18 42,18 31,26 35,40 24,32 13,40 17,26 6,18 20,18" />,
    root:    <path d="M24 8 C18 14 10 18 10 26 C10 34 16 40 24 40 C32 40 38 34 38 26 C38 18 30 14 24 8Z" />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ opacity, filter: shadow }}>
      <defs>
        <linearGradient id={`g-${shape}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <g fill={`url(#g-${shape})`} stroke={color} strokeWidth="1">
        {paths[shape] || paths.circle}
      </g>
    </svg>
  );
};

// ─── Confeti ─────────────────────────────────────────────────────────────────

const ConfettiParticle = ({ x, color, delay, angle }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full pointer-events-none z-40"
    style={{ left: `${x}%`, top: '50%', backgroundColor: color }}
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{ opacity: 0, y: -150, x: Math.cos(angle) * 60, scale: 0.3, rotate: 360 }}
    transition={{ duration: 1.4, delay, ease: 'easeOut' }}
  />
);

const Confetti = ({ show }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 36 }, (_, i) => ({
        x: 15 + Math.random() * 70,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.4,
        angle: (Math.PI * 2 * i) / 36,
      })).map((p, i) => <ConfettiParticle key={i} {...p} />)}
    </div>
  );
};

// ─── Componente Principal ────────────────────────────────────────────────────

const Fortaleza = () => {
  const TODAY    = new Date().toDateString();
  const [days,         setDays]         = useState(() => parseInt(localStorage.getItem('fortaleza_days') || '0'));
  const [checkedToday, setCheckedToday] = useState(() => localStorage.getItem('fortaleza_last') === TODAY);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse,    setShowPulse]    = useState(false);
  const [newMedalla,   setNewMedalla]   = useState(null);

  const frase = useMemo(() => FRASES[new Date().getDay() % FRASES.length], []);

  // Historial semanal simulado (últimos 14 días)
  const historial = useMemo(() => {
    const arr = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      arr.push({ date: d, completed: i < days && Math.random() > 0.15 });
    }
    return arr;
  }, [days]);

  const handleCheckin = useCallback(() => {
    if (checkedToday) return;
    const next = days + 1;
    localStorage.setItem('fortaleza_days', String(next));
    localStorage.setItem('fortaleza_last', TODAY);
    setDays(next);
    setCheckedToday(true);
    setShowConfetti(true);
    setShowPulse(true);

    const m = MEDALLAS.find(x => x.days === next);
    if (m) setNewMedalla(m);

    setTimeout(() => setShowConfetti(false), 1800);
    setTimeout(() => setShowPulse(false), 900);
    setTimeout(() => setNewMedalla(null), 4500);
  }, [checkedToday, days, TODAY]);

  // Variantes de animación
  const containerV = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const itemV = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
  };
  const medalV = {
    hidden:  { opacity: 0, scale: 0.6 },
    visible: (i) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.12, duration: 0.5, type: 'spring', stiffness: 200 } }),
  };

  const proxima = MEDALLAS.find(m => m.days > days);

  return (
    <motion.div
      className="space-y-8 pb-32 max-w-[1600px] mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerV}
    >
      {/* ── HEADER PANORÁMICO ────────────────────────────────── */}
      <motion.header variants={itemV}
        className="relative bg-[#0b0e14] px-14 py-14 rounded-[4rem] border border-white/5
                   overflow-hidden shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,_rgba(134,239,172,0.06)_0%,_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_110%,_rgba(147,197,253,0.04)_0%,_transparent_50%)]" />

        <div className="relative z-10 space-y-4 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-green-400/50 mb-1">
            <Leaf size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.6em]">Tu camino personal</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter italic leading-none uppercase">
            Tu Camino de<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
              Fortaleza
            </span>
          </h1>
          <p className="text-gray-500 max-w-lg font-medium leading-relaxed">
            Cada día que eliges avanzar, te conviertes un poco más en quien quieres ser. No hay prisa. Solo intención.
          </p>
        </div>

        {/* Contador grande */}
        <div className="relative z-10 flex items-center gap-8">
          <div className="text-center px-12 py-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
            <p className="text-8xl font-black text-white italic leading-none">{days}</p>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] mt-2">Días Ganados</p>
          </div>
          {proxima && (
            <div className="text-center space-y-2">
              <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Próxima meta</p>
              <GemSVG shape={proxima.shape} color={proxima.color} glow={proxima.glow} reached size={52} />
              <p className="text-[9px] font-black text-gray-500 uppercase">{proxima.nombre}</p>
              <p className="text-xs font-black text-green-400">{proxima.days - days}d restantes</p>
            </div>
          )}
        </div>
      </motion.header>

      {/* ── BENTO GRID PRINCIPAL ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── IZQUIERDA: Ritual + Historial ── */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Ritual Diario */}
          <motion.div variants={itemV}
            className="relative bg-white/[0.02] border border-white/5 backdrop-blur-md
                       rounded-[3.5rem] p-12 overflow-hidden shadow-xl"
          >
            {/* Pulso de pantalla */}
            <AnimatePresence>
              {showPulse && (
                <motion.div className="absolute inset-0 rounded-[3.5rem] pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 0.8 }}
                  style={{ background: 'radial-gradient(circle at 50% 50%, #86efac, transparent)' }}
                />
              )}
            </AnimatePresence>
            <Confetti show={showConfetti} />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
              {/* Texto y frase */}
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-green-400/50">
                  <Sparkles size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.5em]">Ritual Diario</span>
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">
                  El Momento del Día
                </h2>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4">
                  <p className="text-sm text-gray-400 font-medium italic leading-relaxed">
                    "{frase}"
                  </p>
                </div>
              </div>

              {/* Botón Check-in */}
              <motion.button
                onClick={handleCheckin}
                disabled={checkedToday}
                whileHover={!checkedToday ? { scale: 1.04 } : {}}
                whileTap={!checkedToday ? { scale: 0.96 } : {}}
                className="shrink-0 w-64 h-64 rounded-[3rem] flex flex-col items-center justify-center
                           gap-4 font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500
                           border relative overflow-hidden"
                style={{
                  background: checkedToday
                    ? 'rgba(255,255,255,0.02)'
                    : 'linear-gradient(135deg, rgba(134,239,172,0.12), rgba(147,197,253,0.08))',
                  borderColor: checkedToday ? 'rgba(255,255,255,0.05)' : 'rgba(134,239,172,0.25)',
                  color: checkedToday ? '#374151' : '#86efac',
                  boxShadow: checkedToday ? 'none' : '0 0 50px rgba(134,239,172,0.06)',
                  cursor: checkedToday ? 'not-allowed' : 'pointer',
                }}
              >
                {checkedToday ? (
                  <>
                    <CheckCircle size={48} className="opacity-30" />
                    <span className="text-center leading-snug">Día<br />Registrado</span>
                    <span className="text-[8px] text-gray-700 normal-case font-bold tracking-wide">Vuelve mañana</span>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full border-2 border-green-400/30 flex items-center justify-center">
                      <Leaf size={32} className="text-green-400" />
                    </div>
                    <span className="text-center leading-snug px-4">He mantenido<br />mi compromiso<br />hoy</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Historial de Rachas (últimas 2 semanas) */}
          <motion.div variants={itemV}
            className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-[3.5rem] p-10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-blue-300/60" />
                <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Historial de Rachas</h3>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-green-400/60" />
                <span className="text-[9px] font-black text-green-400/60 uppercase tracking-widest">Últimas 2 semanas</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {['L','M','X','J','V','S','D'].map(d => (
                <p key={d} className="text-center text-[9px] font-black text-violet-neon/40 uppercase tracking-widest mb-2">{d}</p>
              ))}
              {historial.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.03 }}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1
                             border transition-all hover:scale-110 cursor-default relative group"
                  style={{
                    background: h.completed ? 'rgba(134,239,172,0.12)' : 'rgba(255,255,255,0.02)',
                    borderColor: h.completed ? 'rgba(134,239,172,0.3)' : 'rgba(255,255,255,0.04)',
                    boxShadow: h.completed ? '0 0 12px rgba(134,239,172,0.1)' : 'none',
                  }}
                >
                  {h.completed
                    ? <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#86efac]" />
                    : <div className="w-2 h-2 rounded-full bg-white/10" />
                  }
                  <span className="text-[7px] font-black text-gray-700">
                    {h.date.getDate()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── DERECHA: Panel de Medallas ── */}
        <div className="lg:col-span-4 flex flex-col gap-8">

          <motion.div variants={itemV}
            className="bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-[3.5rem] p-10 shadow-xl flex-1"
          >
            <div className="flex items-center gap-3 mb-8">
              <Award size={18} className="text-violet-300/60" />
              <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em]">Logros Alcanzados</h3>
            </div>

            <motion.div className="space-y-5" initial="hidden" animate="visible" variants={containerV}>
              {MEDALLAS.map((m, i) => {
                const reached = days >= m.days;
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={medalV}
                    className="flex items-center gap-5 p-5 rounded-3xl border transition-all duration-700"
                    style={{
                      background: reached ? `${m.glow}18` : 'rgba(255,255,255,0.01)',
                      borderColor: reached ? `${m.color}30` : 'rgba(255,255,255,0.04)',
                      boxShadow: reached ? `0 0 20px ${m.glow}` : 'none',
                    }}
                  >
                    <GemSVG shape={m.shape} color={m.color} glow={m.glow} reached={reached} size={44} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 truncate
                                    ${reached ? 'text-white' : 'text-gray-700'}`}>
                        {m.nombre}
                      </p>
                      <p className="text-[8px] font-bold text-gray-700 leading-tight">{m.descripcion}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest shrink-0
                                    ${reached ? 'text-green-400' : 'text-gray-800'}`}>
                      {reached ? '✓' : `${m.days}d`}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Mini stat */}
          <motion.div variants={itemV}
            className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 shadow-xl space-y-4"
          >
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-green-400/40" />
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Tu Claridad</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span className="text-gray-600">Voluntad</span>
                <span className="text-green-400">{Math.min(days * 3 + 40, 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(days * 3 + 40, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ background: 'linear-gradient(90deg, #86efac, #93c5fd)' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── NOTIFICACIÓN DE MEDALLA ─────────────────────────────── */}
      <AnimatePresence>
        {newMedalla && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-10 py-6
                       rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl"
            style={{
              background: 'rgba(8,10,16,0.95)',
              borderColor: `${newMedalla.color}40`,
              boxShadow: `0 0 50px ${newMedalla.glow}`,
            }}
          >
            <GemSVG shape={newMedalla.shape} color={newMedalla.color} glow={newMedalla.glow} reached size={52} />
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-600 mb-1">Logro Desbloqueado</p>
              <p className="text-lg font-black text-white italic">{newMedalla.nombre}</p>
              <p className="text-xs text-gray-500 mt-0.5">{newMedalla.descripcion}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Fortaleza;
