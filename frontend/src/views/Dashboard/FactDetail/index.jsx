import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles, Brain, Quote, Loader2, Zap } from 'lucide-react';
import api from '../../../services/api';

const FactDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fact } = location.state || {};

  const [expansion, setExpansion] = useState(null);
  const [loadingExpansion, setLoadingExpansion] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const loadExpansion = async () => {
    if (!fact || loadingExpansion || expansion) return;
    setLoadingExpansion(true);
    setExpanded(true);
    try {
      const res = await api.expandFact({ title: fact.title, text: fact.text, author: fact.author });
      setExpansion(res.expansion);
    } catch {
      setExpansion('No se pudo conectar con la IA en este momento. Intenta de nuevo más tarde.');
    } finally {
      setLoadingExpansion(false);
    }
  };

  if (!fact) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-6">
        <p className="text-white/40">No hay datos del fact disponibles.</p>
        <button onClick={() => navigate(-1)} className="text-violet-neon underline">Volver</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12 min-h-screen">
      <motion.button
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Volver al Santuario</span>
      </motion.button>

      <div className="space-y-10">

        {/* Hero Fact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative p-14 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Brain size={120} className="text-violet-neon" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-black text-violet-neon/60 uppercase tracking-[0.5em]">
                {fact.category}
              </span>
              {fact.aiGenerated && (
                <span className="text-[8px] bg-violet-neon/10 border border-violet-neon/20 text-violet-neon px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Generado por IA
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-violet-neon">
              <Sparkles size={20} />
              <span className="text-[11px] font-black uppercase tracking-[0.6em]">Reflexión del Día</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight italic uppercase tracking-tighter">
              {fact.title}
            </h1>

            <p className="text-xl text-white/80 font-light leading-relaxed italic border-l-4 border-violet-neon/30 pl-8">
              "{fact.text}"
            </p>

            <div className="flex items-center gap-3 text-gray-500 pt-4">
              <Quote size={16} />
              <span className="text-xs font-medium">{fact.author}</span>
            </div>
          </div>
        </motion.div>

        {/* Contexto del libro */}
        {fact.deep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="space-y-6 px-4"
          >
            <div className="flex items-center gap-4">
              <BookOpen className="text-cyan-400" size={22} />
              <h2 className="text-xl font-black text-white italic uppercase tracking-tight">El Porqué de esta Reflexión</h2>
            </div>
            <div className="space-y-4 text-base text-gray-400 font-medium leading-relaxed">
              <p className="border-l-4 border-violet-neon/30 pl-8 py-2">
                {fact.deep}
              </p>
            </div>
          </motion.div>
        )}

        {/* Botón Profundizar con IA */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          {!expanded ? (
            <button
              onClick={loadExpansion}
              className="flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl group"
            >
              <Brain size={18} className="group-hover:rotate-12 transition-transform" />
              Profundizar con IA
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6 bg-white/[0.02] border border-violet-neon/10 rounded-[3rem] p-12"
              >
                <div className="flex items-center gap-4 text-violet-neon">
                  <Sparkles size={22} />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.5em]">Análisis Profundo — IA del Santuario</h3>
                </div>

                {loadingExpansion ? (
                  <div className="flex flex-col items-center gap-6 py-10">
                    <Loader2 size={36} className="text-violet-neon animate-spin" />
                    <p className="text-gray-500 text-sm italic uppercase tracking-widest animate-pulse">
                      Consultando con la IA...
                    </p>
                    <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4 }}
                        className="h-full bg-violet-neon"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-base text-gray-300 font-light leading-relaxed">
                    {expansion?.split('\n').filter(Boolean).map((paragraph, i) => (
                      <p key={i} className={i === 0 ? 'text-white font-medium' : 'text-gray-400'}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Referencia bibliográfica */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 opacity-30"
        >
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white">
            📚 {fact.source || fact.author}
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white italic">
            WYSIATI / Santuario Digital — Fact IA
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FactDetail;
