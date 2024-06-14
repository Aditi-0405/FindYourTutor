import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../StudentStyling/RateTutor.css';

const RateTutor = () => {
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating || !comment) {
            setMessage('Rating and comment are required');
            return;
        }

        try {
            const response = await axios.patch(
                `https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/rateTutor/${tutorId}`,
                { rating, comment },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setError('')
                setMessage('Review added successfully');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage('')
                setError(response.data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Server error');
        }
    };

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    return (
        <div className="rate-tutor-container">
            <h2>Rate Tutor</h2>
            <form onSubmit={handleSubmit}>
                <div className="star-rating">
                    {[...Array(5)].map((star, index) => (
                        <span
                            key={index}
                            className={`star ${index < rating ? 'filled' : ''}`}
                            onClick={() => handleStarClick(index)}
                        >
                            &#9733;
                        </span>
                    ))}
                </div>
                <label>
                    Comment:
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
            {message && <p className='rating-message'>{message}</p>}
            {error && <p className='rating-error'>{error}</p>}
        </div>
    );
};

export default RateTutor;
