import React, { useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgotpassword';
import Feedback from './pages/feedback';
import Profile from './pages/profile';

// Recruitment Management pages
import Dashboard from './pages/recruitmentdashboard';
import ApplicationManagement from './pages/application management';
import CandidateShortlisting from './pages/candidateshortlisting';
import InterviewScheduling from './pages/interviewscheduling';
import Setting from './pages/setting';
import HelpCenter from './pages/helpcenter';

// Admin pages
import AdminDashboard from './pages/adminDashboard';

import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  // Current page state
  const [currentPage, setCurrentPage] = useState('login');

  // Logged-in user/session state
  const [loggedUser, setLoggedUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleSetUser = (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setLoggedUser(user);
  };

  const handleLogout = () => {
    handleSetUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      // Auth pages
      case 'login':
        return <Login onNavigate={setCurrentPage} setLoggedUser={handleSetUser} />;
      case 'signup':
        return <Signup onNavigate={setCurrentPage} setLoggedUser={handleSetUser} />;
      case 'forgotpassword':
        return <ForgotPassword onNavigate={setCurrentPage} />;

      // Feedback/Profile pages
      case 'feedback':
        return <Feedback onNavigate={setCurrentPage} userData={loggedUser} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} userData={loggedUser} setUserData={handleSetUser} />;

      // Recruitment management pages
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} onNavigate={setCurrentPage} />;
      case 'applications':
        return <ApplicationManagement onLogout={handleLogout} onNavigate={setCurrentPage} />;
      case 'shortlisting':
        return <CandidateShortlisting onLogout={handleLogout} onNavigate={setCurrentPage} />;
      case 'interviews':
        return <InterviewScheduling onLogout={handleLogout} onNavigate={setCurrentPage} />;
      case 'settings':
        return <Setting onLogout={handleLogout} onNavigate={setCurrentPage} />;
      case 'help':
        return <HelpCenter onLogout={handleLogout} onNavigate={setCurrentPage} />;

      // Admin dashboard
      case 'admindashboard':
        return <AdminDashboard onLogout={handleLogout} onNavigate={setCurrentPage} />;

      default:
        return <Login onNavigate={setCurrentPage} setLoggedUser={handleSetUser} />;
    }
  };

  // Pages that should be wrapped in MainLayout
  const isInternalPage = [
    'dashboard', 'applications', 'shortlisting', 'interviews', 'settings', 'help',
    'profile', 'feedback', 'admindashboard'
  ].includes(currentPage);

  const pageContent = renderPage();

  return (
    <div className="App">
      {isInternalPage ? (
        <MainLayout currentPage={currentPage} onNavigate={setCurrentPage} userData={loggedUser} onLogout={handleLogout}>
          {pageContent}
        </MainLayout>
      ) : (
        pageContent
      )}
    </div>
  );
}

export default App;