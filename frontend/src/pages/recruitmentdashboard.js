import React from 'react';
import {
    LayoutDashboard, Briefcase, Users, Settings, HelpCircle, LogOut,
    Search, Bell, Plus, List, Clock, Info, CheckCircle2, TrendingUp, MoreVertical, Calendar
} from 'lucide-react';

export default function App({ onLogout, onNavigate }) {
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
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
                        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-3 px-6 py-3.5 bg-[#f0f4ff] text-[#1e285a] font-bold border-l-4 border-[#1e285a] w-full text-left">
                            <LayoutDashboard size={20} strokeWidth={2.5} />
                            Dashboard
                        </button>
                        <button onClick={() => onNavigate('applications')} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
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
                        <button onClick={() => onNavigate('settings')} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <Settings size={20} strokeWidth={2} />
                            Settings
                        </button>
                    </nav>
                </div>
                <div className="pb-8 space-y-1">
                    <button onClick={() => onNavigate('help')} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
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
                        <h2 className="text-xl font-bold text-[#1e285a]">Atelier Talent</h2>
                        <nav className="flex items-center gap-6 h-full pt-1 hidden sm:flex">
                            <a href="#/" className="text-[#1e285a] font-bold border-b-[3px] border-[#1e285a] h-full flex items-center px-1">Analytics</a>
                            <a href="#/" className="text-gray-500 font-semibold h-full flex items-center px-1 hover:text-gray-800 transition-colors">Reports</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} strokeWidth={2.5} />
                            <input
                                type="text"
                                placeholder="Search talent..."
                                className="pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 w-72 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-[#1e285a] transition-colors relative">
                                <Bell size={20} strokeWidth={2} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white translate-x-1/2 -translate-y-1/4"></span>
                            </button>
                            <button className="text-gray-400 hover:text-[#1e285a] transition-colors">
                                <Settings size={20} strokeWidth={2} />
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-200 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-orange-200 transition-all">
                            <img src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-1/653701366_1656083882213917_224881808506701562_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFtyEdDwubf20fmTiHIpsZmRP0W5wXVHWBE_RbnBdUdYNLMsjsmZ5ev4Igs8J6ANo9Z0sLrSusYiwt_IMp0RjT6&_nc_ohc=4uMi4qjD6PYQ7kNvwEcTWii&_nc_oc=AdrFUVSo5x-0wXrCxQeG9hIB-wk8o19BeKtWLfA-TnmmxlXvNw-26zLkzJLvKTxtIFJXxHlj7gvzon7ha84Zj6pF&_nc_zt=24&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=fOpB4Z5eYNO5tDDgR9lLUQ&_nc_ss=7a3a8&oh=00_Af3zUF3JWbrdNNlACT2XW9XP0LrEdh5R8bhv4Fgvp3r3Lw&oe=69DAEF41" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h1 className="text-[2.2rem] font-bold text-[#1e285a] mb-2 tracking-tight">Good morning, Sanju</h1>
                        <p className="text-gray-600 text-[15px]">
                            Your recruitment pipeline is looking strong today. You have <span className="font-bold text-teal-600">3 new</span> applications to review.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Stat 1 */}
                        <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-10">
                                <div className="bg-[#f0f4ff] p-3 rounded-2xl text-[#1e285a]">
                                    <Briefcase size={24} strokeWidth={2} />
                                </div>
                                <span className="text-[10px] font-bold text-teal-800 bg-[#e0f2f1] px-3 py-1.5 rounded-full uppercase tracking-wider">3 NEW THIS WEEK</span>
                            </div>
                            <div>
                                <p className="text-gray-500 font-semibold mb-1 text-[13px]">Total Job Posts</p>
                                <h3 className="text-5xl font-bold text-[#1e285a] tracking-tight">12</h3>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-10">
                                <div className="bg-[#e0f2f1] p-3 rounded-2xl text-teal-700">
                                    <Users size={24} strokeWidth={2} />
                                </div>
                                <span className="flex items-center text-xs font-bold text-teal-700 gap-1 mt-1 transition-transform hover:-translate-y-0.5 text-[13px]">
                                    <TrendingUp size={16} strokeWidth={2.5} /> 12% increase
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 font-semibold mb-1 text-[13px]">Total Applicants</p>
                                <h3 className="text-5xl font-bold text-[#1e285a] tracking-tight">458</h3>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-10">
                                <div className="bg-[#e0f2f1] p-3 rounded-2xl text-teal-700">
                                    <CheckCircle2 size={24} strokeWidth={2} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wider">STABLE</span>
                            </div>
                            <div>
                                <p className="text-gray-500 font-semibold mb-1 text-[13px]">Shortlisted Candidates</p>
                                <h3 className="text-5xl font-bold text-[#1e285a] tracking-tight">84</h3>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="flex justify-between items-center p-7 border-b border-gray-100">
                                    <h3 className="text-[1.1rem] font-bold text-[#1e285a]">Recent Applications</h3>
                                    <a href="#/" className="flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors">
                                        Download Report
                                    </a>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-max">
                                        <thead>
                                            <tr className="text-[11px] font-bold text-gray-400/80 uppercase tracking-widest border-b border-gray-100 bg-gray-50/30">
                                                <th className="px-7 py-4">Candidate Name</th>
                                                <th className="px-7 py-4">Applied For</th>
                                                <th className="px-7 py-4">Date Applied</th>
                                                <th className="px-7 py-4">Status</th>
                                                <th className="px-7 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {/* Row 1 */}
                                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-7 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <img src="https://ui-avatars.com/api/?name=Sachini+Kawshalya&background=random" alt="Sachini Kawshalya" className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight mb-0.5">Anjana Sithumini</p>
                                                            <p className="text-[13px] text-gray-500 font-medium">Kurunegala, SL</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-7 py-5">
                                                    <p className="font-bold text-[#1e285a] mb-0.5">Senior Product Designer</p>
                                                    <p className="text-[13px] text-gray-500 font-medium border-none underline-none decoration-transparent">Design Department</p>
                                                </td>
                                                <td className="px-7 py-5 text-[14px] text-gray-600 font-medium">
                                                    Oct 24, 2023
                                                </td>
                                                <td className="px-7 py-5">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#b2f5ea] text-teal-800 uppercase tracking-widest shadow-sm">
                                                        Interviewing
                                                    </span>
                                                </td>
                                                <td className="px-7 py-5 text-right w-16">
                                                    <button className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 p-1"><MoreVertical size={18} strokeWidth={2.5} /></button>
                                                </td>
                                            </tr>

                                            {/* Row 2 */}
                                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-7 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <img src="https://scontent.fcmb11-3.fna.fbcdn.net/v/t39.30808-6/615482656_122235247076121171_918118880588851247_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeGqJt_eFeqlRJynMdC8-2Bf7LXQHVXg_mjstdAdVeD-aGdJwukj5Y-bNqii2Q9--9ppuo9ldsyZwhLDN3WnjakE&_nc_ohc=fSMoO5YHInYQ7kNvwEQ8sWy&_nc_oc=AdpVeP4nYBP7dKIo8lu2G7iK4nV4DgHaQFW3iIwFDlBvSCspY3ePigr4cqFkVapoXZQgQe9LeXp5XGe13b_539fn&_nc_zt=23&_nc_ht=scontent.fcmb11-3.fna&_nc_gid=GV48-PROYGdNqcrUBLDcCQ&_nc_ss=7a3a8&oh=00_Af03Y3x1TEspWKZoMJQrOpFJOx1_4BI8Ab1T-BK2-BgZbw&oe=69DAC970" alt="Nipuni Dihara" className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight mb-0.5">Nipuni Dihara </p>
                                                            <p className="text-[13px] text-gray-500 font-medium">Badulla, SL</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-7 py-5">
                                                    <p className="font-bold text-[#1e285a] mb-0.5">Frontend Architect</p>
                                                    <p className="text-[13px] text-gray-500 font-medium">Engineering</p>
                                                </td>
                                                <td className="px-7 py-5 text-[14px] text-gray-600 font-medium">
                                                    Oct 23, 2023
                                                </td>
                                                <td className="px-7 py-5">
                                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700 uppercase tracking-widest shadow-sm">
                                                        Pending
                                                    </span>
                                                </td>
                                                <td className="px-7 py-5 text-right">
                                                    <button className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 p-1"><MoreVertical size={18} strokeWidth={2.5} /></button>
                                                </td>
                                            </tr>

                                            {/* Row 3 */}
                                            <tr className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-7 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <img src="https://ui-avatars.com/api/?name=Anuja+Akalanaka&background=random" alt="Anuja Akalanaka" className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight mb-0.5">Anuja Akalanaka</p>
                                                            <p className="text-[13px] text-gray-500 font-medium">Kandy, SL</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-7 py-5">
                                                    <p className="font-bold text-[#1e285a] mb-0.5">Talent Acquisition Lead</p>
                                                    <p className="text-[13px] text-gray-500 font-medium">HR & People</p>
                                                </td>
                                                <td className="px-7 py-5 text-[14px] text-gray-600 font-medium">
                                                    Oct 22, 2023
                                                </td>
                                                <td className="px-7 py-5">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#fed7d7] text-red-800 uppercase tracking-widest shadow-sm">
                                                        Rejected
                                                    </span>
                                                </td>
                                                <td className="px-7 py-5 text-right">
                                                    <button className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 p-1"><MoreVertical size={18} strokeWidth={2.5} /></button>
                                                </td>
                                            </tr>

                                            {/* Row 4 */}
                                            <tr className="hover:bg-gray-50/50 transition-colors group border-b-transparent">
                                                <td className="px-7 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <img src="https://ui-avatars.com/api/?name=Tharusha+Fonseka&background=random" alt="Tharusha Fonseka" className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm" />
                                                        <div>
                                                            <p className="font-bold text-gray-900 leading-tight mb-0.5">Tharusha Fonseka</p>
                                                            <p className="text-[13px] text-gray-500 font-medium">Nawalapitiya, SL</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-7 py-5">
                                                    <p className="font-bold text-[#1e285a] mb-0.5">Backend Developer</p>
                                                    <p className="text-[13px] text-gray-500 font-medium">Engineering</p>
                                                </td>
                                                <td className="px-7 py-5 text-[14px] text-gray-600 font-medium">
                                                    Oct 22, 2023
                                                </td>
                                                <td className="px-7 py-5">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#b2f5ea] text-teal-800 uppercase tracking-widest shadow-sm">
                                                        Interviewing
                                                    </span>
                                                </td>
                                                <td className="px-7 py-5 text-right">
                                                    <button className="text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 p-1"><MoreVertical size={18} strokeWidth={2.5} /></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
                                <h3 className="text-[11px] font-bold text-[#1e285a] uppercase tracking-widest mb-5">Quick Actions</h3>
                                <div className="space-y-3.5">
                                    <button className="w-full flex items-center justify-between p-4 bg-[#111942] hover:bg-black transition-colors rounded-2xl text-white group shadow-md shadow-blue-900/10">
                                        <div className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl">
                                            <Plus size={20} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-bold text-[14px] px-4 w-full text-center tracking-tight">Post New Job</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 bg-[#f8f9fa] hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all rounded-2xl text-[#1e285a] group focus:bg-gray-100">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#1e285a]">
                                            <List size={20} strokeWidth={2} />
                                        </div>
                                        <span className="font-bold text-[14px] px-2 w-full text-center tracking-tight text-gray-700">View All Applicants</span>
                                    </button>
                                    <button className="w-full flex items-center justify-between p-4 bg-[#f8f9fa] hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all rounded-2xl text-[#1e285a] group focus:bg-gray-100">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#1e285a]">
                                            <Clock size={20} strokeWidth={2} />
                                        </div>
                                        <span className="font-bold text-[14px] px-2 w-full text-center tracking-tight text-gray-700">Schedule Interview</span>
                                    </button>
                                </div>
                            </div>

                            {/* Active Pipeline */}
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[11px] font-bold text-[#1e285a] uppercase tracking-widest">Active Pipeline</h3>
                                    <div className="bg-gray-100 rounded-full p-1 cursor-pointer hover:bg-gray-200 transition-colors">
                                        <Info size={14} className="text-gray-500" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-end mb-2.5">
                                            <span className="text-[14px] font-bold text-gray-800 leading-none">Screening</span>
                                            <span className="text-[13px] font-bold text-teal-700 leading-none">45%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-teal-700 h-2 rounded-full shadow-sm" style={{ width: '45%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2.5">
                                            <span className="text-[14px] font-bold text-gray-800 leading-none">Interview</span>
                                            <span className="text-[13px] font-bold text-[#1e285a] leading-none">28%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-[#1e285a] h-2 rounded-full shadow-sm" style={{ width: '28%' }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-end mb-2.5">
                                            <span className="text-[14px] font-bold text-gray-800 leading-none">Offer</span>
                                            <span className="text-[13px] font-bold text-teal-700 leading-none">12%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-teal-700 h-2 rounded-full shadow-sm" style={{ width: '12%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
}