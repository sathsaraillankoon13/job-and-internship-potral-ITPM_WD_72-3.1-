import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  ArrowRight,
  Rocket,
  Calendar,
  Video,
  MessageSquare,
  Bookmark,
  Target,
  Trophy,
  TrendingUp,
  BrainCircuit,
  Lightbulb
} from 'lucide-react';

import '../styles/UserDashboard.css';
import ReadinessScoreCard from '../components/ReadinessScoreCard';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const UserDashboard = () => {
  const [timelineItems, setTimelineItems] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);
  const [skillMatrix, setSkillMatrix] = useState([]);
  const [userName, setUserName] = useState('Student');
  const [readinessData, setReadinessData] = useState({ skillScore: 0, interviewScore: 0, profileCompletion: 0 });
  const [loading, setLoading] = useState(true);

  // Derived State: Robust Recommendation Algorithm
  const recommendedJobs = useMemo(() => {
    if (!latestAssessment || latestAssessment.percentage < 70) return [];

    let testTopic = latestAssessment.quizTitle.replace(/ Assessment| Quiz| Test/gi, '').trim().toLowerCase();

    // HEAL: Strip anything before a colon
    if (testTopic.includes(':')) {
      testTopic = testTopic.split(':').pop().trim();
    }

    const testResult = {
      skill: testTopic,
      score: latestAssessment.percentage
    };

    return allJobs.filter(job => {
      // RULE B: Strict 'Scheduled' Blockade
      const lowerStatus = String(job.status || '').toLowerCase().trim();
      if (lowerStatus === 'scheduled' || lowerStatus === 'expired') return false;

      // RULE A: Skill-Exclusive Search 
      const keywordChain = [
        ...(job.requiredSkills || []),
        ...(job.required_skills || []),
        ...(job.skills || []),
        job.title || job.jobTitle || ""
      ].join(' ').toLowerCase();

      return keywordChain.includes(testResult.skill);
    }).map(job => ({
      ...job,
      compatibilityScore: Math.round((testResult.score * 0.8) + 20)
    })).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }, [allJobs, latestAssessment]);

  useEffect(() => {
    let isMounted = true;

    const formatDate = (dateValue) => {
      if (!dateValue) return 'Recently';
      return new Date(dateValue).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const loadDashboardData = async () => {
      try {
        // HEAL: Recover identity from local storage if userId is missing
        const userStr = localStorage.getItem('user');
        const userObj = userStr ? JSON.parse(userStr) : null;
        const userId = localStorage.getItem('userId') || userObj?.id || userObj?._id || userObj?.uid || 'guest_user';

        if (userObj) {
          const name = userObj.firstName || userObj.fullName || userObj.username || 'Student';
          setUserName(name);
        }

        const [assessmentResult, interviewResult] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/questions/history/${userId}`),
          axios.get(`${API_BASE_URL}/api/interview/history/${userId}`),
        ]);

        // FETCH JOBS: Use the consolidated recommendation endpoint
        let jobsData = [];
        try {
          const jobRes = await axios.get(`${API_BASE_URL}/api/recommendations/smart`, {
            params: { userId }
          });
          jobsData = jobRes.data.recommendedJobs || jobRes.data.jobs || [];
        } catch (err) {
          console.error('Initial Job Recommendation Fetch Failed:', err);
        }

        const assessmentHistory =
          assessmentResult.status === 'fulfilled' && Array.isArray(assessmentResult.value?.data)
            ? assessmentResult.value.data
            : [];

        const interviewHistory =
          interviewResult.status === 'fulfilled' && Array.isArray(interviewResult.value?.data)
            ? interviewResult.value.data
            : [];

        if (isMounted) {
          setAllJobs(jobsData);
          if (assessmentHistory.length > 0) {
            setLatestAssessment(assessmentHistory[0]);
          }

          // DYNAMIC SKILL MATRIX: Extract from history
          const scoresBySkill = {};
          assessmentHistory.forEach(a => {
            const skillName = (a.quizTitle || 'Skill').replace(/ Assessment| Quiz| Test/gi, '').trim();
            if (!scoresBySkill[skillName] || scoresBySkill[skillName] < a.percentage) {
              scoresBySkill[skillName] = a.percentage;
            }
          });

          const dynamicSkills = Object.keys(scoresBySkill).map((name, i) => ({
            name,
            value: scoresBySkill[name],
            color: i % 2 === 0 ? 'bg-white' : 'bg-white/80'
          })).slice(0, 4);

          if (dynamicSkills.length === 0) {
            dynamicSkills.push({ name: 'Take Assessment', value: 0, color: 'bg-white' });
          }
          setSkillMatrix(dynamicSkills);

          // Construct Timeline
          const items = [];
          if (assessmentHistory.length > 0) {
            const latest = assessmentHistory[0];
            items.push({
              title: `Assessment: ${latest.quizTitle}`,
              meta: `${formatDate(latest.date)} • ${latest.percentage}% Score`,
              status: 'Completed',
              icon: Calendar,
              color: '#2563eb',
            });
          }

          if (interviewHistory.length > 0) {
            const latest = interviewHistory[0];
            items.push({
              title: `Interview: ${latest.skill || 'Session'}`,
              meta: `${formatDate(latest.date)} • AI Evaluated`,
              status: 'Reviewed',
              icon: Video,
              color: '#4338ca',
            });
          }

          if (jobsData.length > 0) {
            const topJob = jobsData[0];
            items.push({
              title: `Recommended: ${topJob.title || topJob.jobTitle}`,
              meta: `${topJob.company} • ${topJob.location}`,
              status: 'Matched',
              icon: Target,
              color: '#059669',
            });
          }

          if (items.length === 0) {
            items.push({ title: 'Welcome!', meta: 'Start your journey today', status: 'Ready', icon: Trophy, color: '#2563eb' });
          }

          // CALCULATE READINESS: Real data
          const skillVal = assessmentHistory.length > 0 ? assessmentHistory[0].percentage : 0;
          const interviewVal = interviewHistory.length > 0 ? (interviewHistory[0].overallScore || 0) : 0;

          // Profile Completion Logic
          const profileFields = ['firstName', 'lastName', 'email', 'university', 'degree', 'bio', 'phoneNumber'];
          const completedFields = profileFields.filter(f => userObj && userObj[f] && String(userObj[f]).trim() !== '');
          const profileVal = Math.round((completedFields.length / profileFields.length) * 100);

          setReadinessData({
            skillScore: skillVal,
            interviewScore: interviewVal,
            profileCompletion: profileVal
          });

          setTimelineItems(items.slice(0, 3));
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center opacity-50">Loading your profile...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-control-card">
          <div className="search-wrapper">
            <Search className="search-icon" size={14} strokeWidth={2.5} />
            <input type="text" placeholder="Search internships, skills, or mentors..." className="search-input" />
          </div>
        </div>

        <div className="welcome-section">
          <div>
            <h2 className="welcome-title">Welcome back, {userName}..</h2>
            <p className="welcome-subtitle text-left">
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/student/mock-interview">
              <button className="btn-primary-gradient">Start Practice Session Now</button>
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="column-left">
            <ReadinessScoreCard data={readinessData} />
            <div className="mt-6">
              <div className="card-ai group p-4 rounded-md border border-slate-100 bg-white shadow-sm">
                <h3 className="section-title-large text-slate-900 mb-3 flex items-center gap-2">
                  <BrainCircuit size={18} className="text-blue-600" />
                  AI Assistant
                </h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 text-left">Career Guide</p>
                    <p className="text-[12px] text-slate-500 text-left text-left">Quick answers and roadmaps.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to="/student/ai-assistant" className="flex-1">
                    <button className="btn-primary-gradient w-full">Open Chat</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="column-right">
            <div className="card-cyan group mb-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="section-title-large text-white">Skill Matrix</h3>
                <Link to="/student/skill-selection" className="text-[11px] font-bold text-blue-100 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-white/20 transition-all">
                  Take New Assessment <ArrowRight size={14} strokeWidth={3} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {skillMatrix.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[13px] font-bold text-white">{skill.name}</span>
                      <span className="text-[12px] font-bold text-white/80">{skill.value}%</span>
                    </div>
                    <div className="skill-bar-bg bg-white/10 text-left">
                      <div className={`${skill.color} h-full rounded-full transition-all duration-500`} style={{ width: `${skill.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-5 pl-1">
                <h3 className="section-title-large text-slate-800">Curated Opportunities</h3>
                <Link
                  to="/student/recommendations"
                  state={{
                    homeJobs: allJobs,
                    latestResult: latestAssessment ? {
                      skill: latestAssessment.quizTitle.replace(/ Assessment| Quiz| Test/gi, '').trim(),
                      score: latestAssessment.percentage
                    } : null
                  }}
                  className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!latestAssessment || latestAssessment.percentage < 70 ? (
                  <div className="col-span-full bg-amber-50 border border-amber-100 rounded-2xl p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                      <Lightbulb size={24} />
                    </div>
                    <h4 className="text-amber-800 font-bold mb-1">Skill Improvement Needed</h4>
                    <p className="text-amber-600 text-[12px] max-w-xs">
                      Focus on strengthening your skills to unlock job recommendations.
                    </p>
                    <Link to="/student/skill-selection" className="mt-4 text-[13px] font-bold text-amber-700 underline">
                      Retake Skill Assessment
                    </Link>
                  </div>
                ) : recommendedJobs.length > 0 ? (
                  recommendedJobs.slice(0, 2).map((job, idx) => (
                    <div key={job._id || idx} className="card-job-blue group">
                      <div className="flex justify-between items-start mb-4 text-left">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <Rocket size={20} strokeWidth={2.5} />
                        </div>
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                          Best Match
                        </span>
                      </div>
                      <h4 className="text-[15px] font-bold text-slate-900 mb-1 leading-tight text-left">{job.title || job.jobTitle}</h4>
                      <p className="text-[12px] text-slate-400 mb-4 font-medium text-left">{job.company} • {job.location}</p>
                      <div className="flex gap-1.5 mb-6 flex-wrap">
                        {(job.requiredSkills || job.skills || []).slice(0, 3).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md text-[9px] font-bold">{s}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white font-bold text-[12px] py-2.5 rounded-lg hover:bg-blue-700 transition-all">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-10 flex flex-col items-center opacity-50">
                    <TrendingUp size={30} className="text-slate-300 mb-3" />
                    <p className="text-xs font-semibold text-slate-400">No matching jobs for {latestAssessment?.quizTitle.replace(/ Assessment| Quiz| Test/gi, '')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="section-title-large text-slate-900">Career Timeline</h3>
              </div>
              <div className="relative">
                <div className="timeline-line"></div>
                <div className="space-y-6">
                  {timelineItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 relative">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10 border shadow-sm" style={{ backgroundColor: `${item.color}12`, color: item.color, borderColor: `${item.color}24` }}>
                        <item.icon size={18} />
                      </div>
                      <div className="flex-1 bg-white/60 px-4 py-3 rounded-xl border border-blue-50 flex justify-between items-center transition-all hover:bg-white text-left">
                        <div className="text-left">
                          <h4 className="font-bold text-slate-900 text-[14px]">{item.title}</h4>
                          <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.meta}</p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ color: item.color, backgroundColor: `${item.color}12` }}>
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
  );
};

export default UserDashboard;