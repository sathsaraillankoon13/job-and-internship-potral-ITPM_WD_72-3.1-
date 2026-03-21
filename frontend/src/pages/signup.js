import React, { useState } from 'react';
import '../styles/Login.css';

function Signup({ onNavigate }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Signup attempted:", { email, username });
    };

    return (
        <div className="login-container">
            {/* Same glassy card from Login.css, but swapping child order! */}
            <div className="login-card">
                
                {/* Form Area - Now on the LEFT */}
                <div className="login-right" style={{ paddingLeft: '2.5rem', paddingRight: '0.5rem', position: 'relative' }}>
                    
                    {/* Welcome tag */}
                    <div className="welcome-tag" style={{ background: '#035ce2', boxShadow: '0 4px 6px -1px rgba(3, 92, 226, 0.5)' }}>
                        Join Us
                    </div>

                    <div className="login-form-container" style={{ padding: '6rem 2.5rem 3rem 0' }}>
                        <div className="login-form-wrapper" style={{ marginLeft: 0 }}>
                            <h2 className="login-title" style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
                                Create an account
                            </h2>

                            <form className="login-form" style={{ gap: '1.5rem' }} onSubmit={handleSignup}>
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

                                <div className="login-button-group" style={{ paddingTop: '1.5rem', alignItems: 'flex-start' }}>
                                    <button type="submit" className="login-button">
                                        Sign Up
                                    </button>
                                </div>
                            </form>
                            
                            <div className="create-account-link-container" style={{ textAlign: 'left', marginTop: '2rem' }}>
                                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 'bold' }}>Already have an account? </span>
                                <button type="button" onClick={() => onNavigate('login')} className="create-account-link" style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
                                    Log In Here
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Illustration Area - Now on the RIGHT */}
                <div className="login-left" style={{ borderRadius: '0 30px 30px 0' }}>
                    <div className="login-illustration-container">
                        <svg className="login-illustration" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* A different illustration for variety (person with a laptop) */}
                            <circle cx="200" cy="200" r="140" fill="#E0F2FE" />
                            
                            {/* Abstract leaves for consistent aesthetic */}
                            <path d="M100 280 C60 250, 60 180, 100 150 C120 180, 120 250, 100 280 Z" fill="#3B82F6" opacity="0.9" />
                            <path d="M300 320 C350 270, 330 180, 260 140 C270 200, 260 280, 300 320 Z" fill="#0066afff" opacity="0.9" />

                            {/* Desk Elements */}
                            <rect x="130" y="240" width="140" height="15" rx="5" fill="#4B5563" />
                            <rect x="180" y="215" width="40" height="25" rx="2" fill="#1E3A8A" />
                            <path d="M 175 240 L 225 240 L 230 245 L 170 245 Z" fill="#9CA3AF" />

                            {/* Person Working */}
                            <g transform="translate(140, 140)">
                                {/* Head */}
                                <circle cx="30" cy="5" r="14" fill="#FDBA74" />
                                {/* Hair */}
                                <path d="M 25 -10 C 15 -10, 10 0, 15 15 C 20 20, 35 15, 45 15 C 50 0, 40 -10, 25 -10 Z" fill="#1E3A8A" />
                                
                                {/* Body */}
                                <path d="M 15 25 C 0 25, 10 50, 15 75 C 20 100, 45 100, 45 75 C 50 50, 40 25, 25 25 Z" fill="#035ce2" />
                                
                                {/* Arm */}
                                <path d="M 25 35 Q 45 65 55 65" stroke="#FDBA74" strokeWidth="10" strokeLinecap="round" />
                                <circle cx="58" cy="65" r="5" fill="#FDBA74" />
                            </g>
                        </svg>
                    </div>

                    <div className="login-lorem-text" style={{ fontSize: '13px', padding: '0 2rem 2rem' }}>
                        Join the platform to securely network and explore amazing university opportunities around you!
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Signup;
