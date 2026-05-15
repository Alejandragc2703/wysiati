import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, ImageIcon, Video, Send, X, Smile } from 'lucide-react';

const Community = () => {
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState([
    { 
      id: 1,
      user: 'Luna_Zen', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      content: 'Hoy logré mi racha de 15 días en Fortaleza. Me siento increíblemente en paz. 🌿',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      likes: 124,
      liked: false,
      time: '2h'
    },
    { 
      id: 2,
      user: 'Atlas_Focus', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      content: 'Probando el nuevo modo Enfoque con ruido blanco. 100% recomendado para deep work.',
      likes: 89,
      liked: true,
      time: '5h'
    },
  ]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const post = {
      id: Date.now(),
      user: 'Adrián',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop',
      content: newPostContent,
      likes: 0,
      liked: false,
      time: 'Ahora'
    };
    setPosts([post, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-32">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 text-violet-neon/40 mb-2">
          <MessageCircle size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.6em]">Santuario Social</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Comunidad</h1>
      </header>

      {/* ── CREATE POST ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 space-y-6 shadow-2xl"
      >
        <div className="flex gap-4">
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop" className="w-12 h-12 rounded-2xl border border-white/10" alt="Me" />
          <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="¿Qué hay en tu mente consciente?"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 resize-none py-2 text-lg font-light italic"
            rows="2"
          />
        </div>
        <div className="flex items-center justify-end pt-4 border-t border-white/5">
          <button 
            onClick={handleCreatePost}
            disabled={!newPostContent.trim()}
            className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-violet-neon hover:text-white transition-all disabled:opacity-20"
          >
            <Send size={20} />
          </button>
        </div>
      </motion.div>

      {/* ── FEED ── */}
      <div className="space-y-10">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              layout
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 space-y-6 hover:bg-white/[0.02] transition-all group"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <img src={post.avatar} alt={post.user} className="w-14 h-14 rounded-3xl object-cover border border-white/10" />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">{post.user}</p>
                    <p className="text-[10px] text-gray-600 font-bold">{post.time} ago</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-xl font-light text-white/90 leading-relaxed italic border-l-2 border-violet-neon/20 pl-8">
                  "{post.content}"
                </p>
                {post.image && (
                  <div className="rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-white/20 transition-all aspect-video">
                    <img src={post.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="Post media" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-10 pt-6 border-t border-white/5">
                <button className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group">
                  <Heart size={20} className="group-hover:fill-white/10" />
                  <span className="text-[11px] font-black tracking-widest">{post.likes}</span>
                </button>
                <button className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group">
                  <MessageCircle size={20} className="group-hover:fill-white/10" />
                  <span className="text-[11px] font-black tracking-widest">0</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Community;
