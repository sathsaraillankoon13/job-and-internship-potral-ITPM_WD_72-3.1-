import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, BadgeCheck } from 'lucide-react';
import '../styles/AuthPages.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessageType('error');
      setMessage('Please fill in full name, email, password, and confirm password.');
      return;
    }

    if (password !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        conpassword: confirmPassword,
      });

      const { token, userId, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('fullName', user?.fullName || fullName.trim());
      localStorage.setItem('userEmail', user?.email || email.trim());
      localStorage.setItem('userType', user?.type || 'user');

      navigate('/');
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1>Create your account and start tracking career readiness.</h1>
          <p>
            Register with your full name, email address, and password. Your profile will be used
            across assessments, mock interviews, recommendations, and dashboard reporting.
          </p>
          <div className="auth-points">
            <div className="auth-point">One account for assessments, interviews, and job recommendations.</div>
            <div className="auth-point">Your full name appears across your dashboard and history.</div>
            <div className="auth-point">Token-based signup keeps the flow simple and direct.</div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-header">
            <h2>Create account</h2>
            <p>Fill in the details below and get instant access to CareerBridge.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="relative">
                <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  className="auth-input pl-11"
                  type="text"
                  placeholder="Sathsara Perera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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

            <div className="auth-grid-2">
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="auth-input pl-11"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    className="auth-input pl-11"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {message ? <div className={`auth-message ${messageType}`}>{message}</div> : null}

            <button type="submit" className="auth-submit" disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
