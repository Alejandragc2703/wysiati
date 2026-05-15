import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock, Sparkles, Leaf } from 'lucide-react';

// ── Frases reconfortantes (rotan por día) ──────────────────────────────────
const FRASES = [
  'La constancia es tu mayor superpoder.',
  'Hoy has elegido tu paz.',
  'Cada día que cumples, te vuelves más tú.',
  'El camino se hace al andar, un día a la vez.',
  'Tu voluntad es más fuerte de lo que crees.',
  'Hoy también has ganado.',
  'El progreso silencioso sigue siendo progreso.',
];

// ── Hitos de gemas orgánicas ──────────────────────────────────────────────
const HITOS = [
  {
    days: 3,
    nombre: 'Semilla de Intención',
    color: '#86efac',  // verde suave
    glow: 'rgba(134,239,172,0.5)',
    shape: 'circle',
  },
  {
    days: 7,
    nombre: 'Brote de Voluntad',
    color: '#6ee7b7',  // esmeralda
    glow: 'rgba(110,231,183,0.5)',
    shape: 'leaf',
  },
  {
    days: 15,
    nombre: 'Piedra de Río',
    color: '#93c5fd',  // azul suave
    glow: 'rgba(147,197,253,0.5)',
    shape: 'oval',
  },
  {
    days: 30,
    nombre: 'Cristal de Claridad',
    color: '#c4b5fd',  // violeta suave
    glow: 'rgba(196,181,253,0.6)',
    shape: 'diamond',
  },
];

// ── Confeti minimalista con framer-motion ─────────────────────────────────
const CONFETTI_COLORS = ['#86efac', '#93c5fd', '#fde68a', '#f9a8d4', '#c4b5fd'];

const ConfettiParticle = ({ x, color, delay }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full pointer-events-none"
    style={{ left: `${x}%`, top: '40%', backgroundColor: color }}
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{ opacity: 0, y: -120, scale: 0.4, x: (Math.random() - 0.5) * 80 }}
    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
  />
);

