import React, { useState } from 'react';
import api from '../api';
import { User, Lock, ArrowRight, graduationCap, Rocket, Shield, Globe } from 'lucide-react';

function Login({ onNavigate, setLoggedUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('auth/login', { username, password });
      const data = response.data;
      if (setLoggedUser) setLoggedUser(data);

      const userRole = (data.role || data.type || 'student').toLowerCase();
      if (userRole === 'admin') onNavigate('/admin/dashboard');
      else if (userRole === 'employer' || userRole === 'company') onNavigate('/employer/dashboard');
      else onNavigate('/student/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'The credentials you entered are incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-['Sora'] selection:bg-blue-500/30">

      {/* --- STUNNING MESH BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-sky-500/20 blur-[100px] animate-bounce [animation-duration:8s]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[90px] [animation:pulse_10s_infinite]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] md:flex-row">

          {/* --- EXPERIENCE PART--- */}
          <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-blue-700/40 to-transparent p-12 md:flex border-r border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/40">
                  <Globe className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">CareerBridge</span>
              </div>

              <h2 className="text-4xl font-extrabold leading-tight text-white mb-6">
                Your Future <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Starts Right Here.</span>
              </h2>

              <div className="space-y-6">
                {[
                  { icon: <Rocket size={18} />, title: "Accelerate Growth", desc: "Access high-growth internship roles." },
                  { icon: <Shield size={18} />, title: "Secure Platform", desc: "Data protection and verified employers." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-300 transition-colors group-hover:bg-blue-600 group-hover:text-white">
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
              <p className="text-xs italic text-blue-100/70 leading-relaxed">
                "Finding my first internship was effortless. The platform connected me with mentors who actually cared about my growth."
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-blue-400"></div>
                <span className="text-[10px] font-bold text-white tracking-wide">Alex Chen — UX Intern</span>
              </div>
            </div>
          </div>

          {/* --- FORM --- */}
          <div className="flex w-full flex-col justify-center p-8 sm:p-12 md:w-1/2 bg-slate-900/40">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-10 text-center md:text-left">
                <h3 className="text-3xl font-black text-white mb-2">Welcome Back</h3>
                <p className="text-slate-400 text-sm font-medium">Continue your journey to success.</p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs font-bold text-red-400 animate-in fade-in slide-in-from-top-2">
                    {error}
                  </div>
                )}

                <div className="group relative space-y-1.5 focus-within:translate-x-1 transition-transform cursor-pointer">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    <User size={12} className="text-blue-500" /> Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your handle"
                      className="peer w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-5 pr-5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-[6px] focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>

                <div className="group relative space-y-1.5 focus-within:translate-x-1 transition-transform cursor-pointer">
                  <div className="flex items-center justify-between ml-1">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <Lock size={12} className="text-blue-500" /> Password
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('forgotpassword')}
                      className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      FORGOT?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="peer w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-5 pr-5 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-[6px] focus:ring-blue-500/10"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative group w-full overflow-hidden rounded-2xl bg-blue-600 py-4 font-black transition-all hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2 text-sm text-white">
                    {loading ? 'Authenticating...' : 'Sign In To Portal'}
                    {!loading && <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </form>

              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  New to CareerBridge?
                </p>
                <button
                  onClick={() => onNavigate('signup')}
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-blue-500/30"
                >
                  Create a student account
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Animations */}
      <style>{`
        @keyframes pulse_10s {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default Login;