import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, Mail, GraduationCap, Calendar, Briefcase, 
  Award, CheckCircle2, AlertCircle, UploadCloud, 
  LogOut, Edit3, Plus, ChevronRight, LayoutDashboard,
  Target, TrendingUp, Trophy, BrainCircuit, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import '../styles/Profile.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

function Profile({ onNavigate, userData: propUserData, setUserData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [stats, setStats] = useState({
        assessments: 0,
        applied: 0,
        avgScore: 0,
        interviews: 0
    });
    const [assessmentHistory, setAssessmentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Fallback
    const defaultUser = {
        firstName: 'User',
        lastName: '',
        email: 'user@example.com',
        university: '',
        degree: '',
        bio: 'No bio provided.',
        cvName: null,
        skills: ['Python', 'React', 'SQL', 'Node.js'], // Default skills if none exist
        academicYear: '',
        phoneNumber: ''
    };

    const actualUser = propUserData || defaultUser;
    const [tempData, setTempData] = useState({...actualUser});

    useEffect(() => {
        if (propUserData) {
            setTempData({...propUserData});
        }
    }, [propUserData]);

    useEffect(() => {
        const fetchProfileStats = async () => {
            try {
                const userId = localStorage.getItem('userId') || actualUser._id || 'guest_user';
                
                // Fetch Assessment History
                const assessResult = await axios.get(`${API_BASE_URL}/api/questions/history/${userId}`);
                const assessData = Array.isArray(assessResult.data) ? assessResult.data : [];
                setAssessmentHistory(assessData);

                // Fetch Interview History
                const interviewResult = await axios.get(`${API_BASE_URL}/api/interview/history/${userId}`);
                const interviewData = Array.isArray(interviewResult.data) ? interviewResult.data : [];

                // Get Applied Jobs count from localStorage (matches application.js logic)
                const appliedJobs = JSON.parse(localStorage.getItem("careerbridge-applied-jobs") || "[]");
                
                // Calculate Avg Score
                const avg = assessData.length > 0 
                    ? Math.round(assessData.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / assessData.length)
                    : 0;

                setStats({
                    assessments: assessData.length,
                    applied: appliedJobs.length,
                    avgScore: avg,
                    interviews: interviewData.length
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile stats:', err);
                setLoading(false);
            }
        };

        fetchProfileStats();
    }, [actualUser._id]);

    const profileCompletion = useMemo(() => {
        const fields = ['firstName', 'lastName', 'email', 'university', 'degree', 'bio', 'phoneNumber'];
        const completed = fields.filter(f => actualUser[f] && String(actualUser[f]).trim() !== '' && actualUser[f] !== 'No bio provided.');
        return Math.round((completed.length / fields.length) * 100);
    }, [actualUser]);

    const earnedBadges = useMemo(() => {
        // Simple logic: if percentage >= 80 in an assessment, earn a badge
        const badges = [];
        const uniqueSkills = new Set();
        
        assessmentHistory.forEach(item => {
            const skillName = item.quizTitle.split(':')[0].trim();
            if (item.percentage >= 80 && !uniqueSkills.has(skillName)) {
                uniqueSkills.add(skillName);
                badges.push({
                    id: item._id,
                    title: skillName,
                    level: item.difficulty || 'Advanced',
                    score: item.percentage,
                    icon: skillName.toLowerCase().includes('sql') ? <DatabaseIcon /> : <BrainCircuit size={20} />
                });
            }
        });
        return badges.slice(0, 3); // Top 3
    }, [assessmentHistory]);

    const handleEditToggle = () => {
        if (isEditing) {
            setTempData({...actualUser});
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (!actualUser._id && !localStorage.getItem('userId')) {
                alert("No user ID found, cannot update profile");
                return;
            }

            const userId = actualUser._id || localStorage.getItem('userId');
            const response = await fetch(`${API_BASE_URL}/api/users/profile/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: tempData.firstName,
                    lastName: tempData.lastName,
                    university: tempData.university,
                    degree: tempData.degree,
                    bio: tempData.bio,
                    academicYear: tempData.academicYear,
                    phoneNumber: tempData.phoneNumber
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (setUserData) setUserData(data);
                
                // Also update local storage 'user' object if it exists
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const parsed = JSON.parse(savedUser);
                    localStorage.setItem('user', JSON.stringify({ ...parsed, ...data }));
                }

                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Error updating profile: ' + data.message);
            }
        } catch (error) {
            console.error('Error connecting to backend:', error);
            alert('Failed to connect to backend.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setTempData(prev => ({ ...prev, cvName: e.target.files[0].name }));
            // In a real app, you'd upload the file here
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        onNavigate('login');
    };

    const initials = `${actualUser.firstName?.charAt(0) || 'U'}${actualUser.lastName?.charAt(0) || ''}`.toUpperCase();

    if (loading) return <div className="loading-state">Loading Profile...</div>;

    return (
        <div className="profile-page-container">
            {/* Header / Hero Section */}
            <div className="profile-hero">
                <div className="profile-hero-content">
                    <div className="profile-main-info">
                        <div className="hero-avatar">{initials}<div className="online-indicator"></div></div>
                        <div className="hero-text">
                            <div className="hero-name-row">
                                <h1 className="hero-name">{actualUser.firstName} {actualUser.lastName}</h1>
                                <div className="hero-badges">
                                    <span className="badge-pill student"><User size={12} /> Student</span>
                                    <span className="badge-pill top-percent"><TrendingUp size={12} /> Top 5%</span>
                                    <span className="badge-pill verified"><CheckCircle2 size={12} /> Verified</span>
                                </div>
                            </div>
                            <div className="hero-actions-top">
                                <button className="hero-btn-logout" onClick={handleLogout}><LogOut size={16} /> Log Out</button>
                                <button className="hero-btn-edit" onClick={handleEditToggle}><Edit3 size={16} /> Edit Profile</button>
                            </div>
                        </div>
                    </div>

                    <div className="hero-stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{stats.assessments}</span>
                            <span className="stat-label">Assessments</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.applied}</span>
                            <span className="stat-label">Applied</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.avgScore}%</span>
                            <span className="stat-label">Avg Score</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{stats.interviews}</span>
                            <span className="stat-label">Interviews</span>
                        </div>
                    </div>

                    <div className="hero-completion">
                        <div className="completion-info">
                            <span className="completion-label">Profile completion</span>
                            <span className="completion-value">{profileCompletion}%</span>
                        </div>
                        <div className="completion-bar-container">
                            <div className="completion-bar-fill" style={{width: `${profileCompletion}%`}}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-main-grid">
                {/* Left Column */}
                <div className="profile-col-left">
                    {isEditing ? (
                        <div className="card-modern">
                            <div className="card-header-modern">
                                <h3 className="card-title-modern"><User size={18} /> Edit Personal Details</h3>
                            </div>
                            <form className="edit-form-grid" onSubmit={handleSave}>
                                <div className="form-group-modern">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={tempData.firstName} onChange={handleChange} />
                                </div>
                                <div className="form-group-modern">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={tempData.lastName} onChange={handleChange} />
                                </div>
                                <div className="form-group-modern full">
                                    <label>University</label>
                                    <input type="text" name="university" value={tempData.university} onChange={handleChange} />
                                </div>
                                <div className="form-group-modern full">
                                    <label>Degree / Major</label>
                                    <input type="text" name="degree" value={tempData.degree} onChange={handleChange} />
                                </div>
                                <div className="form-group-modern full">
                                    <label>Academic Year</label>
                                    <select name="academicYear" value={tempData.academicYear} onChange={handleChange}>
                                        <option value="">Select Year</option>
                                        <option value="Year 1">Year 1</option>
                                        <option value="Year 2">Year 2</option>
                                        <option value="Year 3">Year 3</option>
                                        <option value="Year 4">Year 4</option>
                                    </select>
                                </div>
                                <div className="form-group-modern">
                                    <label>Phone Number</label>
                                    <input type="text" name="phoneNumber" value={tempData.phoneNumber} onChange={handleChange} placeholder="+94 7X XXX XXXX" />
                                </div>
                                <div className="form-group-modern full">
                                    <label>About Me</label>
                                    <textarea name="bio" value={tempData.bio} onChange={handleChange} rows="4"></textarea>
                                </div>
                                <div className="form-actions-modern">
                                    <button type="submit" className="btn-save-modern">Save Profile Changes</button>
                                    <button type="button" className="btn-cancel-modern" onClick={handleEditToggle}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="card-modern">
                            <div className="card-header-modern">
                                <h3 className="card-title-modern"><User size={18} /> Personal Details</h3>
                                <button className="edit-mini-btn" onClick={handleEditToggle}><Edit3 size={14} /> Edit</button>
                            </div>
                            <div className="details-modern-list">
                                <div className="detail-item-modern">
                                    <div className="detail-icon-box"><Mail size={18} /></div>
                                    <div className="detail-info-modern">
                                        <span className="detail-tag">Email Address</span>
                                        <span className="detail-text">{actualUser.email}</span>
                                    </div>
                                </div>
                                <div className="detail-item-modern">
                                    <div className="detail-icon-box"><GraduationCap size={18} /></div>
                                    <div className="detail-info-modern">
                                        <span className="detail-tag">University</span>
                                        <span className="detail-text">{actualUser.university || 'Not specified — add your university'}</span>
                                    </div>
                                </div>
                                <div className="detail-item-modern">
                                    <div className="detail-icon-box"><Briefcase size={18} /></div>
                                    <div className="detail-info-modern">
                                        <span className="detail-tag">Field of Study</span>
                                        <span className="detail-text">{actualUser.degree || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item-modern">
                                    <div className="detail-icon-box"><Calendar size={18} /></div>
                                    <div className="detail-info-modern">
                                        <span className="detail-tag">Academic Year</span>
                                        <span className="detail-text">{actualUser.academicYear || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="detail-item-modern">
                                    <div className="detail-icon-box"><LayoutDashboard size={18} /></div>
                                    <div className="detail-info-modern">
                                        <span className="detail-tag">About Me</span>
                                        <span className="detail-text bio">{actualUser.bio || 'No bio provided yet — tell employers about yourself'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card-modern mt-6">
                        <div className="card-header-modern">
                            <h3 className="card-title-modern"><Award size={18} /> Skills & Expertise</h3>
                            <button className="add-skill-btn"><Plus size={14} /> Add Skill</button>
                        </div>
                        <div className="skills-pill-grid">
                            {(actualUser.skills || defaultUser.skills).map((skill, idx) => (
                                <span key={idx} className="skill-pill-modern">{skill}</span>
                            ))}
                            <button className="skill-pill-add">+ Add skill</button>
                        </div>
                    </div>

                    <div className="card-modern mt-6">
                        <div className="card-header-modern">
                            <h3 className="card-title-modern"><Briefcase size={18} /> Resume / CV</h3>
                            <span className="card-hint">PDF, DOC up to 5MB</span>
                        </div>
                        <label className="resume-dropzone">
                            <input type="file" onChange={handleFileChange} hidden />
                            <div className="dropzone-content">
                                <div className="upload-circle"><UploadCloud size={24} /></div>
                                <h4 className="upload-title">Upload your resume</h4>
                                <p className="upload-subtitle">Drag & drop your CV here or click to browse</p>
                                {actualUser.cvName && <div className="file-preview-tag">{actualUser.cvName}</div>}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Right Column */}
                <div className="profile-col-right">
                    <div className="card-modern">
                        <div className="card-header-modern">
                            <h3 className="card-title-modern"><Target size={18} /> Profile Strength</h3>
                        </div>
                        <div className="strength-chart-section">
                            <div className="radial-progress" style={{"--progress": `${profileCompletion}`}}>
                                <div className="radial-inner">
                                    <span className="radial-value">{profileCompletion}%</span>
                                    <span className="radial-label">COMPLETE</span>
                                </div>
                            </div>
                            <div className="strength-status">
                                <h4 className="strength-status-title">{profileCompletion < 70 ? 'Needs Improvement' : 'Looking Great!'}</h4>
                                <p className="strength-status-subtitle">Complete to unlock Elite status</p>
                            </div>
                        </div>
                        <div className="strength-checklist">
                            <div className={`check-item ${actualUser.firstName && actualUser.lastName ? 'checked' : ''}`}>
                                <div className="check-icon">{actualUser.firstName && actualUser.lastName ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>Name completed</span>
                            </div>
                            <div className={`check-item ${actualUser.email ? 'checked' : ''}`}>
                                <div className="check-icon">{actualUser.email ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>Email address added</span>
                            </div>
                            <div className={`check-item ${actualUser.university ? 'checked' : ''}`}>
                                <div className="check-icon">{actualUser.university ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>University details</span>
                            </div>
                            <div className={`check-item ${actualUser.degree ? 'checked' : ''}`}>
                                <div className="check-icon">{actualUser.degree ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>Degree information</span>
                            </div>
                            <div className={`check-item ${actualUser.phoneNumber ? 'checked' : ''}`}>
                                <div className="check-icon">{actualUser.phoneNumber ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>Phone number added</span>
                            </div>
                            <div className={`check-item ${actualUser.bio && actualUser.bio !== 'No bio provided.' ? 'checked' : ''}`}>
                                <div className="check-icon">{actualUser.bio && actualUser.bio !== 'No bio provided.' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>Add a profile bio</span>
                            </div>
                            <div className={`check-item ${stats.assessments > 0 ? 'checked' : ''}`}>
                                <div className="check-icon">{stats.assessments > 0 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                                <span>Complete skill assessment</span>
                            </div>
                        </div>
                    </div>

                    <div className="card-modern mt-6">
                        <div className="card-header-modern">
                            <h3 className="card-title-modern"><Trophy size={18} /> Earned Badges</h3>
                            <span className="badge-count-tag">{earnedBadges.length} earned</span>
                        </div>
                        <div className="badges-list-modern">
                            {earnedBadges.length > 0 ? earnedBadges.map((badge, idx) => (
                                <div key={badge.id} className="earned-badge-item">
                                    <div className="badge-icon-box">{badge.icon}</div>
                                    <div className="badge-details">
                                        <h4 className="badge-item-title">{badge.title}</h4>
                                        <p className="badge-item-level">{badge.level}</p>
                                    </div>
                                    <div className="badge-score-tag">{badge.score}%</div>
                                </div>
                            )) : (
                                <div className="empty-badges">
                                    <p>No badges earned yet. Score 80%+ in assessments!</p>
                                    <button className="goto-assess-btn" onClick={() => onNavigate('skills')}>Take Assessment</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Custom Database icon
const DatabaseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
);

export default Profile;
