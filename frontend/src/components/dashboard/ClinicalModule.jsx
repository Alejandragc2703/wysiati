import React from 'react';
import { ShieldCheck, ChevronRight, Activity } from 'lucide-react';

const ClinicalModule = () => {
  const tasks = [
    { label: 'Exposición al miedo', progress: 'Paso 2/5', status: 'current' },
    { label: 'Identificar sesgos cognitivos', progress: 'Pendiente', status: 'todo' },
    { label: 'Registro de pensamientos', progress: 'Completado', status: 'done' },
  ];

  return (
    <div className="kintsugi-card p-8 h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-gold mb-2">
            <ShieldCheck size={18} />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Clinical Ecosystem</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Módulo TCC</h2>
        </div>
        <div className="bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
          <span className="text-[10px] text-gold font-bold">Activo</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {tasks.map((task, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
              task.status === 'current' ? 'bg-gold/10 border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-white/5 border border-white/5 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${task.status === 'current' ? 'bg-gold shadow-[0_0_8px_#d4af37]' : 'bg-gray-600'}`} />
              <div>
                <p className="text-sm font-semibold text-white">{task.label}</p>
                <p className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${task.status === 'current' ? 'text-gold' : 'text-gray-500'}`}>
                  {task.progress}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className={task.status === 'current' ? 'text-gold' : 'text-gray-600'} />
          </div>
        ))}
      </div>

      {/* Decorative Golden Crack (Kintsugi Aesthetic) */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-gold fill-none stroke-[2]">
          <path d="M0,50 Q20,30 50,60 T100,40" />
          <path d="M20,0 Q40,40 10,100" />
        </svg>
      </div>
    </div>
  );
};

export default ClinicalModule;
