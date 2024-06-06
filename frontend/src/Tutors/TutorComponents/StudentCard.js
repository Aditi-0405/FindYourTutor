// StudentCard.js
import React from 'react';
import '../TutorStyling/StudentCard.css';

const StudentCard = ({ student }) => {
  return (
    <div className="student-card">
      <h3 className="student-card__name">{student.name}</h3>
      <p className="student-card__info"><strong>Location:</strong> {student.location}</p>
      <p className="student-card__info"><strong>Subjects Interested:</strong> {student.subjectsInterested.join(', ')}</p>
      <p className="student-card__info"><strong>Class:</strong> {student.class}</p>
    </div>
  );
};

export default StudentCard;
