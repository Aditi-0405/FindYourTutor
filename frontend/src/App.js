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


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId') !== null);
  const [unread, setUnread] = useState(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');

      if (userId && role) {
        try {
          console.log(userId)
          const response = await fetch(`http://localhost:5000/notifications/${role === 'student' ? 'student' : 'tutor'}/${userId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("here", data)
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

  if (unread === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} unread={unread} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-tutor" element={<RegisterTutor />} />
          <Route path="/login-student" element={<LoginStudent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login-tutor" element={<LoginTutor setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/tutor-profile" element={<TutorProfile />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/chat-list-student" element={<ChatsListStudent setUnread={setUnread} />} />
          <Route path="/chat-list-tutor" element={<ChatsListTutor setUnread={setUnread} />} />
          <Route path="/chat-messages-student/:tutorId" element={<ChatMessagesStudent />} />
          <Route path="/chat-messages-tutor/:studentId" element={<ChatMessagesTutor />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
