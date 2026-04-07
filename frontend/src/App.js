import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Opportunities from './pages/opportunities';
import Categories from './pages/categories';
import About from './pages/about';
import Contact from './pages/contact';
import JobInternshipDashboardPage from './pages/Job-internship-Dashboard';
import PostJobPage from './pages/post-job';
import ManageJobPostsPage from './pages/manage-job-posts';
import AnalyticsPage from './pages/analytics';
import { EmployerJobsProvider } from './context/EmployerJobsContext';
import './styles/App.css';

function App() {
  return (
    <EmployerJobsProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/employer/dashboard" element={<JobInternshipDashboardPage />} />
          <Route path="/employer/post-job" element={<PostJobPage />} />
          <Route path="/employer/manage-job-posts" element={<ManageJobPostsPage />} />
          <Route path="/employer/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </EmployerJobsProvider>
  );
}

export default App;
