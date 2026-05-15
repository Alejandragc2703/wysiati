import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage(null);
    
    try {
      if (isForgotPassword) {
        // LLAMADA REAL AL BACKEND USANDO EL SERVICIO CENTRAL
        const data = await api.request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        setAuthMessage(data.message || 'Vínculo enviado');
        setIsForgotPassword(false);
      } else {
        // Simulación de login (puedes cambiarlo por llamada real después)
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (error) {
      setAuthMessage('Error en la conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Bio-Sync Aura */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[1000px] h-[1000px] bg-violet-600/20 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-xl"
           >
              <Fingerprint className="text-violet-neon" size={40} />
           </motion.div>
           <h1 className="text-white font-black text-4xl tracking-tighter mb-2 italic">WYSIATI</h1>
           <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] font-black">Bio-Sync Sanctuary</p>
        </div>

        {authMessage && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-violet-neon/10 border border-violet-neon/20 rounded-2xl text-[10px] font-black text-violet-neon uppercase tracking-widest text-center">
            {authMessage}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div 
              key={isRegistering ? 'reg' : (isForgotPassword ? 'forgot' : 'log')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-neon transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email del Santuario" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-14 py-5 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/50 transition-all backdrop-blur-md"
                />
              </div>

              {!isRegistering && !isForgotPassword && (
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-neon transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña Transmitida" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-14 py-5 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/50 transition-all backdrop-blur-md"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full group relative p-[1px] rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 animate-[shimmer_3s_infinite] opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#050505] rounded-[15px] py-5 flex items-center justify-center gap-4 border border-white/5">
               {loading ? (
                 <Loader2 className="animate-spin text-white" size={20} />
               ) : (
                 <>
                   <span className="text-white font-black text-xs uppercase tracking-[0.5em] italic">
                     {isForgotPassword ? 'Enviar Vínculo' : (isRegistering ? 'Generar Vínculo' : 'Acceder al Santuario')}
                   </span>
                   <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={18} />
                 </>
               )}
            </div>
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4 text-center">
          <button 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setIsForgotPassword(false);
              setAuthMessage(null);
            }}
            className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-violet-neon transition-colors"
          >
            {isRegistering ? '¿Ya tienes un vínculo? Entra aquí' : '¿Nuevo en el ecosistema? Crea tu cuenta'}
          </button>
          
          {!isRegistering && (
            <button 
              onClick={() => {
                setIsForgotPassword(!isForgotPassword);
                setAuthMessage(null);
              }}
              className="text-[9px] font-black uppercase tracking-widest text-violet-neon/40 hover:text-violet-neon transition-colors"
            >
              {isForgotPassword ? 'Volver al Login' : '¿Olvidaste tu contraseña?'}
            </button>
          )}
        </div>

        <p className="text-center mt-16 text-[9px] text-gray-800 font-black uppercase tracking-[0.4em]">
           Sincronización Biométrica Protegida
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default LoginScreen;
