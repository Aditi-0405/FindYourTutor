import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/ChatList.css';

const ChatsListTutor = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/getMyChats`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const studentsWithUnreadCounts = await Promise.all(response.data.map(async (student) => {
          const unreadResponse = await axios.get(`http://localhost:5000/api/tutor/getIndividualNotifications/${student.studentId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
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
  }, []);

  return (
    <div className="chats-list-container">
      <h2>Chats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error-message'>{error}</p>
      ) : students.length === 0 ? (
        <p >No chats yet.</p>
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
