import React, { useState } from 'react';
import '../styles/Login.css';

function ForgotPassword({ onNavigate }) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Password reset requested for:", email);
        setSubmitted(true);
    };

    return (
        <div className="login-container">
            <div className="login-card" style={{ maxWidth: '450px', height: 'auto', minHeight: '400px' }}>
                <div className="login-right" style={{ width: '100%', padding: '40px' }}>
                    
                    <div className="login-form-container">
                        <h2 className="login-title" style={{ marginBottom: '16px', textAlign: 'center' }}>
                            Forgot Password?
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', textAlign: 'center', marginBottom: '32px', lineHeight: '1.6' }}>
                            Enter the email address associated with your account and we'll send you a secure link to reset your password.
                        </p>

                        {!submitted ? (
                            <form className="login-form" onSubmit={handleSubmit}>
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
                                <div className="login-button-group">
                                    <button type="submit" className="login-button">
                                        Send Reset Link
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: '#16A34A' }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3 style={{ color: '#1E293B', fontSize: '1.2rem', marginBottom: '8px', fontWeight: '700' }}>Check your email</h3>
                                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.6' }}>We've sent password reset instructions to <br/><strong style={{ color: '#1E293B' }}>{email}</strong></p>
                            </div>
                        )}
                        
                        <div className="create-account-link-container">
                            <button type="button" onClick={() => onNavigate('login')} className="create-account-link" style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
                                &larr; Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
