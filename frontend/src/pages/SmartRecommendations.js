import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  Bookmark,
  TrendingUp,
  Sparkles,
  Search as SearchIcon,
  ChevronRight,
  Filter,
  Users
} from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
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

  return (
    <div className="job-card group">
      <div className="job-card-image-wrap">
        <img className="job-card-image" src={job.image} alt={`${job.title} preview`} />
        <span className="job-card-image-badge">{job.category}</span>
      </div>

      <div>
        <div className="job-card-header">
          <div className="job-info-main">
            <h3 className="job-title">{job.title}</h3>
            <div className="company-info">
              <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                <Briefcase size={12} />
              </div>
              {job.company}
            </div>
            <div className="job-location">
              <MapPin size={12} />
              {job.location}
            </div>
          </div>

          <div className="match-indicator">
            <span className={`match-badge ${getMatchClass(job.match)}`}>
              {job.match}% Match
            </span>
            <div className="match-progress-bg">
              <div
                className="match-progress-fill"
                style={{
                  width: `${job.match}%`,
                  backgroundColor: getMatchColor(job.match)
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="job-tags">
          {job.skills.map((skill, index) => (
            <span key={index} className="job-tag">
              {skill}
            </span>
          ))}
          <span className="job-tag ml-auto bg-blue-50 text-blue-600 border-blue-100">{job.type}</span>
        </div>

        <p className="job-description">
          {job.description}
        </p>
      </div>

      <div className="job-card-actions">
        <button className="apply-btn">
          Apply Now
        </button>
        <button className="save-btn">
          <Bookmark size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

const SmartRecommendations = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get filter values from URL params, with defaults
  const searchTerm = searchParams.get('search') || '';
  const jobType = searchParams.get('type') || 'All';
  const jobCategory = searchParams.get('category') || 'All';

  const pathway = location.state?.career || location.state?.pathway || '';

  // Auto-select category based on pathway
  const categoryFromPathway = useMemo(() => {
    const normalized = String(pathway).toLowerCase();

    if (normalized.includes('frontend') || normalized.includes('ui') || normalized.includes('ux') || normalized.includes('design')) {
      return 'Frontend';
    }
    if (normalized.includes('backend') || normalized.includes('full stack') || normalized.includes('software')) {
      return 'Backend';
    }
    if (normalized.includes('data')) return 'Data';
    if (normalized.includes('cloud') || normalized.includes('devops')) return 'Cloud';

    return 'All';
  }, [pathway]);

  // Set category from pathway on first load
  useEffect(() => {
    if (categoryFromPathway !== 'All' && !searchParams.has('category')) {
      setSearchParams({ category: categoryFromPathway });
    }
  }, [categoryFromPathway, searchParams, setSearchParams]);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params based on filters
        const params = new URLSearchParams();
        if (jobType !== 'All') params.append('type', jobType);
        if (jobCategory !== 'All') params.append('category', jobCategory);
        if (searchTerm) params.append('search', searchTerm);

        const response = await axios.get(`${API_BASE_URL}/api/jobs/all?${params}`);
        
        // Add generated images to jobs
        const jobsWithImages = response.data.data.map(job => ({
          ...job,
          image: createJobImage(job.title, getCategoryColor(job.category).start, getCategoryColor(job.category).end)
        }));

        setJobs(jobsWithImages);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job recommendations. Please try again.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobType, jobCategory, searchTerm]);

  // Helper function to get colors by category
  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': { start: '#2563eb', end: '#1e40af' },
      'Backend': { start: '#0ea5e9', end: '#1d4ed8' },
      'Design': { start: '#8b5cf6', end: '#ec4899' },
      'Data': { start: '#0f766e', end: '#0891b2' },
      'Cloud': { start: '#059669', end: '#0d9488' },
      'Web': { start: '#334155', end: '#475569' }
    };
    return colors[category] || { start: '#1f2937', end: '#111827' };
  };

  // Update URL params when filter changes
  const handleSearchChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleTypeChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== 'All') {
      newParams.set('type', value);
    } else {
      newParams.delete('type');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== 'All') {
      newParams.set('category', value);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const jobCategories = ['All', 'Frontend', 'Backend', 'Design', 'Data', 'Cloud', 'Web'];

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
            <Sparkles size={24} />
          </div>
          <span className="text-blue-600 font-bold text-[13px] uppercase tracking-widest">Smart Matching System</span>
        </div>
        <h1 className="recommendations-title">Recommended Jobs & Internships</h1>
        <p className="recommendations-subtitle">
          Based on your recent assessment scores and skill matrix, we've identified these opportunities
          that perfectly align with your career pathway.
        </p>
        {pathway ? (
          <div className="recommendations-pathway-pill">
            Recommended for: <strong>{pathway}</strong>
          </div>
        ) : null}
      </div>

      <div className="recommendations-content">
        {/* Filters */}
        <div className="filter-section">
          <div className="search-bar-wrapper">
            <SearchIcon className="search-bar-icon" size={18} />
            <input
              type="text"
              placeholder="Search by role or company..."
              className="search-bar-input"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <select
            className="filter-dropdown"
            value={jobType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="All">All Job Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
          <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="category-chips">
          {jobCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`category-chip ${jobCategory === category ? 'category-chip-active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="jobs-grid">
          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">
                <div className="animate-spin">⏳</div>
              </div>
              <h3 className="empty-title">Loading opportunities...</h3>
              <p className="empty-desc">
                Fetching the best job recommendations for you from our database.
              </p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-icon text-red-500">
                ⚠️
              </div>
              <h3 className="empty-title">Error loading jobs</h3>
              <p className="empty-desc">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Retry
              </button>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={32} />
              </div>
              <h3 className="empty-title">No recommendations found</h3>
              <p className="empty-desc">
                We couldn't find any opportunities matching your filters.
                Try updating your profile or modifying your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
