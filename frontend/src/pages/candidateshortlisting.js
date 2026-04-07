import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Briefcase, Users, Calendar, HelpCircle, LogOut,
    Search, Bell, Filter, Download, CheckCircle, MapPin, GraduationCap, Code, Star, XCircle, Mail, Phone
} from 'lucide-react';

export default function CandidateShortlisting({ onLogout, onNavigate }) {
    // Advanced Filters State
    const [filters, setFilters] = useState({
        searchTerm: '',
        skills: '',
        education: 'All',
        experience: 'All'
    });

    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/candidates')
            .then(res => res.json())
            .then(data => setCandidates(data))
            .catch(console.error);
    }, []);

    // Modal state for View Profile
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Handle Toggling Shortlist Status
    const toggleShortlist = (id) => {
        const candidate = candidates.find(c => c.id === id);
        if (!candidate) return;

        fetch(`http://localhost:5000/api/candidates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shortlisted: !candidate.shortlisted })
        })
            .then(res => res.json())
            .then(updatedCandidate => {
                setCandidates(candidates.map(c => c.id === id ? updatedCandidate : c));
            })
            .catch(console.error);
    };

    // Derived Filtering Logic
    const filteredCandidates = candidates.filter(candidate => {
        // 1. Search Term Filter
        const matchesSearch = candidate.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            candidate.role.toLowerCase().includes(filters.searchTerm.toLowerCase());

        // 2. Skills Filter (comma separated)
        const filterSkills = filters.skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '');
        const candidateSkills = candidate.skills.map(s => s.toLowerCase());
        const matchesSkills = filterSkills.length === 0 || filterSkills.every(fs => candidateSkills.some(cs => cs.includes(fs)));

        // 3. Education Filter
        let matchesEdu = true;
        if (filters.education !== 'All') {
            if (filters.education === 'BSc') matchesEdu = candidate.education.includes('BSc');
            else if (filters.education === 'MSc') matchesEdu = candidate.education.includes('MSc');
            else if (filters.education === 'Diploma') matchesEdu = candidate.education.includes('Diploma');
        }

        // 4. Experience Filter
        let matchesExp = true;
        if (filters.experience !== 'All') {
            if (filters.experience === '0-2 Yrs') matchesExp = candidate.experience <= 2;
            else if (filters.experience === '3-5 Yrs') matchesExp = candidate.experience >= 3 && candidate.experience <= 5;
            else if (filters.experience === '5+ Yrs') matchesExp = candidate.experience > 5;
        }

        return matchesSearch && matchesSkills && matchesEdu && matchesExp;
    });

    // Sort by Match Score (Descending)
    const sortedCandidates = [...filteredCandidates].sort((a, b) => b.matchScore - a.matchScore);

    return (
        <div className="flex bg-[#f8f9fa] font-sans h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shrink-0 h-full overflow-y-auto">
                <div>
                    <div className="p-6 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#1e285a] text-white p-2 rounded-lg">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-[#1e285a] leading-tight text-lg">Recruitment Management</h1>
                                <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-0.5 uppercase">PREMIUM EDITION</p>
                            </div>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        {/* Make sure App.js has onNavigate prop handled */}
                        <button onClick={() => { if (onNavigate) onNavigate('dashboard') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <LayoutDashboard size={20} strokeWidth={2.5} />
                            Dashboard
                        </button>
                        <button onClick={() => { if (onNavigate) onNavigate('applications') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <Briefcase size={20} strokeWidth={2} />
                            Application Management
                        </button>
                        <button onClick={() => { if (onNavigate) onNavigate('shortlisting') }} className="flex items-center gap-3 px-6 py-3.5 bg-[#f0f4ff] text-[#1e285a] font-bold border-l-4 border-[#1e285a] w-full text-left">
                            <Users size={20} strokeWidth={2} />
                            Candidate Shortlisting
                        </button>
                        <button onClick={() => { if (onNavigate) onNavigate('interviews') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
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
                    <div>
                        <h2 className="text-xl font-bold text-[#1e285a]">Atelier Talent</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="Global search..."
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
                    {/* Header Details */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-[2.2rem] font-bold text-[#1e285a] mb-2 tracking-tight">Candidate Shortlisting</h1>
                            <p className="text-gray-600 text-[15px]">Filter and select top-tier candidates efficiently using AI-driven match scores.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm">
                                <Download size={18} />
                                Export List
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1e285a] text-white font-bold rounded-xl hover:bg-[#111942] transition-colors shadow-sm text-sm">
                                <CheckCircle size={18} />
                                Advance {sortedCandidates.filter(c => c.shortlisted).length} Selected
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Filtering Sidebar Panel */}
                        <div className="w-full lg:w-80 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-shrink-0 sticky top-[6.5rem]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                    <Filter size={18} className="text-[#1034a6]" />
                                    Smart Filters
                                </h3>
                                <button
                                    onClick={() => setFilters({ searchTerm: '', skills: '', education: 'All', experience: 'All' })}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Search Name/Role */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Search Role/Name</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="text"
                                            value={filters.searchTerm}
                                            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                                            placeholder="e.g. Frontend Developer"
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Required Skills</label>
                                    <textarea
                                        rows="2"
                                        value={filters.skills}
                                        onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                                        placeholder="React, Java, UI/UX (comma separated)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                {/* Experience Level */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Experience (Years)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['All', '0-2 Yrs', '3-5 Yrs', '5+ Yrs'].map(exp => (
                                            <button
                                                key={exp}
                                                onClick={() => setFilters({ ...filters, experience: exp })}
                                                className={`py-2 px-3 text-xs font-bold rounded-lg transition-all border ${filters.experience === exp ? 'bg-[#1034a6] text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {exp}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-widest">Education Level</label>
                                    <select
                                        value={filters.education}
                                        onChange={(e) => setFilters({ ...filters, education: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none"
                                    >
                                        <option value="All">Any Education</option>
                                        <option value="Diploma">Diploma / Associate's</option>
                                        <option value="BSc">Bachelor's Degree (BSc, BA)</option>
                                        <option value="MSc">Master's Degree (MSc, MA)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Candidates Grid */}
                        <div className="flex-1 w-full">
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800">
                                    {sortedCandidates.length} Candidates Found
                                </h3>
                            </div>

                            <div className="space-y-4">
                                {sortedCandidates.length === 0 ? (
                                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                                        <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">No matching candidates</h3>
                                        <p className="text-gray-500 text-sm">Try adjusting your filters to find more candidates.</p>
                                    </div>
                                ) : (
                                    sortedCandidates.map((candidate) => (
                                        <div key={candidate.id} className={`bg-white rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${candidate.shortlisted ? 'border-blue-400 ring-4 ring-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                                            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">

                                                {/* Candidate Profile Info */}
                                                <div className="flex gap-5">
                                                    <div className="relative">
                                                        <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full object-cover bg-gray-100 shadow-sm" />
                                                        <div className="absolute -bottom-2 -right-2 bg-green-100 border-2 border-white text-green-700 font-extrabold text-[10px] w-8 h-8 flex items-center justify-center rounded-full shadow-sm">
                                                            {candidate.matchScore}%
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-lg font-bold text-gray-900 leading-none">{candidate.name}</h4>
                                                            {candidate.matchScore >= 90 && (
                                                                <span className="flex items-center text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-widest gap-1">
                                                                    <Star size={10} fill="currentColor" /> Top Match
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[#1034a6] font-bold text-sm mb-3">{candidate.role}</p>

                                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-gray-600 mb-4">
                                                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {candidate.location}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-gray-400" /> {candidate.experience} Years Exp.</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="flex items-center gap-1.5"><GraduationCap size={14} className="text-gray-400" /> {candidate.education}</span>
                                                        </div>

                                                        {/* Skills Tags */}
                                                        <div className="flex flex-wrap gap-2">
                                                            <Code size={14} className="text-gray-400 mt-1" />
                                                            {candidate.skills.map((skill, idx) => (
                                                                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-bold">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                                    <button
                                                        onClick={() => toggleShortlist(candidate.id)}
                                                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all w-full sm:w-36 ${candidate.shortlisted ? 'bg-blue-50 text-[#1034a6] border-2 border-[#1034a6]/20 hover:bg-white' : 'bg-[#1e285a] text-white border-2 border-transparent hover:bg-[#111942] shadow-md'}`}
                                                    >
                                                        {candidate.shortlisted ? (
                                                            <><CheckCircle size={16} /> Shortlisted</>
                                                        ) : (
                                                            'Shortlist'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedProfile(candidate); setIsProfileModalOpen(true); }}
                                                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-gray-700 text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-36"
                                                    >
                                                        View Profile
                                                    </button>
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

            {/* View Profile Modal */}
            {isProfileModalOpen && selectedProfile && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative">
                        <button
                            onClick={() => { setIsProfileModalOpen(false); setSelectedProfile(null); }}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <XCircle size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                                <img src={selectedProfile.avatar} alt={selectedProfile.name} className="w-32 h-32 rounded-full object-cover shadow-md mb-4 border-4 border-gray-50" />
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedProfile.name}</h2>
                                <p className="text-[#1034a6] font-bold text-sm mb-4">{selectedProfile.role}</p>

                                <div className="bg-gray-50 rounded-2xl p-4 w-full text-left space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                                        <Mail size={16} className="text-gray-400" />
                                        <span>{selectedProfile.name.split(' ')[0].toLowerCase()}@example.com</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                                        <Phone size={16} className="text-gray-400" />
                                        <span>+94 77 123 4567</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{selectedProfile.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/3 flex flex-col">
                                <div className="mb-6 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 border-b pb-2">Professional Summary</h3>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed mt-2 text-justify">
                                            Highly motivated professional with {selectedProfile.experience} years of experience. Proven track record in developing high-quality software solutions and leading teams to success in fast-paced environments.
                                        </p>
                                    </div>
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-center shadow-sm">
                                        <div className="text-2xl font-extrabold">{selectedProfile.matchScore}%</div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Match</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Education</h4>
                                        <div className="flex items-start gap-2">
                                            <GraduationCap size={18} className="text-[#1034a6] mt-0.5" />
                                            <span className="text-sm font-bold text-gray-800">{selectedProfile.education}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Experience</h4>
                                        <div className="flex items-start gap-2">
                                            <Briefcase size={18} className="text-[#1034a6] mt-0.5" />
                                            <span className="text-sm font-bold text-gray-800">{selectedProfile.experience}+ Years Total</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Top Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProfile.skills.map((skill, idx) => (
                                            <span key={idx} className="bg-[#1034a6]/10 text-[#1034a6] px-3 py-1.5 rounded-lg text-xs font-bold">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
