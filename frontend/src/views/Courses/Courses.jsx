import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Play, Clock, Star, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
};

const Courses = () => {
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAcademyContent()
      .then(res => {
        setCourseList(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getStyleByCategory = (category) => {
    const cats = {
      'Enfoque':    { color: 'violet', grad: 'from-violet-900/40 to-violet-600/10', glow: '#8b5cf6' },
      'Respiración': { color: 'cyan',   grad: 'from-cyan-900/40 to-cyan-600/10',   glow: '#06b6d4' },
      'Meditación':  { color: 'gold',   grad: 'from-yellow-900/30 to-yellow-600/5', glow: '#facc15' },
      'CBT':         { color: 'violet', grad: 'from-violet-900/40 to-violet-600/10', glow: '#8b5cf6' }
    };
    return cats[category] || cats['Enfoque'];
  };

  return (
    <div className="space-y-10 pb-24">

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative flex flex-col lg:flex-row justify-between items-center
                   bg-white/[0.02] border border-white/5 rounded-[3.5rem] px-14 py-12 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,_rgba(6,182,212,0.05)_0%,_transparent_50%)]" />
        <div className="relative z-10 space-y-3 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-cyan-400/40 mb-1">
            <BookOpen size={15} />
            <span className="text-[9px] font-black uppercase tracking-[0.5em]">Academia de Sabiduría</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Tu Conocimiento</h1>
          <p className="text-gray-500 max-w-lg font-medium leading-relaxed">
            Explora las técnicas de regulación del Sistema 1 y 2. Sincroniza tu mente con la ciencia del bienestar.
          </p>
        </div>
        <div className="relative z-10 mt-6 lg:mt-0 flex items-center gap-3 text-[10px] font-black uppercase text-gray-600 tracking-widest">
          <GraduationCap size={18} className="text-cyan-400" />
          {courseList.length} Técnicas Disponibles
        </div>
      </motion.header>

      {/* ── BENTO ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courseList.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center space-y-4">
             <p className="text-gray-600 font-black uppercase tracking-widest italic">Aún no hay contenido sincronizado en el Santuario.</p>
             <button className="text-violet-neon text-[10px] font-black uppercase tracking-widest">Sincronizar Manualmente</button>
          </div>
        )}

        {courseList.map((course, idx) => {
          const style = getStyleByCategory(course.category);
          return (
            <motion.div
              key={course.id || idx}
              variants={card} custom={idx}
              initial="hidden" animate="visible"
              className="group relative glass-card border-white/5 hover:border-white/20
                         hover:bg-white/[0.04] transition-all duration-500 overflow-hidden
                         rounded-[3rem] flex flex-col cursor-pointer"
            >
              {/* Category Tag */}
              <div className="absolute top-5 right-5 z-20 px-3 py-1.5 bg-black/40 backdrop-blur-xl
                              border border-white/10 rounded-full flex items-center gap-2">
                <span className="text-[8px] font-black text-white uppercase tracking-widest">{course.category}</span>
              </div>

              {/* Image Area */}
              <div className={`h-40 bg-gradient-to-br ${style.grad} relative flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-all duration-700" />
                <div className="relative z-10 w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-full
                                flex items-center justify-center transition-all duration-500
                                group-hover:scale-110 group-hover:bg-white/20">
                  <Play size={20} className="text-white fill-white relative z-20" />
                </div>
              </div>

              {/* Info */}
              <div className="p-8 flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full
                                   text-[8px] font-black uppercase tracking-widest text-gray-400">
                    Nivel {course.difficulty || 'Básico'}
                  </span>
                  <div className="flex items-center gap-1.5 text-yellow-500">
                    <Star size={11} fill="currentColor" />
                    <span className="text-[11px] font-black">4.9</span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-white italic tracking-tight leading-tight
                               group-hover:text-cyan-400 transition-colors uppercase">{course.title}</h3>
                
                <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]
                                   group-hover:text-white/60 transition-colors">Iniciar Módulo</span>
                  <ChevronRight size={16} className="text-white/20 group-hover:translate-x-1.5
                                group-hover:text-cyan-400 transition-all" />
                </div>
              </div>

              {/* Decorative progress bar */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5">
                <div
                  className="h-full w-[10%] transition-all duration-1000"
                  style={{
                    background: `linear-gradient(90deg, ${style.glow}, #06b6d4)`,
                    boxShadow: `0 0 8px ${style.glow}`
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
