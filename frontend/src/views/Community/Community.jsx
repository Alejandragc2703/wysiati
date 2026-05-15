import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, ImageIcon, Video, Send, X, Smile, MoreHorizontal, ChevronDown, ChevronUp, Radio, Award, Trash2, Edit3, Save } from 'lucide-react';
import api from '../../services/api';

const PostCard = ({ post, onRefresh, currentUserId, currentUserNickname }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const currentUserIdStr = String(currentUserId || '');
  const postAuthorIdStr = String(post.author_id || '');
  const isOwner = currentUserIdStr.length > 0 && postAuthorIdStr.length > 0 && currentUserIdStr === postAuthorIdStr;
  
  // Debug: quitar cuando funcione
  console.log(`🔍 isOwner check - currentUserId: ${currentUserIdStr}, post.author_id: ${postAuthorIdStr}, result: ${isOwner}`);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await api.togglePostLike(post.id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await api.getPostComments(post.id);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.addPostComment(post.id, newComment);
      setNewComment('');
      loadComments();
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres borrar este momento?")) return;
    try {
      await api.deletePost(post.id);
      onRefresh();
    } catch (err) {
      alert("No se pudo eliminar el post.");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.updatePost(post.id, editContent);
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      alert("Error al actualizar.");
    }
  };

  useEffect(() => {
    if (showComments) loadComments();
  }, [showComments]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 space-y-6 hover:bg-white/[0.02] transition-all group relative"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-3xl bg-violet-neon/10 border border-violet-neon/20 flex items-center justify-center text-violet-neon font-black text-xl italic">
            {post.nickname?.[0] || 'V'}
          </div>
          <div>
            <p className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              {post.nickname}
              {post.is_active && <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />}
            </p>
            <p className="text-[10px] text-gray-600 font-bold">{new Date(post.created_at).toLocaleString()}</p>
          </div>
        </div>
        
        {isOwner && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-700 hover:text-white transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#0b0e14] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden"
                >
                  <button 
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <Edit3 size={14} /> Editar
                  </button>
                  <button 
                    onClick={() => { handleDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {isEditing ? (
          <div className="space-y-4">
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg font-light italic focus:outline-none focus:border-violet-neon/40"
              rows="3"
            />
            <div className="flex gap-3">
              <button 
                onClick={handleUpdate}
                className="flex items-center gap-2 px-6 py-3 bg-violet-neon text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                <Save size={14} /> Guardar
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-white/5 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          post.content && (
            <p className="text-xl font-light text-white/90 leading-relaxed italic border-l-2 border-violet-neon/20 pl-8">
              "{post.content}"
            </p>
          )
        )}
        
        {post.media_url && (
          <div className="rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-white/20 transition-all shadow-2xl">
            {post.media_type === 'image' ? (
              <img src={`http://localhost:3000${post.media_url}`} className="w-full h-auto opacity-90 group-hover:opacity-100 transition-all duration-700" alt="Post" />
            ) : (
              <video src={`http://localhost:3000${post.media_url}`} controls className="w-full h-auto" />
            )}
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="flex items-center gap-10 pt-6 border-t border-white/5">
        <button 
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-3 transition-all group ${isLiking ? 'opacity-50' : ''} hover:scale-110`}
        >
          <Heart 
            size={20} 
            className={post.liked ? "text-red-500" : "text-gray-500 group-hover:text-red-500"} 
            fill={post.liked ? "currentColor" : "none"} 
          />
          <span className={`text-[11px] font-black tracking-widest ${post.liked ? "text-red-500" : "text-gray-500"}`}>
            {post.likes_count}
          </span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-3 text-gray-500 hover:text-white transition-all group hover:scale-110"
        >
          <MessageCircle size={20} className="group-hover:text-violet-neon" />
          <span className="text-[11px] font-black tracking-widest group-hover:text-violet-neon">
            {post.comments_count}
          </span>
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-6 space-y-6"
          >
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map(c => (
                <div key={c.id} className="bg-white/5 p-4 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-violet-neon uppercase tracking-widest">{c.nickname}</p>
                  <p className="text-xs text-white/80 font-medium">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && <p className="text-[10px] text-gray-600 text-center italic">Sé el primero en apoyar...</p>}
            </div>

            <form onSubmit={handleAddComment} className="relative flex items-center gap-3 pt-4">
               <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un mensaje de apoyo..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-xs text-white focus:outline-none focus:border-violet-neon/50 transition-all"
               />
               <button type="submit" className="p-3 bg-violet-neon text-white rounded-xl hover:scale-105 transition-all">
                  <Send size={16} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Community = () => {
  const [newPostContent, setNewPostContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const fileInputRef = useRef(null);

  const loadFeed = async () => {
    console.log("🔍 Intentando cargar el feed de comunidad...");
    try {
      const data = await api.getCommunityFeed();
      console.log("✅ Feed recibido:", data);
      setPosts(data || []);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error al cargar el feed:", err);
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const data = await api.getProfile();
      console.log('👤 Perfil cargado:', data);
      setCurrentUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log("🚀 Componente Comunidad montado");
    loadFeed();
    loadUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !mediaFile) return;
    
    const formData = new FormData();
    formData.append('content', newPostContent);
    if (mediaFile) formData.append('media', mediaFile);

    try {
      await api.createPost(formData);
      setNewPostContent('');
      setMediaFile(null);
      setMediaPreview(null);
      loadFeed();
    } catch (err) {
      console.error(err);
      alert("Error al publicar en el Santuario.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-32">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 text-violet-neon/40 mb-2">
          <Radio size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em]">Ecosistema Social Activo</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Comunidad</h1>
      </header>

      {/* ── CREATE POST ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`glass-card bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden transition-all duration-700 ${!currentUser?.is_active && 'opacity-40 grayscale pointer-events-none'}`}
      >
        {!currentUser?.is_active && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-10 text-center space-y-4 pointer-events-auto">
             <Radio size={32} className="text-violet-neon animate-pulse" />
             <p className="text-sm font-black uppercase tracking-widest text-white">Estás en Modo Incógnito</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Activa tu estado en el Dashboard para participar</p>
          </div>
        )}
        <div className="flex gap-6">
          <div className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 font-black text-xl italic">
            {currentUser?.nickname?.[0] || 'ME'}
          </div>
          <textarea 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Comparte tu luz, un logro o un pensamiento..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-700 resize-none py-2 text-xl font-light italic"
            rows="3"
          />
        </div>

        {mediaPreview && (
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 max-h-80">
            <button 
              onClick={() => { setMediaFile(null); setMediaPreview(null); }}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full z-10 hover:bg-black transition-colors"
            >
              <X size={16} />
            </button>
            {mediaFile?.type.startsWith('image') ? (
              <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <video src={mediaPreview} className="w-full h-full object-cover" />
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-4">
            <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" />
            <button onClick={() => fileInputRef.current.click()} className="p-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-violet-neon/10 hover:text-violet-neon transition-all">
              <ImageIcon size={22} />
            </button>
            <button onClick={() => fileInputRef.current.click()} className="p-4 bg-white/5 text-gray-400 rounded-2xl hover:bg-violet-neon/10 hover:text-violet-neon transition-all">
              <Video size={22} />
            </button>
          </div>

          <button 
            onClick={handleCreatePost}
            disabled={(!newPostContent.trim() && !mediaFile)}
            className="flex items-center gap-4 px-10 py-5 bg-white text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-violet-neon hover:text-white transition-all disabled:opacity-10 shadow-xl"
          >
            Publicar <Send size={14} />
          </button>
        </div>
      </motion.div>

      {/* ── FEED ── */}
      <div className="space-y-10">
        {loading ? (
          <div className="text-center py-20">
             <div className="w-12 h-12 border-4 border-violet-neon/30 border-t-violet-neon rounded-full animate-spin mx-auto mb-4" />
             <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sincronizando Feed...</p>
          </div>
        ) : (
          <AnimatePresence>
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onRefresh={loadFeed} 
                currentUserId={currentUser?.user_id || currentUser?.id}
                currentUserNickname={currentUser?.nickname}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Community;
