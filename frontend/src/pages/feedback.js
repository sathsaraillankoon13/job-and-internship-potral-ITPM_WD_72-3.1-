import React, { useState } from 'react';
import '../styles/Feedback.css';

function Feedback({ onNavigate, userData }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Feedbacks state
    const [feedbacks, setFeedbacks] = useState([]);

    // Fetch on mount
    React.useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/feedback');
                if (response.ok) {
                    const data = await response.json();
                    setFeedbacks(data);
                }
            } catch (error) {
                console.error("Could not fetch feedbacks", error);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const name = userData ? `${userData.firstName} ${userData.lastName}` : "Student User";
            const dateStr = new Date().toISOString().split('T')[0];

            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, rating, comment, date: dateStr })
            });

            if (response.ok) {
                const savedFeedback = await response.json();
                setFeedbacks([savedFeedback, ...feedbacks]);
                console.log("Feedback submitted successfully");
                setSubmitted(true);
                // Reset form to default
                setRating(0);
                setHover(0);
                setComment('');
            } else {
                alert("Failed to submit feedback");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Could not connect to backend");
        }
    };

    return (
        <div className="feedback-layout-content">
            <div className="feedback-content-card">
                {!submitted ? (
                    <>
                        <div className="feedback-header">
                            <div className="feedback-icon">⭐</div>
                            <h2>Rate Your Experience</h2>
                            <p>Help us improve by sharing your thoughts. We appreciate your valuable feedback!</p>
                        </div>

                        <form className="feedback-form" onSubmit={handleSubmit}>
                            <div className="star-rating-container">
                                {[...Array(5)].map((star, index) => {
                                    index += 1;
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className={index <= (hover || rating) ? "star-btn active" : "star-btn"}
                                            onClick={() => setRating(index)}
                                            onMouseEnter={() => setHover(index)}
                                            onMouseLeave={() => setHover(rating)}
                                        >
                                            ★
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="feedback-input-group">
                                <label>Additional Comments</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you like or dislike?"
                                    rows="5"
                                    required={rating === 0}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="primary-btn stretch" 
                                disabled={rating === 0 && comment.trim() === ''}
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="feedback-success-state">
                        <div className="success-icon-large">✓</div>
                        <h2>Thank You!</h2>
                        <p>Your feedback has been successfully submitted. We'll use it to make our platform even better.</p>
                        <button className="btn-outline mt-4" onClick={() => setSubmitted(false)}>
                            Submit Another Response
                        </button>
                    </div>
                )}

                {/* Feedback List Section */}
                <div className="feedback-list-container">
                    <h3>Recent Feedback</h3>
                    <div className="feedback-list">
                        {feedbacks.map((fb) => (
                            <div key={fb._id || Math.random()} className="feedback-item">
                                <div className="feedback-item-header">
                                    <div className="reviewer-info">
                                        <span className="reviewer-name">{fb.name}</span>
                                        <span className="feedback-date">{fb.date}</span>
                                    </div>
                                    <div className="feedback-item-stars">
                                        {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                                    </div>
                                </div>
                                <p className="feedback-item-comment">{fb.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Feedback;
