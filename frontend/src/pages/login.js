import React, { useState } from 'react';
import { Mail, Lock, Linkedin, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Hardcoded frontend validation (with trim to avoid spaces and added gmail.com for safety)
    const trimmedEmail = email.trim().toLowerCase();
    if ((trimmedEmail === 'sanju@gamil.com' || trimmedEmail === 'sanju@gmail.com') && password === 'kawshi2024') {
      setError('');
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans">
      {/* Left Section - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80")' }}
        ></div>

        {/* Soft Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 via-gray-300/30 to-gray-500/80"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0f349e] tracking-tight">Nexus<span className="font-semibold text-gray-800">Talent</span></h1>
            <div className="h-4 w-px bg-gray-400"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-600 uppercase">The Curator</span>
          </div>

          {/* Main Copy */}
          <div className="max-w-xl pb-32">
            <h2 className="text-6xl font-extrabold text-[#111827] leading-[1.1] mb-6 tracking-tight">
              Curating the future <br />
              of <span className="text-[#1034a6]">leadership.</span>
            </h2>
            <p className="text-xl text-gray-800 font-medium leading-relaxed max-w-lg">
              Access the world's most sophisticated talent pipeline. We don't just find candidates; we architect teams that define industries.
            </p>
          </div>

          {/* Footer Stats */}
          <div className="flex gap-16">
            <div>
              <p className="text-3xl font-bold text-[#111827] mb-1 tracking-tight">12.4k</p>
              <p className="text-[10px] font-bold text-gray-700 tracking-[0.15em] uppercase">Vetted Executives</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#111827] mb-1 tracking-tight">98%</p>
              <p className="text-[10px] font-bold text-gray-700 tracking-[0.15em] uppercase">Retention Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Dynamic Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative">
        {/* Top right dots decorative */}
        <div className="absolute top-8 right-12 flex space-x-2 hidden md:flex">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
        </div>

        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">

          <div className={`transition-all duration-300 ease-in-out ${isForgotPassword ? 'opacity-0 invisible absolute' : 'opacity-100 visible relative'}`}>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-gray-500 font-medium">Please enter your credentials to access the gallery.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm font-medium border border-red-100">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="name@nexus-talent.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-gray-900 placeholder-gray-400 tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#1034a6] focus:ring-[#1034a6] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-600">
                    Remember Me
                  </label>
                </div>
                <div className="text-xs">
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(''); }}
                    className="font-bold text-[#1034a6] hover:text-blue-800 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-blue-900/10 text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1034a6] transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Social Authentication
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-xl shadow-sm bg-[#f8f9fa] text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-xl shadow-sm bg-[#f8f9fa] text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-[#0A66C2]" strokeWidth={2.5} />
                  LinkedIn
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password View */}
          <div className={`transition-all duration-300 ease-in-out ${!isForgotPassword ? 'opacity-0 invisible absolute' : 'opacity-100 visible relative'}`}>
            <button
              onClick={() => setIsForgotPassword(false)}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1034a6] transition-colors mb-6 uppercase tracking-widest"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to Login
            </button>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Forgot Password</h2>
              <p className="text-sm text-gray-500 font-medium">Enter your email address and we'll send you instructions to reset your password.</p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="name@nexus-talent.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-blue-900/10 text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1034a6] transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          </div>

        </div>

        <div className="absolute bottom-10 flex justify-center w-full">
          <p className="text-sm font-medium text-gray-600">
            Don't have an account? <a href="#/" className="font-bold text-[#1034a6] hover:underline">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
}
