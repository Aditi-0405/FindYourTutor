import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/Form.css';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/register/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.status === 201) {
        setMessage('Student registered successfully');
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
      <h2>Register as a Student</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={username} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button className="form-button" type="submit">Register</button>
      </form>
      <div className='switch'><Link to={'/login-student'}>Login</Link></div>
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default RegisterStudent;
