import React from 'react';
import '../StudentStyling/TutorCard.css';

const TutorCard = ({ tutor }) => {
  return (
    <div className="card">
      <h3>{tutor.name}</h3>
      <p>Location: {tutor.location}</p>
      <p>Subjects Taught: {Object.keys(tutor.subjectsTaught).join(', ')}</p>
      <p>Rating: {tutor.rating}</p>
      <p>Rate: ${tutor.rate} per hour</p>
      <p>Contact Info: {tutor.contactInfo}</p>
    </div>
  );
};

export default TutorCard;
