import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainLayout.css';

function MainLayout({ children, onNavigate, userData, currentPage }) {
    const navigate = useNavigate();
    const userName = userData ? `${userData.firstName} ${userData.lastName}` : 'Admin User';
    
    // Quick helper to see if a link is active
    const isActive = (page) => currentPage === page ? 'active' : '';

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className="layout-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">🎓</div>
                    <div className="brand-text">
                        <h3>CampusBridge</h3>
                        <p>Management Portal</p>
                    </div>
                </div>

                <div className="sidebar-menu">
                    <p className="menu-label">MAIN</p>
                    <nav>
                        <button className={`menu-item ${isActive('admindashboard')}`} onClick={() => onNavigate('admindashboard')}>
                            <span className="icon">🏠</span>
                            <span>Dashboard</span>
                        </button>
                        <button className="menu-item" onClick={() => { onNavigate(null); navigate('/student/QuestionBank'); }}>
                            <span className="icon">🎯</span>
                            <span>Career Preparation</span>
                        </button>
                        <button className="menu-item" onClick={() => { onNavigate(null); navigate('/employer/dashboard'); }}>
                            <span className="icon">💼</span>
                            <span>Job & Internship</span>
                        </button>
                        <button className={`menu-item ${isActive('dashboard')}`} onClick={() => onNavigate('dashboard')}>
                            <span className="icon">👥</span>
                            <span>Recruitment</span>
                            <span className="badge">New</span>
                        </button>
                    </nav>

                    <p className="menu-label">ADMIN & USER</p>
                    <nav>
                        <button className={`menu-item ${isActive('admindashboard')}`} onClick={() => onNavigate('admindashboard')}>
                            <span className="icon">⚙️</span>
                            <span>Admin Options</span>
                        </button>
                        <button className={`menu-item ${isActive('profile')}`} onClick={() => onNavigate('profile')}>
                            <span className="icon">🧑‍🎓</span>
                            <span>Student Profile</span>
                        </button>
                        <button className={`menu-item ${isActive('feedback')}`} onClick={() => onNavigate('feedback')}>
                            <span className="icon">⭐</span>
                            <span>Feedback</span>
                        </button>
                    </nav>
                </div>

                <div className="sidebar-usercard">
                    <div className="user-avatar">
                        {userData ? userData.firstName.charAt(0) : 'A'}
                    </div>
                    <div className="user-info">
                        <h4>{userName.trim()}</h4>
                        <p>Portal Account</p>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <main className="layout-main">
                {/* Global Header */}
                <header className="layout-header">
                    <div className="header-breadcrumbs">
                        <span className="breadcrumb-text">Home</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-current">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</span>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn">🔔</button>
                        <div className="header-profile-shortcut" onClick={() => onNavigate('profile')}>
                            <div className="shortcut-avatar">
                                {userData ? userData.firstName.charAt(0) : 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="layout-content-scrollable">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default MainLayout;
