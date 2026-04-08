import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Bell,
  User,
  ArrowRight,
  Rocket,
  Database,
  Calendar,
  Clipboard,
  Video,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Plus,
  Trophy,
  Star,
  Target,
  History,
  AlertCircle
} from 'lucide-react';

import '../styles/UserDashboard.css';
import ReadinessScoreCard from '../components/ReadinessScoreCard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const UserDashboard = () => {
  const [timelineItems, setTimelineItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const formatDate = (dateValue) => {
      if (!dateValue) return 'Recently';
      return new Date(dateValue).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const loadTimeline = async () => {
      try {
        const userId = localStorage.getItem('userId') || 'guest_user';

        const [assessmentResult, interviewResult, jobsResult] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/questions/history/${userId}`),
          axios.get(`${API_BASE_URL}/api/interview/history/${userId}`),
          axios.get(`${API_BASE_URL}/api/jobs/recommended`),
        ]);

        const assessmentHistory =
          assessmentResult.status === 'fulfilled' && Array.isArray(assessmentResult.value?.data)
            ? assessmentResult.value.data
            : [];

        const interviewHistory =
          interviewResult.status === 'fulfilled' && Array.isArray(interviewResult.value?.data)
            ? interviewResult.value.data
            : [];

        const recommendedJobs =
          jobsResult.status === 'fulfilled' && Array.isArray(jobsResult.value?.data?.data)
            ? jobsResult.value.data.data
            : [];

        const items = [];

        if (assessmentHistory.length > 0) {
          const latestAssessment = assessmentHistory[0];
          items.push({
            title: `Assessment: ${latestAssessment.quizTitle || 'Recent Assessment'}`,
            meta: `${formatDate(latestAssessment.date)} • ${latestAssessment.percentage || 0}% Score`,
            status: latestAssessment.status || 'Completed',
            icon: Calendar,
            color: '#2563eb',
          });
        }

        if (interviewHistory.length > 0) {
          const latestInterview = interviewHistory[0];
          items.push({
            title: `Interview: ${latestInterview.pathway || latestInterview.skill || 'Mock Session'}`,
            meta: `${formatDate(latestInterview.date)} • ${latestInterview.type || 'Technical'}`,
            status: 'Reviewed',
            icon: Video,
            color: '#4338ca',
          });
        }

        if (recommendedJobs.length > 0) {
          const topJob = recommendedJobs[0];
          items.push({
            title: `Recommended: ${topJob.title}`,
            meta: `${topJob.company} • ${topJob.location}`,
            status: 'Matched',
            icon: Target,
            color: '#059669',
          });
        }

        if (items.length === 0) {
          items.push(
            {
              title: 'Complete your first assessment',
              meta: 'Live timeline will appear after your first result is saved',
              status: 'Pending',
              icon: Trophy,
              color: '#2563eb',
            },
            {
              title: 'Start a mock interview',
              meta: 'Interview results will update this timeline automatically',
              status: 'Pending',
              icon: Video,
              color: '#4338ca',
            },
            {
              title: 'Open Smart Recommendations',
              meta: 'Matched jobs will appear here from the database',
              status: 'Pending',
              icon: Target,
              color: '#059669',
            }
          );
        }

        if (isMounted) {
          setTimelineItems(items.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load dashboard timeline:', error);
        if (isMounted) {
          setTimelineItems([
            {
              title: 'Unable to load live data',
              meta: 'Check whether the backend is running',
              status: 'Error',
              icon: AlertCircle,
              color: '#dc2626',
            },
          ]);
        }
      }
    };

    loadTimeline();
    const refreshTimer = setInterval(loadTimeline, 60000);

    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, []);

  return (
    <div className="dashboard-container">

      <div className="dashboard-content">
        {/* Isolated Dashboard Control Card */}
        <div className="dashboard-control-card">
          <div className="search-wrapper">
            <Search className="search-icon" size={14} strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search internships, skills, or mentors..."
              className="search-input"
            />
          </div>
        </div>

        {/* Welcome Section */}
          <div className="welcome-section">
          <div>
            <h2 className="welcome-title">Welcome back, Sathsara..</h2>
            <p className="welcome-subtitle">
              You are in the <span className="top-percent-badge">Top 5%</span> of computer science applicants this week.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/student/mock-interview">
              <button className="btn-primary-gradient">
                Start Practice Session Now
              </button>
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">

          {/* LEFT COLUMN - Stats & Profile */}
          <div className="column-left">

            {/* Profile Completion removed */}
            {/* Readiness Score */}
            <ReadinessScoreCard />

            {/* AI Chat Preview (moved under Readiness) */}
            <div className="mt-6">
              <div className="card-ai group p-4 rounded-md border border-slate-100 bg-white">
                <h3 className="section-title-large text-slate-900 mb-3">AI Assistant</h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">AI Career Assistant</p>
                    <p className="text-[12px] text-slate-500">Quick answers, roadmaps, and interview tips.</p>
                  </div>
                </div>
                <div className="chat-preview h-36 overflow-auto text-[13px] text-slate-600 mb-3 p-2 rounded-md bg-slate-50">
                  <p className="mb-2"><strong>You:</strong> Tell me about Technical Skills for backend</p>
                  <p className="mb-1"><strong>AI:</strong> Focus on system design, databases, API design — practice projects and algorithms.</p>
                </div>
                <div className="flex gap-2">
                  <Link to="/student/ai-assistant" className="flex-1">
                    <button className="btn-primary-gradient w-full">Open Chat</button>
                  </Link>
                  <Link to="/student/ai-assistant" className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <MessageSquare size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Matrix & Opportunities */}
          <div className="column-right">

            {/* Skill Matrix */}
            <div className="card-cyan group">
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-title-large text-white">Skill Matrix</h3>
                <Link to="/student/assessment" className="text-[11px] font-bold text-blue-600 flex items-center gap-1.5 hover:text-blue-700 transition-colors">
                  Take New Assessment <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  { name: 'Cloud Architecture', value: 94, color: 'bg-blue-600' },
                  { name: 'Algorithmic Logic', value: 88, color: 'bg-blue-500' },
                  { name: 'Data Engineering', value: 76, color: 'bg-blue-400' },
                  { name: 'UX Strategy', value: 62, color: 'bg-indigo-400' },
                ].map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[13px] font-bold text-white">{skill.name}</span>
                      <span className="text-[12px] font-bold text-blue-400">{skill.value}%</span>
                    </div>
                    <div className="skill-bar-bg">
                      <div
                        className={`${skill.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${skill.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Opportunities */}
            <div>
              <div className="flex justify-between items-center mb-5 pl-1">
                <h3 className="section-title-large text-slate-800">Curated Opportunities</h3>
                <Link to="/student/recommendations" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Card 1 */}
                <div className="card-job-blue group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                      <Rocket size={20} strokeWidth={2.5} />
                    </div>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                      New Match
                    </span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-900 mb-1 leading-tight">Junior DevOps Architect</h4>
                  <p className="text-[12px] text-slate-400 mb-4 font-medium">Stellar Systems • Remote</p>

                  <div className="flex gap-1.5 mb-6 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md text-[9px] font-bold">Kubernetes</span>
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md text-[9px] font-bold">AWS</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-blue-700 transition-all">
                      Apply Now
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600 transition-all">
                      <Bookmark size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Job Card 2 */}
                <div className="card-job-slate group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <Database size={20} strokeWidth={2.5} />
                    </div>
                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                      4 Days Left
                    </span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-900 mb-1 leading-tight">Backend Engineering Intern</h4>
                  <p className="text-[12px] text-slate-400 mb-4 font-medium">Apex Analytics • NY</p>

                  <div className="flex gap-1.5 mb-6 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md text-[9px] font-bold">Python</span>
                    <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md text-[9px] font-bold">PostgreSQL</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-900 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-blue-600 transition-all">
                      Apply Now
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600 transition-all">
                      <Bookmark size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
              {/* AI Assistant Quick Access */}
              <div className="mt-6">
                <div className="card-ai group p-5 rounded-md border border-slate-100 bg-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <MessageSquare size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1">AI Career Assistant</h4>
                      <p className="text-[12px] text-slate-400">Ask about skills, roadmaps, interview tips, or request a fast summary.</p>
                    </div>
                    <div>
                      <Link to="/student/ai-assistant">
                        <button className="btn-primary-gradient">Open Chat</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Timeline with AI Chat preview */}
            <div className="card-white flex-1 relative overflow-hidden">
              <div className="flex gap-6">
                

                {/* Right: Career Timeline */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="section-title-large text-slate-900">Career Timeline</h3>
                    <Link to="/student/assessment-history" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
                      View history
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="timeline-line"></div>
                    <div className="space-y-6">
                      {timelineItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 relative">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10 border shadow-sm"
                            style={{ backgroundColor: `${item.color}12`, color: item.color, borderColor: `${item.color}24` }}
                          >
                            <item.icon size={18} />
                          </div>
                          <div className="flex-1 bg-white/60 px-4 py-3 rounded-xl border border-blue-100 flex justify-between items-center transition-all hover:bg-white/80">
                            <div>
                              <h4 className="font-bold text-slate-900 text-[14px]">{item.title}</h4>
                              <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.meta}</p>
                            </div>
                            <span
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{ color: item.color, backgroundColor: `${item.color}12` }}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;