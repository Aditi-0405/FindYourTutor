import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../SharedStyling/Navbar.css';

const Navbar = ({ isLoggedIn }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">Tutor-Student Connect</Link>
        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon">&#9776;</span>
        </button>
        <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/messages">Messages</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications">Notifications</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/settings">Settings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/logout">Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Login
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/login-student">Login as Student</Link>
                    <Link className="dropdown-item" to="/login-tutor">Login as Tutor</Link>
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Register
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/register-student">Register as Student</Link>
                    <Link className="dropdown-item" to="/register-tutor">Register as Tutor</Link>
                  </div>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/help">Help</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
