import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams , useNavigate} from 'react-router-dom';

const TutorDetails = ({ isLoggedIn }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { tutorId } = useParams();
    const navigate = useNavigate()
    const handleChatClick = () => {
        navigate(`/chat-messages-student/${tutorId}`);
    };
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/general/tutorProfile/${tutorId}`);
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
            <h2 className="tutor-profile__heading">{profile.name.toUpperCase()}</h2>
            <p className="tutor-profile__info"><strong>Bio:</strong> {profile.bio}</p>
            <p className="tutor-profile__info"><strong>Subjects Taught:</strong> {Object.entries(profile.subjectsTaught).map(([subject, details]) => (
                <span key={subject}>{subject} ({details.join(', ')})</span>
            )).reduce((prev, curr) => prev.length === 0 ? [curr] : [...prev, ', ', curr], [])}</p>
            <p className="tutor-profile__info"><strong>Rate:</strong> ${profile.rate} per hour</p>
            <p className="tutor-profile__info"><strong>Location:</strong> {profile.location}</p>
            <p className="tutor-profile__info"><strong>Contact Info:</strong> {profile.contactInfo}</p>
            {isLoggedIn && role === 'student' && <button className="view-details-btn-home" onClick={handleChatClick}>Chat</button>}
        </div>
    );
};

export default TutorDetails;
