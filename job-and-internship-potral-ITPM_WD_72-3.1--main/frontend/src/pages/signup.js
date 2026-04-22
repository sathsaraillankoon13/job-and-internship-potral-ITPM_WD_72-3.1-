import React, { useState } from 'react';
import api from '../api';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

function Signup({ onNavigate, setLoggedUser }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('auth/register', {
        username,
        email,
        password,
        firstName: username,
        lastName: " "
      });

      const data = response.data;
      if (setLoggedUser) setLoggedUser(data);
      onNavigate('home');
    } catch (err) {
      setError(err.response?.data?.message || 'We could not create your account at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-['Sora'] selection:bg-blue-500/30">
      
      {/* --- MESH BACKGROUND (REVERSED) --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-500/20 blur-[100px] animate-bounce [animation-duration:9s]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-sky-600/20 blur-[90px] [animation:pulse_12s_infinite]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] md:flex-row-reverse">
          
          {/* --- LEFT SIDE: THE PLEDGE --- */}
          <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-bl from-indigo-700/40 to-transparent p-12 md:flex border-l border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/40">
                  <Sparkles className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">Join CareerBridge</span>
              </div>
              
              <h2 className="text-4xl font-extrabold leading-tight text-white mb-6">
                Start Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">New Chapter.</span>
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: <ShieldCheck size={18} />, title: "Verified Network", desc: "Connect with genuine employers and vetted university programs." },
                  { icon: <Zap size={18} />, title: "Smart Matching", desc: "Our AI tailors opportunities based on your growing skillset." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-indigo-300 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Member Highlight</p>
              <p className="text-xs text-blue-100/70 leading-relaxed italic">
                "Signing up was the best decision for my career. I got my first offer within 2 weeks of completing my profile."
              </p>
            </div>
          </div>

          {/* --- RIGHT SIDE: THE SIGNUP FORM --- */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 md:w-1/2 bg-slate-900/40">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-8 text-center md:text-left">
                <h3 className="text-3xl font-black text-white mb-1">Create Account</h3>
                <p className="text-slate-400 text-sm font-medium">Join thousands of students building their future.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSignup}>
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs font-bold text-red-400 animate-in fade-in zoom-in-95">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    <Mail size={12} className="text-indigo-500" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-5 pr-5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-[6px] focus:ring-indigo-500/10"
                    required
                  />
                </div>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    <User size={12} className="text-indigo-500" /> Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a unique handle"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-5 pr-5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-[6px] focus:ring-indigo-500/10"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      <Lock size={12} className="text-indigo-500" /> Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-5 pr-5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-[6px] focus:ring-indigo-500/10"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Confirm
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-5 pr-5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/[0.08] focus:ring-[6px] focus:ring-indigo-500/10"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-indigo-600 py-4 font-black shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
                  >
                    <span className="relative flex items-center justify-center gap-2 text-sm text-white">
                      {loading ? 'Creating Member ID...' : 'Join The Community'}
                      {!loading && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-10 text-center">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Already a member?</p>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Log In To Your Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Signup;