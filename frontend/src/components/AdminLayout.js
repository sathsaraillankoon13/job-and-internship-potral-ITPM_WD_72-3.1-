import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children, onLogout }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="flex h-screen w-full bg-sky-100 overflow-hidden font-sans text-slate-900 selection:bg-[#0262BA]/20 selection:text-[#0262BA]">
      <AdminSidebar isMinimized={isMinimized} />
      
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
        <AdminHeader 
          isMinimized={isMinimized} 
          toggleSidebar={toggleSidebar} 
          onLogout={onLogout} 
        />
        
        <main className="flex-1 w-full flex flex-col overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
