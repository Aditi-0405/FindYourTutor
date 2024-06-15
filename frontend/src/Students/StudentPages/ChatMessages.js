import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { formatDistanceToNow, format } from 'date-fns';

const socket = io(`https://${process.env.REACT_APP_BACKEND_BASE_URL}`);

const ChatMessagesStudent = ({ setUnread }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messLength, setMessLength] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const studentId = localStorage.getItem('userId');
  const { tutorId } = useParams();
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getMessages/${tutorId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const unreadResponse = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getIndividualNotifications/${tutorId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        setMessLength(response.data.length);
        setUnreadCount(unreadResponse.data.unreadCount);

        setMessages(response.data);

        const res = await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/updateNotifications/${tutorId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/resetNotifications/${tutorId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        setUnread(res.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();

    socket.emit('joinRoom', { studentId, tutorId });

    socket.on('receiveMessage', async (messageData) => {
      const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/getMessages/${tutorId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(response.data);

      const res = await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/updateNotifications/${tutorId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/resetNotifications/${tutorId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setUnread(res.data.count);
    });

    return () => {
      socket.off('receiveMessage');
    };

  }, [studentId, tutorId, setUnread, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageSend = async () => {
    try {
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/sendMessageToTutor/${tutorId}`, {
        message: newMessage,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/incrementTutorNotifications/${tutorId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/student/updateTutorNotifications/${tutorId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
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
            <li
              key={index}
              className={`${message.isSentBySelf ? 'sent-by-self' : 'received'} ${(index >= (messLength - unreadCount)) ? 'unread' : 'read'}`}>
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
          className="message-input-text"
          placeholder="Type your message here..."
        />
        <button onClick={handleMessageSend} className="message-send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatMessagesStudent;
