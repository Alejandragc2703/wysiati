import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Camera, ShieldCheck, LogOut, ChevronRight, Zap, UserCheck, UserMinus, Edit3, Check, Flame, Brain, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const AvatarCircle = ({ name, size = 48 }) => {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="rounded-full bg-gradient-to-br from-violet-600 to-violet-900 border-4 border-black flex items-center justify-center font-black text-white shadow-2xl shrink-0"
    >
      {initials}
    </div>
  );
};

const PerformanceCircle = ({ label, value, color, icon: Icon, sublabel }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const pct = value !== null ? Math.min(100, Math.max(0, value)) : null;
  const strokeDashoffset = pct !== null ? circumference - (pct / 100) * circumference : circumference;
  return (
    <div className="flex flex-col items-center gap-3 bg-white/[0.02] p-6 rounded-3xl border border-white/5 flex-1 min-w-[120px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
          <circle cx="40" cy="40" r={radius} stroke={color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-1000 ease-out" />
        </svg>
        <span className="absolute text-sm font-black text-white">
          {pct !== null ? `${pct}%` : <Icon size={18} className="opacity-30" />}
        </span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{label}</span>
      {sublabel && <span className="text-[8px] text-gray-700 uppercase tracking-wider text-center">{sublabel}</span>}
    </div>
  );
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('Cargando...');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingNick, setSavingNick] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sincronizando...';
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const loadProfile = () => {
    Promise.all([api.getProfile(), api.getDashboardStats()])
      .then(([profileRes, statsRes]) => {
        setProfile(profileRes);
        setNickname(profileRes.nickname || profileRes.first_name || 'Viajero');
        setStats(statsRes);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadProfile(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('wysiati_token');
    window.location.href = '/';
  };

  const saveNickname = async () => {
    setSavingNick(true);
    try {
      await api.updateProfile({ nickname });
      setIsEditing(false);
      loadProfile();
    } catch {
      alert('Error al sincronizar con el Santuario.');
    } finally {
      setSavingNick(false);
    }
  };

  const toggleStatus = async () => {
    setTogglingStatus(true);
    try {
      await api.updateStatus(!profile?.is_active);
      loadProfile();
    } catch {
      alert('Error al cambiar el estado.');
    } finally {
      setTogglingStatus(false);
    }
  };

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || nickname
    : 'Cargando...';

  // Calcular porcentajes para los círculos
  // Fortaleza: racha actual / 30 días (objetivo mensual)
  const streakPct = stats?.streak > 0 ? Math.min(100, Math.round((stats.streak / 30) * 100)) : null;
  // Mood: score de 1-10 → porcentaje
  const moodPct = stats?.lastMoodScore !== null && stats?.lastMoodScore !== undefined
    ? Math.round((stats.lastMoodScore / 10) * 100)
    : null;
  // Quest: score directo (ya viene en 0-100)
  const questPct = stats?.lastQuestScore !== null && stats?.lastQuestScore !== undefined
    ? Math.round(stats.lastQuestScore)
    : null;

  const circles = [
    {
      label: 'Fortaleza',
      value: streakPct,
      color: '#8b5cf6',
      icon: Flame,
      sublabel: stats?.streak > 0 ? `${stats.streak} días racha` : 'Sin racha aún'
    },
    {
      label: 'Estado de Ánimo',
      value: moodPct,
      color: '#06b6d4',
      icon: Heart,
      sublabel: moodPct !== null ? `Último registro` : 'Sin registro hoy'
    },
    {
      label: 'Misión Diaria',
      value: questPct,
      color: '#facc15',
      icon: Brain,
      sublabel: questPct !== null ? `Score: ${questPct}%` : 'Sin misión hoy'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-24 max-w-7xl mx-auto text-white">

      {/* ── HEADER ── */}
      <header className="relative bg-[#0b0e14] p-12 lg:p-16 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,_rgba(139,92,246,0.06)_0%,_transparent_50%)]" />

        {/* Avatar */}
        <div className="relative shrink-0">
          <AvatarCircle name={displayName} size={192} />
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-[#0b0e14] rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:border-violet-neon/40 transition-colors">
            <Camera size={14} className="text-gray-500" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-10 z-10 w-full">
          <div className="text-center lg:text-left space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 text-violet-neon mb-2">
              <Zap size={16} fill="currentColor" />
              <span className="text-[10px] uppercase font-black tracking-[0.5em]">Miembro del Santuario</span>
            </div>

            {/* Nickname editable */}
            {isEditing ? (
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveNickname()}
                  className="bg-white/5 border-b-2 border-violet-neon text-4xl lg:text-5xl font-black text-white italic uppercase focus:outline-none w-full max-w-md px-2"
                  autoFocus
                />
                <button
                  onClick={saveNickname}
                  disabled={savingNick}
                  className="bg-violet-neon text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  <Check size={14} /> {savingNick ? '...' : 'Guardar'}
                </button>
                <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-white transition-colors">✕</button>
              </div>
            ) : (
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                <h1
                  onClick={() => setIsEditing(true)}
                  className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic cursor-pointer hover:text-violet-neon transition-colors"
                  title="Clic para editar"
                >
                  {loading ? 'Cargando...' : nickname}
                </h1>
                <Edit3 size={16} className="text-gray-700 hover:text-violet-neon cursor-pointer transition-colors" onClick={() => setIsEditing(true)} />
              </div>
            )}

            {/* Nombre completo */}
            {profile?.first_name && (
              <p className="text-white/40 font-medium text-sm">
                {[profile.first_name, profile.last_name].filter(Boolean).join(' ')}
              </p>
            )}

            <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest">
              Digital-Auth: {loading ? '...' : (profile?.email || '---')}
            </p>
          </div>

          {/* Stat circles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {circles.map((c, i) => <PerformanceCircle key={i} {...c} />)}
          </div>
        </div>
      </header>

      {/* ── SECURITY + ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] space-y-10 shadow-xl">
          <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-4">
            <ShieldCheck size={18} /> Seguridad de Cuenta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} /> Registro Principal
              </label>
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white font-medium text-sm">
                {profile?.email || '---'}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Sincronizado Desde
              </label>
              <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white font-medium text-sm">
                {formatDate(profile?.created_at)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Toggle estado comunidad */}
          <motion.button
            onClick={toggleStatus}
            disabled={togglingStatus}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center justify-between p-8 border rounded-[2.5rem] group transition-all ${
              profile?.is_active
                ? 'bg-violet-neon/10 border-violet-neon/30 hover:bg-violet-neon/20'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                profile?.is_active ? 'bg-violet-neon/20' : 'bg-white/5'
              }`}>
                {profile?.is_active
                  ? <UserCheck size={20} className="text-violet-neon" />
                  : <UserMinus size={20} className="text-gray-500" />
                }
              </div>
              <div className="text-left">
                <span className={`text-xs font-black uppercase tracking-widest block ${profile?.is_active ? 'text-violet-neon' : 'text-white/50'}`}>
                  {profile?.is_active ? 'Activo en Comunidad' : 'Modo Incógnito'}
                </span>
                <span className="text-[9px] text-gray-600 uppercase tracking-widest">
                  {profile?.is_active ? 'Visible para otros' : 'Nadie te ve'}
                </span>
              </div>
            </div>
            <ChevronRight size={20} className={profile?.is_active ? 'text-violet-neon/40' : 'text-white/10'} />
          </motion.button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-8 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-red-500/10 hover:border-red-500/20 group transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <LogOut size={20} className="text-red-500" />
              </div>
              <span className="text-xs font-black text-white/50 group-hover:text-red-500 uppercase tracking-widest transition-colors">
                Finalizar Sesión
              </span>
            </div>
            <ChevronRight size={20} className="text-white/10 group-hover:text-red-500/40" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
