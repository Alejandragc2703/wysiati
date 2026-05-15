import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles, Brain, Quote } from 'lucide-react';

const FactDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fact } = location.state || { fact: { text: "No hay datos disponibles.", extra_info: "Vuelve al dashboard para sincronizar." } };

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

      <div className="space-y-12">
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="relative p-14 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-10 opacity-5">
                <Brain size={120} className="text-violet-neon" />
            </div>
            
            <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 text-violet-neon">
                    <Sparkles size={20} />
                    <span className="text-[11px] font-black uppercase tracking-[0.6em]">Reflexión del Día</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight italic uppercase tracking-tighter">
                    {fact.text}
                </h1>
                <div className="flex items-center gap-3 text-gray-500">
                    <Quote size={16} />
                    <span className="text-xs font-medium">Sincronizado desde tu Arquetipo Bio-Sync</span>
                </div>
            </div>
        </motion.div>

        {/* Depth Section (THE WHY) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="space-y-8 px-8"
        >
            <div className="flex items-center gap-4">
                <BookOpen className="text-cyan-neon" size={24} />
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">El Porqué de esta Reflexión</h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-400 font-medium leading-relaxed">
                <p className="border-l-4 border-violet-neon/30 pl-8 py-2">
                    {fact.extra_info || "Estamos recopilando más datos científicos sobre este hecho. Vuelve pronto para profundizar."}
                </p>
                <p className="text-sm text-gray-600 italic">
                    Integrar este conocimiento en tu rutina diaria ayuda a fortalecer la plasticidad neuronal y la resiliencia emocional.
                </p>
            </div>
        </motion.div>

        {/* Footer info */}
        <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
             className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 opacity-30"
        >
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Referencia: {fact.source || 'Bio-Sync Engine'}</div>
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white italic">WYSIATI / Santuario Digital v2.0</div>
        </motion.div>
      </div>
    </div>
  );
};

export default FactDetail;
