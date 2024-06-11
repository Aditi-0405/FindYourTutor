import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Shared/SharedComponents/Navbar';
import Home from './Shared/SharedPages/Home';
import RegisterStudent from './Students/StudentPages/Register';
import RegisterTutor from './Tutors/TutorPages/Register';
import LoginStudent from './Students/StudentPages/Login';
import LoginTutor from './Tutors/TutorPages/Login';
import TutorDashboard from './Tutors/TutorPages/TutorDashboard';
import StudentDashboard from './Students/StudentPages/StudentDashboard';
import TutorProfile from './Tutors/TutorPages/TutorProfile';
import StudentProfile from './Students/StudentPages/StudentProfile';
import ChatsListStudent from './Students/StudentPages/ChatList';
import ChatsListTutor from './Tutors/TutorPages/ChatList';
import ChatMessagesStudent from './Students/StudentPages/ChatMessages';
import ChatMessagesTutor from './Tutors/TutorPages/ChatMessages';
import TutorDetails from './Shared/SharedPages/TutorDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId') !== null);
  const [unread, setUnread] = useState(null);
  const role = localStorage.getItem('role')

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      const token = localStorage.getItem('token')

      if (userId && role) {
        try {
          const response = await fetch(`http://${process.env.REACT_APP_BACKEND_BASE_URL}/api/${role === 'student' ? 'student' : 'tutor'}/notifications`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUnread(data.count);
          } else {
            console.error('Error fetching unread count:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    fetchUnreadCount();
  }, [isLoggedIn]);

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} unread={unread} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/register-student" element={!isLoggedIn && <RegisterStudent />} />
          <Route path="/register-tutor" element={ !isLoggedIn && <RegisterTutor />} />
          <Route path="/login-student" element={!isLoggedIn && <LoginStudent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login-tutor" element={!isLoggedIn && <LoginTutor setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/tutor-dashboard" element={isLoggedIn && role === 'tutor' && <TutorDashboard />} />
          <Route path="/student-dashboard" element={isLoggedIn && role === 'student' && <StudentDashboard />} />
          <Route path="/tutor-profile" element={isLoggedIn && role ==='tutor' && <TutorProfile />} />
          <Route path="/student-profile" element={isLoggedIn && role === 'student' && <StudentProfile />} />
          <Route path="/chat-list-student" element={isLoggedIn && role === 'student' && <ChatsListStudent />} />
          <Route path="/chat-list-tutor" element={isLoggedIn && role === 'tutor' && <ChatsListTutor />} />
          <Route path="/chat-messages-student/:tutorId" element={isLoggedIn && role === 'student' && <ChatMessagesStudent setUnread={setUnread} />} />
          <Route path="/chat-messages-tutor/:studentId" element={isLoggedIn && role === 'tutor' && <ChatMessagesTutor setUnread={setUnread} />} />
          <Route path="/view-tutor-profile/:tutorId" element={<TutorDetails isLoggedIn={isLoggedIn} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
