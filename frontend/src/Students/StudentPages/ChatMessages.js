import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatMessagesStudent = ({ setUnread }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const studentId = localStorage.getItem('userId');
  const { tutorId } = useParams();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/student/getMessages/${studentId}/tutor/${tutorId}`);
        setMessages(response.data);
        const res = await axios.patch(`http://localhost:5000/updateNotifications/student/${studentId}/tutor/${tutorId}`);
        await axios.patch(`http://localhost:5000/resetStudentNotifications/${studentId}/tutor/${tutorId}`);
        setUnread(res.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    socket.emit('joinRoom', { studentId, tutorId });

    socket.on('receiveMessage', async (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('receiveMessage');
    };

  }, [studentId, tutorId, setUnread]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageSend = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/student/sendMessageFromStudentToTutor/${studentId}/tutor/${tutorId}`, { message: newMessage });
      await axios.patch(`http://localhost:5000/incrementNotifications/tutor/${tutorId}`);
      await axios.patch(`http://localhost:5000/updateTutorNotifications/${tutorId}/student/${studentId}`);
      socket.emit('sendMessage', { studentId, tutorId, message: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-container">
      <div className="message-list-container">
        <h2>Messages</h2>
        <ul className="message-list">
          {messages.map((message, index) => (
            <li key={index}>
              <span className="message-text">{message.message}</span> - {message.timestamp}
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="message-input-text"
          placeholder="Type your message here..."
        />
        <button onClick={handleMessageSend} className="message-send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatMessagesStudent;
