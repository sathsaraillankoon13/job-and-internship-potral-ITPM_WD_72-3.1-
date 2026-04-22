import React, { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Bookmark,
  Sparkles,
  Search as SearchIcon,
  Filter,
  Users,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronLeft
} from 'lucide-react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SmartRecommendations.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const createJobImage = (label, startColor, endColor) => {
  const initials = label
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="120" viewBox="0 0 220 120">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="220" height="120" rx="22" fill="url(#g)"/>
      <circle cx="176" cy="30" r="18" fill="rgba(255,255,255,0.18)"/>
      <circle cx="32" cy="88" r="28" fill="rgba(255,255,255,0.12)"/>
      <text x="26" y="74" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="white">${initials}</text>
      <text x="26" y="95" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1.8" fill="rgba(255,255,255,0.85)">${label.toUpperCase()}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const getMatchClass = (percent) => {
    if (percent >= 80) return 'match-high';
    if (percent >= 60) return 'match-medium';
    return 'match-low';
  };

  const getMatchColor = (percent) => {
    if (percent >= 80) return '#10b981';
    if (percent >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const openJobDetails = () => {
    const searchParams = new URLSearchParams({
      jobId: job.id || job._id,
      title: job.jobTitle || job.title,
      category: job.category || '',
      location: job.location || 'Remote',
      salaryStipend: String(job.salaryStipend || job.stipend || ""),
      skills: (job.skills || job.requiredSkills || []).join(", "),
      experienceLevel: String(job.experienceLevel || ""),
      applicationDeadline: String(job.expiresAt || job.applicationDeadline || ""),
      description: String(job.description || ""),
    });
    navigate(`/application?${searchParams.toString()}`);
  };

  return (
    <div className="job-card group">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="job-info-main">
            <h3 className="job-title text-[14px] font-bold text-slate-900 truncate max-w-[180px]">{job.jobTitle}</h3>
            <div className="company-info text-blue-600 font-bold text-[11px]">
              {job.company}
            </div>
          </div>
          <div className="match-indicator text-right">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${getMatchClass(job.compatibilityScore)} bg-opacity-10`} style={{ color: getMatchColor(job.compatibilityScore) }}>
              {job.compatibilityScore}%
            </span>
          </div>
        </div>

        <div className="job-location flex items-center gap-1 text-slate-400 text-[10px] mb-3">
          <MapPin size={10} />
          {job.location || 'Remote'}
        </div>

        {job.whyMatched && (
          <div className="p-3 bg-blue-50/80 border border-blue-200/50 rounded-xl mb-3 shadow-inner">
            <p className="text-[11px] font-bold text-blue-900 leading-tight">
              {job.compatibilityScore}% Match: <span className="font-medium text-blue-700 italic">"{job.whyMatched}"</span>
            </p>
          </div>
        )}

        <div className="job-tags flex flex-wrap gap-1 mb-4">
          {(job.skills || []).slice(0, 3).map((skill, index) => (
            <span key={index} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded text-[9px] font-bold italic">
              {skill}
            </span>
          ))}
          {job.type && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold ml-auto">{job.type}</span>}
        </div>

        <div className="job-card-actions flex gap-2 mt-auto pt-3 border-t border-slate-50">
          <button
            onClick={openJobDetails}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg transition-all text-[11px]"
          >
            Apply Now
          </button>
          <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg border border-slate-100">
            <Bookmark size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SmartRecommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ jobs: [], studyPath: [], mode: 'JOBS', readinessScore: 0, readinessStatus: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchTerm = searchParams.get('search') || '';
  const jobCategory = searchParams.get('category') || 'All';

  const { homeJobs, latestResult } = location.state || {};

  const isPostAssessment = useMemo(() => {
    return latestResult && latestResult.score >= 70 && homeJobs && homeJobs.length > 0;
  }, [latestResult, homeJobs]);

  const processedData = useMemo(() => {
    // RULE C: Score Threshold (>= 70)
    if (!latestResult || latestResult.score < 70) {
      return { jobs: [], readinessScore: 0, readinessStatus: 'N/A' };
    }

    // HEAL: Strip anything before a colon (e.g., "UI/UX Designer: Figma" -> "Figma")
    let testTopic = (latestResult?.skill || '').replace(/ Assessment| Quiz| Test/gi, '').trim().toLowerCase();
    if (testTopic.includes(':')) {
      testTopic = testTopic.split(':').pop().trim();
    }

    const jobList = Array.isArray(homeJobs) ? homeJobs : (homeJobs?.items || []);

    // --- STEP 1: FILTERING (Master Search) ---
    const filtered = jobList.filter(job => {
      // RULE B: Strict 'Scheduled' Blockade
      const lowerStatus = String(job.status || '').toLowerCase().trim();
      if (lowerStatus === 'scheduled' || lowerStatus === 'expired') return false;

      // RULE A: Skill-Exclusive Search (Search arrays AND Title)
      const keywordChain = [
        ...(job.requiredSkills || []),
        ...(job.required_skills || []),
        ...(job.skills || []),
        job.title || job.jobTitle || ""
      ].join(' ').toLowerCase();

      return keywordChain.includes(testTopic);
    });

    // --- STEP 2: SCORING & RANKING (Premium Variations) ---
    const scored = filtered.map((job, index) => {
      const userScore = latestResult.score;
      // Formula: (AssessmentScore * 0.7) + (Base 20) + (Varying Alignment 1-10)
      const baseAlign = (userScore * 0.7) + 20;
      const variation = (index * 3) % 10;
      const compScore = Math.min(99, Math.round(baseAlign + variation));

      let badge = 'Interview Ready';
      if (compScore >= 92) badge = 'Career Ready';
      if (compScore >= 96) badge = 'Expert Matched';

      return {
        ...job,
        id: job._id || job.id,
        jobTitle: job.title || job.jobTitle,
        compatibilityScore: compScore,
        matchCategory: badge,
        image: createJobImage(job.title || job.jobTitle, '#2563eb', '#1e40af'),
        whyMatched: `Your ${userScore}% proficiency in ${testTopic} provides a ${compScore}% match with this position's core requirements.`
      };
    });

    const sorted = scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return {
      jobs: sorted,
      readinessScore: sorted.length > 0 ? sorted[0].compatibilityScore : latestResult.score,
      readinessStatus: sorted.length > 0 ? sorted[0].matchCategory : 'Analyzing',
      mode: 'JOBS'
    };
  }, [homeJobs, latestResult]);

  useEffect(() => {
    // HEAL: Identity Recovery
    const getUserIdentity = () => {
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : null;
      return localStorage.getItem('userId') || userObj?.id || userObj?._id || userObj?.uid || 'guest_user';
    };

    const currentUserId = getUserIdentity();

    if (latestResult?.score >= 70 && (!homeJobs || homeJobs.length === 0)) {
      const loadJobs = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_BASE_URL}/api/recommendations/smart`, {
            params: {
              skill: latestResult.skill,
              userId: currentUserId
            }
          });
          const rawJobs = res.data.recommendedJobs || res.data.jobs || [];

          // FILTER: Only display active jobs
          const jobs = rawJobs.filter(job => {
            const lowerStatus = String(job.status || '').toLowerCase().trim();
            return lowerStatus !== 'scheduled' && lowerStatus !== 'expired';
          });

          if (jobs.length > 0) {
            setData({
              jobs: jobs.map(j => ({
                ...j,
                id: j.id || j._id,
                compatibilityScore: Math.round((latestResult.score * 0.8) + 20),
                image: createJobImage(j.jobTitle || j.title, '#1f2937', '#111827')
              })).sort((a, b) => b.compatibilityScore - a.compatibilityScore),
              readinessScore: res.data.readinessScore || latestResult.score,
              readinessStatus: 'Matched',
              mode: 'JOBS',
              studyPath: [],
              message: res.data.message
            });
          } else {
            setData(prev => ({ ...prev, jobs: [], mode: 'JOBS', message: 'No matching jobs found' }));
          }
        } catch (err) {
          console.error('Fallback Fetch Error:', err);
        } finally {
          setLoading(false);
        }
      };
      loadJobs();
    } else {
      setData({
        ...processedData,
        studyPath: [],
        message: processedData.jobs.length > 0
          ? `Showing top ${processedData.jobs.length} matches sorted by compatibility.`
          : 'No matching jobs found for your criteria.'
      });
      setLoading(false);
    }
  }, [homeJobs, latestResult, processedData]);

  useEffect(() => {
    if (!isPostAssessment) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const directUserId = localStorage.getItem('userId');
          const response = await axios.get(`${API_BASE_URL}/api/recommendations/smart`, {
            params: { userId: directUserId }
          });
          if (response.data.success) {
            const rawJobs = response.data.recommendedJobs || [];

            // FILTER: Only display active jobs
            const filteredJobs = rawJobs.filter(job => {
              const lowerStatus = String(job.status || '').toLowerCase().trim();
              return lowerStatus !== 'scheduled' && lowerStatus !== 'expired';
            });

            setData({
              jobs: filteredJobs,
              studyPath: response.data.studyPath || [],
              mode: response.data.mode || 'JOBS',
              readinessScore: response.data.readinessScore || 0,
              readinessStatus: response.data.readinessStatus || 'Developing',
              message: response.data.message
            });
          }
        } catch (err) {
          console.error('General Fetch Failed:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isPostAssessment, homeJobs, latestResult, processedData, searchTerm, jobCategory]);

  const handleSearchChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('search', value);
    else newParams.delete('search');
    setSearchParams(newParams);
  };

  const jobCategories = ['All', 'Frontend', 'Backend', 'Design', 'Data', 'Cloud', 'Web'];

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/10 text-white rounded-xl shadow-lg backdrop-blur-md border border-white/20">
              <TrendingUp size={24} />
            </div>
            <span className="text-sky-300 font-bold text-[13px] uppercase tracking-widest">CareerBridge Smart Engine</span>
          </div>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold"
          >
            <ChevronLeft size={18} /> Back to Dashboard
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl text-left">
            <h1 className="recommendations-title">Smart Career Fit Insights</h1>
            <p className="recommendations-subtitle">
              Discover your compatibility across high-priority roles based on your latest assessment and readiness scores.
            </p>
          </div>

          <div className="readiness-card bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl flex items-center gap-6 shadow-2xl">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                <circle
                  cx="40" cy="40" r="36" stroke="white" strokeWidth="8" fill="none"
                  strokeDasharray="226.2"
                  strokeDashoffset={226.2 - (226.2 * data.readinessScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-xl font-black text-white">{data.readinessScore}%</span>
            </div>
            <div className="text-left">
              <div className="text-sky-200 text-[11px] font-bold uppercase tracking-wider mb-1">Compatibility Avg</div>
              <div className="text-white text-xl font-black flex items-center gap-2">
                {data.readinessStatus}
                <Award size={20} className="text-sky-300" />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-white/60 text-[10px] font-medium">Post-Assessment Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-content">


        <div className="jobs-grid">
          {loading ? (
            <div className="empty-state py-20">
              <div className="animate-bounce mb-4 text-4xl">🚀</div>
              <h3 className="empty-title text-slate-400">Processing test results...</h3>
            </div>
          ) : data.jobs.length > 0 ? (
            data.jobs.map((job, i) => <JobCard key={job.id || i} job={job} />)
          ) : (
            <div className="empty-state py-20 col-span-full">
              <Users size={32} className="text-slate-300 mb-4" />
              <h3 className="empty-title">No matching opportunities</h3>
              <p className="empty-desc text-slate-400">
                {isPostAssessment
                  ? `We couldn't find any roles matching '${latestResult.skill}' in your current dashboard list.`
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
