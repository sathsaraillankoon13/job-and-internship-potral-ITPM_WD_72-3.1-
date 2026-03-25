import React, { useState } from 'react';
import '../styles/Feedback.css';

function Feedback({ onNavigate }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add actual submit logic here
        console.log("Feedback submitted:", { rating, comment });
        setSubmitted(true);
    };

    return (
        <div className="feedback-container">
            {/* Animated background blobs for premium feel */}
            <div className="feedback-blob blob-1"></div>
            <div className="feedback-blob blob-2"></div>

            <div className="feedback-card">
                {!submitted ? (
                    <>
                        <div className="feedback-icon-wrapper">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        
                        <h2 className="feedback-title">Rate Your Experience</h2>
                        <p className="feedback-subtitle">
                            Help us improve by sharing your thoughts. We appreciate your valuable feedback!
                        </p>

                        <form className="feedback-form" onSubmit={handleSubmit}>
                            <div className="star-rating">
                                {[...Array(5)].map((star, index) => {
                                    index += 1;
                                    return (
                                        <button
                                            type="button"
                                            key={index}
                                            className={index <= (hover || rating) ? "star active" : "star"}
                                            onClick={() => setRating(index)}
                                            onMouseEnter={() => setHover(index)}
                                            onMouseLeave={() => setHover(rating)}
                                        >
                                            <span className="star-icon">&#9733;</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like or dislike?"
                                className="feedback-textarea"
                                required={rating === 0}
                            />

                            <button 
                                type="submit" 
                                className="feedback-button" 
                                disabled={rating === 0 && comment.trim() === ''}
                            >
                                Submit Feedback
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h2 className="success-title">Thank You!</h2>
                        <p className="success-desc">
                            Your feedback has been successfully submitted. We'll use it to make our platform even better.
                        </p>
                    </div>
                )}

                <button type="button" onClick={() => onNavigate('login')} className="back-link">
                    &larr; Return to Login
                </button>
            </div>
        </div>
    );
}

export default Feedback;
