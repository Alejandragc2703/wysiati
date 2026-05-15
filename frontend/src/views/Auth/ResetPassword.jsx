import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        setStatus('loading');
        
        // Simulación de éxito por ahora
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => navigate('/'), 3000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.1)_0%,_transparent_70%)]" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-card bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 relative z-10 shadow-2xl"
            >
                <div className="text-center space-y-4 mb-10">
                    <div className="w-20 h-20 bg-violet-neon/10 rounded-3xl flex items-center justify-center border border-violet-neon/20 mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                        <Lock size={32} className="text-violet-neon" />
                    </div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Nueva Contraseña</h1>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Asegura tu acceso al Santuario</p>
                </div>

                {status === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6 py-8"
                    >
                        <div className="flex justify-center">
                            <CheckCircle2 size={48} className="text-green-400" />
                        </div>
                        <p className="text-white font-medium">¡Contraseña actualizada con éxito! Redirigiendo al login...</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Nueva Contraseña</label>
                            <input 
                                type="password" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-violet-neon/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Confirmar Contraseña</label>
                            <input 
                                type="password" required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-violet-neon/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            disabled={status === 'loading'}
                            className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-violet-neon hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group"
                        >
                            {status === 'loading' ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                )}

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-2">
                    <Shield size={12} className="text-gray-700" />
                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Seguridad Bio-Sync Activa</span>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
