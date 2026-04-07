import React, { useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgotpassword';
import Feedback from './pages/feedback';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard';
import AdminDashboard from './pages/adminDashboard';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  
  // Session state to map to local storage
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

  const renderPage = () => {
    if (currentPage === 'login') {
      return <Login onNavigate={setCurrentPage} setLoggedUser={handleSetUser} />;
    } else if (currentPage === 'signup') {
      return <Signup onNavigate={setCurrentPage} setLoggedUser={handleSetUser} />;
    } else if (currentPage === 'forgotpassword') {
      return <ForgotPassword onNavigate={setCurrentPage} />;
    } else if (currentPage === 'feedback') {
      return <Feedback onNavigate={setCurrentPage} userData={loggedUser} />;
    } else if (currentPage === 'profile') {
      return <Profile onNavigate={setCurrentPage} userData={loggedUser} setUserData={handleSetUser} />;
    } else if (currentPage === 'dashboard') {
      return <Dashboard onNavigate={setCurrentPage} userData={loggedUser} />;
    } else if (currentPage === 'admindashboard') {
      return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  const isInternalPage = ['dashboard', 'profile', 'feedback', 'admindashboard'].includes(currentPage);
  const pageContent = renderPage();

  return (
    <div className="App">
      {isInternalPage ? (
        <MainLayout currentPage={currentPage} onNavigate={setCurrentPage} userData={loggedUser}>
          {pageContent}
        </MainLayout>
      ) : (
        pageContent
      )}
    </div>
  );
}

export default App;
