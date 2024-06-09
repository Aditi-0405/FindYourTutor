import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/ChatList.css'; 

const ChatsListTutor = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tutorId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/getMyChats/${tutorId}`);
        
        const studentsWithUnreadCounts = await Promise.all(response.data.map(async (student) => {
          const unreadResponse = await axios.get(`http://localhost:5000/getIndividualNotificationsTutor/${tutorId}/student/${student.studentId}`);
          return { ...student, unreadCount: unreadResponse.data.unreadCount };
        }));
        
        setStudents(studentsWithUnreadCounts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching chats.');
        setLoading(false);
      }
    };

    fetchChats();
  }, [tutorId]);

  return (
    <div className="chats-list-container"> 
      <h2>Chats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {students.map(student => (
            <li key={student.studentId}>
              <Link to={`/chat-messages-tutor/${student.studentId}`}>
                {student.name} <span className="unread-count">({student.unreadCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsListTutor;
