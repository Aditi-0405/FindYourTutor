import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../StudentStyling/TutorCard.css';

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat-messages-student/${tutor.tutorId}`);
  };

  return (
    <div className="tutor-card-student">
      <h3>{tutor.name.toUpperCase()}</h3>
      <p>Location: {tutor.location.toUpperCase() || 'N/A'}</p>
      <p>Subjects Taught: {Object.keys(tutor.subjectsTaught).length ? Object.keys(tutor.subjectsTaught).join(', ').toUpperCase() : 'N/A'}</p>
      <p>Rating: {tutor.rating || 'N/A'}</p>
      <p>Rate: {tutor.rate ? `Rs. ${tutor.rate} per hour` : 'N/A'}</p>
      <p>Contact Info: {tutor.contactInfo || 'N/A'}</p>
      <button className="chat-button" onClick={handleChatClick}>Chat</button>
    </div>
  );
};

export default TutorCard;
