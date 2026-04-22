import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Briefcase, Users, HelpCircle, LogOut,
    Search, Bell, Calendar, Clock, Video, Send, CheckCircle, Plus, AlertCircle, Phone, MapPin, Edit3, Trash2, XCircle, Download
} from 'lucide-react';

export default function InterviewScheduling({ onLogout, onNavigate }) {
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/candidates')
            .then(res => res.json())
            .then(data => setCandidates(data))
            .catch(console.error);

        fetch('http://localhost:5000/api/interviews')
            .then(res => res.json())
            .then(data => setInterviews(data))
            .catch(console.error);
    }, []);

    // New Interview Form State
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [interviewType, setInterviewType] = useState('Video Call');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // Edit Interview State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingInterview, setEditingInterview] = useState(null);

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCandidate || !date || !time) return;

        const candidate = candidates.find(c => String(c.id) === String(selectedCandidate));
        if (!candidate) return;

        const newInterview = {
            candidateId: String(candidate.id),
            candidateName: candidate.name,
            role: candidate.role,
            date: date,
            time: time,
            type: interviewType,
            status: 'Pending',
        };

        fetch('http://localhost:5000/api/interviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newInterview)
        })
            .then(res => res.json())
            .then(savedInterview => {
                setInterviews([savedInterview, ...interviews]);
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 3000);
                setSelectedCandidate('');
                setDate('');
                setTime('');
            })
            .catch(console.error);
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/api/interviews/${id}`, { method: 'DELETE' })
            .then(() => setInterviews(ints => ints.filter(i => i.id !== id)))
            .catch(console.error);
    };

    const handleEditClick = (interview) => {
        setEditingInterview({ ...interview });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/api/interviews/${editingInterview.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingInterview)
        })
            .then(res => res.json())
            .then(updatedInterview => {
                setInterviews(ints => ints.map(i => i.id === editingInterview.id ? updatedInterview : i));
                setIsEditModalOpen(false);
                setEditingInterview(null);
            })
            .catch(console.error);
    };

    const getStatusColor = (status) => {
        return status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200';
    };

    const getTypeIcon = (type) => {
        if (type === 'Video Call') return <Video size={14} />;
        if (type === 'Phone') return <Phone size={14} />;
        return <MapPin size={14} />;
    };

    const handleExportInterviewPdf = async () => {
        if (isExportingPdf || interviews.length === 0) {
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
            doc.text('Interview Scheduling Report', 40, 50);

            doc.setTextColor(71, 85, 105);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(`Generated at: ${generatedAt}`, 40, 92);
            doc.text(`Total interviews: ${interviews.length}`, 40, 106);

            const rows = interviews.map((interview) => {
                const candidate = candidates.find((c) => String(c.id) === String(interview.candidateId));
                return [
                    interview.candidateName || '-',
                    interview.role || '-',
                    candidate?.location || '-',
                    interview.date || '-',
                    interview.time || '-',
                    interview.type || '-',
                    interview.status || '-',
                ];
            });

            autoTable(doc, {
                startY: 122,
                head: [['Candidate', 'Role', 'Location', 'Date', 'Time', 'Format', 'Status']],
                body: rows,
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

            doc.save(`interview-scheduling-report-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error('Failed to export interview PDF:', error);
        } finally {
            setIsExportingPdf(false);
        }
    };

    return (
        <div className="flex bg-[#f8f9fa] font-sans h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex-col justify-between hidden md:flex shrink-0 h-full overflow-y-auto">
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
                        <button onClick={() => { if (onNavigate) onNavigate('dashboard') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <LayoutDashboard size={20} strokeWidth={2.5} />
                            Dashboard
                        </button>
                        <button onClick={() => { if (onNavigate) onNavigate('applications') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <Briefcase size={20} strokeWidth={2} />
                            Application Management
                        </button>
                        <button onClick={() => { if (onNavigate) onNavigate('shortlisting') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <Users size={20} strokeWidth={2} />
                            Candidate Shortlisting
                        </button>
                        <button className="flex items-center gap-3 px-6 py-3.5 bg-[#f0f4ff] text-[#1e285a] font-bold border-l-4 border-[#1e285a] w-full text-left">
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

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col h-full bg-[#f8f9fa]">
                {/* Header Navbar */}
                <header className="bg-white border-b border-gray-100 flex items-center justify-between px-8 py-5 shrink-0 z-10 sticky top-0">
                    <div></div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="Search interviews..."
                                className="pl-11 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 w-64 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-[#1e285a] transition-colors relative">
                                <Bell size={20} strokeWidth={2} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white translate-x-1/2 -translate-y-1/4"></span>
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-100 transition-all">
                            <img src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-1/653701366_1656083882213917_224881808506701562_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFtyEdDwubf20fmTiHIpsZmRP0W5wXVHWBE_RbnBdUdYNLMsjsmZ5ev4Igs8J6ANo9Z0sLrSusYiwt_IMp0RjT6&_nc_ohc=4uMi4qjD6PYQ7kNvwEcTWii&_nc_oc=AdrFUVSo5x-0wXrCxQeG9hIB-wk8o19BeKtWLfA-TnmmxlXvNw-26zLkzJLvKTxtIFJXxHlj7gvzon7ha84Zj6pF&_nc_zt=24&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=fOpB4Z5eYNO5tDDgR9lLUQ&_nc_ss=7a3a8&oh=00_Af3zUF3JWbrdNNlACT2XW9XP0LrEdh5R8bhv4Fgvp3r3Lw&oe=69DAEF41" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-[2.2rem] font-bold text-[#1e285a] mb-2 tracking-tight">Interview Scheduling</h1>
                            <p className="text-gray-600 text-[15px]">Organize interview slots and automatically notify candidates.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleExportInterviewPdf}
                            disabled={interviews.length === 0 || isExportingPdf}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Download size={18} />
                            {isExportingPdf ? 'Exporting...' : 'Export'}
                        </button>
                    </div>

                    {/* Success Notification Toast */}
                    {showSuccessModal && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-green-800">
                            <CheckCircle size={20} className="text-green-600" />
                            <div>
                                <h4 className="font-bold text-sm">Interview Scheduled & Notification Sent!</h4>
                                <p className="text-xs mt-0.5 opacity-90">An email has been automatically dispatched to the candidate with the meeting invite.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col xl:flex-row gap-6 items-start">

                        {/* Left Side: Scheduled Interviews */}
                        <div className="w-full xl:w-2/3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar size={20} className="text-[#1034a6]" />
                                Upcoming Interviews
                            </h3>

                            <div className="space-y-4">
                                {interviews.length === 0 ? (
                                    <div className="text-center py-10">
                                        <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p className="font-bold text-gray-500">No upcoming interviews scheduled</p>
                                    </div>
                                ) : (
                                    interviews.map(interview => (
                                        <div key={interview.id} className="group border border-gray-100 hover:border-blue-100 rounded-2xl p-5 hover:bg-blue-50/30 transition-all flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between">

                                            {/* Candidate Detail */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shadow-sm shrink-0 border border-white">
                                                    <img src={candidates.find(c => c.id === interview.candidateId)?.avatar} alt="Avatar" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 leading-tight">{interview.candidateName}</h4>
                                                    <p className="text-xs text-[#1034a6] font-bold mt-0.5">{interview.role}</p>
                                                </div>
                                            </div>

                                            {/* Details & Time */}
                                            <div className="flex flex-col gap-2 md:items-end">
                                                <div className="flex flex-wrap gap-2 md:justify-end">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border ${getStatusColor(interview.status)}`}>
                                                        {interview.status}
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                        {getTypeIcon(interview.type)} {interview.type}
                                                    </span>
                                                    <button onClick={() => handleEditClick(interview)} className="px-2 py-1 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors" title="Edit">
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(interview.id)} className="px-2 py-1 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors" title="Delete">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-white md:bg-transparent p-2 md:p-0 rounded-lg border border-gray-100 md:border-transparent mt-1 md:mt-0">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {interview.date}</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {interview.time}</span>
                                                </div>
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Side: Schedule Form */}
                        <div className="w-full xl:w-1/3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 xl:sticky xl:top-[6.5rem]">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-[#1034a6]" />
                                Schedule New
                            </h3>

                            <form onSubmit={handleScheduleSubmit} className="space-y-5">
                                {/* Candidate Dropdown */}
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Assign Candidate</label>
                                    <select
                                        required
                                        value={selectedCandidate}
                                        onChange={(e) => setSelectedCandidate(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                    >
                                        <option value="" disabled>Select shortlisted candidate</option>
                                        {candidates.map(candidate => (
                                            <option key={candidate.id} value={candidate.id}>{candidate.name} - {candidate.role}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date Selection */}
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Interview Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="date"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Interview Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="time"
                                            required
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Format</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Video Call', 'In-Person', 'Phone'].map(type => (
                                            <div
                                                key={type}
                                                onClick={() => setInterviewType(type)}
                                                className={`cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${interviewType === type ? 'bg-[#1034a6] text-white border-transparent shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {getTypeIcon(type)}
                                                <span className="mt-1.5">{type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-4 mt-2 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(16,52,166,0.2)] text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all active:scale-[0.98]"
                                >
                                    <Send size={16} />
                                    Schedule & Notify
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-bold tracking-wide uppercase mt-3 mb-1">
                                    Automatic email will be sent
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </main>

            {/* Edit Interview Modal */}
            {isEditModalOpen && editingInterview && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative">
                        <button
                            onClick={() => { setIsEditModalOpen(false); setEditingInterview(null); }}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#1e285a] mb-1 tracking-tight">Edit Interview</h2>
                            <p className="text-sm text-gray-500 font-medium">Update scheduled interview details below.</p>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Interview Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date" required
                                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                        value={editingInterview.date}
                                        onChange={(e) => setEditingInterview({ ...editingInterview, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Interview Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="time" required
                                        className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                        value={editingInterview.time}
                                        onChange={(e) => setEditingInterview({ ...editingInterview, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Format</label>
                                <select
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingInterview.type}
                                    onChange={(e) => setEditingInterview({ ...editingInterview, type: e.target.value })}
                                >
                                    <option value="Video Call">Video Call</option>
                                    <option value="In-Person">In-Person</option>
                                    <option value="Phone">Phone</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1 mb-1.5 block">Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    value={editingInterview.status}
                                    onChange={(e) => setEditingInterview({ ...editingInterview, status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                </select>
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
