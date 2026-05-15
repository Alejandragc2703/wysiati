import React from 'react';
import { Home, MessageCircle, Calendar, BookOpen, Activity, Settings, Leaf, Brain } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Home' },
    { icon: MessageCircle, path: '/sessions', label: 'Sesiones' },
    { icon: Calendar, path: '/history', label: 'Historial' },
    { icon: BookOpen, path: '/journal', label: 'Diario' },
    { icon: Activity,  path: '/courses',   label: 'Academia' },
    { icon: MessageCircle, path: '/community', label: 'Comunidad' },
    { icon: Leaf,      path: '/fortaleza', label: 'Fortaleza' },
    { icon: Settings,  path: '/profile',   label: 'Perfil' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-neon/30 flex flex-row">
      
      {/* ── SIDEBAR VERTICAL EXPANDIBLE ── */}
      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`fixed left-0 top-0 h-screen bg-white/[0.01] border-r border-white/5 backdrop-blur-3xl flex flex-col py-12 px-6 z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-24'}`}
      >
        <Link 
          to="/dashboard"
          className={`flex items-center gap-4 mb-16 transition-all duration-300 hover:opacity-70 ${isExpanded ? 'px-2' : 'justify-center'}`}
        >
          <div className="w-10 h-10 bg-violet-neon/10 rounded-2xl flex items-center justify-center border border-violet-neon/20 shrink-0">
            <Brain size={20} className="text-violet-neon" />
          </div>
          <span className={`font-black uppercase tracking-[0.4em] text-sm overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            WYSIATI
          </span>
        </Link>

        <nav className="flex flex-col gap-8">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`relative group flex items-center gap-5 transition-all duration-300 ${
                  isActive ? 'text-violet-neon' : 'text-gray-600 hover:text-white'
                } ${isExpanded ? 'px-2' : 'justify-center'}`}
              >
                <item.icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : ''
                  }`}
                />
                
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 whitespace-nowrap ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -right-6 w-1.5 h-1.5 bg-violet-neon rounded-full shadow-[0_0_10px_#8b5cf6]" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* ── ÁREA DE CONTENIDO DINÁMICO ── */}
      <main className="flex-1 px-8 lg:px-14 py-12 overflow-x-hidden ml-24 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;