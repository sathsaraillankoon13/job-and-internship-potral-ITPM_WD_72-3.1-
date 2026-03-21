import React, { useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgotpassword';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const renderPage = () => {
    if (currentPage === 'login') {
      return <Login onNavigate={setCurrentPage} />;
    } else if (currentPage === 'signup') {
      return <Signup onNavigate={setCurrentPage} />;
    } else if (currentPage === 'forgotpassword') {
      return <ForgotPassword onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
