
import React from 'react';
import '../SharedStyling/TutorCard.css';

const TutorCard = ({ tutor }) => {
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
        <button className="view-details-btn-home">View Details</button>
      </div>
    </div>
  );
};


export default TutorCard;
