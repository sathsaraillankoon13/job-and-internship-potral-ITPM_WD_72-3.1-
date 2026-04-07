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
        <div className="profile-layout-content">
            <div className="profile-header-card">
                <div className="profile-avatar-large">
                    {initials}
                </div>
                <div className="profile-header-info">
                    <h2>{userData.firstName} {userData.lastName}</h2>
                    <p className="role-badge">
                        <span className="icon">🎓</span> {userData.degree || 'Student'}
                    </p>
                </div>
                <div className="profile-header-actions">
                    <button className="btn-danger-outline" onClick={() => onNavigate('login')}>
                        Log Out
                    </button>
                    {!isEditing ? (
                        <button className="primary-btn" onClick={handleEditToggle}>
                            Edit Profile
                        </button>
                    ) : (
                        <button className="btn-outline" onClick={handleEditToggle}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-body-grid">
                {isEditing ? (
                    <form className="profile-form-section" onSubmit={handleSave}>
                        <div className="content-card">
                            <div className="card-header">
                                <h3>Personal Details</h3>
                            </div>
                            <div className="profile-edit-grid">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={tempData.firstName} onChange={handleChange} required />
                                </div>
                                <div className="input-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={tempData.lastName} onChange={handleChange} required />
                                </div>
                                <div className="input-group full-width">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={tempData.email} onChange={handleChange} required />
                                </div>
                                <div className="input-group full-width">
                                    <label>University</label>
                                    <input type="text" name="university" value={tempData.university} onChange={handleChange} />
                                </div>
                                <div className="input-group full-width">
                                    <label>Degree/Major</label>
                                    <input type="text" name="degree" value={tempData.degree} onChange={handleChange} />
                                </div>
                                <div className="input-group full-width">
                                    <label>About Me</label>
                                    <textarea name="bio" value={tempData.bio} onChange={handleChange} rows="4"></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <div className="card-header">
                                <h3>Resume / CV</h3>
                            </div>
                            <label className="cv-upload-zone">
                                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{display: 'none'}} />
                                <div className="upload-icon">📄</div>
                                <h4>Upload your CV</h4>
                                <p>PDF, DOC, or DOCX</p>
                                {tempData.cvName && (
                                    <div className="uploaded-file-tag">
                                        Selected: {tempData.cvName}
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-btn stretch">Save Changes</button>
                            <button type="button" className="btn-danger-text" onClick={handleDelete}>Delete Account Permanently</button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-view-section">
                        <div className="content-card">
                            <div className="card-header">
                                <h3>Personal Details</h3>
                            </div>
                            <div className="details-list">
                                <div className="detail-row">
                                    <span className="detail-label">Email Address</span>
                                    <span className="detail-value">{userData.email}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">University</span>
                                    <span className="detail-value">{userData.university || 'Not specified'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">About Me</span>
                                    <span className="detail-value bio-text">{userData.bio || 'No bio provided yet.'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="content-card">
                            <div className="card-header">
                                <h3>Resume / CV</h3>
                            </div>
                            {userData.cvName ? (
                                <div className="cv-status success">
                                    <div className="status-icon">✓</div>
                                    <div className="status-info">
                                        <h4>Uploaded Successfully</h4>
                                        <p>{userData.cvName}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="cv-status empty">
                                    <p>No CV uploaded yet. Click 'Edit Profile' to add your resume.</p>
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
