import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import '../../Shared/SharedStyling/ChatMessages.css';
import { formatDistanceToNow, format } from 'date-fns';


const socket = io('http://localhost:5000');

const ChatMessagesTutor = ({ setUnread }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const tutorId = localStorage.getItem('userId');
  const { studentId } = useParams();
  const role = localStorage.getItem('role');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tutor/getMessages/${studentId}`);
        setMessages(response.data);
        const res = await axios.patch(`http://localhost:5000/api/tutor/updateNotifications/${studentId}`);
        await axios.patch(`http://localhost:5000/api/tutor/resetNotifications/${studentId}`);
        setUnread(res.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    socket.emit('joinRoom', { studentId, tutorId });

    socket.on('receiveMessage', async (messageData) => {
      const response = await axios.get(`http://localhost:5000/api/tutor/getMessages/${studentId}`);
      setMessages(response.data);
      const res = await axios.patch(`http://localhost:5000/api/tutor/updateNotifications/${studentId}`);
      await axios.patch(`http://localhost:5000/api/tutor/resetNotifications/${studentId}`);
      setUnread(res.data.count);
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
      await axios.patch(`http://localhost:5000/api/tutor/sendMessageToStudent/${studentId}`, { message: newMessage });
      await axios.patch(`http://localhost:5000/api/tutor/incrementStudentNotifications/${studentId}`);
      await axios.patch(`http://localhost:5000/api/tutor/updateStudentNotifications/${studentId}`);
      socket.emit('sendMessage', { studentId, tutorId, message: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-container">
      <div>
        <h2>Messages</h2>
        <ul className="message-list">
          {messages.map((message, index) => (
            <li key={index} className={message.isSentBySelf ? 'sent-by-self' : 'received'}>
              {message.isSentBySelf ? 'You : ' : ''}
              <span className="message-text">{message.message}</span>
              <span className="message-time">
                {format(new Date(message.timestamp), "HH:mm")}
                ({formatDistanceToNow(new Date(message.timestamp))} ago)
              </span>
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
          placeholder="Type your message here..."
          className="message-input-text"
        />
        <button onClick={handleMessageSend} className="message-send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatMessagesTutor;
