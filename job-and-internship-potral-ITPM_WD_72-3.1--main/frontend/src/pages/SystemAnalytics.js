import React from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  Users, 
  Video, 
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  Download
} from 'lucide-react';
import '../styles/SystemAnalytics.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const ICON_MAP = {
  Video,
  Users,
  ClipboardCheck,
};

const DEFAULT_PAYLOAD = {
  stats: [
    { title: 'Total Interviews', value: 0, trend: '0.0%', isUp: true, icon: 'Video', color: 'blue' },
    { title: 'Student Engagement', value: 0, trend: '0.0%', isUp: true, icon: 'Users', color: 'emerald' },
    { title: 'Assessments Taken', value: 0, trend: '0.0%', isUp: true, icon: 'ClipboardCheck', color: 'purple' },
  ],
  featureUsage: [
    { name: 'Mock Interview', count: 0, color: '#3b82f6' },
    { name: 'Skill Assessment', count: 0, color: '#a855f7' },
    { name: 'AI Career Assistant', count: 0, color: '#f59e0b' },
    { name: 'Smart Recommender', count: 0, color: '#10b981' },
  ],
  weeklyEngagement: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [0, 0, 0, 0, 0, 0, 0] },
  recentActivity: [],
};

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = React.useState('Last 30 Days');
  const [analyticsData, setAnalyticsData] = React.useState(DEFAULT_PAYLOAD);

  React.useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/analytics/system`, {
          params: { range: timeRange },
        });

        if (isMounted && response.data) {
          setAnalyticsData({
            ...DEFAULT_PAYLOAD,
            ...response.data,
          });
        }
      } catch (error) {
        console.error('Failed to fetch system analytics:', error);
      }
    };

    fetchAnalytics();
    const intervalId = setInterval(fetchAnalytics, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [timeRange]);

  const stats = analyticsData.stats || [];
  const featureUsage = analyticsData.featureUsage || [];

  const maxUsage = Math.max(1, ...featureUsage.map(f => f.count || 0));

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-title">System Analytics</h1>
          <p className="analytics-subtitle">Monitor platform usage, engagement, and feature performance.</p>
        </div>
        <div className="analytics-actions">
          <div className="filter-dropdown-container">
            <select 
              className="analytics-filter-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>All Time</option>
            </select>
          </div>
          <button className="generate-report-btn" onClick={() => alert('Generating system report... CSV will be downloaded shortly.')}>
            <Download size={16} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon-bg ${stat.color}`}>
              {React.createElement(ICON_MAP[stat.icon] || BarChart3, { size: 22 })}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.title}</p>
              <div className="flex items-end gap-2">
                <h3 className="stat-value">{Number(stat.value || 0).toLocaleString()}</h3>
                <span className={`stat-trend ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-main-grid">
        {/* Feature Usage Chart */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Feature Adoption</h2>
            <BarChart3 size={18} className="text-slate-400" />
          </div>
          <div className="usage-bars-container">
            {featureUsage.map((feature, idx) => (
              <div key={idx} className="usage-bar-group">
                <div className="usage-label-row">
                  <span className="usage-name">{feature.name}</span>
                  <span className="usage-value">{feature.count} users</span>
                </div>
                <div className="usage-bar-bg">
                  <div 
                    className="usage-bar-fill" 
                    style={{ 
                      width: `${(feature.count / maxUsage) * 100}%`,
                      backgroundColor: feature.color
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Mini-List */}
      <div className="recent-activity-card">
        <h2 className="chart-title mb-6">Real-time Engagement</h2>
        <div className="activity-list">
          {(analyticsData.recentActivity || []).map((act, idx) => (
            <div key={idx} className="activity-item">
              <div className="activity-avatar">
                {act.user.charAt(0)}
              </div>
              <div className="activity-info">
                <p className="activity-text">
                  <span className="font-bold text-slate-900">{act.user}</span>
                  <span className="text-slate-500 ml-1">{act.activity}</span>
                </p>
                <p className="activity-time">{act.time}</p>
              </div>
              {act.score && (
                <div className="activity-badge">{act.score}</div>
              )}
            </div>
          ))}
          {(analyticsData.recentActivity || []).length === 0 ? (
            <div className="activity-item">
              <div className="activity-avatar">-</div>
              <div className="activity-info">
                <p className="activity-text">
                  <span className="text-slate-200">No recent activity in selected range.</span>
                </p>
                <p className="activity-time">Live data updates every 30 seconds</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;
