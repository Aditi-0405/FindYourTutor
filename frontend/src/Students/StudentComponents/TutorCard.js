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
      <h3>{tutor.name}</h3>
      <p>Location: {tutor.location}</p>
      <p>Subjects Taught: {Object.keys(tutor.subjectsTaught).join(', ')}</p>
      <p>Rating: {tutor.rating}</p>
      <p>Rate: ${tutor.rate} per hour</p>
      <p>Contact Info: {tutor.contactInfo}</p>
      <button className="chat-button" onClick={handleChatClick}>Chat</button>
    </div>
  );
};

export default TutorCard;
