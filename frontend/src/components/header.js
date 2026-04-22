import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
import { Menu, Bell, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const location = useLocation();

  // Read real user data from localStorage (set during login)
  const [userData, setUserData] = useState({ name: 'User', role: 'Student' });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const name = parsed.firstName
          ? `${parsed.firstName}${parsed.lastName ? ' ' + parsed.lastName : ''}`
          : parsed.username || parsed.name || parsed.fullName || 'User';
        const role = parsed.role || parsed.type || parsed.userType || 'Student';
        setUserData({ name, role: role.charAt(0).toUpperCase() + role.slice(1) });
      } else {
        // Fallback to individual localStorage keys
        const fullName = localStorage.getItem('fullName') || 'User';
        const roleLabel = localStorage.getItem('userType') || 'Student';
        setUserData({ name: fullName, role: roleLabel });
      }
    } catch (e) {
      console.error('Failed to parse user data:', e);
    }
  }, []);

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
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-black text-white shadow-md">
              CB
            </div>
            <span className="text-[13px] lg:text-[15px] font-extrabold text-white tracking-tight">
              Career<span className="text-sky-300">Bridge</span>
            </span>
          </div>
        </div>
      </div>

      <div className="header-right">

          <button className="header-action-btn">
            <Bell size={18} strokeWidth={2.5} />
            <div className="header-action-dot"></div>
          </button>

          <Link to="/student/profile" className="header-user-btn" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="header-user-info">
              <span className="header-user-name">{userData.name}</span>
              <span className="header-user-role">{userData.role}</span>
            </div>
            <div className="header-user-avatar">
              <User size={18} strokeWidth={2.5} />
            </div>
          </Link>
        </div>
    </header>
  );
};

export default Header;