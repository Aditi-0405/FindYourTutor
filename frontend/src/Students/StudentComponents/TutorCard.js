import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../StudentStyling/TutorCard.css';

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat-messages-student/${tutor.tutorId}`);
  };

  const handleRateClick = () => {
    navigate(`/rate-tutor/${tutor.tutorId}`);
  };
  const handleViewDetailsClick = () => {
    navigate(`/view-tutor-profile/${tutor.tutorId}`);
  };

  return (
    <div className="tutor-card-student">
      <h3>{tutor.name.toUpperCase()}</h3>
      <p>Location: {tutor.location.toUpperCase() || 'N/A'}</p>
      <p>Subjects Taught: {Object.keys(tutor.subjectsTaught).length ? Object.keys(tutor.subjectsTaught).join(', ').toUpperCase() : 'N/A'}</p>
      <div className="tutor-details-home">
        <p>
          <strong>Subjects Taught:</strong> {Object.keys(tutor.subjectsTaught).length ? Object.keys(tutor.subjectsTaught).join(', ').toUpperCase() : 'N/A'}
        </p>
        <p>
          <strong>Rating:</strong> {tutor.rating ? <span>{tutor.rating} <span className='star-profile'>&#9733;</span></span> : 'N/A'}
        </p>
      </div>

      <p>Rate: {tutor.rate ? `Rs. ${tutor.rate} per hour` : 'N/A'}</p>
      <p>Contact Info: {tutor.contactInfo || 'N/A'}</p>
      <div className='tutor-actions'>
        <button className="view-details-button" onClick={handleViewDetailsClick}>View Details</button>
        <button className="chat-button" onClick={handleChatClick}>Chat</button>
        <button className="rate-button" onClick={handleRateClick}>Rate</button>
      </div>
    </div>
  );
};

export default TutorCard;
