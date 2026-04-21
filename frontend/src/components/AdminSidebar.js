import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  MessageSquare,
  Settings,
  HelpCircle,
  BookOpen,
  Database
} from 'lucide-react';

const AdminSidebar = ({ isMinimized }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', icon: BarChart3, path: '/admin/dashboard' },
    { label: 'Question Bank', icon: Database, path: '/student/QuestionBank' },
    { label: 'Manage Jobs', icon: Briefcase, path: '/employer/dashboard' },
    { label: 'Recruitment', icon: Users, path: '/recruitment-dashboard' },
    { label: 'Career Preparation', icon: BookOpen, path: '/student/dashboard' },
    { label: 'Feedbacks', icon: MessageSquare, path: '/admin/feedbacks' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isMinimized ? '80px' : '256px' }} // 256px = 64 tailwind width
      className="hidden lg:flex flex-col h-screen bg-gradient-to-b from-blue-900 to-blue-700 shadow-2xl relative z-50 shrink-0 overflow-y-auto overflow-x-hidden"
    >
      {/* Brand area */}
      <div className="flex h-[68px] shrink-0 items-center border-b border-white/15 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-skyBrand-500 to-skyBrand-900 text-base font-black text-white shadow-glow">
            CB
          </div>
          <motion.div 
            animate={{ opacity: isMinimized ? 0 : 1, display: isMinimized ? 'none' : 'block' }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-['Sora'] text-lg font-extrabold tracking-tight text-white whitespace-nowrap">
              Career<span className="text-sky-300">Bridge</span>
            </p>
            <p className="text-[11px] text-white/55">Admin Portal</p>
          </motion.div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col mt-6 px-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/admin/dashboard');
                
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`
                        w-full group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm transition relative
                        ${isActive 
                            ? 'bg-white/20 text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.2)] font-bold' 
                            : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'}
                      `}
                    >
                      {isActive && <span className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r bg-sky-300" />}
                      <item.icon 
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-sky-300' : 'text-white/70 group-hover:text-white'}`} 
                        aria-hidden="true" 
                      />
                      <motion.span
                        animate={{ opacity: isMinimized ? 0 : 1, display: isMinimized ? 'none' : 'block' }}
                        transition={{ duration: 0.2 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
          
          <li className="mt-auto mb-6">
            <button
               onClick={() => navigate('/help')}
               className="w-full group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium leading-6 text-white/70 hover:text-white hover:bg-white/10 transition-all"
             >
               <HelpCircle className="h-5 w-5 shrink-0 group-hover:text-white" aria-hidden="true" />
               <motion.span
                  animate={{ opacity: isMinimized ? 0 : 1, display: isMinimized ? 'none' : 'block' }}
                  transition={{ duration: 0.2 }}
                  className="truncate"
               >
                 Go to Help Center
               </motion.span>
             </button>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default AdminSidebar;
