import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn } from 'lucide-react';
import '../styles/AuthPages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessageType('error');
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password,
      });

      const { token, userId, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('fullName', user?.fullName || 'User');
      localStorage.setItem('userEmail', user?.email || email.trim());
      // store normalized userType in lowercase to make checks consistent
      localStorage.setItem('userType', (user?.type || 'user').toLowerCase());

      navigate('/');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="auth-brand">
            <div className="auth-brand-mark">CB</div>
            CareerBridge
          </div>
          <h1>Sign in to continue your career journey.</h1>
          <p>
            Use your email and password to access assessments, interview practice, recommendations,
            and your performance history.
          </p>
          <div className="auth-points">
            <div className="auth-point">Secure email/password access with token-based login.</div>
            <div className="auth-point">Your dashboard keeps assessment and interview history in one place.</div>
            <div className="auth-point">Built for students, job seekers, and career preparation workflows.</div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Enter the email you used during registration and continue into the platform.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="auth-input pl-11"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="auth-input pl-11"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {message ? <div className={`auth-message ${messageType}`}>{message}</div> : null}

            <button type="submit" className="auth-submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one here</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
