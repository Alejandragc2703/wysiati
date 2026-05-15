import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SoberTracker from '../../components/dashboard/SoberTracker';
import ComprehensiveJournal from '../../components/dashboard/ComprehensiveJournal';
import MoodSelectorDaylio from '../../components/dashboard/MoodSelectorDaylio';
import DailyQuest from '../../components/dashboard/DailyQuest';
import CommunityCard from '../../components/dashboard/CommunityCard';
import HeartCoherence from '../../components/dashboard/HeartCoherence';
import { Sparkles, ShieldCheck, Waves, Sun, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: 'easeOut' }
  })
};

const Dashboard = () => {
  const [data, setData] = useState({
    nickname: localStorage.getItem('wysiati_nickname') || 'Viajero',
    streak: 1,
    lastInsight: "Analizando tu Sistema de pensamiento...",
    moodTrend: 'Estable',
    personality: 'Arquitecto de Hábitos'
  });

  useEffect(() => {
    // Carga de datos reales desde el backend
    api.getDashboardStats()
      .then(res => setData(res))
      .catch(err => console.warn("Backend no detectado, usando datos locales.", err));
  }, []);

  const staticData = {
    user: {
      nickname: data.nickname,
      personality_type: data.personality,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop"
    },
    fortaleza: {
      vicio_actual: "Procrastinación Digital",
      current_streak: data.streak,
      next_badge_in_days: 30 - (data.streak % 30),
      current_badge_id: 'cristal_cobalto'
    },
    ia_content: {
      daily_fact: {
        text: data.lastInsight,
        extra_info: "Basado en tu última reflexión."
      }
    }
  };

  return (
    <div className="space-y-8 pb-24 max-w-[1700px] mx-auto">

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col lg:flex-row justify-between items-center
                   bg-white/[0.02] border border-white/5 rounded-[3.5rem]
                   px-14 py-12 overflow-hidden shadow-xl gap-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_-30%,_rgba(139,92,246,0.07)_0%,_transparent_55%)]" />

        <div className="relative z-10 space-y-3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-violet-neon/40">
            <Sun size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.5em]">Tu Refugio Bio-Sync</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
            Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{staticData.user.nickname}</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
            Tu sistema contra <span className="text-white font-bold italic">{staticData.fortaleza.vicio_actual}</span> está activo.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="flex items-center gap-4 px-8 py-5 bg-white/[0.02] border border-white/5 rounded-full shadow-lg">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Nivel de Paz</span>
              <span className="text-xl font-black text-white italic">Óptimo</span>
            </div>
            <div className="w-10 h-10 bg-violet-neon/5 rounded-full flex items-center justify-center border border-violet-neon/10">
              <Waves className="text-violet-neon/40 animate-pulse" size={20} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── BENTO GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Mood Tracker */}
        <motion.div variants={card} custom={0} initial="hidden" animate="visible" className="lg:col-span-12">
          <MoodSelectorDaylio />
        </motion.div>

        {/* Heart Coherence */}
        <motion.div variants={card} custom={1} initial="hidden" animate="visible" className="lg:col-span-8">
          <HeartCoherence />
        </motion.div>

        <div className="lg:col-span-4 grid grid-rows-2 gap-8">
          <motion.div variants={card} custom={2} initial="hidden" animate="visible">
            <CommunityCard />
          </motion.div>
          <motion.div variants={card} custom={3} initial="hidden" animate="visible">
            <DailyQuest />
          </motion.div>
        </div>

        {/* Sober Tracker */}
        <motion.div variants={card} custom={4} initial="hidden" animate="visible" className="lg:col-span-12">
          <SoberTracker 
            days={staticData.fortaleza.current_streak} 
            milestone={30} 
            canCheckIn={true}
          />
        </motion.div>

        {/* Diario */}
        <motion.div variants={card} custom={5} initial="hidden" animate="visible" className="lg:col-span-12">
          <ComprehensiveJournal />
        </motion.div>

        {/* IA Fact */}
        <motion.div variants={card} custom={6} initial="hidden" animate="visible" className="lg:col-span-12 group">
          <div className="relative glass-card p-14 bg-white/[0.01] border border-white/5 rounded-[3.5rem]
                          flex flex-col lg:flex-row items-center gap-14 shadow-xl
                          transition-all duration-700 hover:bg-white/[0.03]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center shrink-0
                            border border-white/10 group-hover:scale-110 transition-transform duration-700">
              <Sparkles size={36} className="text-violet-neon" />
            </div>
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.6em]">Reflexión del Arquetipo</h3>
              <p className="text-2xl font-light text-white leading-tight max-w-4xl italic">
                "{staticData.ia_content.daily_fact.text}"
              </p>
            </div>
            <Link 
              to="/fact-detail"
              className="px-12 py-6 bg-white text-black rounded-full font-black text-[10px] uppercase
                                tracking-[0.5em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl shrink-0 text-center flex items-center gap-3 group"
            >
              Profundizar
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>

      <footer className="flex justify-between items-center opacity-20 pt-8 px-4">
        <div className="flex items-center gap-3">
          <ShieldCheck size={16} className="text-white" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Santuario Protegido // Bio-Sync</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;