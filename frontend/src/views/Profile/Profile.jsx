import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Calendar, Camera, ShieldCheck, LogOut, ChevronRight, Zap, Target, BarChart3, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const PerformanceCircle = ({ label, value, color }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 bg-white/[0.02] p-6 rounded-3xl border border-white/5 flex-1 min-w-[120px]">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
          <circle 
            cx="40" cy="40" r={radius} 
            stroke={color} 
            strokeWidth="4" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            fill="transparent" 
            className="transition-all duration-1000 ease-out" 
          />
        </svg>
        <span className="absolute text-sm font-black text-white">{value}%</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{label}</span>
    </div>
  );
};

const Profile = () => {
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1287&auto=format&fit=crop");
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("Cargando...");
  const [loading, setLoading] = useState(true);

  // Cargar perfil al entrar
  useEffect(() => {
    api.getProfile()
      .then(res => {
        setNickname(res.nickname || "Viajero");
        setLoading(false);
      })
      .catch(() => {
        setNickname(localStorage.getItem('wysiati_nickname') || "Viajero");
        setLoading(false);
      });
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('wysiati_token');
    window.location.href = '/'; 
  };

  const saveNickname = async () => {
    try {
      await api.updateProfile({ nickname });
      localStorage.setItem('wysiati_nickname', nickname);
      setIsEditing(false);
    } catch (error) {
      alert("Error al sincronizar con el Santuario.");
    }
  };

  const userData = {
    email: "adrian@wysiati.com",
    joinedDate: "12 Mayo 2026",
    level: 74,
    stats: [
      { label: "Enfoque", value: 85, color: "#8b5cf6" },
      { label: "Resiliencia", value: 92, color: "#06b6d4" },
      { label: "Consistencia", value: 78, color: "#facc15" }
    ]
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-24 max-w-7xl mx-auto text-white">
      
      <header className="relative bg-[#0b0e14] p-12 lg:p-16 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center gap-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,_rgba(139,92,246,0.05)_0%,_transparent_50%)]" />
        
        <div className="relative shrink-0 group">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-black p-1 bg-gradient-to-br from-violet-600/20 to-transparent relative shadow-2xl">
            <img src={profileImage} alt="Elite Member" className="w-full h-full object-cover rounded-full" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Camera size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-10 z-10 w-full">
          <div className="text-center lg:text-left space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 text-violet-neon mb-2">
               <Zap size={16} fill="currentColor" />
               <span className="text-[10px] uppercase font-black tracking-[0.5em]">Elite Member Lvl.{userData.level}</span>
            </div>
            
            <div className="space-y-2">
              {isEditing ? (
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-white/5 border-b-2 border-violet-neon text-4xl lg:text-5xl font-black text-white italic uppercase focus:outline-none w-full max-w-md px-2"
                    autoFocus
                  />
                  <button 
                    onClick={saveNickname}
                    className="bg-violet-neon text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <h1 
                  onClick={() => setIsEditing(true)}
                  className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic cursor-pointer hover:text-violet-neon transition-colors"
                >
                  {nickname}
                </h1>
              )}
            </div>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Digital-Auth: {userData.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userData.stats.map((stat, i) => (
              <PerformanceCircle key={i} {...stat} />
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] space-y-10 shadow-xl">
           <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] flex items-center gap-4">
             <ShieldCheck size={18} /> Seguridad de Cuenta
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Mail size={14} /> Registro Principal</label>
                 <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white font-medium text-sm">{userData.email}</div>
              </div>
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} /> Sincronizado Desde</label>
                 <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-white font-medium text-sm">{userData.joinedDate}</div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-between p-8 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-red-500/10 hover:border-red-500/20 group transition-all"
           >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <LogOut size={20} className="text-red-500" />
                 </div>
                 <span className="text-xs font-black text-white/50 group-hover:text-red-500 uppercase tracking-widest transition-colors">Finalizar Sesión</span>
              </div>
              <ChevronRight size={20} className="text-white/10 group-hover:text-red-500/40" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
