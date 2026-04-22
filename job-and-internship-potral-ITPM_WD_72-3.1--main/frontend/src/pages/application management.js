import React, { useState, useEffect, useMemo } from 'react';
import {
    LayoutDashboard, Briefcase, Users, Calendar, HelpCircle, LogOut,
    Search, Bell, Filter, Download, FileText, CheckCircle, XCircle, Plus,
    Edit3, Trash2
} from 'lucide-react';

export default function ApplicationManagement({ onLogout, onNavigate }) {
    // Mock data for Jobs and Applications
    const [jobs] = useState([
        { id: 1, title: 'Senior Product Designer', department: 'Design', active: true },
        { id: 2, title: 'Frontend Architect', department: 'Engineering', active: true },
        { id: 3, title: 'Backend Developer', department: 'Engineering', active: false },
    ]);

    const [selectedJobId, setSelectedJobId] = useState(1);

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/applications')
            .then(res => res.json())
            .then(data => setApplications(data))
            .catch(console.error);
    }, []);

    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [newApp, setNewApp] = useState({ candidateName: '', location: '', skills: '', education: '', jobId: 1 });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState(null);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // Filter applications based on selected job
    const filteredApplications = applications.filter(app => app.jobId === selectedJobId);
    const jobsById = useMemo(() => {
        const map = new Map();
        jobs.forEach((job) => {
            map.set(Number(job.id), job);
        });
        return map;
    }, [jobs]);

    const handleExportPdf = async () => {
        if (isExportingPdf || applications.length === 0) {
            return;
        }

        setIsExportingPdf(true);
        try {
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
            doc.text('Application Management - Full Report', 40, 50);

            doc.setTextColor(71, 85, 105);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(`Generated at: ${generatedAt}`, 40, 92);
            doc.text(`Total applications: ${applications.length}`, 40, 106);

            const rows = applications.map((app) => {
                const job = jobsById.get(Number(app.jobId));
                return [
                    app.candidateName || '-',
                    job?.title || `Job #${app.jobId ?? '-'}`,
                    job?.department || '-',
                    app.location || '-',
                    app.education || '-',
                    Array.isArray(app.skills) ? app.skills.join(', ') : String(app.skills || '-'),
                    app.appliedDate || '-',
                    app.status || 'Pending',
                ];
            });

            autoTable(doc, {
                startY: 122,
                head: [[
                    'Candidate Name',
                    'Applied For',
                    'Department',
                    'Location',
                    'Education',
                    'Skills',
                    'Date Applied',
                    'Status',
                ]],
                body: rows,
                styles: {
                    fontSize: 8,
                    cellPadding: 5,
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

            doc.save(`application-management-report-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('Failed to export applications PDF:', error);
        } finally {
            setIsExportingPdf(false);
        }
    };

    const handleStatusChange = (appId, newStatus) => {
        fetch(`http://localhost:5000/api/applications/${appId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(updatedApp => {
                setApplications(apps => apps.map(app => app.id === appId ? updatedApp : app));
            })
            .catch(console.error);
    };

    const handleApplySubmit = (e) => {
        e.preventDefault();
        const skillsArray = newApp.skills.split(',').map(s => s.trim()).filter(s => s !== '');

        const newApplication = {
            jobId: Number(newApp.jobId),
            candidateName: newApp.candidateName,
            location: newApp.location,
            avatar: `https://ui-avatars.com/api/?name=${newApp.candidateName.replace(' ', '+')}&background=random`,
            skills: skillsArray.length > 0 ? skillsArray : ['N/A'],
            education: newApp.education || 'Not specified',
            appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Pending',
        };

        fetch('http://localhost:5000/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newApplication)
        })
            .then(res => res.json())
            .then(savedApp => {
                setApplications([savedApp, ...applications]);
                setIsApplyModalOpen(false);
                setNewApp({ candidateName: '', location: '', skills: '', education: '', jobId: selectedJobId });
            })
            .catch(console.error);
    };

    const handleDelete = (appId) => {
        fetch(`http://localhost:5000/api/applications/${appId}`, { method: 'DELETE' })
            .then(() => setApplications(apps => apps.filter(app => app.id !== appId)))
            .catch(console.error);
    };

    const handleEditClick = (app) => {
        setEditingApp({ ...app, skills: app.skills.join(', ') });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const skillsArray = editingApp.skills.split(',').map(s => s.trim()).filter(s => s !== '');

        const payload = { ...editingApp, skills: skillsArray.length > 0 ? skillsArray : ['N/A'] };

        fetch(`http://localhost:5000/api/applications/${editingApp.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(updatedApp => {
                setApplications(apps => apps.map(app =>
                    app.id === editingApp.id ? updatedApp : app
                ));
                setIsEditModalOpen(false);
                setEditingApp(null);
            })
            .catch(console.error);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-gray-200 text-gray-700';
            case 'Interviewing': return 'bg-[#b2f5ea] text-teal-800';
            case 'Shortlisted': return 'bg-blue-100 text-blue-800';
            case 'Hired': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-col justify-between hidden md:flex">
                <div>
                    <div className="p-6 pb-8">
                        <button
                            type="button"
                            onClick={() => { if (onNavigate) onNavigate('admindashboard'); }}
                            className="flex items-center gap-3 text-left"
                            title="Go to admin dashboard"
                        >
                            <div className="bg-[#1e285a] text-white p-2 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-[#1e285a] leading-tight text-lg">Recruitment Management</h1>
                                <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-0.5 uppercase">PREMIUM EDITION</p>
                            </div>
                        </button>
                    </div>
                    <nav className="space-y-1">
                        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <LayoutDashboard size={20} strokeWidth={2.5} />
                            Dashboard
                        </button>
                        <button onClick={() => onNavigate('applications')} className="flex items-center gap-3 px-6 py-3.5 bg-[#f0f4ff] text-[#1e285a] font-bold border-l-4 border-[#1e285a] w-full text-left">
                            <Briefcase size={20} strokeWidth={2} />
                            Application Management
                        </button>
                        <button onClick={() => onNavigate('shortlisting')} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <Users size={20} strokeWidth={2} />
                            Candidate Shortlisting
                        </button>
                        <button onClick={() => onNavigate('interviews')} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <Calendar size={20} strokeWidth={2} />
                            Interview scheduling
                        </button>
                    </nav>
                </div>
                <div className="pb-8 space-y-1">
                    <button className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                        <HelpCircle size={20} strokeWidth={2} />
                        Help Center
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors text-left">
                        <LogOut size={20} strokeWidth={2} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 px-8 flex items-center justify-between h-20">
                    <div className="flex items-center gap-8 h-full">
                        <h2 className="text-xl font-bold text-[#1e285a]">CareerBridge</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="Search applicants..."
                                className="pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 w-72 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-[#1e285a] transition-colors relative">
                                <Bell size={20} strokeWidth={2} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white translate-x-1/2 -translate-y-1/4"></span>
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-200 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-orange-200 transition-all">
                            <img src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-1/653701366_1656083882213917_224881808506701562_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFtyEdDwubf20fmTiHIpsZmRP0W5wXVHWBE_RbnBdUdYNLMsjsmZ5ev4Igs8J6ANo9Z0sLrSusYiwt_IMp0RjT6&_nc_ohc=4uMi4qjD6PYQ7kNvwEcTWii&_nc_oc=AdrFUVSo5x-0wXrCxQeG9hIB-wk8o19BeKtWLfA-TnmmxlXvNw-26zLkzJLvKTxtIFJXxHlj7gvzon7ha84Zj6pF&_nc_zt=24&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=fOpB4Z5eYNO5tDDgR9lLUQ&_nc_ss=7a3a8&oh=00_Af3zUF3JWbrdNNlACT2XW9XP0LrEdh5R8bhv4Fgvp3r3Lw&oe=69DAEF41" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-[2.2rem] font-bold text-[#1e285a] mb-2 tracking-tight">Application Management</h1>
                            <p className="text-gray-600 text-[15px]">View and manage all candidates applying for active job posts.</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleExportPdf}
                                disabled={applications.length === 0 || isExportingPdf}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Download size={18} />
                                {isExportingPdf ? 'Exporting...' : 'Export'}
                            </button>
                            <button
                                onClick={() => setIsApplyModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#1e285a] text-white font-bold rounded-xl hover:bg-[#111942] transition-colors shadow-sm text-sm"
                            >
                                <Plus size={18} />
                                Student Apply
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                        {/* Jobs List (Left Col) */}
                        <div className="w-full md:w-1/3 border-r border-gray-100 bg-gray-50/30 flex flex-col">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4">Select Job Post</h3>
                                <div className="space-y-3">
                                    {jobs.map(job => (
                                        <div
                                            key={job.id}
                                            onClick={() => setSelectedJobId(job.id)}
                                            className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedJobId === job.id ? 'bg-white border-[#1e285a] shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`font-bold ${selectedJobId === job.id ? 'text-[#1e285a]' : 'text-gray-800'}`}>{job.title}</h4>
                                                {job.active ? (
                                                    <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></span>
                                                ) : (
                                                    <span className="w-2 h-2 rounded-full bg-gray-300 mt-1.5"></span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 font-medium">{job.department}</span>
                                                <span className="font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                                                    {applications.filter(a => a.jobId === job.id).length} Apps
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Applications List (Right Col) */}
                        <div className="w-full md:w-2/3 flex flex-col bg-white">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Applicants for {jobs.find(j => j.id === selectedJobId)?.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">Showing {filteredApplications.length} candidates</p>
                                </div>
                                <button className="flex items-center gap-2 p-2 text-gray-500 hover:text-[#1e285a] hover:bg-gray-50 rounded-lg transition-colors">
                                    <Filter size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 overflow-y-auto">
                                {filteredApplications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="text-gray-400" size={24} />
                                        </div>
                                        <h4 className="text-gray-900 font-bold mb-1">No applicants yet</h4>
                                        <p className="text-gray-500 text-sm">Waiting for students to apply for this position.</p>
                                    </div>
                                ) : (
                                    filteredApplications.map(app => (
                                        <div key={app.id} className="border border-gray-100 rounded-2xl p-5 hover:border-blue-100 hover:shadow-md transition-all group bg-white">
                                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                {/* Candidate Info */}
                                                <div className="flex gap-4 items-start">
                                                    <img src={app.avatar} alt={app.candidateName} className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm" />
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-[15px] mb-1">{app.candidateName}</h4>
                                                        <p className="text-xs text-gray-500 font-medium mb-3 flex items-center gap-1">
                                                            📍 {app.location} • 📅 Applied: {app.appliedDate}
                                                        </p>

                                                        {/* Details */}
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2 text-xs">
                                                                <span className="font-bold text-gray-700 w-20">Education:</span>
                                                                <span className="text-gray-600">{app.education}</span>
                                                            </div>
                                                            <div className="flex gap-2 text-xs items-start">
                                                                <span className="font-bold text-gray-700 w-20 pt-0.5">Skills:</span>
                                                                <div className="flex flex-wrap gap-1.5 flex-1">
                                                                    {app.skills.map((skill, idx) => (
                                                                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
                                                                            {skill}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions & Status */}
                                                <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end gap-3 min-w-[140px] border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                                                    <div className="relative group/dropdown cursor-pointer">
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${getStatusStyles(app.status)}`}>
                                                            {app.status}
                                                        </span>

                                                        {/* Simple hover dropdown for changing status */}
                                                        <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 py-2">
                                                            {['Pending', 'Interviewing', 'Shortlisted', 'Hired', 'Rejected'].map(s => (
                                                                <div
                                                                    key={s}
                                                                    onClick={() => handleStatusChange(app.id, s)}
                                                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 hover:text-[#1e285a] cursor-pointer"
                                                                >
                                                                    Set {s}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <a href={app.cvLink} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors tooltip relative" title="View CV">
                                                            <FileText size={16} strokeWidth={2.5} />
                                                        </a>
                                                        <button
                                                            onClick={() => handleStatusChange(app.id, 'Shortlisted')}
                                                            className="p-2 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors" title="Shortlist"
                                                        >
                                                            <CheckCircle size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(app.id, 'Rejected')}
                                                            className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Reject"
                                                        >
                                                            <XCircle size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditClick(app)}
                                                            className="p-2 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="Edit"
                                                        >
                                                            <Edit3 size={16} strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(app.id)}
                                                            className="p-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors" title="Delete"
                                                        >
                                                            <Trash2 size={16} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Student Apply Modal */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
                        <button
                            onClick={() => setIsApplyModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1e285a] mb-1 tracking-tight">Student Application</h2>
                            <p className="text-sm text-gray-500 font-medium">Apply for a job position. Your skills and education will be evaluated.</p>
                        </div>

                        <form onSubmit={handleApplySubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Select Job</label>
                                <select
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={newApp.jobId}
                                    onChange={(e) => setNewApp({ ...newApp, jobId: e.target.value })}
                                >
                                    {jobs.filter(j => j.active).map(j => (
                                        <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    placeholder="e.g. Ruwani Silva"
                                    value={newApp.candidateName}
                                    onChange={(e) => setNewApp({ ...newApp, candidateName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Location</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    placeholder="e.g. Kandy, Sri Lanka"
                                    value={newApp.location}
                                    onChange={(e) => setNewApp({ ...newApp, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Education</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    placeholder="e.g. BSc in IT, SLIIT"
                                    value={newApp.education}
                                    onChange={(e) => setNewApp({ ...newApp, education: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Skills (Comma separated)</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    value={newApp.skills}
                                    onChange={(e) => setNewApp({ ...newApp, skills: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-4 border border-transparent rounded-xl shadow-md shadow-blue-900/10 text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-colors"
                            >
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Application Modal */}
            {isEditModalOpen && editingApp && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
                        <button
                            onClick={() => { setIsEditModalOpen(false); setEditingApp(null); }}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1e285a] mb-1 tracking-tight">Edit Application</h2>
                            <p className="text-sm text-gray-500 font-medium">Update candidate information beneath.</p>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Select Job</label>
                                <select
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingApp.jobId}
                                    onChange={(e) => setEditingApp({ ...editingApp, jobId: Number(e.target.value) })}
                                >
                                    {jobs.map(j => (
                                        <option key={j.id} value={j.id}>{j.title} ({j.department})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Full Name</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingApp.candidateName}
                                    onChange={(e) => setEditingApp({ ...editingApp, candidateName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Location</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingApp.location}
                                    onChange={(e) => setEditingApp({ ...editingApp, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Education</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingApp.education}
                                    onChange={(e) => setEditingApp({ ...editingApp, education: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Skills (Comma separated)</label>
                                <input
                                    type="text" required
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingApp.skills}
                                    onChange={(e) => setEditingApp({ ...editingApp, skills: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-4 border border-transparent rounded-xl shadow-md shadow-blue-900/10 text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-colors"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
