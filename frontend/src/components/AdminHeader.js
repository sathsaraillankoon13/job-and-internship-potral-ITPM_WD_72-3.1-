import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ isMinimized, toggleSidebar, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between border-b border-blue-300/50 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 px-4 shadow-[0_8px_22px_rgba(30,64,175,0.28)] backdrop-blur lg:px-8">
      
        <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button 
          type="button" 
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/35 bg-white/15 text-white transition-colors"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Toggle sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <h1 className="font-['Sora'] text-lg font-extrabold tracking-tight text-white lg:text-xl">CareerBridge Admin Dashboard</h1>
          <p className="hidden text-xs text-blue-100/90 sm:block">Monitor and manage the CareerBridge platform</p>
        </div>
      </div>

      <div className="flex items-center gap-x-2 lg:gap-x-4">
        <button type="button" className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/35 bg-white/15 text-lg text-white">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-blue-300/30" aria-hidden="true" />

        <div className="flex items-center gap-x-4">
          <span className="hidden lg:flex lg:items-center">
            <span className="text-sm font-bold text-white px-2" aria-hidden="true">System Admin</span>
          </span>
          <button
             onClick={() => {
              if(onLogout) onLogout();
              else {
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                navigate('/login');
              }
             }}
             className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-blue-700 shadow-[0_8px_20px_rgba(15,23,42,0.2)] transition hover:bg-blue-50 sm:px-4 sm:text-sm flex items-center gap-2"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
