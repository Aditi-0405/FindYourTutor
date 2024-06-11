import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/ChatList.css';

const ChatsListStudent = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = localStorage.getItem('userId');
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getMyChats`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const updatedTutors = await Promise.all(response.data.map(async tutor => {
          const unreadResponse = await axios.get(`http://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getIndividualNotifications/${tutor.tutorId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          return { ...tutor, unreadCount: unreadResponse.data.unreadCount };
        }));
        setTutors(updatedTutors);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching chats.');
        setLoading(false);
      }
    };

    fetchChats();
  }, [studentId]);

  return (
    <div className="chats-list-container">
      <h2>Chats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : tutors.length === 0 ? (
        <p>No chats available.</p>
      ) : (
        <ul>
          {tutors.map(tutor => (
            <li key={tutor.tutorId}>
              <Link to={`/chat-messages-student/${tutor.tutorId}`}>{tutor.name} <span className="unread-count">({tutor.unreadCount})</span></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default ChatsListStudent;
