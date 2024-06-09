
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap/dist/css/bootstrap.min.css';

import '../SharedStyling/Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, unread }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/');
  };

  const role = localStorage.getItem('role');

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">Tutor-Student Connect</Link>
        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                {role === 'student' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/student-dashboard">Student Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/student-profile">Student Profile</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/chat-list-student">Chats{unread >= 0 && <span className="badge badge-pill badge-danger unread-count">({unread})</span>}</Link>
                    </li>
                  </>
                )}
                {role === 'tutor' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/tutor-dashboard">Tutor Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/tutor-profile">Tutor Profile</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/chat-list-tutor">Chats {unread >= 0 && <span className="badge badge-pill badge-danger">{unread}</span>}</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Login
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/login-student">Login as Student</Link></li>
                    <li><Link className="dropdown-item" to="/login-tutor">Login as Tutor</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Register
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/register-student">Register as Student</Link></li>
                    <li><Link className="dropdown-item" to="/register-tutor">Register as Tutor</Link></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
