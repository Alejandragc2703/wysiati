import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  // Form states
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    try {
        localStorage.clear();
    } catch (e) {}
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage(null);
    
    try {
      if (isForgotPassword) {
        const data = await api.request('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        setAuthMessage({ text: data.message || 'Vínculo enviado ✉️', isError: false });
        setIsForgotPassword(false);
      } else if (isRegistering) {
        if (password !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
        }
        const data = await api.register(email, password, firstName, lastName);
        localStorage.setItem('wysiati_token', data.token);
        setAuthMessage({ text: '✅ Bienvenido al Santuario', isError: false });
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        const data = await api.login(identifier, password);
        localStorage.setItem('wysiati_token', data.token);
        setAuthMessage({ text: '🔱 Sincronización Exitosa', isError: false });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      setAuthMessage({ 
        text: error.error || error.message || 'Error de conexión',
        isError: true 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl"
           >
              <Fingerprint className="text-violet-neon" size={32} />
           </motion.div>
           <h1 className="text-white font-black text-4xl tracking-tighter mb-1 italic">WYSIATI</h1>
           <p className="text-gray-600 text-[9px] uppercase tracking-[0.4em] font-black">
             {isRegistering ? 'Crea tu Identidad Digital' : 'Acceso al Santuario'}
           </p>
        </div>

        {authMessage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className={`mb-6 p-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-center border ${
              authMessage.isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
            }`}
          >
            {authMessage.text}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div 
              key={isRegistering ? 'reg' : (isForgotPassword ? 'forgot' : 'log')}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {isRegistering ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                        type="text" required placeholder="Nombre" value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                    />
                    <input 
                        type="text" required placeholder="Apellidos" value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                    />
                  </div>
                  <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                  />
                  <input 
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                  />
                  <input 
                    type="password" required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repetir contraseña" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                  />
                </>
              ) : isForgotPassword ? (
                <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email de recuperación" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                />
              ) : (
                <>
                  <input 
                    type="text" required value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email o Nickname" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                  />
                  <input 
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña" 
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-violet-neon/40 transition-all backdrop-blur-md text-sm"
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <button 
            type="submit" disabled={loading}
            className="w-full group relative p-[1px] rounded-xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
          >
            <div className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative bg-white text-black rounded-[11px] py-4 flex items-center justify-center gap-3">
               {loading ? (
                 <Loader2 className="animate-spin" size={18} />
               ) : (
                 <>
                   <span className="font-black text-[10px] uppercase tracking-[0.3em]">
                     {isForgotPassword ? 'Enviar' : (isRegistering ? 'Crear Cuenta' : 'Acceder')}
                   </span>
                   <ArrowRight size={16} />
                 </>
               )}
            </div>
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setIsForgotPassword(false); setAuthMessage(null); }}
            className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
          >
            {isRegistering ? '¿Ya tienes cuenta? Entra' : '¿Eres nuevo? Regístrate'}
          </button>
          
          {!isRegistering && (
            <button 
              onClick={() => { setIsForgotPassword(!isForgotPassword); setAuthMessage(null); }}
              className="text-[9px] font-black uppercase tracking-widest text-violet-neon/40 hover:text-violet-neon transition-colors"
            >
              {isForgotPassword ? 'Volver' : '¿Olvidaste tu contraseña?'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
