import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Radio, UserCheck, UserMinus } from 'lucide-react';

const CommunityCard = () => {
  const [isActive, setIsActive] = useState(true);

  return (
    <motion.div 
      className="bg-violet-900/10 border border-violet-500/10 p-10 rounded-[3rem]
                 flex flex-col justify-between relative overflow-hidden group h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-50" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="relative">
          <Heart size={28} className={isActive ? "text-violet-neon" : "text-gray-600"} fill="currentColor" fillOpacity="0.2" />
          {isActive && (
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-violet-neon rounded-full blur-md -z-10"
            />
          )}
        </div>
        
        {/* Toggle Active Status */}
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[8px] font-black uppercase tracking-widest ${
            isActive ? 'bg-violet-neon/20 border-violet-neon/30 text-violet-neon' : 'bg-white/5 border-white/10 text-gray-500'
          }`}
        >
          {isActive ? <UserCheck size={10} /> : <UserMinus size={10} />}
          {isActive ? 'Activo' : 'Invisible'}
        </button>
      </div>

      <div className="relative z-10">
        <p className="text-3xl font-black text-white tracking-tighter italic uppercase leading-none">
          {isActive ? '204' : '---'}
        </p>
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mt-1">Personas Contigo</p>
      </div>
    </motion.div>
  );
};

export default CommunityCard;
