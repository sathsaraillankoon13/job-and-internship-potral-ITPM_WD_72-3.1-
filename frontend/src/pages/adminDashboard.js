import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { fetchPendingJobs, updateJobApproval } from '../api';

function AdminDashboard({ onLogout }) {
    // Mock Data for Admin
    const [stats, setStats] = useState({
        totalUsers: 1240,
        activeJobs: 85,
        pendingApprovals: 0,
        totalFeedbacks: 342
    });

    const [recentUsers] = useState([
        { id: 1, name: "Thilina Perera", role: "Student", date: "2026-04-05", status: "Active" },
        { id: 2, name: "Sarah Williams", role: "Employer", date: "2026-04-06", status: "Pending" },
        { id: 3, name: "Alex Johnson", role: "Student", date: "2026-04-07", status: "Active" },
    ]);

    const [pendingJobs, setPendingJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const jobs = await fetchPendingJobs();
            setPendingJobs(jobs);
            setStats(prev => ({ ...prev, pendingApprovals: jobs.length }));
        } catch (error) {
            console.error("Failed to load pending jobs:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAction = async (type, item) => {
        if (type === 'Approve' || type === 'Reject') {
            const approvalStatus = type === 'Approve' ? 'Approved' : 'Rejected';
            try {
                await updateJobApproval(item._id || item.id, approvalStatus);
                alert(`Job ${type === 'Approve' ? 'approved' : 'rejected'} successfully!`);
                loadData();
            } catch (error) {
                alert(`Failed to ${type.toLowerCase()} job: ` + (error.response?.data?.message || error.message));
            }
        } else {
            alert(`${type} action executed for ${item.name || item.title}! (Simulated)`);
        }
    };

    return (
        <AdminLayout onLogout={onLogout}>
            {/* Remove Header Section with action buttons as requested */}
            {/* The title "Admin Dashboard" is now already inside the AdminHeader Component */}

            {/* Metrics Grid */}
            <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 pt-2">
                <div className="relative overflow-hidden rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.04] p-5 shadow-[0_10px_30px_rgba(2,98,186,0.18)] transition hover:-translate-y-1 group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#0262BA]" />
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0262BA]/15 text-xl text-[#0262BA] group-hover:scale-110 transition-transform">👥</div>
                    <p className="font-['Sora'] text-3xl font-extrabold leading-none tracking-tight text-slate-900">{stats.totalUsers}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Total Users</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.04] p-5 shadow-[0_10px_30px_rgba(2,98,186,0.18)] transition hover:-translate-y-1 group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#0262BA]" />
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0262BA]/15 text-xl text-[#0262BA] group-hover:scale-110 transition-transform">💼</div>
                    <p className="font-['Sora'] text-3xl font-extrabold leading-none tracking-tight text-slate-900">{stats.activeJobs}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Active Postings</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.04] p-5 shadow-[0_10px_30px_rgba(2,98,186,0.18)] transition hover:-translate-y-1 group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#0262BA]" />
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0262BA]/15 text-xl text-amber-600 group-hover:scale-110 transition-transform">⏳</div>
                    <p className="font-['Sora'] text-3xl font-extrabold leading-none tracking-tight text-slate-900">{stats.pendingApprovals}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Pending Approvals</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.04] p-5 shadow-[0_10px_30px_rgba(2,98,186,0.18)] transition hover:-translate-y-1 group">
                    <div className="absolute inset-x-0 top-0 h-1 bg-[#0262BA]" />
                    <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0262BA]/15 text-xl text-emerald-600 group-hover:scale-110 transition-transform">⭐</div>
                    <p className="font-['Sora'] text-3xl font-extrabold leading-none tracking-tight text-slate-900">{stats.totalFeedbacks}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Total Feedbacks</p>
                </div>
            </section>

            {/* Tables Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Users Table */}
                <article className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)] overflow-hidden flex flex-col">
                    <div className="border-b border-[#0262BA]/20 bg-white/50 px-5 py-4 lg:px-6">
                        <h3 className="font-['Sora'] text-[15px] font-extrabold text-slate-900">Recent Registrations</h3>
                        <p className="text-xs text-slate-500">Latest students and employers joining the platform</p>
                    </div>
                    <div className="overflow-x-auto bg-white/40 flex-1">
                        <table className="min-w-full divide-y divide-[#0262BA]/10">
                            <thead className="bg-[#0262BA]/5">
                                <tr>
                                    <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">User Info</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                                    <th className="px-3 py-3.5 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0262BA]/10">
                                {recentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#0262BA]/5 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs font-medium text-slate-500">{user.role} • {user.date}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleAction('Edit', user)} className="rounded-lg bg-[#0262BA]/10 px-3 py-1.5 text-xs font-bold text-[#0262BA] hover:bg-[#0262BA]/20 transition">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleAction('Suspend', user)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200 transition">
                                                    Suspend
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>

                {/* Pending Jobs Table */}
                <article className="rounded-2xl border border-[#0262BA]/25 bg-gradient-to-br from-sky-50 to-[#0262BA]/[0.03] shadow-[0_10px_30px_rgba(2,98,186,0.14)] overflow-hidden flex flex-col">
                    <div className="border-b border-[#0262BA]/20 bg-white/50 px-5 py-4 lg:px-6">
                        <h3 className="font-['Sora'] text-[15px] font-extrabold text-slate-900">Pending Job Approvals</h3>
                        <p className="text-xs text-slate-500">Review jobs submitted by employers</p>
                    </div>
                    <div className="overflow-x-auto bg-white/40 flex-1">
                        <table className="min-w-full divide-y divide-[#0262BA]/10">
                            <thead className="bg-[#0262BA]/5">
                                <tr>
                                    <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Job Title</th>
                                    <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                                    <th className="px-3 py-3.5 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#0262BA]/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-sm text-slate-500">Loading pending jobs...</td>
                                    </tr>
                                ) : pendingJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="py-8 text-center text-sm text-slate-500">No pending approvals</td>
                                    </tr>
                                ) : pendingJobs.map((job) => (
                                    <tr key={job._id || job.id} className="hover:bg-[#0262BA]/5 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{job.title}</span>
                                                <span className="text-xs font-medium text-slate-500">{job.company}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-600">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleAction('Approve', job)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-lg text-emerald-600 hover:bg-emerald-200 transition" title="Approve">
                                                    ✅
                                                </button>
                                                <button onClick={() => handleAction('Reject', job)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-lg text-red-600 hover:bg-red-200 transition" title="Reject">
                                                    ❌
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;
