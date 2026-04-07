import React, { useState, useEffect } from 'react';
import {
  History, Calendar, Trophy, ArrowRight, Search,
  RotateCcw, Download, Filter, BrainCircuit,
  CheckCircle2, XCircle, Clock, ChevronRight,
  AlertCircle, Loader2, Video
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/AssessmentHistory.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const AssessmentHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('assessments'); // 'assessments', 'interviews'
  const [searchTerm, setSearchTerm] = useState('');
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = localStorage.getItem('userId') || 'guest_user';

        const [assessResult, interviewResult] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/questions/history/${userId}`),
          axios.get(`${API_BASE_URL}/api/interview/history/${userId}`)
        ]);

        const assessmentData =
          assessResult.status === 'fulfilled' && Array.isArray(assessResult.value?.data)
            ? assessResult.value.data
            : [];
        const interviewData =
          interviewResult.status === 'fulfilled' && Array.isArray(interviewResult.value?.data)
            ? interviewResult.value.data
            : [];

        setAssessmentHistory(assessmentData);
        setInterviewHistory(interviewData);

        if (assessResult.status === 'rejected' && interviewResult.status === 'rejected') {
          setError('Failed to load your history. Please make sure backend is running and try again.');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load your history. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const historyData = activeTab === 'assessments' ? assessmentHistory : interviewHistory;

  const filteredData = historyData
    .filter(item => {
      const title = activeTab === 'assessments' ? item.quizTitle : `${item.pathway || item.skill} ${item.type}`;
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'percentage') {
        const valA = activeTab === 'assessments' ? a.percentage : a.overallScore * 10;
        const valB = activeTab === 'assessments' ? b.percentage : b.overallScore * 10;
        return valB - valA;
      }
      return new Date(b.date) - new Date(a.date);
    });

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#D0E7FF]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="inner-tabs-wrapper">
        <div className="inner-tabs-content">
          {[
            { name: 'Assessments', id: 'assessments' },
            { name: 'Mock Interviews', id: 'interviews' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inner-tab ${activeTab === tab.id ? 'inner-tab-active' : 'inner-tab-inactive'}`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="history-layout">
        <div className="history-header">
          <div>
            <span className="history-badge">
              <History size={14} className="text-blue-500" />
              {activeTab === 'assessments' ? 'Assessment Records' : 'Mock Interview Results'}
            </span>
            <h1 className="history-title">{activeTab === 'assessments' ? 'Assessment History' : 'Interview History'}</h1>
            <p className="history-description">
              {activeTab === 'assessments' 
                ? "Review your past performance, track your learning journey, and identify patterns in your career preparation."
                : "Track your growth in technical communication and response quality through AI-evaluated interview sessions."}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder={activeTab === 'assessments' ? "Search assessments..." : "Search pathways..."}
                className="history-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="history-filter-btn"
              onClick={() => setSortBy(sortBy === 'newest' ? 'percentage' : 'newest')}
              title={`Sort by ${sortBy === 'newest' ? 'Performance' : 'Date'}`}
            >
              <Filter size={20} strokeWidth={2.5} className={sortBy === 'percentage' ? 'text-blue-600' : ''} />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4 text-rose-700 mb-8">
            <AlertCircle />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!error && filteredData.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl border border-slate-100">
             <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
               <BrainCircuit size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No Records Found</h3>
             <p className="text-slate-500 mb-8">
               {searchTerm ? `No results matching "${searchTerm}"` : `You haven't completed any ${activeTab} yet.`}
             </p>
             {!searchTerm && activeTab === 'assessments' && (
               <button 
                 onClick={() => navigate('/skill-selection')} 
                 className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
               >
                 Take an Assessment
               </button>
             )}
             {!searchTerm && activeTab === 'interviews' && (
               <button 
                 onClick={() => navigate('/mock-interview')} 
                 className="px-8 py-4 bg-[#0238AD] text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
               >
                 Start AI Interview
               </button>
             )}
          </div>
        )}

        <div className="history-list-section">
          {filteredData.map((item) => (
            <div key={item._id} className="history-card group">
              <div className="history-card-info">
                <div className={`history-icon-box ${activeTab === 'interviews' ? 'bg-[#0238AD] text-white' : ''}`}>
                  {activeTab === 'assessments' ? <BrainCircuit size={28} strokeWidth={2.5} /> : <Video size={28} strokeWidth={2.5} />}
                </div>

                <div className="history-card-text">
                  <h3 className="history-card-title">
                    {activeTab === 'assessments' ? item.quizTitle : `${item.pathway || item.skill} - ${item.type}`}
                  </h3>
                  <div className="history-card-meta">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(item.date)}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {activeTab === 'assessments' ? item.timeTaken : '20-30 mins'}
                    </span>
                    {activeTab === 'assessments' && (
                      <>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className={`history-status-badge ${item.status === 'Passed' ? 'status-passed' : 'status-failed'}`}>
                          {item.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="history-card-stats">
                <div className="history-stat-item">
                  <span className="history-stat-label">{activeTab === 'assessments' ? 'Level' : 'AI Rating'}</span>
                  <span className="history-stat-value">{activeTab === 'assessments' ? item.difficulty : `${item.overallScore}/10`}</span>
                </div>
                <div className="history-stat-item">
                  <span className="history-stat-label">Performance</span>
                  <span className={`history-stat-value ${activeTab === 'assessments' && item.status === 'Failed' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {activeTab === 'assessments' ? `${item.percentage}%` : `${(item.overallScore * 10)}%`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (activeTab === 'assessments') {
                    navigate('/assessment-results', { 
                      state: { questions: item.questions, selectedAnswers: item.selectedAnswers, score: item.score, totalQuestions: item.totalQuestions, quizTitle: item.quizTitle } 
                    });
                  } else {
                    // Navigate to mock interview result summary page
                    navigate('/mock-interview', { state: { evaluation: item } });
                  }
                }}
                className="view-results-btn"
              >
                View Details
                <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentHistory;
