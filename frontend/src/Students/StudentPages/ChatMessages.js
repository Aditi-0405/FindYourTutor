import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatMessagesStudent = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const studentId = localStorage.getItem('userId');
  const { tutorId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/getMessages/${studentId}/tutor/${tutorId}`);
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [studentId, tutorId]);

  const handleMessageSend = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/student/sendMessageFromStudentToTutor/${studentId}/tutor/${tutorId}`, { message: newMessage });
      const response = await axios.get(`http://localhost:5000/api/student/getMessages/${studentId}/tutor/${tutorId}`);
      setMessages(response.data);
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map(message => (
            <li key={message._id}>
              {message.message} - {message.timestamp}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Send Message</h2>
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatMessagesStudent;
