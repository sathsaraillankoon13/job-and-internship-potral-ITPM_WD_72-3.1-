import React, { useState } from 'react';
import '../styles/Profile.css';

function Profile({ onNavigate, userData: propUserData, setUserData }) {
    const [isEditing, setIsEditing] = useState(false);
    
    // Fallback
    const defaultUser = {
        firstName: 'User',
        lastName: '',
        email: 'user@example.com',
        university: '',
        degree: '',
        bio: 'No bio provided.',
        cvName: null
    };

    const actualUser = propUserData || defaultUser;

    const [tempData, setTempData] = useState({...actualUser});

    React.useEffect(() => {
        if (propUserData) {
            setTempData({...propUserData});
        }
    }, [propUserData]);

    const handleEditToggle = () => {
        if (isEditing) {
            setTempData({...actualUser});
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (setUserData) setUserData({...tempData});
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setTempData(prev => ({ ...prev, cvName: e.target.files[0].name }));
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
            onNavigate('signup');
        }
    };

    const safeFirstName = actualUser.firstName || 'U';
    const safeLastName = actualUser.lastName || ' ';
    const initials = `${safeFirstName.charAt(0)}${safeLastName.trim() ? safeLastName.charAt(0) : ''}`.toUpperCase();
    
    const userData = actualUser;

    return (
        <div className="profile-container">
            <div className="profile-card">
                
                {/* Banner & Header */}
                <div className="profile-banner">
                    <div className="logout-btn-container">
                        <button className="logout-btn" onClick={() => onNavigate('login')}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="profile-header">
                    <div className="profile-avatar-container">
                        {initials}
                    </div>
                    <div className="profile-name-display">
                        {userData.firstName} {userData.lastName}
                    </div>
                    <div className="profile-role-display">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
                        </svg>
                        {userData.degree || 'Student'}
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="profile-btn-primary" onClick={handleEditToggle}>
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                Edit Profile
                            </button>
                        ) : (
                            <>
                                <button className="profile-btn-secondary" onClick={handleEditToggle}>
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Cancel
                                </button>
                                <button className="profile-btn-danger" onClick={handleDelete} type="button">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Delete Account
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Sections */}
                {isEditing ? (
                    <form className="profile-content" onSubmit={handleSave}>
                        <div className="profile-section-card">
                            <h2 className="profile-section-title">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                Personal Details
                            </h2>
                            <div className="profile-edit-grid">
                                <div className="detail-item">
                                    <label className="detail-label">First Name</label>
                                    <input type="text" name="firstName" value={tempData.firstName} onChange={handleChange} className="profile-input" required />
                                </div>
                                <div className="detail-item">
                                    <label className="detail-label">Last Name</label>
                                    <input type="text" name="lastName" value={tempData.lastName} onChange={handleChange} className="profile-input" required />
                                </div>
                                <div className="detail-item full-width">
                                    <label className="detail-label">Email Address</label>
                                    <input type="email" name="email" value={tempData.email} onChange={handleChange} className="profile-input" required />
                                </div>
                                <div className="detail-item full-width">
                                    <label className="detail-label">University</label>
                                    <input type="text" name="university" value={tempData.university} onChange={handleChange} className="profile-input" />
                                </div>
                                <div className="detail-item full-width">
                                    <label className="detail-label">Degree/Major</label>
                                    <input type="text" name="degree" value={tempData.degree} onChange={handleChange} className="profile-input" />
                                </div>
                                <div className="detail-item full-width">
                                    <label className="detail-label">About Me</label>
                                    <textarea name="bio" value={tempData.bio} onChange={handleChange} className="profile-input" placeholder="Tell recruiters about yourself..."></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <div className="profile-section-card">
                            <h2 className="profile-section-title">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Resume / CV
                            </h2>
                            <label className="cv-upload-container">
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{display: 'none'}} />
                                <svg width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '1rem', color: '#64748b'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <span style={{fontSize: '1.1rem', fontWeight: '500', color: '#334155'}}>Upload your CV</span>
                                <span style={{marginTop: '0.5rem', fontSize: '0.85rem'}}>PDF, DOC, or DOCX</span>
                                
                                {tempData.cvName && (
                                    <div className="cv-file-name">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{flexShrink: 0}}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{tempData.cvName}</span>
                                    </div>
                                )}
                            </label>

                            <button type="submit" className="profile-btn-primary" style={{marginTop: '1.5rem', width: '100%', justifyContent: 'center'}}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                Save Profile
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-content">
                        <div className="profile-section-card">
                            <h2 className="profile-section-title">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Personal Details
                            </h2>
                            <div className="profile-details-list">
                                <div className="detail-item">
                                    <span className="detail-label">Email Address</span>
                                    <span className="detail-value">
                                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"></path></svg>
                                        <span style={{overflowWrap: 'anywhere'}}>{userData.email}</span>
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">University</span>
                                    <span className="detail-value">
                                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                        <span style={{overflowWrap: 'anywhere'}}>{userData.university || 'Not specified'}</span>
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">About Me</span>
                                    <span className="detail-value" style={{lineHeight: '1.6', fontSize: '0.95rem', color: '#475569', marginTop: '0.25rem'}}>
                                        {userData.bio || 'No bio provided yet.'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="profile-section-card">
                            <h2 className="profile-section-title">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Resume / CV
                            </h2>
                            {userData.cvName ? (
                                <div className="cv-upload-container" style={{padding: '1.5rem', borderStyle: 'solid', borderColor: '#10b981', background: 'rgba(16, 185, 129, 0.05)', cursor: 'default'}}>
                                    <svg width="40" height="40" fill="none" stroke="#10b981" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '0.5rem'}}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <span style={{color: '#1e293b', fontWeight: '600', marginBottom: '0.25rem'}}>Uploaded successfully</span>
                                    <span style={{fontSize: '0.9rem', color: '#64748b', wordBreak: 'break-all'}}>{userData.cvName}</span>
                                </div>
                            ) : (
                                <div className="cv-upload-container" style={{cursor: 'default', opacity: 0.7}}>
                                    <p style={{margin: 0}}>No CV uploaded yet.</p>
                                    <p style={{margin: '0.5rem 0 0 0', fontSize: '0.85rem'}}>Click 'Edit Profile' to add your resume.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
