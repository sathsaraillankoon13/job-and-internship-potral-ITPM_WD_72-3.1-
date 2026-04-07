import React from 'react';
import {
  LayoutDashboard, Video, ClipboardCheck, Briefcase,
  BarChart3, Zap, X, LogOut, Sparkles, MessageSquare, History, Database
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

import logo from '../assets/logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userType = (localStorage.getItem('userType') || 'user').toLowerCase();

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    
    // Redirect to login page
    navigate('/login');
  };

  const menuGroups = [
    {
      title: "Home",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
      ]
    },
    {
      title: "Preparation",
      items: [
        { name: "Skill Assessment", icon: ClipboardCheck, path: "/skill-selection" },
        { name: "Mock Interview", icon: Video, path: "/mock-interview" },
        { name: "AI Assistant", icon: MessageSquare, path: "/ai-assistant" },
        { name: "History", icon: History, path: "/assessment-history" },
      ]
    },
    {
      title: "Opportunities",
      items: [
        { name: "Smart Recommendations", icon: Sparkles, path: "/recommendations" },
      ]
    },
    ...(userType === 'admin' ? [{
      title: "Administration",
      items: [
        { name: "Question Bank", icon: Database, path: "/QuestionBank" },
        { name: "System Analytics", icon: BarChart3, path: "/SystemAnalytics" },
      ]
    }] : []),
  ];

  return (
    <>
      {/* Sidebar Container */}
      <aside className={`sidebar-container ${!isOpen ? 'sidebar-collapsed' : ''}`}>

        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand group">
            <div className="sidebar-brand-icon">
              <img src={logo} alt="CareerBridge Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="sidebar-brand-text">CareerBridge</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="sidebar-close-btn"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
              <h3 className="sidebar-section-title">{group.title}</h3>
              <div className="space-y-1">
                {group.items.map((item, iIdx) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      className={`nav-item group ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                    >
                      <div className="nav-item-link">
                        <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                        <span>{item.name}</span>
                      </div>

                      {isActive && <div className="nav-item-active-dot" />}

                      {/* Hover effect highlight */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.03] transition-colors pointer-events-none" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card (Replacing logout for now to match my Sidebar.css layout) */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
