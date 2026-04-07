import React, { useState } from 'react';
import '../styles/Feedback.css';

function Feedback({ onNavigate }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Feedback submitted:", { rating, comment });
        setSubmitted(true);
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
            </div>
        </div>
    );
}

export default Feedback;
