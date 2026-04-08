import React, { useState, useEffect } from 'react';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// CareerBridge Main Pages
import HomePage from './pages/HomePage';
import Opportunities from './pages/opportunities';
import Categories from './pages/categories';
import About from './pages/about';
import Contact from './pages/contact';
import ApplicationPage from './pages/application';

import JobInternshipDashboardPage from './pages/Job-internship-Dashboard';
import PostJobPage from './pages/post-job';
import ManageJobPostsPage from './pages/manage-job-posts';
import AnalyticsPage from './pages/analytics';
import { EmployerJobsProvider } from './context/EmployerJobsContext';
import './styles/App.css';

// Original Auth & Profile
import Login from './pages/Login';
import Signup from './pages/signup';
import ForgotPassword from './pages/forgotpassword';
import Feedback from './pages/feedback';
import Profile from './pages/profile';

// Recruitment Management
import Dashboard from './pages/recruitmentdashboard';
import ApplicationManagement from './pages/application management';
import CandidateShortlisting from './pages/candidateshortlisting';
import InterviewScheduling from './pages/interviewscheduling';
import Setting from './pages/setting';
import HelpCenter from './pages/helpcenter';

// Admin Dashboard
import AdminDashboard from './pages/adminDashboard';

// Layouts
import MainLayout from './components/MainLayout';
import Footer from './components/footer.js';
import Header from './components/header.js';
import Sidebar from './components/Sidebar.js';

// Smart Career Preparation Modules
import UserDashboard from './pages/UserDashboard.js';
import QuestionBank from './pages/QuestionBank.js';
import SystemAnalytics from './pages/SystemAnalytics.js';
import CareerSetup from './pages/CareerSetup.js';
import SkillSelection from './pages/SkillSelection.js';
import SkillsAssessment from './pages/SkillsAssessment.js';
import AssessmentResults from './pages/AssessmentResults.js';
import AssessmentHistory from './pages/AssessmentHistory.js';
import SmartRecommendations from './pages/SmartRecommendations.js';
import MockInterview from './pages/MockInterview.js';
import InterviewFeedback from "./pages/InterviewFeedback";
import AICareerAssistant from "./pages/AICareerAssistant";
import QuestionCard from './pages/QuestionCard.js';
import Register from './pages/Register.js';

function App() {
  const [currentPage, setCurrentPage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page) => {
    if (page === 'home') {
      setCurrentPage(null);
      navigate('/');
      return;
    }
    if (typeof page === 'string' && (page.startsWith('/') || page.includes('/'))) {
      setCurrentPage(null);
      const target = page.startsWith('/') ? page : `/${page}`;
      navigate(target);
      return;
    }
    setCurrentPage(page);
    if (page !== null && location.pathname !== '/') {
      navigate('/');
    }
  };

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
    handleNavigate('login');
  };

  useEffect(() => {
    const onCustomNavigate = (e) => {
      handleNavigate(e.detail);
    };
    window.addEventListener("careerbridge:navigate", onCustomNavigate);
    return () => window.removeEventListener("careerbridge:navigate", onCustomNavigate);
  }, []);

  const renderPage = () => {

    switch (currentPage) {
      case 'login': return <Login onNavigate={handleNavigate} setLoggedUser={handleSetUser} />;
      case 'signup': return <Signup onNavigate={handleNavigate} setLoggedUser={handleSetUser} />;
      case 'forgotpassword': return <ForgotPassword onNavigate={handleNavigate} />;
      case 'feedback': return <Feedback onNavigate={handleNavigate} userData={loggedUser} />;
      case 'profile': return <Profile onNavigate={handleNavigate} userData={loggedUser} setUserData={handleSetUser} />;
      case 'dashboard': return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'applications': return <ApplicationManagement onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'shortlisting': return <CandidateShortlisting onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'interviews': return <InterviewScheduling onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'settings': return <Setting onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'help': return <HelpCenter onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'admindashboard': return <AdminDashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
      default: return null;
    }
  };

  const isInternalPage = [
    'profile', 'feedback', 'admindashboard'
  ].includes(currentPage);

  const pageContent = renderPage();

  // If path starts with /student, wrap in sidebars
  if (location.pathname.startsWith('/student')) {
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50 selection:bg-blue-200 selection:text-blue-900">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <main className="flex-1 w-full flex flex-col pt-0 overflow-y-auto">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex-1">
              <Routes>
                <Route path="/student/dashboard" element={<UserDashboard />} />
                <Route path="/student/QuestionBank" element={<QuestionBank />} />
                <Route path="/student/SystemAnalytics" element={<SystemAnalytics />} />
                <Route path="/student/CareerSetup" element={<CareerSetup />} />
                <Route path="/student/skill-selection" element={<SkillSelection />} />
                <Route path="/student/mock-interview" element={<MockInterview />} />
                <Route path="/student/assessment" element={<SkillsAssessment />} />
                <Route path="/student/assessment-results" element={<AssessmentResults />} />
                <Route path="/student/assessment-history" element={<AssessmentHistory />} />
                <Route path="/student/recommendations" element={<SmartRecommendations />} />
                <Route path="/student/feedback" element={<InterviewFeedback />} />
                <Route path="/student/ai-assistant" element={<AICareerAssistant />} />
                <Route path="/student/question-card" element={<QuestionCard />} />
              </Routes>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <EmployerJobsProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={!currentPage ? (
              (loggedUser?.role === 'admin' || loggedUser?.type === 'admin') 
                ? <AdminDashboard onLogout={handleLogout} onNavigate={handleNavigate} />
                : <HomePage user={loggedUser} />
            ) : null} />

            <Route path="/login" element={<Login onNavigate={handleNavigate} setLoggedUser={handleSetUser} />} />
            <Route path="/opportunities" element={<Opportunities user={loggedUser} />} />
            <Route path="/categories" element={<Categories user={loggedUser} />} />
            <Route path="/about" element={<About user={loggedUser} />} />
            <Route path="/contact" element={<Contact user={loggedUser} />} />
            <Route path="/application" element={<ApplicationPage user={loggedUser} />} />


            <Route path="/employer/dashboard" element={<JobInternshipDashboardPage />} />
            <Route path="/recruitment-dashboard" element={<Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />} />
            <Route path="/employer/post-job" element={<PostJobPage />} />

            <Route path="/employer/manage-job-posts" element={<ManageJobPostsPage />} />
            <Route path="/employer/analytics" element={<AnalyticsPage />} />
            <Route path="/student-register" element={<Register />} />
          </Routes>
        </div>
      </EmployerJobsProvider>

      {/* Render the legacy state-based pages only on root (when not hitting React Router routes above) */}
      {(location.pathname === '/' || pageContent) && (
        <div className="App">
          {isInternalPage ? (
            <MainLayout currentPage={currentPage} onNavigate={setCurrentPage} userData={loggedUser} onLogout={handleLogout}>
              {pageContent}
            </MainLayout>
          ) : (
            pageContent
          )}
        </div>
      )}
    </>
  );
}

export default App;