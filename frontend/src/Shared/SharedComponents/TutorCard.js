
import React from 'react';
import '../SharedStyling/TutorCard.css';

const TutorCard = ({ tutor }) => {
  return (
    <div className="tutor-card">
      <div className="tutor-header">
        <h3 className="tutor-name">{tutor.name}</h3>
        <p className="tutor-location">{tutor.location}</p>
      </div>
      <div className="tutor-details">
        <p><strong>Subjects Taught:</strong> {Object.keys(tutor.subjectsTaught).join(', ')}</p>
        <p><strong>Rating:</strong> {tutor.rating}</p>
      </div>
      <div className="tutor-actions">
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

export default TutorCard;
