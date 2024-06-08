import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

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
        await axios.patch(`http://localhost:5000/resetStudentNotifications/${studentId}/tutor/${tutorId}`);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    socket.emit('joinRoom', { studentId, tutorId });

    socket.on('receiveMessage', async (messageData) => {
      const response = await axios.patch(`http://localhost:5000/incrementNotifications/tutor/${tutorId}`);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [studentId, tutorId]);

  const handleMessageSend = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/student/sendMessageFromStudentToTutor/${studentId}/tutor/${tutorId}`, { message: newMessage });
      socket.emit('sendMessage', { studentId, tutorId, message: newMessage });
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
          {messages.map((message, index) => (
            <li key={index}>
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
