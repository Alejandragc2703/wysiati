import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Heart, Brain, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const FactDetail = () => {
  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto py-12 px-6">
      <Link to="/dashboard" className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Volver al Refugio</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-violet-neon/10 rounded-3xl flex items-center justify-center border border-violet-neon/20 shadow-2xl shadow-violet-neon/5">
            <Sparkles size={32} className="text-violet-neon" />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-violet-neon/60 uppercase tracking-[0.6em]">Reflexión Profunda</h3>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">La Paz Interior</h1>
          </div>
        </div>

        <p className="text-3xl font-light text-white leading-tight italic border-l-4 border-violet-neon pl-10 py-4 bg-white/[0.01]">
          "La paz interior no es la ausencia de problemas, sino la presencia de serenidad ante ellos."
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="glass-card p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-4 hover:bg-white/[0.04] transition-all">
            <Heart size={24} className="text-red-400" />
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">El Factor Emocional</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              La serenidad se cultiva a través de la aceptación radical. Al dejar de luchar contra lo que no podemos cambiar, liberamos energía para transformar lo que sí está en nuestras manos.
            </p>
          </div>

          <div className="glass-card p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-4 hover:bg-white/[0.04] transition-all">
            <Brain size={24} className="text-cyan-400" />
            <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Análisis Cognitivo</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              Nuestra mente tiende a proyectar escenarios futuros negativos. Volver al presente mediante la respiración consciente es la herramienta más potente para recuperar la paz.
            </p>
          </div>
        </div>

        <div className="bg-violet-neon/5 border border-violet-neon/10 p-12 rounded-[4rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <Moon size={48} className="text-violet-neon opacity-20" />
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Práctica Sugerida</h3>
            <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
              Dedica 5 minutos hoy a observar tus pensamientos como si fueran nubes pasando. No te enganches a ninguno, solo obsérvalos y déjalos ir.
            </p>
            <button className="px-12 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl">
              Iniciar Ejercicio
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FactDetail;
