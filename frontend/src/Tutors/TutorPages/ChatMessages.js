import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import '../../Shared/SharedStyling/ChatMessages.css';
import { formatDistanceToNow, format } from 'date-fns';


const socket = io(`https://${process.env.REACT_APP_BACKEND_BASE_URL}`);

const ChatMessagesTutor = ({ setUnread }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messLength, setMessLength] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const tutorId = localStorage.getItem('userId');
  const { studentId } = useParams();
  const role = localStorage.getItem('role');

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/getMessages/${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const unreadResponse = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/getIndividualNotifications/${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        setMessLength(response.data.length);
        setUnreadCount(unreadResponse.data.unreadCount);
        setMessages(response.data);
        const res = await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/updateNotifications/${studentId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/resetNotifications/${studentId}`, {}, {
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
      const response = await axios.get(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/getMessages/${studentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setMessages(response.data);
      const res = await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/updateNotifications/${studentId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/resetNotifications/${studentId}`, {}, {
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
  }, [studentId, tutorId, setUnread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageSend = async () => {
    try {
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/sendMessageToStudent/${studentId}`,
        { message: newMessage },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/incrementStudentNotifications/${studentId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      await axios.patch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/tutor/updateStudentNotifications/${studentId}`, {}, {
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
      <div>
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
          placeholder="Type your message here..."
          className="message-input-text"
        />
        <button onClick={handleMessageSend} className="message-send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatMessagesTutor;
