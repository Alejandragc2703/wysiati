import React, { useState } from 'react';
import { 
  Users, Moon, Dumbbell, Coffee, Sparkles, 
  Save, Clock, BookOpen, CheckCircle2, Image as ImageIcon, X
} from 'lucide-react';

const ComprehensiveJournal = () => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [emotionalLoad, setEmotionalLoad] = useState('violet');
  const [success, setSuccess] = useState(false);
  
  const metrics = [
    { id: 'social', icon: Users, label: 'Social', color: 'text-violet-neon', load: 'violet' },
    { id: 'sleep', icon: Moon, label: 'Sueño', color: 'text-cyan-neon', load: 'cyan' },
    { id: 'fitness', icon: Dumbbell, label: 'Ejercicio', color: 'text-gold', load: 'orange' },
    { id: 'nutrition', icon: Coffee, label: 'Nutrición', color: 'text-orange-400', load: 'orange' },
  ];

  const [image, setImage] = useState(null);

  const handleSave = () => {
    if (!text || !title) return;
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setText('');
      setTitle('');
      setImage(null);
    }, 2000);
  };

  return (
    <div className="glass-card p-8 space-y-8 animate-in fade-in duration-700 h-full flex flex-col bg-white/[0.01]">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="text-violet-neon" size={20} />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Reflexión Rápida</h3>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase italic">
          <Clock size={12} />
          <span>Sincronizado Localmente</span>
        </div>
      </header>

      {/* Selector de Categoría / Color */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <button 
            key={m.id}
            onClick={() => {
                setEmotionalLoad(m.load);
                setTitle(`Reflexión sobre ${m.label}`);
            }}
            className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                emotionalLoad === m.load ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:border-white/10'
            }`}
          >
            <m.icon size={20} className={`${m.color} transition-transform group-hover:scale-110`} />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Input de Título */}
      <div className="flex gap-4">
        <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título de tu reflexión..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold text-xs outline-none focus:border-violet-neon transition-all"
        />
        <button 
            onClick={() => setImage('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1227&auto=format&fit=crop')}
            className={`p-4 rounded-xl border transition-all ${image ? 'bg-violet-neon/20 border-violet-neon/40 text-violet-neon' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
        >
            <ImageIcon size={18} />
        </button>
      </div>

      {/* Preview de Imagen */}
      {image && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative h-32 rounded-2xl overflow-hidden border border-white/10 group">
              <img src={image} className="w-full h-full object-cover opacity-60" alt="Journal" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
              </button>
          </motion.div>
      )}

      {/* Editor con Mood Analysis Visual */}
      <div className={`relative transition-all duration-700 rounded-[2rem] border flex-1 min-h-[150px] ${
          emotionalLoad === 'cyan' ? 'border-cyan-400/30' : emotionalLoad === 'violet' ? 'border-violet-neon/30' : 'border-orange-400/30'
      }`}>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué hay en tu mente ahora?..."
          className="w-full h-full bg-transparent p-6 text-gray-300 text-sm leading-relaxed outline-none resize-none placeholder:text-gray-700"
        />
        
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={12} className={emotionalLoad === 'cyan' ? 'text-cyan-400' : 'text-violet-neon'} />
            <span className="text-[10px] font-bold text-gray-500 uppercase">Analizando estado...</span>
          </div>
          <span className="text-[10px] font-bold text-gray-600 uppercase">
            {text.trim().split(/\s+/).filter(Boolean).length} palabras
          </span>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!text || !title}
        className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl group font-black text-xs tracking-widest ${
            success ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-violet-neon hover:text-white'
        } disabled:opacity-30`}
      >
        {success ? <CheckCircle2 size={18} /> : <Save size={18} />}
        <span>{success ? 'REFLEXIÓN GUARDADA' : 'GUARDAR EN EL DIARIO'}</span>
      </button>
    </div>
  );
};

export default ComprehensiveJournal;
