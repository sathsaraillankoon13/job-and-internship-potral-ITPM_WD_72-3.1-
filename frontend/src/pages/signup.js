import React, { useState } from 'react';
import '../styles/Login.css';

function Signup({ onNavigate, setLoggedUser }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    firstName: username,
                    lastName: " "
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (setLoggedUser) setLoggedUser(data);
                console.log("Account created successfully!");
                onNavigate('home');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Could not connect to server.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* Form Area - On left for signup */}
                <div className="login-right">
                    <div className="welcome-tag">
                        Join Us
                    </div>

                    <div className="login-form-container">
                        <h2 className="login-title">
                            Create an account
                        </h2>

                        <form className="login-form" onSubmit={handleSignup}>
                            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '-0.5rem', fontWeight: '500' }}>{error}</div>}
                            <div className="input-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="login-input"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="login-input"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="login-input"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    className="login-input"
                                    required
                                />
                            </div>

                            <div className="login-button-group">
                                <button type="submit" className="login-button">
                                    Sign Up
                                </button>
                            </div>
                        </form>

                        <div className="create-account-link-container">
                            <span style={{ fontSize: '12px', color: '#64748B' }}>Already have an account? </span>
                            <button type="button" onClick={() => onNavigate('login')} className="create-account-link" style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
                                Log In Here
                            </button>
                        </div>
                    </div>
                </div>

                {/* Illustration Area - On right */}
                <div className="login-left">
                    <div className="login-illustration-container">
                        <svg className="login-illustration" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="200" cy="200" r="140" fill="#E0F2FE" opacity="0.2" />

                            <path d="M100 280 C60 250, 60 180, 100 150 C120 180, 120 250, 100 280 Z" fill="#60A5FA" opacity="0.9" />
                            <path d="M300 320 C350 270, 330 180, 260 140 C270 200, 260 280, 300 320 Z" fill="#93C5FD" opacity="0.9" />

                            <rect x="130" y="240" width="140" height="15" rx="5" fill="#E2E8F0" />
                            <rect x="180" y="215" width="40" height="25" rx="2" fill="#1E40AF" />
                            <path d="M 175 240 L 225 240 L 230 245 L 170 245 Z" fill="#94A3B8" />

                            <g transform="translate(140, 140)">
                                <circle cx="30" cy="5" r="14" fill="#FDBA74" />
                                <path d="M 25 -10 C 15 -10, 10 0, 15 15 C 20 20, 35 15, 45 15 C 50 0, 40 -10, 25 -10 Z" fill="#1E293B" />
                                <path d="M 15 25 C 0 25, 10 50, 15 75 C 20 100, 45 100, 45 75 C 50 50, 40 25, 25 25 Z" fill="#DBEAFE" />
                                <path d="M 25 35 Q 45 65 55 65" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" />
                                <circle cx="58" cy="65" r="5" fill="#FDBA74" />
                            </g>
                        </svg>
                    </div>

                    <div className="login-lorem-text">
                        Join the platform to securely network and explore amazing university opportunities around you!
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Signup;