import React, { useState } from 'react';
import Login from './pages/login';
import Dashboard from './pages/recruitmentdashboard';
import ApplicationManagement from './pages/application management';
import CandidateShortlisting from './pages/candidateshortlisting';
import InterviewScheduling from './pages/interviewscheduling';
import Setting from './pages/setting';
import HelpCenter from './pages/helpcenter';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved !== null ? saved === 'true' : false; 
  });
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} onNavigate={setActivePage} />;
      case 'applications':
        return <ApplicationManagement onLogout={handleLogout} onNavigate={setActivePage} />;
      case 'shortlisting':
        return <CandidateShortlisting onLogout={handleLogout} onNavigate={setActivePage} />;
      case 'interviews':
        return <InterviewScheduling onLogout={handleLogout} onNavigate={setActivePage} />;
      case 'settings':
        return <Setting onLogout={handleLogout} onNavigate={setActivePage} />;
      case 'help':
        return <HelpCenter onLogout={handleLogout} onNavigate={setActivePage} />;
      default:
        return <Dashboard onLogout={handleLogout} onNavigate={setActivePage} />;
    }
  };

  return (
    <div>
      {isLoggedIn ? renderPage() : <Login onLoginSuccess={handleLogin} />}
    </div>
  );
}

export default App;
