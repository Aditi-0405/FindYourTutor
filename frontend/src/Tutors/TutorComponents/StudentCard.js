import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../TutorStyling/StudentCard.css';

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat-messages-tutor/${student.studentId}`);
  };

  return (
    <div className="student-card-tutor">
      <h3 className="student-card__name">{student.name}</h3>
      <p className="student-card__info"><strong>Location:</strong> {student.location}</p>
      <p className="student-card__info"><strong>Subjects Interested:</strong> {student.subjectsInterested.join(', ')}</p>
      <p className="student-card__info"><strong>Class:</strong> {student.class}</p>
      <button className="student-card__chat-button" onClick={handleChatClick}>Chat</button>
    </div>
  );
};

export default StudentCard;
