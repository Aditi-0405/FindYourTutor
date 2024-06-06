import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Shared/SharedComponents/Navbar';
import Home from './Shared/SharedPages/Home';
import RegisterStudent from './Students/StudentPages/Register';
import RegisterTutor from './Tutors/TutorPages/Register';
import LoginStudent from './Students/StudentPages/Login';
import LoginTutor from './Tutors/TutorPages/Login';

const App = () => {
  // Assume you have a way to determine if a user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-tutor" element={<RegisterTutor />} />
          <Route path="/login-student" element={<LoginStudent />} />
          <Route path="/login-tutor" element={<LoginTutor />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
