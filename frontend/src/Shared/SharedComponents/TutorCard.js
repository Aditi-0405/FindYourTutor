
import React from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import '../SharedStyling/TutorCard.css';

const TutorCard = ({ tutor, isLoggedIn }) => {

  const navigate = useNavigate();
  const role = localStorage.getItem('role')

  const handleViewDetailsClick = () => {
    navigate(`/view-tutor-profile/${tutor.tutorId}`);
  };
  const handleChatClick = () => {
    navigate(`/chat-messages-student/${tutor.tutorId}`);
};

  return (
    <div className="tutor-card-home">
      <div className="tutor-header-home">
        <h3 className="tutor-name-home">{tutor.name}</h3>
        <p className="tutor-location-home">{tutor.location}</p>
      </div>
      <div className="tutor-details-home">
        <p><strong>Subjects Taught:</strong> {Object.keys(tutor.subjectsTaught).join(', ')}</p>
        <p><strong>Rating:</strong> {tutor.rating}</p>
      </div>
      <div className="tutor-actions-home">
        <button className="view-details-btn-home" onClick={handleViewDetailsClick}>View Details</button>
        {isLoggedIn && role === 'student' && <button className="view-details-btn-home" onClick={handleChatClick}>Chat</button>}
      </div>
    </div>
  );
};


export default TutorCard;
