import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Shared/SharedStyling/FormStyles.css';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`https://${process.env.REACT_APP_BACKEND_BASE_URL}/api/register/student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.status === 201) {
        setError('');
        setMessage('Student registered successfully');
        setTimeout(() => {
          setMessage('');
          setFormData({ username: '', email: '', password: '' });
        }, 5000);
      } else {
        setMessage('');
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage('')
      setError('Could not register. Try after some time.');
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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RegisterStudent;
