import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowRight, Timer, BarChart3, 
  CheckCircle2, Play, Pause, RefreshCw 
} from 'lucide-react';

const ClinicalModule = () => {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [thought, setThought] = useState('');

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <div className="kintsugi-card p-10 min-h-[600px] relative flex flex-col animate-in fade-in duration-700">
      {/* Header Clínico */}
      <header className="flex justify-between items-start mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck size={18} />
            <span className="text-[10px] uppercase font-black tracking-[0.3em]">CBT Exposure Protocol</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Módulo de Resiliencia</h2>
        </div>
        <div className="bg-gold/10 px-4 py-2 rounded-2xl border border-gold/20 flex items-center gap-2">
           <RefreshCw size={14} className="text-gold animate-spin-slow" />
           <span className="text-[10px] font-black text-gold uppercase tracking-widest">En curso</span>
        </div>
      </header>

      {/* Stepper Vertical Interactiva */}
      <div className="flex-1 flex gap-10">
        <div className="flex flex-col items-center gap-4">
          {[1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step === i ? 'bg-gold border-gold text-dark-bg shadow-[0_0_20px_#d4af37]' : 
                  step > i ? 'bg-gold/20 border-gold/40 text-gold' : 'bg-white/5 border-white/10 text-gray-600'
                }`}
              >
                {step > i ? <CheckCircle2 size={20} /> : <span className="font-black">{i}</span>}
              </div>
              {i < 3 && <div className={`w-0.5 flex-1 rounded-full ${step > i ? 'bg-gold' : 'bg-white/5'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Contenido Dinámico de los Pasos */}
        <div className="flex-1 pt-1">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <h3 className="text-xl font-bold text-white">1. Identificación del Pensamiento</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Describe el pensamiento o situación que te genera malestar. Ponerlo en palabras es el primer paso para repararlo.
              </p>
              <textarea 
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="Ej: 'Siento que no podré manejar la reunión de mañana...'"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-gray-300 outline-none focus:border-gold/50 transition-all min-h-[150px] resize-none"
              />
              <button 
                onClick={() => setStep(2)}
                className="px-8 py-3 bg-gold text-dark-bg font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Iniciar Exposición <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 flex flex-col items-center text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">2. Exposición Guiada</h3>
                <p className="text-gray-400 text-sm">Mantén el pensamiento presente mientras controlas tu respiración.</p>
              </div>

              {/* Burbuja de Respiración Integrada */}
              <div className="relative flex items-center justify-center py-10">
                <div className="w-48 h-48 rounded-full bg-cyan-neon/20 border border-cyan-neon/40 breathing-bubble flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-white">{timeLeft}s</span>
                    <Timer size={20} className="text-cyan-neon mt-2" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white"
                >
                  {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                {timeLeft <= 0 && (
                  <button 
                    onClick={() => setStep(3)}
                    className="px-8 py-4 bg-cyan-neon text-dark-bg font-black rounded-2xl hover:scale-105 transition-all"
                  >
                    Pasar a Evaluación
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <h3 className="text-xl font-bold text-white">3. Re-evaluación Final</h3>
               <div className="glass-card p-6 border-white/5 space-y-6">
                 <div className="flex justify-between items-end h-40 gap-4">
                   {[
                     { label: 'Antes', val: '80%', color: 'bg-gray-700' },
                     { label: 'Después', val: '30%', color: 'bg-gold' }
                   ].map((bar, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full relative bg-white/5 rounded-t-xl overflow-hidden flex items-end" style={{height: '100%'}}>
                           <div className={`w-full ${bar.color} transition-all duration-1000`} style={{height: bar.val}} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{bar.label} ({bar.val})</span>
                     </div>
                   ))}
                 </div>
                 <div className="flex items-center gap-3 p-4 bg-gold/10 rounded-xl border border-gold/20">
                    <BarChart3 size={18} className="text-gold" />
                    <p className="text-xs text-gold/80 font-medium">Reducción de ansiedad detectada: 62%</p>
                 </div>
               </div>
               <button 
                onClick={() => setStep(1)}
                className="w-full py-4 bg-white text-dark-bg font-black rounded-xl hover:bg-gold hover:text-dark-bg transition-all"
              >
                Finalizar Protocolo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Avatar de Apoyo (Bottom Right) */}
      <div className="absolute bottom-6 right-6 group">
        <div className="relative">
           <div className="absolute inset-0 bg-gold rounded-full blur-xl opacity-20 animate-pulse group-hover:opacity-40 transition-opacity" />
           <div className="relative w-20 h-20 rounded-full glass-card border-gold/30 overflow-hidden flex items-center justify-center p-1 bg-[#1a1a2e]">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elara" 
                alt="Therapist" 
                className="w-full h-full object-cover scale-125"
              />
           </div>
           {/* Listening Animation Dots */}
           <div className="absolute -top-1 -left-1 flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{animationDelay: `${i * 0.2}s`}} />
              ))}
           </div>
        </div>
        <div className="absolute right-24 bottom-6 scale-0 group-hover:scale-100 transition-all origin-right bg-black/80 backdrop-blur-xl border border-gold/20 px-4 py-2 rounded-xl whitespace-nowrap">
           <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Dra. Elara: "Te escucho..."</span>
        </div>
      </div>
    </div>
  );
};

export default ClinicalModule;
