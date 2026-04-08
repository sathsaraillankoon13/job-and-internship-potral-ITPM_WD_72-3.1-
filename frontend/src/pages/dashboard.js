import React from 'react';
import '../styles/Dashboard.css';

function Dashboard({ userData }) {
    return (
        <div className="dashboard-content-wrapper">
            {/* Page Header */}
            <div className="dashboard-page-header">
                <div>
                    <h2>System Dashboard</h2>
                    <p>Welcome back! Here's your overview for today.</p>
                </div>
                <div className="header-actions">
                    <button className="primary-btn">+ New Entry</button>
                </div>
            </div>

            {/* Welcome Banner */}
            <section className="dashboard-banner">
                <div className="banner-content">
                    <h2>Good morning, {userData ? userData.firstName : 'Admin'}! ☀️</h2>
                    <p>The system is running smoothly. You have 12 pending approvals and 3 new student registrations to review.</p>
                    <div className="banner-actions">
                        <button className="btn-white">Review Approvals</button>
                        <button className="btn-outline-white">View Analytics</button>
                    </div>
                </div>
                <div className="banner-decoration">
                    <div className="circle-1"></div>
                    <div className="circle-2"></div>
                    <span className="banner-icon">📊</span>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">👥</div>
                    <h3>1,245</h3>
                    <p>Total Students</p>
                    <span className="stat-badge success">Up 5% today</span>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper green">💼</div>
                    <h3>342</h3>
                    <p>Active Internships</p>
                    <span className="stat-badge neutral">Live updates</span>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper orange">📝</div>
                    <h3>89</h3>
                    <p>Pending Applications</p>
                    <span className="stat-badge warning">Needs Action</span>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper purple">⭐</div>
                    <h3>4.8</h3>
                    <p>Average Feedback</p>
                    <span className="stat-badge success">Excellent</span>
                </div>
            </section>

            {/* Bottom Section */}
            <section className="dashboard-bottom">
                <div className="recent-activity-card">
                    <div className="card-header">
                        <div>
                            <h3>Recent Activity</h3>
                            <p>Latest updates from the platform</p>
                        </div>
                        <button className="btn-text">View All</button>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon student">👨‍🎓</div>
                            <div className="activity-details">
                                <h4>New Student Registration</h4>
                                <p>John Doe joined the portal</p>
                            </div>
                            <div className="activity-meta">Just now</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon job">🏢</div>
                            <div className="activity-details">
                                <h4>New Job Posted</h4>
                                <p>TechCorp Ltd. posted "Software Engineer Intern"</p>
                            </div>
                            <div className="activity-meta">2 hrs ago</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon review">⭐</div>
                            <div className="activity-details">
                                <h4>New Feedback Submitted</h4>
                                <p>Sarah Smith rated her internship experience</p>
                            </div>
                            <div className="activity-meta">5 hrs ago</div>
                        </div>
                    </div>
                </div>

                <div className="system-status-card">
                    <div className="card-header">
                        <div>
                            <h3>System Status</h3>
                            <p>Quick overview of platform health</p>
                        </div>
                    </div>
                    <div className="status-content">
                        <div className="status-chart-placeholder">
                            <div className="bar-wrapper"><div className="bar b1"></div></div>
                            <div className="bar-wrapper"><div className="bar b2"></div></div>
                            <div className="bar-wrapper"><div className="bar b3"></div></div>
                            <div className="bar-wrapper"><div className="bar b4"></div></div>
                            <div className="bar-wrapper"><div className="bar b5"></div></div>
                            <div className="bar-wrapper"><div className="bar b6"></div></div>
                            <div className="bar-wrapper"><div className="bar b7"></div></div>
                        </div>
                        <div className="status-legend">
                            <span><span className="dot blue"></span> Traffic</span>
                            <span><span className="dot green"></span> Success Rate</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
