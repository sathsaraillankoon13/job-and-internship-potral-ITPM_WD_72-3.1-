import React, { useState } from 'react';
import {
    LayoutDashboard, Briefcase, Users, Settings as SettingsIcon, HelpCircle, LogOut,
    Search, Bell, BookOpen, MessageCircle, FileText, ChevronDown, ChevronUp, Mail, Phone
} from 'lucide-react';

export default function HelpCenter({ onLogout, onNavigate }) {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "How do I schedule an interview with a candidate?",
            answer: "Navigate to the 'Interview Scheduling' tab from the sidebar. Select your shortlisted candidate from the dropdown, choose your preferred date, time, and format (Video, In-Person, Phone), and hit 'Schedule & Notify'. An automatic invite will be generated."
        },
        {
            id: 2,
            question: "Can I filter candidates by specific skills?",
            answer: "Yes! On the Candidate Shortlisting page, you can use the 'Smart Filters' panel. Type any comma-separated skills (like React, Java) in the Required Skills text box to instantly see matching profiles."
        },
        {
            id: 3,
            question: "How can I update my company details?",
            answer: "Click on 'Settings' in the sidebar. Switch to the 'Company Details' tab where you can update your company's name, website, and description. Don't forget to click Save!"
        },
        {
            id: 4,
            question: "Is there a limit to the number of job posts I can manage?",
            answer: "With the Premium Edition, you have unlimited job posts and unlimited candidate tracking pipelines."
        }
    ];

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
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
                        <button onClick={() => { if (onNavigate) onNavigate('settings') }} className="flex items-center gap-3 px-6 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-colors w-full text-left">
                            <SettingsIcon size={20} strokeWidth={2} />
                            Settings
                        </button>
                    </nav>
                </div>
                <div className="pb-8 space-y-1">
                    <button onClick={() => { if (onNavigate) onNavigate('help') }} className="flex items-center gap-3 px-6 py-3.5 bg-[#f0f4ff] text-[#1e285a] font-bold border-l-4 border-[#1e285a] w-full text-left">
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
                                placeholder="Search articles..."
                                className="pl-11 pr-4 py-2 bg-gray-50 border border-transparent rounded-full text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 w-64 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-[#1e285a] transition-colors relative">
                                <Bell size={20} strokeWidth={2} />
                            </button>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-100 transition-all border border-gray-100">
                            <img src="https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-1/653701366_1656083882213917_224881808506701562_n.jpg?stp=cp6_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFtyEdDwubf20fmTiHIpsZmRP0W5wXVHWBE_RbnBdUdYNLMsjsmZ5ev4Igs8J6ANo9Z0sLrSusYiwt_IMp0RjT6&_nc_ohc=4uMi4qjD6PYQ7kNvwEcTWii&_nc_oc=AdrFUVSo5x-0wXrCxQeG9hIB-wk8o19BeKtWLfA-TnmmxlXvNw-26zLkzJLvKTxtIFJXxHlj7gvzon7ha84Zj6pF&_nc_zt=24&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=fOpB4Z5eYNO5tDDgR9lLUQ&_nc_ss=7a3a8&oh=00_Af3zUF3JWbrdNNlACT2XW9XP0LrEdh5R8bhv4Fgvp3r3Lw&oe=69DAEF41" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto w-full">
                    {/* Hero Section */}
                    <div className="bg-[#1e285a] rounded-3xl p-10 text-center mb-8 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl"></div>

                        <h1 className="text-3xl font-bold text-white mb-4 relative z-10">How can we help you today?</h1>
                        <div className="relative max-w-xl mx-auto z-10">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search the knowledge base for guides, FAQs..."
                                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all text-gray-800 shadow-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* Quick Links Cards */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-start">
                            <div className="w-12 h-12 bg-blue-50 text-[#1034a6] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Getting Started</h3>
                            <p className="text-sm text-gray-500 leading-relaxed text-left">Learn the basics of setting up your recruitment dashboard and managing jobs.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-start">
                            <div className="w-12 h-12 bg-blue-50 text-[#1034a6] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Billing & Plans</h3>
                            <p className="text-sm text-gray-500 leading-relaxed text-left">Manage your premium subscriptions, view invoices, and change payment methods.</p>
                        </div>
                        <div className="bg-[#f0f4ff] p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-start">
                            <div className="w-12 h-12 bg-[#1034a6] text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageCircle size={24} />
                            </div>
                            <h3 className="font-bold text-[#1034a6] mb-2">Live Support</h3>
                            <p className="text-sm text-blue-800/70 leading-relaxed mb-4 text-left">Need immediate assistance? Chat directly with our customer success team.</p>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1e285a] flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Agents Online</span>
                        </div>
                    </div>

                    {/* FAQ & Contact Section Split */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* FAQs */}
                        <div className="w-full lg:w-2/3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <HelpCircle size={22} className="text-[#1034a6]" />
                                Frequently Asked Questions
                            </h3>

                            <div className="space-y-4">
                                {faqs.map((faq) => (
                                    <div key={faq.id} className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300">
                                        <button
                                            onClick={() => toggleFaq(faq.id)}
                                            className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <span className="font-bold text-gray-800">{faq.question}</span>
                                            {openFaq === faq.id ? (
                                                <ChevronUp size={20} className="text-[#1034a6] shrink-0 ml-4" />
                                            ) : (
                                                <ChevronDown size={20} className="text-gray-400 shrink-0 ml-4" />
                                            )}
                                        </button>
                                        <div
                                            className={`px-5 overflow-hidden transition-all duration-300 ease-in-out bg-gray-50 border-t border-gray-100 ${openFaq === faq.id ? 'max-h-40 py-5 opacity-100' : 'max-h-0 py-0 opacity-0'
                                                }`}
                                        >
                                            <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Widget */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
                                <p className="text-sm text-gray-500 mb-6">Our dedicated support team is available 24/7 to assist you.</p>

                                <div className="space-y-4">
                                    <a href="mailto:support@ateliertalent.com" className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group">
                                        <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-lg flex items-center justify-center text-gray-500 group-hover:text-[#1034a6] transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800">Email Us</h4>
                                            <p className="text-xs text-gray-500">support@ateliertalent.com</p>
                                        </div>
                                    </a>

                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group cursor-pointer">
                                        <div className="w-10 h-10 bg-gray-50 group-hover:bg-white rounded-lg flex items-center justify-center text-gray-500 group-hover:text-[#1034a6] transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800">Call Support</h4>
                                            <p className="text-xs text-gray-500">+1 (800) 123-4567</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
