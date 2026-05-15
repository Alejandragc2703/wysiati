import React from 'react';
import { BookOpen, Plus, Users, Moon, Dumbbell } from 'lucide-react';

const JournalCard = () => {
  const stats = [
    { icon: Users, label: 'Social', color: 'text-violet-neon' },
    { icon: Moon, label: 'Sueño', color: 'text-cyan-neon' },
    { icon: Dumbbell, label: 'Ejercicio', color: 'text-gold' },
  ];

  return (
    <div className="glass-card p-6 flex flex-col justify-between h-full group">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <BookOpen size={18} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Mi Diario</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Plus size={18} className="text-gray-500" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">¿Cómo estuvo tu día?</h3>
        
        <div className="grid grid-cols-3 gap-3">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/5 hover:border-white/10 transition-all duration-300">
              <item.icon size={20} className={item.color} />
              <span className="text-[9px] text-gray-500 uppercase font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-6 w-full py-3 bg-gradient-to-r from-violet-neon/20 to-cyan-neon/20 border border-white/10 rounded-2xl text-sm font-semibold text-white hover:from-violet-neon/30 hover:to-cyan-neon/30 transition-all duration-300">
        Escribir Registro Ahora
      </button>
    </div>
  );
};

export default JournalCard;
