import React, { useState } from 'react';
import Login from './pages/login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgotpassword';
import Feedback from './pages/feedback';
import Profile from './pages/profile';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  
  // Shared state to simulate a backend database for the presentation
  const [mockUser, setMockUser] = useState({
    firstName: 'Student',
    lastName: 'Example',
    email: 'student@example.edu',
    username: 'student',
    password: '1234',
    university: 'Example University',
    degree: 'BSc Computer Science',
    bio: 'I am a third-year computer science student looking for a software engineering internship. I love solving problems and building modern web applications.',
    cvName: null
  });

  const renderPage = () => {
    if (currentPage === 'login') {
      return <Login onNavigate={setCurrentPage} mockUser={mockUser} />;
    } else if (currentPage === 'signup') {
      return <Signup onNavigate={setCurrentPage} setMockUser={setMockUser} />;
    } else if (currentPage === 'forgotpassword') {
      return <ForgotPassword onNavigate={setCurrentPage} />;
    } else if (currentPage === 'feedback') {
      return <Feedback onNavigate={setCurrentPage} />;
    } else if (currentPage === 'profile') {
      return <Profile onNavigate={setCurrentPage} userData={mockUser} setUserData={setMockUser} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
