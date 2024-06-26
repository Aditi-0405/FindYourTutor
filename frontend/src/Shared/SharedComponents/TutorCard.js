import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../SharedStyling/TutorCard.css';

const TutorCard = ({ tutor, isLoggedIn }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  console.log(role, isLoggedIn)

  const handleViewDetailsClick = () => {
    navigate(`/view-tutor-profile/${tutor.tutorId}`);
  };

  const handleChatClick = () => {
    navigate(`/chat-messages-student/${tutor.tutorId}`);
  };
  const handleRateClick = () => {
    navigate(`/rate-tutor/${tutor.tutorId}`);
  };
  return (
    <div className="tutor-card-home">
      <div className="tutor-header-home">
        <h3 className="tutor-name-home">{tutor.name.toUpperCase()}</h3>
        <p className="tutor-location-home">{tutor.location || 'N/A'}</p>
      </div>
      <div className="tutor-details-home">
        <p>
          <strong>Subjects Taught:</strong> {tutor.subjectsTaught ? Object.entries(tutor.subjectsTaught).length > 0 ? Object.entries(tutor.subjectsTaught).map(([subject, details]) => (
            <span key={subject}>{subject.toUpperCase()} ({details.length > 0 ? details.join(', ').toUpperCase() : 'N/A'})</span>
          )).reduce((prev, curr) => prev.length === 0 ? [curr] : [...prev, ', ', curr], []) : 'N/A' : 'N/A'}
        </p>
        <p>
          <strong>Rating:</strong> {tutor.rating ? <span>{tutor.rating} <span className='star-profile'>&#9733;</span></span> : 'N/A'}
        </p>
        <p>
          <strong>Rate:</strong>
          {tutor.rate ? `Rs.${tutor.rate} per hour` : 'N/A'}
        </p>
      </div>


      <div className="tutor-actions">
        <button onClick={handleViewDetailsClick}>View Details</button>
        {isLoggedIn && role === 'student' && <button onClick={handleChatClick}>Chat</button>}
        {isLoggedIn && role === 'student' && <button onClick={handleRateClick}>Rate</button>}
      </div>
    </div>
  );
};

export default TutorCard;
