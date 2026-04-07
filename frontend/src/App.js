import './App.css';
import React, { useState } from 'react';
import Footer from './components/footer.js';
import Header from './components/header.js';
import Sidebar from './components/Sidebar.js';

import { Routes, Route, useLocation } from 'react-router-dom';
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
import Login from './pages/Login.js';
import Register from './pages/Register.js';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 selection:bg-blue-200 selection:text-blue-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 w-full flex flex-col pt-0 overflow-y-auto">
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<UserDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/QuestionBank" element={<QuestionBank />} />
              <Route path="/SystemAnalytics" element={<SystemAnalytics />} />
              <Route path="/CareerSetup" element={<CareerSetup />} />
              <Route path="/skill-selection" element={<SkillSelection />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/assessment" element={<SkillsAssessment />} />
              <Route path="/assessment-results" element={<AssessmentResults />} />
              <Route path="/assessment-history" element={<AssessmentHistory />} />
              <Route path="/recommendations" element={<SmartRecommendations />} />
              <Route path="/feedback" element={<InterviewFeedback />} />
              <Route path="/ai-assistant" element={<AICareerAssistant />} />
              <Route path="/question-card" element={<QuestionCard />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;
