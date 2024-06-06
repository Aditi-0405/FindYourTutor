import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/Form.css';

const LoginStudent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.status === 200) {
        setMessage('Login successful');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('Internal Server Error');
    }
  };

  return (
    <div className="form-container">
      <h2>Student Login</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button className="form-button" type="submit">Login</button>
      </form>
      <div className='switch'><Link to={'/register-student'}>Register</Link></div>
      {message && <p className="error-message">{message}</p>}
    </div>
  );
};

export default LoginStudent;
