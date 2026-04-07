import React, { useState } from 'react';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
    // Mock Data for Admin
    const [stats] = useState({
        totalUsers: 1240,
        activeJobs: 85,
        pendingApprovals: 12,
        totalFeedbacks: 342
    });

    const [recentUsers, setRecentUsers] = useState([
        { id: 1, name: "Thilina Perera", role: "Student", date: "2026-04-05", status: "Active" },
        { id: 2, name: "Sarah Williams", role: "Employer", date: "2026-04-06", status: "Pending" },
        { id: 3, name: "Alex Johnson", role: "Student", date: "2026-04-07", status: "Active" },
    ]);

    const [pendingJobs, setPendingJobs] = useState([
        { id: 101, company: "TechCorp Labs", title: "Frontend Intern", date: "2026-04-06" },
        { id: 102, company: "DataSync", title: "Data Analyst Trainee", date: "2026-04-07" }
    ]);

    const handleAction = (type, item) => {
        console.log(`Action: ${type} on item:`, item);
        alert(`${type} action executed! (Simulated)`);
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <p>Overview and system management</p>
            </div>

            <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                    <div className="metric-icon">👥</div>
                    <div className="metric-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="admin-metric-card">
                    <div className="metric-icon">💼</div>
                    <div className="metric-info">
                        <h3>{stats.activeJobs}</h3>
                        <p>Active Postings</p>
                    </div>
                </div>
                <div className="admin-metric-card">
                    <div className="metric-icon">⏳</div>
                    <div className="metric-info">
                        <h3>{stats.pendingApprovals}</h3>
                        <p>Pending Approvals</p>
                    </div>
                </div>
                <div className="admin-metric-card">
                    <div className="metric-icon">⭐</div>
                    <div className="metric-info">
                        <h3>{stats.totalFeedbacks}</h3>
                        <p>Total Feedbacks</p>
                    </div>
                </div>
            </div>

            <div className="admin-tables-container">
                {/* Recent Users Table */}
                <div className="admin-table-card">
                    <h3>Recent Registrations</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.date}</td>
                                    <td>
                                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="admin-action-btn edit" onClick={() => handleAction('Edit', user)}>Edit</button>
                                        <button className="admin-action-btn reject" onClick={() => handleAction('Suspend', user)}>Suspend</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pending Jobs Table */}
                <div className="admin-table-card">
                    <h3>Pending Job Approvals</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Company</th>
                                <th>Job Title</th>
                                <th>Submitted On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingJobs.map(job => (
                                <tr key={job.id}>
                                    <td>{job.company}</td>
                                    <td>{job.title}</td>
                                    <td>{job.date}</td>
                                    <td>
                                        <button className="admin-action-btn approve" onClick={() => handleAction('Approve', job)}>Approve</button>
                                        <button className="admin-action-btn reject" onClick={() => handleAction('Reject', job)}>Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
