import React, { useState } from 'react';
import '../styles/Login.css';

function ForgotPassword({ onNavigate }) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add actual reset link logic here
        console.log("Password reset requested for:", email);
        setSubmitted(true);
    };

    return (
        <div className="login-container">
            {/* Centered glass card without the split-screen for a simpler layout */ }
            <div className="login-card" style={{ maxWidth: '500px', minHeight: '400px' }}>
                <div className="login-right" style={{ width: '100%', paddingLeft: 0 }}>
                    
                    <div className="login-form-container" style={{ padding: '6rem 3rem 3rem 3rem' }}>
                        <div className="login-form-wrapper" style={{ margin: '0 auto', width: '100%' }}>
                            <h2 className="login-title" style={{ marginBottom: '1rem' }}>
                                Forgot Password?
                            </h2>
                            <p style={{ fontSize: '0.85rem', color: '#6B7280', textAlign: 'center', marginBottom: '2.5rem', lineHeight: '1.7' }}>
                                Enter the email address associated with your account and we'll send you a secure link to reset your password.
                            </p>

                            {!submitted ? (
                                <form className="login-form" style={{ gap: '1.5rem' }} onSubmit={handleSubmit}>
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
                                    <div className="login-button-group" style={{ paddingTop: '1rem' }}>
                                        <button type="submit" className="login-button" style={{ width: '100%' }}>
                                            Send Reset Link
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '1rem 0', animation: 'fadeIn 0.5s' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0095ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h3 style={{ color: '#374151', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Check your email</h3>
                                    <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: '1.5' }}>We've sent password reset instructions to <br/><strong>{email}</strong></p>
                                </div>
                            )}
                            
                            <div className="create-account-link-container" style={{ marginTop: '2.5rem' }}>
                                <button type="button" onClick={() => onNavigate('login')} className="create-account-link" style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}>
                                    ← Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
