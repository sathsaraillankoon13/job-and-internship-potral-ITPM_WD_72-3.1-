import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Login({ onNavigate, setLoggedUser }) {
  const [username, setUsername] = useState(''); // keeping username field
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
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (setLoggedUser) setLoggedUser(data);
        onNavigate('dashboard');
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Could not connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter your username/email');
      return;
    }
    alert(`Password reset link has been sent to ${username.trim()} (simulated)`);
    setIsForgotPassword(false);
    setUsername('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-50 p-4 font-sans flex items-center justify-center">
      <div className="min-h-[550px] w-full max-w-[850px] overflow-hidden rounded-[30px] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-xl md:flex">

        {/* Left Side - Illustration */}
        <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-sky-500/65 p-10 text-white md:flex">
          <div className="relative -mt-4 flex h-full w-full flex-1 items-center justify-center">
            {/* Optional: add your SVG illustration here */}
          </div>
          <div className="z-10 mb-2 px-4 text-center text-[11px] font-light leading-relaxed tracking-wide text-white/80">
            Securely manage your profile and discover opportunities.
          </div>
        </div>

        {/* Right Side - Login / Forgot Password */}
        <div className="relative flex w-full flex-col bg-transparent pl-2 md:w-[45%]">
          <div className="flex flex-1 flex-col justify-between px-10 pb-12 pt-36">
            <div className="mx-auto w-full max-w-sm">
              {!isForgotPassword && (
                <>
                  <h2 className="mb-12 text-center text-xl font-bold tracking-wide text-gray-500">
                    Login your account
                  </h2>
                  <form className="flex flex-col gap-6" onSubmit={handleLoginSubmit}>
                    {error && (
                      <div className="bg-red-50 text-red-600 rounded-xl p-3 flex items-center gap-3 text-sm font-medium border border-red-100">
                        <AlertCircle size={18} />
                        <p>{error}</p>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                        placeholder="Username or email"
                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-1.5 text-sm font-semibold text-gray-700 outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        placeholder="Password"
                        className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-1.5 text-sm font-semibold text-gray-700 outline-none focus:border-sky-500"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input id="remember-me" type="checkbox" className="h-4 w-4 text-[#1034a6] border-gray-300 rounded" />
                        <label htmlFor="remember-me" className="ml-2 block text-xs font-bold text-gray-600">Remember Me</label>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setError(''); }}
                        className="text-xs font-bold text-[#1034a6] hover:text-blue-800"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-full bg-sky-500 px-12 py-2.5 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition disabled:opacity-70"
                    >
                      {loading ? 'Signing In...' : 'Login'}
                    </button>
                  </form>
                  <div className="mt-5 text-center">
                    <button
                      onClick={() => onNavigate('signup')}
                      className="text-[10px] font-bold uppercase text-gray-500 hover:text-sky-500"
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}

              {isForgotPassword && (
                <>
                  <button
                    onClick={() => { setIsForgotPassword(false); setError(''); }}
                    className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1034a6] mb-6 uppercase tracking-widest"
                  >
                    <ArrowLeft size={16} /> Back to Login
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Forgot Password</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Enter your username/email to receive reset instructions.
                  </p>
                  <form onSubmit={handleResetSubmit} className="space-y-6">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError(''); }}
                      placeholder="Username or email"
                      className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-1.5 text-sm font-semibold text-gray-700 outline-none focus:border-sky-500"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full rounded-full bg-sky-500 px-12 py-2.5 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition"
                    >
                      Send Reset Link
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}