import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/ChatList.css'; 

const ChatsListTutor = ({ setUnread }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tutorId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/getMyChats/${tutorId}`);
        setStudents(response.data);
        await axios.patch(`http://localhost:5000/updateNotifications/tutor/${tutorId}`);
        
        setUnread(0);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching chats.');
        setLoading(false);
      }
    };

    fetchChats();
  }, [tutorId, setUnread]);

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
              <Link to={`/chat-messages-tutor/${student.studentId}`}>{student.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatsListTutor;
