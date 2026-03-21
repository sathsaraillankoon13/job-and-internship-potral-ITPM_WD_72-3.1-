import React, { useState } from 'react';
import '../styles/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Add actual login/authentication logic here
        console.log("Login attempted with:", { username, password });
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* Left Side: Purple area */}
                <div className="login-left">
                    {/* Character Illustration SVG */}
                    <div className="login-illustration-container">
                        <svg className="login-illustration" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Light blue background circle */}
                            <circle cx="200" cy="200" r="140" fill="#E0F2FE" />

                            {/* Left tall purple leaf */}
                            <path d="M90 280 C50 250, 50 160, 90 130 C110 160, 110 250, 90 280 Z" fill="#3B82F6" opacity="0.9" />

                            {/* Right curved leaf */}
                            <path d="M310 320 C360 270, 340 180, 270 140 C280 200, 270 280, 310 320 Z" fill="#6366F1" opacity="0.95" />

                            {/* Small fern-like leaves left */}
                            <path d="M 120 260 Q 100 220 80 200" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" />
                            <path d="M 115 250 Q 95 240 85 220" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 110 235 Q 90 225 80 215" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />

                            {/* Small fern-like leaves right */}
                            <path d="M 270 290 Q 300 240 330 200" stroke="#0066afff" strokeWidth="6" strokeLinecap="round" />
                            <path d="M 275 270 Q 305 255 320 230" stroke="#0066afff" strokeWidth="4" strokeLinecap="round" />
                            <path d="M 285 250 Q 310 235 315 210" stroke="#0066afff" strokeWidth="4" strokeLinecap="round" />

                            {/* The jumping person */}
                            <g transform="translate(185, 120)">
                                {/* Hair (flowing) */}
                                <path d="M25 -10 C 40 -50, -40 -30, -10 30 C 10 40, 20 20, 25 -10 Z" fill="#1E3A8A" />
                                {/* Face */}
                                <circle cx="30" cy="5" r="14" fill="#FDBA74" />

                                {/* Arm left */}
                                <path d="M 20 30 Q -25 10 -40 -15" stroke="#FDBA74" strokeWidth="11" strokeLinecap="round" />
                                {/* Hand details */}
                                <circle cx="-42" cy="-17" r="5" fill="#FDBA74" />

                                {/* Arm right */}
                                <path d="M 40 30 Q 80 10 80 -25" stroke="#FDBA74" strokeWidth="11" strokeLinecap="round" />
                                <circle cx="80" cy="-27" r="5" fill="#FDBA74" />

                                {/* Body (White top) */}
                                <path d="M 12 25 C 25 20, 48 20, 48 40 C 48 55, 45 75, 40 70 C 35 68, 25 68, 20 70 C 15 75, 12 55, 12 25 Z" fill="#FFFFFF" />

                                {/* Leg left (Purple pants) */}
                                <path d="M 23 60 Q 5 110 -40 120" stroke="#0563a2ff" strokeWidth="20" strokeLinecap="round" />
                                {/* Leg right */}
                                <path d="M 41 60 Q 60 70 50 100 L 25 145" stroke="#0563a2ff" strokeWidth="20" strokeLinecap="round" />

                                {/* Shoes */}
                                <path d="M -30 115 L -45 120 L -45 125 L -30 125 Z" fill="#111827" /> {/* Left Shoe */}
                                <path d="M 33 138 L 15 145 L 18 152 L 35 145 Z" fill="#111827" /> {/* Right Shoe */}
                            </g>
                        </svg>
                    </div>

                    <div className="login-lorem-text">
                        Securely manage your academic profile, discover verified university internships,
                        and share authentic ratings to build a trusted, empowering career network for all future student leaders.
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="login-right">

                    {/* "Welcome back" tag */}
                    <div className="welcome-tag">
                        Welcome back
                    </div>

                    <div className="login-form-container">

                        <div className="login-form-wrapper">
                            <h2 className="login-title">
                                Login your account
                            </h2>

                            <form className="login-form" onSubmit={handleLogin}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="username"
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
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="login-input"
                                        required
                                    />
                                </div>

                                <div className="login-button-group">
                                    <button type="submit" className="login-button">
                                        Login
                                    </button>
                                </div>
                            </form>

                            <div className="create-account-link-container">
                                <a href="/signup" className="create-account-link">
                                    Create Account
                                </a>
                            </div>
                        </div>

                        <div className="forgot-password-container">
                            <a href="/reset-password" className="forgot-password-link">
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;