const Confetti = ({ show }) => {
  if (!show) return null;
  const particles = Array.from({ length: 28 }, (_, i) => ({
    x: 20 + Math.random() * 60,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.3,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {particles.map((p, i) => <ConfettiParticle key={i} {...p} />)}
    </div>
  );
};

// ── Gem SVG por forma ─────────────────────────────────────────────────────
const GemIcon = ({ shape, color, glow, reached, size = 44 }) => {
  const opacity = reached ? 1 : 0.18;
  const filter = reached ? `drop-shadow(0 0 8px ${glow})` : 'none';

  const shapes = {
    circle: <circle cx="24" cy="24" r="14" />,
    leaf: <ellipse cx="24" cy="24" rx="10" ry="16" transform="rotate(-30 24 24)" />,
    oval: <ellipse cx="24" cy="24" rx="14" ry="10" />,
    diamond: <polygon points="24,8 38,24 24,40 10,24" />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ opacity, filter }}>
      <defs>
        <linearGradient id={`grad-${shape}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <g fill={`url(#grad-${shape})`} stroke={color} strokeWidth="1.5">
        {shapes[shape]}
      </g>
    </svg>
  );
};

// ── Componente principal ──────────────────────────────────────────────────
const FortalezaTracker = ({ userName = 'Felix' }) => {
  const TODAY = new Date().toDateString();
  const STORAGE_DAYS    = 'fortaleza_days';
  const STORAGE_LAST    = 'fortaleza_last_checkin';

  const [days, setDays]         = useState(() => parseInt(localStorage.getItem(STORAGE_DAYS) || '0'));
  const [checkedToday, setCheckedToday] = useState(() => localStorage.getItem(STORAGE_LAST) === TODAY);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPulse, setShowPulse]       = useState(false);
  const [newHito, setNewHito]           = useState(null);

  const fraseDelDia = FRASES[new Date().getDay() % FRASES.length];

  const handleCheckin = useCallback(() => {
    if (checkedToday) return;

    const next = days + 1;
    localStorage.setItem(STORAGE_DAYS, next);
    localStorage.setItem(STORAGE_LAST, TODAY);
    setDays(next);
    setCheckedToday(true);
    setShowConfetti(true);
    setShowPulse(true);

    // ¿Nuevo hito alcanzado?
    const hito = HITOS.find(h => h.days === next);
    if (hito) setNewHito(hito);

    setTimeout(() => setShowConfetti(false), 1500);
    setTimeout(() => setShowPulse(false), 800);
    setTimeout(() => setNewHito(null), 4000);
  }, [checkedToday, days, TODAY]);

  // Próximo hito
  const proxHito = HITOS.find(h => h.days > days);

  return (
    <div className="relative glass-card p-10 rounded-[3rem] border-white/5 bg-white/[0.02]
                    overflow-hidden flex flex-col gap-8 h-full shadow-xl">

      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(134,239,172,0.04)_0%,_transparent_65%)] pointer-events-none" />

      {/* Confeti */}
      <Confetti show={showConfetti} />

      {/* Pulso de pantalla al check-in */}
      <AnimatePresence>
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-[3rem] pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.7 }}
            style={{ background: 'radial-gradient(circle at 50% 50%, #86efac, transparent)' }}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={13} className="text-green-400" />
            <span className="text-[9px] font-black text-green-400/60 uppercase tracking-[0.5em]">Mi Compromiso</span>
          </div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none">Fortaleza</h3>
        </div>
        <div className="text-right">
          <p className="text-5xl font-black text-white leading-none italic">{days}</p>
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">{days === 1 ? 'Día' : 'Días'}</p>
        </div>
      </div>

      {/* ── Línea de hitos ── */}
      <div className="relative z-10 flex justify-between items-center gap-2">
        {/* Línea de progreso */}
        <div className="absolute top-[50%] left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2 mx-6" />
        <div
          className="absolute top-[50%] left-0 h-[1px] -translate-y-1/2 ml-6 transition-all duration-1000"
          style={{
            width: `${Math.min((days / 30) * 100, 100)}%`,
            background: 'linear-gradient(90deg, #86efac, #93c5fd)',
            boxShadow: '0 0 8px #86efac80',
          }}
        />

        {HITOS.map((hito, i) => {
          const reached = days >= hito.days;
          return (
            <motion.div
              key={i}
              className="relative flex flex-col items-center gap-2 z-10"
              whileHover={{ scale: 1.1 }}
            >
              <GemIcon shape={hito.shape} color={hito.color} glow={hito.glow} reached={reached} />
              <span className={`text-[7px] font-black uppercase tracking-widest text-center whitespace-nowrap
                               ${reached ? 'text-white' : 'text-gray-700'}`}>
                {hito.nombre.split(' ').slice(-1)[0]}
              </span>
              <span className={`text-[7px] font-black ${reached ? 'text-green-400' : 'text-gray-700'}`}>
                {hito.days}d
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* ── Frase del día ── */}
      <div className="relative z-10 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4">
        <p className="text-xs text-gray-400 font-medium italic leading-relaxed text-center">
          "{fraseDelDia}"
        </p>
      </div>

      {/* ── Botón Check-in ── */}
      <motion.button
        onClick={handleCheckin}
        disabled={checkedToday}
        whileHover={!checkedToday ? { scale: 1.03 } : {}}
        whileTap={!checkedToday ? { scale: 0.97 } : {}}
        className="relative z-10 w-full py-7 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em]
                   flex items-center justify-center gap-3 transition-all duration-500"
        style={{
          background: checkedToday
            ? 'rgba(255,255,255,0.03)'
            : 'linear-gradient(135deg, rgba(134,239,172,0.2), rgba(147,197,253,0.15))',
          border: checkedToday ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(134,239,172,0.3)',
          color: checkedToday ? '#4b5563' : '#86efac',
          cursor: checkedToday ? 'not-allowed' : 'pointer',
          boxShadow: checkedToday ? 'none' : '0 0 30px rgba(134,239,172,0.08)',
        }}
      >
        {checkedToday ? (
          <>
            <CheckCircle size={18} />
            Registrado hoy · Vuelve mañana
          </>
        ) : (
          <>
            <Sparkles size={18} />
            He mantenido mi compromiso hoy
          </>
        )}
      </motion.button>

      {/* ── Notificación de Nuevo Hito ── */}
      <AnimatePresence>
        {newHito && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-6 left-6 right-6 z-40 rounded-2xl p-6 flex items-center gap-4
                       border backdrop-blur-xl shadow-2xl"
            style={{
              background: 'rgba(10,12,18,0.9)',
              borderColor: `${newHito.color}40`,
              boxShadow: `0 0 30px ${newHito.glow}`,
            }}
          >
            <GemIcon shape={newHito.shape} color={newHito.color} glow={newHito.glow} reached size={40} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">Hito Desbloqueado</p>
              <p className="text-sm font-black text-white italic">{newHito.nombre}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Un día más hacia tu mejor versión, {userName}.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FortalezaTracker;
