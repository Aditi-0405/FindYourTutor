import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TutorDetails = ({ isLoggedIn }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { tutorId } = useParams();
    const navigate = useNavigate();
    const handleChatClick = () => {
        navigate(`/chat-messages-student/${tutorId}`);
    };
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/general/tutorProfile/${tutorId}`);
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [tutorId]);


    if (loading) return <p className="tutor-profile__loading">Loading...</p>;
    if (error) return <p className="tutor-profile__error">{error}</p>;

    return (
        <div className="tutor-profile__container">
            <h2 className="tutor-profile__heading">{profile.name ? profile.name.toUpperCase() : 'N/A'}</h2>
            <p className="tutor-profile__info"><strong>Bio:</strong> {profile.bio || 'N/A'}</p>
            <p className="tutor-profile__info">
                <strong>Subjects Taught:</strong> {profile.subjectsTaught ? Object.entries(profile.subjectsTaught).length > 0 ? Object.entries(profile.subjectsTaught).map(([subject, details]) => (
                    <span key={subject}>{subject.toUpperCase()} ({details.length > 0 ? details.join(', ').toUpperCase() : 'N/A'})</span>
                )).reduce((prev, curr) => prev.length === 0 ? [curr] : [...prev, ', ', curr], []) : 'N/A' : 'N/A'}
            </p>
            <p className="tutor-profile__info">
                <strong>Rate:</strong> {profile.rate ? `Rs.${profile.rate} per hour` : 'N/A'}
            </p>
            <p className="tutor-profile__info"><strong>Location:</strong> {profile.location.toUpperCase() || 'N/A'}</p>
            <p className="tutor-profile__info"><strong>Contact Info:</strong> {profile.contactInfo || 'N/A'}</p>
            {isLoggedIn && role === 'student' && <button className="btn" onClick={handleChatClick}>Chat</button>}
        </div>
    );
};

export default TutorDetails;
