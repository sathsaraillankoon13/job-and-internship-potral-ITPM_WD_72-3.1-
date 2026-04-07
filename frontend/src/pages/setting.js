import React, { useState } from 'react';
import {
    LayoutDashboard, Briefcase, Users, Settings as SettingsIcon, HelpCircle, LogOut,
    Search, Bell, User, Building, Shield, BellRing, CreditCard, Save, CheckCircle
} from 'lucide-react';

export default function Setting({ onLogout, onNavigate }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

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
                        <button onClick={() => { if (onNavigate) onNavigate('interviews') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <SettingsIcon size={20} strokeWidth={2} />
                            Interview scheduling
                        </button>
                        <button onClick={() => { if (onNavigate) onNavigate('settings') }} className="flex items-center gap-3 px-6 py-3.5 bg-[#f0f4ff] text-[#1e285a] font-bold border-l-4 border-[#1e285a] w-full text-left">
                            <SettingsIcon size={20} strokeWidth={2} />
                            Settings
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
                                placeholder="Search settings..."
                                className="pl-11 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 w-64 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-[#1e285a] transition-colors relative">
                                <Bell size={20} strokeWidth={2} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white translate-x-1/2 -translate-y-1/4"></span>
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-100 transition-all border border-gray-100">
                            <img src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-1/653701366_1656083882213917_224881808506701562_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFtyEdDwubf20fmTiHIpsZmRP0W5wXVHWBE_RbnBdUdYNLMsjsmZ5ev4Igs8J6ANo9Z0sLrSusYiwt_IMp0RjT6&_nc_ohc=4uMi4qjD6PYQ7kNvwEcTWii&_nc_oc=AdrFUVSo5x-0wXrCxQeG9hIB-wk8o19BeKtWLfA-TnmmxlXvNw-26zLkzJLvKTxtIFJXxHlj7gvzon7ha84Zj6pF&_nc_zt=24&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=fOpB4Z5eYNO5tDDgR9lLUQ&_nc_ss=7a3a8&oh=00_Af3zUF3JWbrdNNlACT2XW9XP0LrEdh5R8bhv4Fgvp3r3Lw&oe=69DAEF41" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-[2.2rem] font-bold text-[#1e285a] mb-2 tracking-tight">Settings & Preferences</h1>
                            <p className="text-gray-600 text-[15px]">Manage your account details, organization info, and portal configurations.</p>
                        </div>
                    </div>

                    {showSuccess && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in text-green-800 shadow-sm">
                            <CheckCircle size={20} className="text-green-600" />
                            <div>
                                <h4 className="font-bold text-sm">Settings Successfully Saved!</h4>
                                <p className="text-xs mt-0.5 opacity-90">Your account configurations have been updated across the platform.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Settings Nav Area */}
                        <div className="w-full lg:w-64 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex-shrink-0 sticky top-[6.5rem]">
                            <nav className="space-y-1.5">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-[#f0f4ff] text-[#1034a6]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <User size={18} strokeWidth={2.5} /> Personal Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('company')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'company' ? 'bg-[#f0f4ff] text-[#1034a6]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <Building size={18} strokeWidth={2.5} /> Company Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'notifications' ? 'bg-[#f0f4ff] text-[#1034a6]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <BellRing size={18} strokeWidth={2.5} /> Notifications
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-[#f0f4ff] text-[#1034a6]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <Shield size={18} strokeWidth={2.5} /> Security
                                </button>
                                <button
                                    onClick={() => setActiveTab('billing')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'billing' ? 'bg-[#f0f4ff] text-[#1034a6]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <CreditCard size={18} strokeWidth={2.5} /> Billing & Plan
                                </button>
                            </nav>
                        </div>

                        {/* Settings Form Area */}
                        <div className="flex-1 w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[500px]">

                            {activeTab === 'profile' && (
                                <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Personal Profile</h3>

                                    <div className="flex items-center gap-6 mb-4">
                                        <img src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-1/653701366_1656083882213917_224881808506701562_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFtyEdDwubf20fmTiHIpsZmRP0W5wXVHWBE_RbnBdUdYNLMsjsmZ5ev4Igs8J6ANo9Z0sLrSusYiwt_IMp0RjT6&_nc_ohc=4uMi4qjD6PYQ7kNvwEcTWii&_nc_oc=AdrFUVSo5x-0wXrCxQeG9hIB-wk8o19BeKtWLfA-TnmmxlXvNw-26zLkzJLvKTxtIFJXxHlj7gvzon7ha84Zj6pF&_nc_zt=24&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=fOpB4Z5eYNO5tDDgR9lLUQ&_nc_ss=7a3a8&oh=00_Af3zUF3JWbrdNNlACT2XW9XP0LrEdh5R8bhv4Fgvp3r3Lw&oe=69DAEF41" className="w-24 h-24 rounded-full border border-gray-200 shadow-sm" alt="Profile" />
                                        <div>
                                            <button type="button" className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm mb-2">Upload New Photo</button>
                                            <p className="text-xs text-gray-500 font-medium">Recommended size: 500x500px. Max size 2MB.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">First Name</label>
                                            <input type="text" defaultValue="Sandamal" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Last Name</label>
                                            <input type="text" defaultValue="Lansakara" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                            <input type="email" defaultValue="sanju@gmail.com" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Role / Job Title</label>
                                            <input type="text" defaultValue="Head of Recruitment" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-700" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                        <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-[0_4px_15px_rgba(16,52,166,0.2)] text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none transition-all active:scale-[0.98]">
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </div>
                                </form>
                            )}

                            {activeTab === 'company' && (
                                <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Company Details</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Company Name</label>
                                            <input type="text" defaultValue="Atelier Talent Inc." className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] transition-all outline-none text-gray-700" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Company Website</label>
                                            <input type="text" defaultValue="https://atelier-talent.io" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] transition-all outline-none text-gray-700" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">About Company</label>
                                            <textarea rows="4" defaultValue="Leading tech recruitment platform for top 1% talents globally." className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] transition-all outline-none text-gray-700 resize-none"></textarea>
                                        </div>
                                    </div>
                                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                                        <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 border border-transparent rounded-xl text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 transition-all">
                                            <Save size={16} /> Update Details
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Notifications Placeholder */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Notification Preferences</h3>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'New Application Received', desc: 'Get notified when a student applies for your job post.', active: true },
                                            { title: 'Interview Reminders', desc: 'Receive a reminder 1 hour before an interview.', active: true },
                                            { title: 'Marketing Communications', desc: 'Product updates, offers, and recruitment tips.', active: false },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${item.active ? 'bg-[#1034a6]' : 'bg-gray-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 flex justify-end border-t border-gray-100">
                                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-[#1034a6] text-white font-bold rounded-xl"><Save size={16} /> Save Preferences</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-6 animate-fade-in">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Security & Passwords</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">New Password</label>
                                            <input type="password" placeholder="Enter new password" className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-[#1034a6] transition-all outline-none" />
                                        </div>
                                    </div>
                                    <div className="pt-6 flex justify-end">
                                        <button onClick={handleSave} className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl mr-2">Update Password</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="space-y-6 animate-fade-in text-center py-10">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1034a6]">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan Active</h3>
                                    <p className="text-gray-500 text-sm max-w-md mx-auto">Your recruitment dashboard is currently on the Premium Edition. Your next billing date is Dec 12, 2023.</p>
                                    <button className="mt-6 px-6 py-3 text-[#1034a6] bg-blue-50 hover:bg-blue-100 font-bold rounded-xl">Manage Subscription</button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
