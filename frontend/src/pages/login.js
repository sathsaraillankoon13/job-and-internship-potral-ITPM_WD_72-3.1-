import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Login({ onNavigate, setLoggedUser }) {
  const [email, setEmail] = useState('');        // Using email (more common for auth)
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: email.trim(),   // backend expects 'username'
          password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        if (setLoggedUser) setLoggedUser(data);
        console.log("Login successful");
        onNavigate('dashboard');
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Could not connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    console.log("Password reset requested for:", email.trim());
    // TODO: Add actual reset API call here later
    alert('Password reset link has been sent to your email (simulated)');
    setIsForgotPassword(false);
    setEmail('');
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans">
      {/* Left Section - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80")' 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 via-gray-300/30 to-gray-500/80"></div>

        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#0f349e] tracking-tight">
              Nexus<span className="font-semibold text-gray-800">Talent</span>
            </h1>
            <div className="h-4 w-px bg-gray-400"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-gray-600 uppercase">The Curator</span>
          </div>

          <div className="max-w-xl pb-32">
            <h2 className="text-6xl font-extrabold text-[#111827] leading-[1.1] mb-6 tracking-tight">
              Curating the future <br />
              of <span className="text-[#1034a6]">leadership.</span>
            </h2>
            <p className="text-xl text-gray-800 font-medium leading-relaxed max-w-lg">
              Access the world's most sophisticated talent pipeline. We don't just find candidates; 
              we architect teams that define industries.
            </p>
          </div>

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

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative">
        <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">

          {/* Login Form */}
          <div className={`transition-all duration-300 ease-in-out ${isForgotPassword ? 'opacity-0 invisible absolute' : 'opacity-100 visible relative'}`}>
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-gray-500 font-medium">Please enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm font-medium border border-red-100">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest pl-1">Email / Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="name@nexus-talent.com or username"
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
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-50 transition-all outline-none text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-[#1034a6] focus:ring-[#1034a6] border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-600">Remember Me</label>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setError(''); }}
                  className="text-xs font-bold text-[#1034a6] hover:text-blue-800 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md shadow-blue-900/10 text-sm font-bold text-white bg-[#1034a6] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1034a6] transition-colors disabled:opacity-70"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Forgot Password Form */}
          <div className={`transition-all duration-300 ease-in-out ${!isForgotPassword ? 'opacity-0 invisible absolute' : 'opacity-100 visible relative'}`}>
            <button
              onClick={() => { setIsForgotPassword(false); setError(''); }}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1034a6] transition-colors mb-6 uppercase tracking-widest"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to Login
            </button>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Forgot Password</h2>
              <p className="text-sm text-gray-500 font-medium">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
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
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
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
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="font-bold text-[#1034a6] hover:underline"
            >
              Contact Admin / Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}