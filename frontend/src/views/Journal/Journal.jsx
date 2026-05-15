import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, BookOpen, ChevronRight, PenLine, X, Calendar, Sparkles } from 'lucide-react';
import api from '../../services/api';

const Journal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);

  const [newEntry, setNewEntry] = useState({ title: '', content: '', emotional_load: 'violet' });

  // Carga inicial de datos desde PostgreSQL
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await api.getJournalEntries();
      setEntries(data);
    } catch (error) {
      console.warn("No se pudo conectar con el Santuario. Usando modo local.");
      // Fallback a datos de ejemplo si falla la conexión
      setEntries([
        {
          id: 1,
          title: "Claridad (Local)",
          content: "El servidor no está activo, pero tus pensamientos se guardan aquí.",
          ai_insight: "Sincroniza con el backend para recibir análisis de Kahneman.",
          emotional_load: "cyan",
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Guardar en Base de Datos + Procesar IA
      const savedEntry = await api.saveJournalEntry({
        ...newEntry,
        mood_score: newEntry.emotional_load === 'cyan' ? 5 : newEntry.emotional_load === 'violet' ? 3 : 1
      });
      
      setEntries([savedEntry, ...entries]);
      setShowModal(false);
      setNewEntry({ title: '', content: '', emotional_load: 'violet' });
    } catch (error) {
      alert("Error al sincronizar con el Arquetipo. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => 
    (e.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     e.content?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-24 relative">
      
      <header className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,_rgba(139,92,246,0.05)_0%,_transparent_50%)]" />
        
        <div className="relative z-10 space-y-4 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-violet-neon mb-2">
            <BookOpen size={16} />
            <span className="text-[10px] uppercase font-black tracking-[0.5em]">Tu espacio privado</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Mis Reflexiones</h1>
          <p className="text-gray-500 max-w-xl font-medium leading-relaxed italic">
            Visualiza tu evolución emocional y profundiza en tus pensamientos.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="relative z-10 bg-white text-black px-10 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-violet-neon hover:text-white transition-all shadow-2xl flex items-center gap-4 group"
        >
          <PenLine size={18} className="group-hover:rotate-12 transition-transform" />
          Escribir hoy
        </button>
      </header>

      <div className="relative max-w-4xl mx-auto w-full">
        <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-700" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar una reflexión pasada..." 
          className="w-full bg-white/[0.02] border border-white/5 rounded-full py-6 pl-20 pr-10 text-white font-medium placeholder:text-gray-800 focus:outline-none focus:border-white/20 transition-all text-sm tracking-wide"
        />
      </div>

      <div className="space-y-6">
        {filteredEntries.map((entry, idx) => (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedEntry(entry)}
            className="group relative glass-card p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] hover:bg-white/[0.03] transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 overflow-hidden shadow-xl cursor-pointer"
          >
            <div className={`absolute left-0 top-0 w-1.5 h-full ${
                entry.emotional_load === 'cyan'   ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 
                entry.emotional_load === 'violet' ? 'bg-violet-500 shadow-[0_0_15px_#8b5cf6]' : 
                                                 'bg-orange-400 shadow-[0_0_15px_#fb923c]'
              } opacity-30 group-hover:opacity-100 transition-opacity duration-700`} />

            <div className="flex flex-col items-center justify-center lg:w-32 shrink-0 border-r border-white/5 pr-10 text-center">
              <span className="font-mono text-xs text-white/40 font-bold">{new Date(entry.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex-1 space-y-3 text-center lg:text-left">
              <h3 className="text-xl font-black text-white italic tracking-tight group-hover:text-violet-neon transition-colors uppercase">{entry.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-3xl truncate">{entry.content}</p>
            </div>

            <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-600 group-hover:text-white group-hover:border-violet-neon/50 transition-all shrink-0">
              <ChevronRight size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal Detalle Entrada */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEntry(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="relative w-full max-w-4xl bg-[#0b0e14] border border-white/10 rounded-[4rem] p-16 shadow-2xl space-y-10 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setSelectedEntry(null)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"><X size={32} /></button>
              
              <header className="space-y-4">
                <div className="flex items-center gap-4 text-violet-neon/60">
                   <Calendar size={18} />
                   <span className="text-xs font-black uppercase tracking-widest">{new Date(selectedEntry.created_at).toLocaleString('es-ES', { dateStyle: 'long' })}</span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedEntry.title}</h2>
              </header>

              <div className="h-px bg-white/5 w-full" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Contenido del Usuario */}
                <div className="lg:col-span-7 space-y-6">
                  <p className="text-2xl text-gray-300 font-light italic leading-relaxed whitespace-pre-wrap">
                    "{selectedEntry.content}"
                  </p>
                </div>

                {/* Insight de la IA (Referencia Psicológica) */}
                <div className="lg:col-span-5">
                  <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Sparkles size={40} className="text-violet-neon" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-violet-neon/80">
                      <Shield size={14} />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em]">Insight del Arquetipo</span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-white/80 font-bold leading-snug">
                        Análisis cognitivo activo.
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed italic">
                        {selectedEntry.ai_insight || "Tu Sistema 2 está procesando esta información. Sigue registrando para profundizar."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Referencia: Daniel Kahneman</span>
                       <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-violet-neon/40" />)}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Nueva Entrada */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0b0e14] border border-white/10 rounded-[3.5rem] p-12 shadow-2xl space-y-8"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-white/20 hover:text-white"><X size={24} /></button>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nueva Reflexión</h2>
              
              <form onSubmit={handleAddEntry} className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Título de tu reflexión..." 
                  required
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:border-violet-neon"
                />
                <textarea 
                  placeholder="¿Qué hay en tu mente?..." 
                  required
                  rows={5}
                  value={newEntry.content}
                  onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-medium focus:outline-none focus:border-violet-neon resize-none"
                />
                <button type="submit" className="w-full bg-white text-black py-6 rounded-full font-black text-xs uppercase tracking-[0.5em] hover:bg-violet-neon hover:text-white transition-all">
                  Guardar en el Santuario
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
