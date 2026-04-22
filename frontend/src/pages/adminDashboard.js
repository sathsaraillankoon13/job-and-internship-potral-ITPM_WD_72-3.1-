import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api, { approveJob, fetchJobs, rejectJob, updateUser, updateUserStatus } from '../api';

function formatDate(value) {
    const parsed = value ? new Date(value) : null;
    if (!parsed || Number.isNaN(parsed.getTime())) {
        return '-';
    }

    return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function mapRegistrationUser(user) {
    const fullName =
        String(user?.name || '').trim() ||
        `${String(user?.firstName || '').trim()} ${String(user?.lastName || '').trim()}`.trim() ||
        String(user?.username || user?.email || 'Unknown User');

    const role = String(user?.role || user?.type || 'user');
    const status = String(user?.status || 'active').toLowerCase();

    return {
        id: user?._id || user?.id || fullName,
        email: user?.email || '',
        name: fullName,
        roleRaw: role.toLowerCase(),
        role: role.charAt(0).toUpperCase() + role.slice(1),
        date: formatDate(user?.createdAt),
        statusRaw: status,
        status:
            status === 'active'
                ? 'Active'
                : status === 'pending'
                  ? 'Pending'
                  : 'Suspended',
    };
}

function AdminDashboard({ onLogout }) {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeJobs: 0,
        totalFeedbacks: 0,
    });

    const [recentUsers, setRecentUsers] = useState([]);

    const [pendingJobs, setPendingJobs] = useState([]);
    const [pendingLoading, setPendingLoading] = useState(true);
    const [pendingError, setPendingError] = useState("");
    const [activeActionId, setActiveActionId] = useState("");
    const [isExportingRegistrations, setIsExportingRegistrations] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        role: 'student',
    });

    useEffect(() => {
        let active = true;

        const loadDashboardData = async () => {
            setPendingLoading(true);
            setPendingError("");

            try {
                const [pendingData, allJobsData, candidatesRes, feedbackRes, usersRes] = await Promise.all([
                    fetchJobs({ approvalStatus: "Pending" }),
                    fetchJobs(),
                    api.get('/candidates'),
                    api.get('/feedback'),
                    api.get('/users', { params: { limit: 6 } }),
                ]);

                if (!active) return;

                const pendingItems = Array.isArray(pendingData) ? pendingData : [];
                const allJobs = Array.isArray(allJobsData) ? allJobsData : [];
                const candidates = Array.isArray(candidatesRes?.data) ? candidatesRes.data : [];
                const feedbacks = Array.isArray(feedbackRes?.data) ? feedbackRes.data : [];
                const users = Array.isArray(usersRes?.data) ? usersRes.data : [];

                setPendingJobs(pendingItems);
                setStats({
                    totalUsers: users.length,
                    activeJobs: allJobs.filter((job) => String(job?.status || '').toLowerCase() === 'active').length,
                    totalFeedbacks: feedbacks.length,
                });

                const registrations = users
                    .filter((user) => {
                        const role = String(user?.role || user?.type || '').toLowerCase();
                        return role === 'student' || role === 'employer' || role === 'admin';
                    })
                    .map(mapRegistrationUser);

                setRecentUsers(registrations);
            } catch (error) {
                if (active) {
                    setPendingError(error?.response?.data?.message || error.message || "Failed to load pending jobs");
                }
            } finally {
                if (active) {
                    setPendingLoading(false);
                }
            }
        };

        loadDashboardData();

        const refresh = () => {
            loadDashboardData();
        };

        window.addEventListener('careerbridge:data-updated', refresh);
        const intervalId = window.setInterval(loadDashboardData, 15000);

        return () => {
            active = false;
            window.removeEventListener('careerbridge:data-updated', refresh);
            window.clearInterval(intervalId);
        };
    }, []);

    const refreshPendingJobs = async () => {
        const data = await fetchJobs({ approvalStatus: "Pending" });
        setPendingJobs(Array.isArray(data) ? data : []);
    };
    const handleAction = async (type, item) => {
        if (type === 'Edit') {
            setEditingUser(item);
            setEditForm({
                name: item?.name || '',
                role: String(item?.roleRaw || item?.role || 'student').toLowerCase(),
            });
            setIsEditModalOpen(true);
            return;
        }

        try {
            setActiveActionId(String(item?.id || item?._id || ''));

            if (type === 'Approve') {
                await approveJob(item._id || item.id);
            } else if (type === 'Reject') {
                await rejectJob(item._id || item.id);
            } else if (type === 'Suspend') {
                const nextStatus = String(item?.statusRaw || '').toLowerCase() === 'suspended' ? 'active' : 'suspended';
                await updateUserStatus(item.id, nextStatus);
            }

            window.dispatchEvent(new Event('careerbridge:data-updated'));
            await refreshPendingJobs();
        } catch (error) {
            alert(error?.response?.data?.message || error.message || `${type} action failed`);
        } finally {
            setActiveActionId('');
        }
    };

    const handleEditSave = async (event) => {
        event.preventDefault();

        if (!editingUser) {
            return;
        }

        const trimmedName = String(editForm.name || '').trim();
        const selectedRole = String(editForm.role || '').toLowerCase();
        const allowedRoles = ['student', 'admin', 'employer'];

        if (!trimmedName) {
            alert('Name cannot be empty');
            return;
        }

        if (!allowedRoles.includes(selectedRole)) {
            alert('Invalid role');
            return;
        }

        try {
            setActiveActionId(String(editingUser.id));

            const [firstName, ...rest] = trimmedName.split(' ');
            const lastName = rest.join(' ').trim();

            await updateUser(editingUser.id, {
                name: trimmedName,
                firstName,
                lastName,
                role: selectedRole,
                type: selectedRole,
            });

            setRecentUsers((prev) =>
                prev.map((user) =>
                    user.id === editingUser.id
                        ? {
                              ...user,
                              name: trimmedName,
                              roleRaw: selectedRole,
                              role: selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1),
                          }
                        : user
                )
            );

            setIsEditModalOpen(false);
            setEditingUser(null);
            window.dispatchEvent(new Event('careerbridge:data-updated'));
        } catch (error) {
            alert(error?.response?.data?.message || error.message || 'User update failed');
        } finally {
            setActiveActionId('');
        }
    };

    const handleExportRegistrationsPdf = async () => {
        if (isExportingRegistrations) {
            return;
        }

        try {
            setIsExportingRegistrations(true);

            const usersRes = await api.get('/users', { params: { all: true } });
            const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
            const registrations = users
                .filter((user) => {
                    const role = String(user?.role || user?.type || '').toLowerCase();
                    return role === 'student' || role === 'employer' || role === 'admin';
                })
                .map(mapRegistrationUser);

            if (registrations.length === 0) {
                alert('No registrations found to export.');
                return;
            }

            const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
                import('jspdf'),
                import('jspdf-autotable'),
            ]);

            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            const generatedAt = new Date().toLocaleString();

            doc.setFillColor(30, 40, 90);
            doc.rect(0, 0, doc.internal.pageSize.getWidth(), 72, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(16);
            doc.text('CAREERIR BRIDGE', 40, 30);
            doc.setFontSize(12);
            doc.text('All Registrations Report', 40, 50);

            doc.setTextColor(71, 85, 105);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(`Generated at: ${generatedAt}`, 40, 92);
            doc.text(`Total registrations: ${registrations.length}`, 40, 106);

            autoTable(doc, {
                startY: 122,
                head: [['Name', 'Role', 'Status', 'Email', 'Registered Date']],
                body: registrations.map((item) => [
                    item.name,
                    item.role,
                    item.status,
                    item.email || '-',
                    item.date,
                ]),
                styles: {
                    fontSize: 9,
                    cellPadding: 6,
                    textColor: [30, 41, 59],
                    overflow: 'linebreak',
                },
                headStyles: {
                    fillColor: [14, 165, 233],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                margin: { left: 24, right: 24 },
            });

            doc.save(`all-registrations-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            alert(error?.response?.data?.message || error.message || 'Failed to export registrations');
        } finally {
            setIsExportingRegistrations(false);
        }
    };

    const pendingApprovalCount = pendingJobs.length;

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
                    <p className="font-['Sora'] text-3xl font-extrabold leading-none tracking-tight text-slate-900">{pendingApprovalCount}</p>
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
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="font-['Sora'] text-[15px] font-extrabold text-slate-900">Recent Registrations</h3>
                                <p className="text-xs text-slate-500">Latest students and employers joining the platform</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleExportRegistrationsPdf}
                                disabled={isExportingRegistrations}
                                className="rounded-lg bg-[#0262BA]/10 px-3 py-1.5 text-xs font-bold text-[#0262BA] hover:bg-[#0262BA]/20 transition disabled:opacity-50"
                            >
                                {isExportingRegistrations ? 'Exporting...' : 'Export PDF'}
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white/40 flex-1">
                        {pendingError ? <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">{pendingError}</div> : null}
                        {pendingLoading ? <div className="border-b border-sky-100 bg-white px-5 py-3 text-sm text-slate-500">Loading pending jobs...</div> : null}
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
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                                user.status === 'Active'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : user.status === 'Pending'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-red-100 text-red-700'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction('Edit', user)}
                                                    disabled={activeActionId === String(user.id)}
                                                    className="rounded-lg bg-[#0262BA]/10 px-3 py-1.5 text-xs font-bold text-[#0262BA] hover:bg-[#0262BA]/20 transition disabled:opacity-50"
                                                >
                                                    {activeActionId === String(user.id) ? '...' : 'Edit'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction('Suspend', user)}
                                                    disabled={activeActionId === String(user.id)}
                                                    className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200 transition disabled:opacity-50"
                                                >
                                                    {user.status === 'Suspended' ? 'Activate' : 'Suspend'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!pendingLoading && recentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-6 text-sm text-slate-500">No recent registrations.</td>
                                    </tr>
                                ) : null}
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
                                {pendingJobs.map((job) => (
                                    <tr key={job._id || job.id} className="hover:bg-[#0262BA]/5 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{job.title}</span>
                                                <span className="text-xs font-medium text-slate-500">{job.department || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-600">
                                            {formatDate(job.createdAt)}
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
                                {!pendingLoading && pendingJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-6 text-sm text-slate-500">No pending job approvals.</td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>

            {isEditModalOpen && editingUser ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <h3 className="font-['Sora'] text-lg font-extrabold text-slate-900">Edit User</h3>
                        <p className="mt-1 text-sm text-slate-500">Update user name and role.</p>

                        <form className="mt-5 space-y-4" onSubmit={handleEditSave}>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-sky-200 focus:border-sky-400 focus:ring"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-sky-200 focus:border-sky-400 focus:ring"
                                >
                                    <option value="student">Student</option>
                                    <option value="employer">Employer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingUser(null);
                                    }}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={activeActionId === String(editingUser.id)}
                                    className="rounded-lg bg-[#0262BA] px-3 py-2 text-sm font-bold text-white hover:bg-[#014b8f] disabled:opacity-50"
                                >
                                    {activeActionId === String(editingUser.id) ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </AdminLayout>
    );
}

export default AdminDashboard;
