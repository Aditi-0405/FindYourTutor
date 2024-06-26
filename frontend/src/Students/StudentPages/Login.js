import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../Shared/SharedStyling/FormStyles.css';

const StudentLogin = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post( `https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/login/student`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('studentEmail', `${response.data.email}`);
      localStorage.setItem('role', 'student');
      setIsLoggedIn(true);
      navigate('/student-dashboard');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('We are currently experiencing technical difficulties. Please try again later.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Student Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin} className="form-button">Login</button>
    </div>
  );
};

export default StudentLogin;
