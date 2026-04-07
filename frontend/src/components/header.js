import React from 'react';
import '../styles/Header.css';
import { Menu, Zap, Search, Bell, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const fullName = localStorage.getItem('fullName') || 'Sathsara';
  const roleLabel = localStorage.getItem('userType') || 'Student';

  return (
    <header className="header-container">
      <div className="header-left">
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle-btn"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>

        <div className="brand-wrapper group">
          <div className="flex flex-col lg:flex-row lg:items-center gap-0 lg:gap-3">
            <span className="text-[12px] lg:text-[14px] font-medium text-blue-100/80 tracking-wide">
              Smart Career Preparation
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">

          <button className="header-action-btn">
            <Bell size={18} strokeWidth={2.5} />
            <div className="header-action-dot"></div>
          </button>

          <div className="header-user-btn">
            <div className="header-user-info">
              <span className="header-user-name">{fullName}</span>
              <span className="header-user-role">{roleLabel}</span>
            </div>
            <div className="header-user-avatar">
              <User size={18} strokeWidth={2.5} />
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;